import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { useRecentlyViewed } from '@/context';
import type { Product } from '@/types';

export interface RecentlyViewedProductsProps {
  excludeId?: string;
}

export function RecentlyViewedProducts({ excludeId }: RecentlyViewedProductsProps) {
  const { ids } = useRecentlyViewed();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    let active = true;
    (async () => {
      const filteredIds = excludeId ? ids.filter((id) => id !== excludeId) : ids;
      if (filteredIds.length === 0) {
        if (active) setProducts([]);
        return;
      }
      // Load all recently viewed products by fetching each individually
      const { fetchProductBySlug } = await import('@/services/productService');
      const results = await Promise.all(
        filteredIds.slice(0, 4).map(async (id) => {
          // The catalog uses slug-based fetch; for static catalog IDs like 'prod-aurora-cat-eye'
          // we need to handle both DB and static catalog cases
          if (id.startsWith('prod-')) {
            const { getProductBySlug } = await import('@/data/catalog');
            const slug = id.replace(/^prod-/, '');
            return getProductBySlug(slug) ?? null;
          }
          // For DB products, we don't have a slug from the ID, so skip
          return null;
        }),
      );
      if (active) {
        setProducts(results.filter((p): p is Product => p !== null));
      }
    })();
    return () => { active = false; };
  }, [ids, excludeId]);

  if (products.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Recently viewed</h2>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
