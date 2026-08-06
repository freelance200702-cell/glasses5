import { useState } from 'react';
import { Ruler } from 'lucide-react';
import { Modal } from '@/components/ui';
import { cx } from '@/lib/utils';

export interface SizeGuideProps {
  className?: string;
}

interface SizeRow {
  size: string;
  lensWidth: string;
  bridgeWidth: string;
  templeLength: string;
  fit: string;
}

const SIZE_DATA: SizeRow[] = [
  { size: 'Small (48mm)', lensWidth: '48mm', bridgeWidth: '18–20mm', templeLength: '140mm', fit: 'Narrow faces' },
  { size: 'Medium (51mm)', lensWidth: '51mm', bridgeWidth: '18–21mm', templeLength: '145mm', fit: 'Most faces' },
  { size: 'Medium-Large (53mm)', lensWidth: '53mm', bridgeWidth: '19–22mm', templeLength: '150mm', fit: 'Wide faces' },
  { size: 'Large (55mm)', lensWidth: '55mm', bridgeWidth: '20–23mm', templeLength: '155mm', fit: 'Extra wide faces' },
];

export function SizeGuide({ className }: SizeGuideProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cx(
          'inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900',
          className,
        )}
      >
        <Ruler size={15} />
        Size guide
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Frame Size Guide" className="max-w-xl">
        <div className="space-y-5">
          <p className="text-sm text-ink-600">
            Frame size is measured by the width of one lens in millimeters. Use the chart below to find
            your ideal fit based on your face width.
          </p>

          <div className="overflow-hidden rounded-xl border border-ink-200">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Size</th>
                  <th className="px-4 py-3 font-medium">Lens Width</th>
                  <th className="px-4 py-3 font-medium">Bridge</th>
                  <th className="px-4 py-3 font-medium">Temple</th>
                  <th className="px-4 py-3 font-medium">Best For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {SIZE_DATA.map((row) => (
                  <tr key={row.size} className="transition-colors hover:bg-ink-50">
                    <td className="px-4 py-3 font-medium text-ink-900">{row.size}</td>
                    <td className="px-4 py-3 text-ink-600">{row.lensWidth}</td>
                    <td className="px-4 py-3 text-ink-600">{row.bridgeWidth}</td>
                    <td className="px-4 py-3 text-ink-600">{row.templeLength}</td>
                    <td className="px-4 py-3 text-ink-600">{row.fit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl bg-primary-50 p-4">
            <h3 className="text-sm font-semibold text-primary-800">How to measure</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-primary-700">
              <li>• Look straight into a mirror with a ruler held below your eyes.</li>
              <li>• Measure the width of one lens from left edge to right edge in millimeters.</li>
              <li>• If between sizes, choose the smaller for a snug fit or the larger for a relaxed fit.</li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
}
