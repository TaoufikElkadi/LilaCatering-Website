'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import Image from 'next/image';
import {
  Check,
  ArrowRight,
  Palette,
  Flower2,
  Leaf,
  Flame,
  UtensilsCrossed,
  Wine,
  Lightbulb,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { StepHeader, StarSeal } from './MenuDecor';

export type DecorationStyleId = 'classic' | 'luxury' | 'natural' | 'moroccan';

// One selected style (or none yet).
export type DecorationSelection = DecorationStyleId | null;

type FeatureId =
  | 'witGoud'
  | 'diepeTinten'
  | 'lichtGroen'
  | 'warmeTinten'
  | 'verseBloemen'
  | 'rijkeBloemen'
  | 'natuurlijk'
  | 'kaarslicht'
  | 'luxeServies'
  | 'kristalglaswerk'
  | 'lantaarns'
  | 'traditioneel';

const FEATURE_ICONS: Record<FeatureId, LucideIcon> = {
  witGoud: Palette,
  diepeTinten: Palette,
  lichtGroen: Palette,
  warmeTinten: Palette,
  verseBloemen: Flower2,
  rijkeBloemen: Flower2,
  natuurlijk: Leaf,
  kaarslicht: Flame,
  luxeServies: UtensilsCrossed,
  kristalglaswerk: Wine,
  lantaarns: Lightbulb,
  traditioneel: Sparkles,
};

// Predefined decoration styles. Images are grey placeholders for now.
export const DECORATION_STYLES: {
  id: DecorationStyleId;
  image: string;
  features: FeatureId[];
}[] = [
  {
    id: 'classic',
    image: '',
    features: ['witGoud', 'verseBloemen', 'kaarslicht', 'luxeServies', 'kristalglaswerk'],
  },
  {
    id: 'luxury',
    image: '',
    features: ['diepeTinten', 'rijkeBloemen', 'luxeServies', 'kristalglaswerk'],
  },
  {
    id: 'natural',
    image: '',
    features: ['lichtGroen', 'natuurlijk', 'luxeServies', 'kristalglaswerk'],
  },
  {
    id: 'moroccan',
    image: '',
    features: ['warmeTinten', 'lantaarns', 'traditioneel', 'kristalglaswerk'],
  },
];

/** Decoration carries no separate line-item price for now. */
export function decorationFeeFor(_selection: DecorationSelection): number {
  return 0;
}

/** A style must be chosen before proceeding. */
export function isDecorationComplete(selection: DecorationSelection): boolean {
  return selection != null;
}

interface DecorationSelectorProps {
  selection: DecorationSelection;
  onSelect: (id: DecorationStyleId) => void;
}

function DecorationSelector({ selection, onSelect }: DecorationSelectorProps) {
  const { t } = useLanguage();
  const complete = isDecorationComplete(selection);

  return (
    <div className="space-y-10">
      <StepHeader title={t('menuBuilder.decoration.title')} subtitle={t('menuBuilder.decoration.subtitle')} />

      <div className="max-w-5xl mx-auto space-y-6">
        {DECORATION_STYLES.map(({ id, image, features }, index) => {
          const isActive = selection === id;
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className={`group block w-full text-left transition-[padding] duration-300 ${
                isActive ? 'p-1.5 bg-[#C19A5B]' : 'p-0'
              }`}
            >
              <div
                className={`grid grid-cols-1 lg:grid-cols-[52%_1fr] bg-[#faf6ee] transition-shadow duration-500 ${
                  isActive
                    ? 'shadow-[0_24px_60px_-26px_rgba(120,90,40,0.55)]'
                    : 'border border-[#e2d8c5] shadow-[0_12px_32px_-22px_rgba(60,45,25,0.3)] group-hover:border-[#d0bd94] group-hover:shadow-[0_22px_54px_-26px_rgba(80,60,30,0.4)]'
                }`}
              >
                {/* Image (grey placeholder until photos are added) */}
                <div className="relative h-52 sm:h-64 lg:h-auto lg:min-h-[300px] overflow-hidden bg-[#d8d2c6]">
                  {image ? (
                    <Image src={image} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 52vw" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#dcd6ca] to-[#cfc8ba]">
                      <StarSeal className="w-10 h-10 text-[#b3aa88]" />
                    </div>
                  )}
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-4 left-4 inline-flex items-center gap-2 bg-[#C19A5B] text-white text-[11px] font-medium uppercase tracking-[0.22em] px-4 py-2"
                    >
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      {t('menuBuilder.decoration.chosen')}
                    </motion.span>
                  )}
                </div>

                {/* Detail panel */}
                <div className="flex flex-col justify-center px-6 sm:px-9 py-7 sm:py-8">
                  <h4 className="text-xl sm:text-2xl font-serif font-light tracking-[0.12em] text-[#1f1f1f] uppercase">
                    {t(`menuBuilder.decoration.styles.${id}.name`)}
                  </h4>

                  <div className="flex items-center gap-3 mt-3 mb-4">
                    <span className="h-px w-8 bg-gradient-to-r from-[#C19A5B]/70 to-transparent" />
                    <StarSeal className="w-2.5 h-2.5 text-[#C19A5B]" />
                    <span className="h-px w-8 bg-gradient-to-l from-[#C19A5B]/70 to-transparent" />
                  </div>

                  <p className="text-[13px] sm:text-sm text-[#5f584d] leading-relaxed font-light">
                    {t(`menuBuilder.decoration.styles.${id}.description`)}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-3 mt-6">
                    {features.map((f) => {
                      const Icon = FEATURE_ICONS[f];
                      return (
                        <span key={f} className="flex items-center gap-2 text-[11px] sm:text-xs text-[#4a443b] font-light tracking-[0.04em]">
                          <Icon className="w-4 h-4 text-[#C19A5B] shrink-0" strokeWidth={1.6} />
                          {t(`menuBuilder.decoration.features.${f}`)}
                        </span>
                      );
                    })}
                  </div>

                  <span
                    className={`mt-7 inline-flex items-center justify-center gap-2 w-full border py-3 text-[11px] uppercase tracking-[0.24em] transition-colors duration-300 ${
                      isActive
                        ? 'border-[#C19A5B] bg-[#C19A5B]/10 text-[#a8824a]'
                        : 'border-[#d8c9a6] text-[#a8824a] group-hover:border-[#C19A5B] group-hover:bg-[#C19A5B]/[0.06]'
                    }`}
                  >
                    {t('menuBuilder.decoration.viewStyle')}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Setup info + required hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center pt-6 border-t border-[#e7ddcb] space-y-1 max-w-5xl mx-auto"
      >
        <p className="text-[11px] text-[#8a8275] tracking-[0.22em] font-light uppercase">
          {t('menuBuilder.decoration.setupInfo')}
        </p>
        {!complete && (
          <p className="text-[11px] text-[#a8824a] tracking-[0.16em] font-light">
            {t('menuBuilder.decoration.chooseAllHint')}
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default memo(DecorationSelector);
