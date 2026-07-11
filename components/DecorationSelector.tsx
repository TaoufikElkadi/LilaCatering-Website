'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { memo, useState } from 'react';
import Image from 'next/image';
import { Check, ArrowRight } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { StepHeader, StarSeal } from './MenuDecor';

export type DecorationCollectionId =
  | 'classic' | 'basic' | 'grace' | 'flower' | 'bohemian' | 'hermes'
  | 'royal' | 'beldi' | 'ballroom' | 'gisprkuid' | 'mosaic' | 'lghrib'
  | 'red' | 'royalblue' | 'royalgreen' | 'blue' | 'pink' | 'black';

export type DecorationCategoryId = 'klassiek' | 'royal' | 'kleurrijk';

// One selected collection (or none yet).
export type DecorationSelection = DecorationCollectionId | null;

// Collections grouped into categories so the customer picks a category first.
export const DECORATION_CATEGORIES: {
  id: DecorationCategoryId;
  collections: DecorationCollectionId[];
}[] = [
  { id: 'klassiek', collections: ['classic', 'basic', 'grace', 'flower', 'bohemian', 'hermes'] },
  { id: 'royal', collections: ['royal', 'beldi', 'ballroom', 'gisprkuid', 'mosaic', 'lghrib'] },
  { id: 'kleurrijk', collections: ['red', 'royalblue', 'royalgreen', 'blue', 'pink', 'black'] },
];

const CATEGORY_OF: Record<DecorationCollectionId, DecorationCategoryId> = DECORATION_CATEGORIES.reduce(
  (acc, cat) => {
    cat.collections.forEach((id) => { acc[id] = cat.id; });
    return acc;
  },
  {} as Record<DecorationCollectionId, DecorationCategoryId>
);

// Price per table. A number is euros per table; 'included' = no extra charge;
// 'onrequest' = day price / quoted by the office.
export type DecorationPrice = number | 'included' | 'onrequest';
export const DECORATION_PRICING: Record<DecorationCollectionId, DecorationPrice> = {
  // Klassiek & Elegant
  classic: 'included',
  basic: 'included',
  grace: 'included',
  flower: 65,
  bohemian: 45,
  hermes: 95,
  // Royal & Goud
  royal: 'onrequest',
  beldi: 55,
  ballroom: 25,
  gisprkuid: 45,
  mosaic: 45,
  lghrib: 85,
  // Kleurrijk
  red: 'included',
  royalblue: 25,
  royalgreen: 'included',
  blue: 25,
  pink: 'included',
  black: 'onrequest',
};

/** Localized price label for a collection, e.g. "€65 per tafel" / "Inbegrepen". */
export function decorationPriceLabel(id: DecorationCollectionId, t: (k: string) => string): string {
  const price = DECORATION_PRICING[id];
  if (price === 'included') return t('menuBuilder.decoration.priceIncluded');
  if (price === 'onrequest') return t('menuBuilder.decoration.priceOnRequest');
  return `€${price} ${t('menuBuilder.decoration.perTable')}`;
}

/** Decoration is priced per table and finalized by the office, so no line-item total here. */
export function decorationFeeFor(_selection: DecorationSelection): number {
  return 0;
}

/** A collection must be chosen before proceeding. */
export function isDecorationComplete(selection: DecorationSelection): boolean {
  return selection != null;
}

interface DecorationSelectorProps {
  selection: DecorationSelection;
  onSelect: (id: DecorationCollectionId) => void;
}

function DecorationSelector({ selection, onSelect }: DecorationSelectorProps) {
  const { t } = useLanguage();
  const complete = isDecorationComplete(selection);

  // Start on the category of the current selection, else the first category.
  const [activeCategory, setActiveCategory] = useState<DecorationCategoryId>(
    selection ? CATEGORY_OF[selection] : 'klassiek'
  );

  const category = DECORATION_CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div className="space-y-8">
      <StepHeader title={t('menuBuilder.decoration.title')} subtitle={t('menuBuilder.decoration.subtitle')} />

      {/* Category pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-5xl mx-auto">
        {DECORATION_CATEGORIES.map((cat) => {
          const isActive = cat.id === activeCategory;
          const hasSelection = selection ? CATEGORY_OF[selection] === cat.id : false;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`relative px-5 sm:px-7 py-2.5 text-[11px] sm:text-xs uppercase tracking-[0.2em] transition-colors duration-300 border ${
                isActive
                  ? 'bg-[#C19A5B] border-[#C19A5B] text-white'
                  : 'bg-transparent border-[#d8c9a6] text-[#6c655b] hover:border-[#C19A5B] hover:text-[#a8824a]'
              }`}
            >
              {t(`menuBuilder.decoration.categories.${cat.id}`)}
              {hasSelection && (
                <span className={`ml-2 inline-block w-1.5 h-1.5 rounded-full align-middle ${isActive ? 'bg-white' : 'bg-[#C19A5B]'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Collections in the active category */}
      <div className="max-w-5xl mx-auto space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            {category.collections.map((id, index) => {
              const isActive = selection === id;
              return (
                <motion.button
                  key={id}
                  type="button"
                  onClick={() => onSelect(id)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
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
                    {/* Collection photo */}
                    <div className="relative h-56 sm:h-72 lg:h-auto lg:min-h-[320px] overflow-hidden bg-[#d8d2c6]">
                      <Image
                        src={`/images/decorations/${id}.jpg`}
                        alt={t(`menuBuilder.decoration.collections.${id}.name`)}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 1024px) 100vw, 52vw"
                      />
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
                      {/* Price per table */}
                      <span className="absolute bottom-0 right-0 bg-[#1f1f1f]/85 text-white text-[11px] sm:text-xs font-light tracking-[0.06em] px-3.5 py-2">
                        {decorationPriceLabel(id, t)}
                      </span>
                    </div>

                    {/* Detail panel */}
                    <div className="flex flex-col justify-center px-6 sm:px-9 py-7 sm:py-8">
                      <h4 className="text-xl sm:text-2xl font-serif font-light tracking-[0.12em] text-[#1f1f1f] uppercase">
                        {t(`menuBuilder.decoration.collections.${id}.name`)}
                      </h4>

                      <div className="flex items-center gap-3 mt-3 mb-4">
                        <span className="h-px w-8 bg-gradient-to-r from-[#C19A5B]/70 to-transparent" />
                        <StarSeal className="w-2.5 h-2.5 text-[#C19A5B]" />
                        <span className="h-px w-8 bg-gradient-to-l from-[#C19A5B]/70 to-transparent" />
                      </div>

                      <p className="text-[13px] sm:text-sm text-[#5f584d] leading-relaxed font-light">
                        {t(`menuBuilder.decoration.collections.${id}.description`)}
                      </p>

                      <span
                        className={`mt-7 inline-flex items-center justify-center gap-2 w-full border py-3 text-[11px] uppercase tracking-[0.24em] transition-colors duration-300 ${
                          isActive
                            ? 'border-[#C19A5B] bg-[#C19A5B]/10 text-[#a8824a]'
                            : 'border-[#d8c9a6] text-[#a8824a] group-hover:border-[#C19A5B] group-hover:bg-[#C19A5B]/[0.06]'
                        }`}
                      >
                        {t('menuBuilder.decoration.viewCollection')}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
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
