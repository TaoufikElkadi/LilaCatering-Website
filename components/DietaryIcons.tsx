'use client';

import { memo } from 'react';
import {
  Fish,
  Beef,
  Drumstick,
  Leaf,
  Wheat,
  Milk,
  Flame,
  Shield,
  Sprout,
} from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import type { MenuSubCategory } from '@/data/menuData';

interface DietaryIconsProps {
  subCategory?: MenuSubCategory;
  dietaryTags?: string[];
  size?: 'sm' | 'md';
}

type ProteinSubCategory = 'meat' | 'chicken' | 'fish';
type Entry = { icon: any; labelKey: string };

const PROTEIN_ICONS: Record<ProteinSubCategory, Entry> = {
  fish: { icon: Fish, labelKey: 'dietary.fish' },
  meat: { icon: Beef, labelKey: 'dietary.meat' },
  chicken: { icon: Drumstick, labelKey: 'dietary.chicken' },
};

const DIETARY_ICONS: Record<string, Entry> = {
  'gluten-free': { icon: Wheat, labelKey: 'dietary.glutenFree' },
  'dairy-free': { icon: Milk, labelKey: 'dietary.dairyFree' },
  vegan: { icon: Sprout, labelKey: 'dietary.vegan' },
  vegetarian: { icon: Leaf, labelKey: 'dietary.vegetarian' },
  spicy: { icon: Flame, labelKey: 'dietary.spicy' },
  halal: { icon: Shield, labelKey: 'dietary.halal' },
};

function DietaryIcons({ subCategory, dietaryTags = [], size = 'sm' }: DietaryIconsProps) {
  const { t } = useLanguage();
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const textSize = size === 'sm' ? 'text-[9px]' : 'text-[10px]';

  const protein =
    subCategory === 'meat' || subCategory === 'chicken' || subCategory === 'fish'
      ? PROTEIN_ICONS[subCategory]
      : null;

  const entries: Entry[] = [
    ...(protein ? [protein] : []),
    ...dietaryTags.map((tag) => DIETARY_ICONS[tag]).filter(Boolean),
  ];

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      {entries.map(({ icon: Icon, labelKey }, i) => (
        <span
          key={`${labelKey}-${i}`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#e3d8c4] bg-[#fcf9f3]/80 text-[#9a865f] transition-colors duration-300 group-hover:border-[#d8c39c]`}
        >
          <Icon className={`${iconSize} text-[#C19A5B]`} strokeWidth={2} />
          <span className={`${textSize} uppercase tracking-[0.16em] leading-none`}>{t(labelKey)}</span>
        </span>
      ))}
    </div>
  );
}

export default memo(DietaryIcons);
