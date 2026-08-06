import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  RecentlyViewedContext,
  type RecentlyViewedContextValue,
} from './RecentlyViewedContext';

const STORAGE_KEY = 'vuera.recently-viewed';
const MAX_ITEMS = 8;

function loadInitial(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>(loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // non-fatal
    }
  }, [ids]);

  const add = useCallback((productId: string) => {
    setIds((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, MAX_ITEMS));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const value = useMemo<RecentlyViewedContextValue>(
    () => ({ ids, add, clear }),
    [ids, add, clear],
  );

  return (
    <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed(): RecentlyViewedContextValue {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  return ctx;
}
