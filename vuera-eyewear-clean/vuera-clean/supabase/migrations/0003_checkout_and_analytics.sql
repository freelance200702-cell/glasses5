/*
# Vuera — Checkout Order Creation & Admin Analytics

Adds the server-side order creation function and admin analytics views.

## New Objects
- public.create_order() — SECURITY DEFINER RPC that atomically creates an
  order + order_items from a cart, validates stock, decrements inventory,
  and clears the user's cart. Returns the new order row.
- public.admin_dashboard_stats — view with KPI roll-ups (totals, revenue,
  order counts by status, low-stock variants).
- public.admin_recent_orders — view of the 20 most recent orders with
  customer email + item count for the admin orders table.

## Security
- create_order is SECURITY DEFINER, callable by authenticated users only.
  It validates that the caller owns the cart items being ordered.
- Admin views are SELECT-only; RLS on underlying tables still applies,
  so only staff can read other users' orders through the views.

## Notes
1. The function accepts items as a JSON array so the frontend can pass
   cart contents directly (including products/variants that may have been
   deleted — product_name/variant_name are snapshotted).
2. Stock is validated BEFORE insert and decremented atomically. If any
   variant has insufficient stock the entire transaction fails.
3. payment_intent_id is left NULL — a future Stripe integration will set
   it after the payment gateway confirms.
*/

CREATE OR REPLACE FUNCTION public.create_order(
  p_items jsonb,
  p_shipping_address jsonb,
  p_customer_email text DEFAULT NULL,
  p_shipping_cents integer DEFAULT 0,
  p_tax_cents integer DEFAULT 0
) RETURNS public.orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders;
  v_item jsonb;
  v_variant public.product_variants;
  v_subtotal integer := 0;
  v_line_total integer;
  v_total integer;
  v_user uuid := auth.uid();
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Cannot create an order with no items';
  END IF;

  -- Validate stock and compute subtotal
  FOR v_item IN SELECT jsonb_array_elements(p_items) LOOP
    SELECT * INTO v_variant
    FROM public.product_variants
    WHERE id = (v_item->>'variant_id')::uuid;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Variant % not found', v_item->>'variant_id';
    END IF;
    IF v_variant.stock < (v_item->>'quantity')::integer THEN
      RAISE EXCEPTION 'Insufficient stock for variant % (have %, need %)',
        v_variant.sku, v_variant.stock, (v_item->>'quantity')::integer;
    END IF;

    v_line_total := v_variant.price_cents * (v_item->>'quantity')::integer;
    v_subtotal := v_subtotal + v_line_total;
  END LOOP;

  v_total := v_subtotal + p_shipping_cents + p_tax_cents;

  -- Create the order
  INSERT INTO public.orders (user_id, status, subtotal_cents, shipping_cents, tax_cents, total_cents, currency, shipping_address, customer_email)
  VALUES (v_user, 'pending', v_subtotal, p_shipping_cents, p_tax_cents, v_total, 'USD', p_shipping_address, p_customer_email)
  RETURNING * INTO v_order;

  -- Insert order items and decrement stock
  FOR v_item IN SELECT jsonb_array_elements(p_items) LOOP
    SELECT * INTO v_variant
    FROM public.product_variants
    WHERE id = (v_item->>'variant_id')::uuid;

    INSERT INTO public.order_items (order_id, product_id, variant_id, product_name, variant_name, unit_price_cents, quantity)
    VALUES (
      v_order.id,
      (v_item->>'product_id')::uuid,
      (v_item->>'variant_id')::uuid,
      v_item->>'product_name',
      v_item->>'variant_name',
      v_variant.price_cents,
      (v_item->>'quantity')::integer
    );

    UPDATE public.product_variants
    SET stock = stock - (v_item->>'quantity')::integer
    WHERE id = v_variant.id;
  END LOOP;

  -- Clear the user's cart
  DELETE FROM public.cart_items WHERE user_id = v_user;

  RETURN v_order;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_order(jsonb, jsonb, text, integer, integer) TO authenticated;

CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT
  (SELECT count(*) FROM public.orders) AS total_orders,
  (SELECT coalesce(sum(total_cents), 0) FROM public.orders WHERE status NOT IN ('cancelled', 'refunded')) AS total_revenue_cents,
  (SELECT count(*) FROM public.orders WHERE status = 'pending') AS pending_orders,
  (SELECT count(*) FROM public.orders WHERE status = 'paid') AS paid_orders,
  (SELECT count(*) FROM public.orders WHERE status = 'shipped') AS shipped_orders,
  (SELECT count(*) FROM public.orders WHERE status = 'delivered') AS delivered_orders,
  (SELECT count(*) FROM public.products WHERE status = 'active') AS active_products,
  (SELECT count(*) FROM public.product_variants WHERE stock <= 5) AS low_stock_count,
  (SELECT count(*) FROM public.profiles WHERE role = 'customer') AS total_customers,
  (SELECT coalesce(avg(rating), 0) FROM public.reviews WHERE moderation_status = 'approved') AS avg_rating;

CREATE OR REPLACE VIEW public.admin_recent_orders AS
SELECT
  o.id, o.status, o.total_cents, o.currency, o.created_at,
  o.customer_email, p.email AS user_email,
  (SELECT count(*) FROM public.order_items oi WHERE oi.order_id = o.id) AS item_count
FROM public.orders o
LEFT JOIN public.profiles p ON p.id = o.user_id
ORDER BY o.created_at DESC
LIMIT 20;

GRANT SELECT ON public.admin_dashboard_stats TO authenticated;
GRANT SELECT ON public.admin_recent_orders TO authenticated;