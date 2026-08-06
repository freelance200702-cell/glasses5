import { useRef, useState } from 'react';
import { cx } from '@/lib/utils';
import type { ProductImage } from '@/types';

export interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeImage = images[activeIndex] ?? images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => setZoomStyle(null);

  if (!activeImage) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-ink-100">
        <span className="text-sm text-ink-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image with zoom */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-square overflow-hidden rounded-2xl bg-ink-100"
      >
        <img
          src={activeImage.url}
          alt={activeImage.altText ?? productName}
          className={cx(
            'h-full w-full object-cover transition-transform duration-200 ease-[var(--ease-standard)]',
            zoomStyle ? 'scale-200' : 'scale-100',
          )}
          style={zoomStyle ?? undefined}
        />
        {zoomStyle && (
          <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-ink-950/60 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
            Hover to zoom
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((image, idx) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(idx)}
              aria-label={`View image ${idx + 1}`}
              aria-pressed={activeIndex === idx}
              className={cx(
                'relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all duration-200',
                activeIndex === idx
                  ? 'border-primary-600 ring-2 ring-primary-200'
                  : 'border-transparent hover:border-ink-300',
              )}
            >
              <img
                src={image.url}
                alt={image.altText ?? `${productName} view ${idx + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
