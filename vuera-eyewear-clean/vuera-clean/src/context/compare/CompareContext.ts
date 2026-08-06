import { createContext } from 'react';
import type { Product } from '@/types';

export interface CompareContextValue {
  items: Product[];
  ids: string[];
  has: (productId: string) => boolean;
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
  clear: () => void;
  isFull: boolean;
  count: number;
  maxItems: number;
}

export const CompareContext = createContext<CompareContextValue | null>(null);
