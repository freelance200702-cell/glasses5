import { Link } from 'react-router-dom';
import { GitCompare, Heart, Scan, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { RatingStars } from '@/components/shared';
import { useCompare, useCart, useWishlist } from '@/context';
import { formatMoney, cx } from '@/lib/utils';
import type { Product } from '@/types';

interface SpecRow {
  label: string;
  render: (p: Product) => React.ReactNode;
}

const SPEC_ROWS: SpecRow[] = [
  {
    label: 'Price',
    render: (p) => (
      <span className="font-semibold text-ink-900">{formatMoney(p.priceCents)}</span>
    ),
  },
  {
    label: 'Shape',
    render: (p) => <span className="capitalize">{p.shape ?? '—'}</span>,
  },
  {
    label: 'Material',
    render: (p) => <span className="capitalize">{p.material ?? '—'}</span>,
  },
  {
    label: 'Size',
    render: (p) => {
      const sizes = p.variants
        .map((v) => {
          const match = v.name.match(/(\d+)\s*mm/);
          return match ? `${match[1]}mm` : null;
        })
        .filter(Boolean) as string[];
      return <span>{sizes.length > 0 ? Array.from(new Set(sizes)).join(', ') : '—'}</span>;
    },
  },
  {
    label: 'Gender',
    render: (p) => <span className="capitalize">{p.gender}</span>,
  },
  {
    label: 'Lens Type',
    render: (p) => <span className="capitalize">{p.lensType.replace('-', ' ')}</span>,
  },
  {
    label: 'Colors',
    render: (p) => (
      <span>
        {p.variants.length > 0
          ? Array.from(new Set(p.variants.map((v) => v.name.split(' / ')[0]))).join(', ')
          : '—'}
      </span>
    ),
  },
  {
    label: 'Rating',
    render: (p) => (
      <RatingStars rating={p.rating ?? 0} size={14} showValue />
    ),
  },
  {
    label: 'Reviews',
    render: (p) => <span>{p.reviewCount}</span>,
  },
  {
    label: 'Availability',
    render: (p) => {
      const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
      return (
        <span
          className={cx(
            'font-medium',
            totalStock > 0 ? 'text-success-600' : 'text-error-500',
          )}
        >
          {totalStock > 0 ? 'In stock' : 'Out of stock'}
        </span>
      );
    },
  },
  {
    label: 'Features',
    render: (p) => {
      const features: string[] = [];
      if (p.shape) features.push(`${p.shape} frame`);
      if (p.material) features.push(`${p.material} construction`);
      if (p.lensType === 'sunglasses') features.push('UV protection');
      if (p.lensType === 'blue-light') features.push('Blue light filter');
      if (p.compareAtPriceCents !== null) features.push('On sale');
      return (
        <ul className="space-y-1 text-left text-xs text-ink-600">
          {features.length > 0 ? (
            features.map((f) => (
              <li key={f} className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-primary-500" />
                <span className="capitalize">{f}</span>
              </li>
            ))
          ) : (
            <li className="text-ink-400">—</li>
          )}
        </ul>
      );
    },
  },
];

export function ComparePage() {
  const { items, remove, clear } = useCompare();
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="container-app py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink-100">
          <GitCompare size={28} className="text-ink-400" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">No items to compare</h1>
        <p className="mt-2 text-sm text-ink-500">
          Add frames to your comparison list from the shop or product pages.
        </p>
        <Link to="/shop" className="mt-6 inline-block">
          <Button>Browse frames</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-24">
      {/* Header */}
      <div className="border-b border-ink-200 bg-white">
        <div className="container-app py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Compare Frames
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                {items.length} of 3 frames — side-by-side comparison
              </p>
            </div>
            <button
              onClick={clear}
              className="text-sm text-ink-500 transition-colors hover:text-error-500"
            >
              Clear all
            </button>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="container-app py-8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Product headers */}
            <thead>
              <tr>
                <th className="sticky left-0 z-10 w-32 bg-white" />
                {items.map((product) => (
                  <th key={product.id} className="align-top px-4 pb-4" style={{ minWidth: 220 }}>
                    {/* Remove button */}
                    <button
                      onClick={() => remove(product.id)}
                      aria-label={`Remove ${product.name}`}
                      className="float-right rounded-md p-1 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
                    >
                      <X size={16} />
                    </button>

                    {/* Product image */}
                    <Link to={`/product/${product.slug}`} className="block">
                      <div className="mb-3 aspect-square overflow-hidden rounded-xl bg-ink-100">
                        <img
                          src={product.images[0]?.url}
                          alt={product.images[0]?.altText ?? product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <span className="text-xs font-medium uppercase tracking-wide text-ink-500">
                        {product.brandName ?? 'Vuera'}
                      </span>
                      <h3 className="mt-1 text-base font-semibold text-ink-900 transition-colors hover:text-primary-700">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Quick actions */}
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        fullWidth
                        onClick={() =>
                          addItem({
                            productId: product.id,
                            variantId: product.variants[0]?.id ?? '',
                            name: `${product.name} — ${product.variants[0]?.name ?? ''}`,
                            image: product.images[0]?.url ?? '',
                            unitPriceCents: product.variants[0]?.priceCents ?? product.priceCents,
                            quantity: 1,
                          })
                        }
                        disabled={product.variants.length === 0}
                      >
                        <ShoppingBag size={14} />
                        Add
                      </Button>
                      <button
                        onClick={() => toggle(product.id)}
                        aria-label={has(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        className={cx(
                          'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
                          has(product.id)
                            ? 'border-error-300 bg-error-50 text-error-500'
                            : 'border-ink-300 bg-white text-ink-600 hover:border-ink-400',
                        )}
                      >
                        <Heart size={15} className={cx(has(product.id) && 'fill-error-500')} />
                      </button>
                      <Link
                        to={`/try-on?product=${product.slug}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-300 bg-white text-ink-600 transition-colors hover:border-ink-400"
                        aria-label="Try on"
                      >
                        <Scan size={15} />
                      </Link>
                    </div>
                  </th>
                ))}
                {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, i) => (
                  <th key={`empty-${i}`} className="align-top px-4 pb-4" style={{ minWidth: 220 }}>
                    <Link
                      to="/shop"
                      className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-ink-200 text-sm text-ink-400 transition-colors hover:border-primary-400 hover:text-primary-600"
                    >
                      + Add frame
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Spec rows */}
            <tbody>
              {SPEC_ROWS.map((row, rowIdx) => (
                <tr key={row.label} className={rowIdx % 2 === 0 ? 'bg-ink-50/50' : ''}>
                  <td className="sticky left-0 z-10 bg-inherit py-3.5 pr-3 text-sm font-semibold text-ink-700">
                    {row.label}
                  </td>
                  {items.map((product) => (
                    <td key={product.id} className="px-4 py-3.5 text-sm text-ink-600">
                      {row.render(product)}
                    </td>
                  ))}
                  {Array.from({ length: Math.max(0, 3 - items.length) }).map((_, i) => (
                    <td key={`empty-spec-${i}`} className="px-4 py-3.5" />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <Link to="/shop">
            <Button variant="outline" size="lg">
              Continue browsing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
