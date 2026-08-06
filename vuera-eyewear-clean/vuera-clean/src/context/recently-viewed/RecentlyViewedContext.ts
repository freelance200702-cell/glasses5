import { createContext } from 'react';

export interface RecentlyViewedContextValue {
  ids: string[];
  add: (productId: string) => void;
  clear: () => void;
}

export const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);
