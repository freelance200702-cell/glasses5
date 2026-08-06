import { Gem, Layers, Leaf, Shield } from 'lucide-react';
import type { FrameMaterial } from '@/types';

export interface MaterialInfoProps {
  material: FrameMaterial | null;
}

interface MaterialDetail {
  title: string;
  description: string;
  features: string[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const MATERIAL_MAP: Record<FrameMaterial, MaterialDetail> = {
  acetate: {
    title: 'Italian Acetate',
    description:
      'Hand-polished cellulose acetate from Mazzucchelli, Italy. Each frame is cut from a single block and tumble-polished for days, producing a deep, lustrous finish that improves with age.',
    features: ['Hypoallergenic', 'Adjustable in warm water', 'Rich color depth', 'Lightweight'],
    icon: Layers,
  },
  metal: {
    title: 'Stainless Steel',
    description:
      'Surgical-grade stainless steel with a PVD coating for lasting shine. Ultra-thin profile with spring-loaded hinges for all-day comfort and durability.',
    features: ['Corrosion resistant', 'Ultra-lightweight', 'Spring hinges', 'Satin finish'],
    icon: Gem,
  },
  titanium: {
    title: 'Aerospace Titanium',
    description:
      'Grade-2 titanium — the same metal used in aerospace. Featherlight yet incredibly strong, naturally hypoallergenic, and biocompatible for the most sensitive skin.',
    features: ['35% lighter than steel', 'Hypoallergenic', 'Memory flex', 'Precision machined'],
    icon: Shield,
  },
  mixed: {
    title: 'Mixed Material',
    description:
      'A thoughtful combination of acetate front with titanium or stainless temples. The best of both worlds — warmth and richness in the frame front, ultralight comfort on the sides.',
    features: ['Balanced weight', 'Acetate front', 'Metal temples', 'Modern contrast'],
    icon: Leaf,
  },
};

export function MaterialInfo({ material }: MaterialInfoProps) {
  if (!material) return null;

  const detail = MATERIAL_MAP[material];
  if (!detail) return null;

  const Icon = detail.icon;

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50">
          <Icon size={24} className="text-primary-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-ink-900">{detail.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">{detail.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {detail.features.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-xs font-medium text-ink-700"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
