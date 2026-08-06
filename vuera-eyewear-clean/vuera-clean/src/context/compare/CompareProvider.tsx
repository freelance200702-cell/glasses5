import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CompareContext, type CompareContextValue } from './CompareContext';
import type { Product } from '@/types';

const STORAGE_KEY = 'vuera.compare';
const MAX_ITEMS = 3;

function loadInitial(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>(loadInitial);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // non-fatal
    }
  }, [items]);

  const has = useCallback(
    (productId: string) => items.some((p) => p.id === productId),
    [items],
  );

  const toggle = useCallback(
    (product: Product) => {
      setItems((prev) => {
        const existing = prev.find((p) => p.id === product.id);
        if (existing) return prev.filter((p) => p.id !== product.id);
        if (prev.length >= MAX_ITEMS) return prev;
        return [...prev, product];
      });
    },
    [],
  );

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const ids = useMemo(() => items.map((p) => p.id), [items]);

  const value = useMemo<CompareContextValue>(
    () => ({
      items,
      ids,
      has,
      toggle,
      remove,
      clear,
      isFull: items.length >= MAX_ITEMS,
      count: items.length,
      maxItems: MAX_ITEMS,
    }),
    [items, ids, has, toggle, remove, clear],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within a CompareProvider');
  return ctx;
}
