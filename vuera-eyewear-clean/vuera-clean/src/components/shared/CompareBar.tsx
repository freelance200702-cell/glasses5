import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, X } from 'lucide-react';
import { useCompare } from '@/context';
import { cx, formatMoney } from '@/lib/utils';

export function CompareBar() {
  const { items, remove, clear, count, isFull } = useCompare();
  const [dismissed, setDismissed] = useState(false);

  if (count === 0 || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
      <div className="border-t border-ink-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="container-app flex items-center gap-4 py-3">
          {/* Product thumbnails */}
          <div className="flex flex-1 items-center gap-3 overflow-x-auto">
            <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-ink-900">
              <GitCompare size={18} className="text-primary-600" />
              Compare
            </span>
            <div className="flex items-center gap-2">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="group relative flex items-center gap-2 rounded-lg border border-ink-200 bg-ink-50 py-1.5 pl-1.5 pr-7"
                >
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                  <span className="text-xs font-medium text-ink-800">{product.name}</span>
                  <span className="text-xs text-ink-500">{formatMoney(product.priceCents)}</span>
                  <button
                    onClick={() => remove(product.id)}
                    aria-label={`Remove ${product.name} from comparison`}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-ink-400 transition-colors hover:bg-ink-200 hover:text-ink-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: Math.max(0, 3 - count) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex h-[52px] w-24 items-center justify-center rounded-lg border-2 border-dashed border-ink-200 text-xs text-ink-300"
                >
                  {isFull ? '' : 'Add'}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={clear}
              className="text-sm text-ink-500 transition-colors hover:text-ink-800"
            >
              Clear
            </button>
            <Link
              to="/compare"
              className={cx(
                'inline-flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors',
                count >= 2
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-ink-100 text-ink-400',
              )}
            >
              Compare {count >= 2 ? `(${count})` : ''}
            </Link>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss compare bar"
              className="rounded-md p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
