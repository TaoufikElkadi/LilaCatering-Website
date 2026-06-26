'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { useLanguage } from './LanguageProvider';
import { StepHeader, StarSeal, InsetFrame, cardShell, CheckSeal } from './MenuDecor';
import { formatEuro } from '@/lib/pricing';

export type DecorationComponentId = 'tafeldecoratie' | 'servies' | 'sfeeraankleding';

// Modular decoration add-ons. Each is an independent one-time fee.
// NOTE: placeholder prices — adjust here.
export const DECORATION_COMPONENTS: { id: DecorationComponentId; price: number }[] = [
  { id: 'tafeldecoratie', price: 150 }, // placeholder price
  { id: 'servies', price: 200 }, // placeholder price
  { id: 'sfeeraankleding', price: 250 }, // placeholder price
];

export const DECORATION_PRICE_BY_ID: Record<DecorationComponentId, number> = DECORATION_COMPONENTS.reduce(
  (acc, c) => ({ ...acc, [c.id]: c.price }),
  {} as Record<DecorationComponentId, number>
);

/** One-time decoration fee for the selected components. */
export function decorationFeeFor(selected: DecorationComponentId[]): number {
  return selected.reduce((sum, id) => sum + (DECORATION_PRICE_BY_ID[id] ?? 0), 0);
}

interface DecorationSelectorProps {
  selected: DecorationComponentId[];
  onToggle: (id: DecorationComponentId) => void;
}

function DecorationSelector({ selected, onToggle }: DecorationSelectorProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-12">
      <StepHeader title={t('menuBuilder.decoration.title')} subtitle={t('menuBuilder.decoration.subtitle')} />

      <div>
        <p className="text-[11px] tracking-[0.28em] text-[#a8824a] mb-6 text-center uppercase">
          {t('menuBuilder.decoration.componentsLabel')}
        </p>
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
          {DECORATION_COMPONENTS.map(({ id, price }, index) => {
            const isActive = selected.includes(id);
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onToggle(id)}
                className="group relative cursor-pointer"
              >
                <div className={`${cardShell(isActive)} p-6 h-full flex flex-col`}>
                  <InsetFrame isActive={isActive} />
                  <CheckSeal show={isActive} className="absolute top-3 right-3 z-10" />

                  <div className="relative space-y-2 text-center flex-1">
                    <h4 className={`text-sm font-serif font-light tracking-[0.05em] ${isActive ? 'text-[#1f1f1f]' : 'text-[#3a352c]'}`}>
                      {t(`menuBuilder.decoration.components.${id}.name`)}
                    </h4>
                    <p className="text-[11px] text-[#6c655b] leading-relaxed font-light min-h-[3.75rem]">
                      {t(`menuBuilder.decoration.components.${id}.description`)}
                    </p>
                  </div>

                  <div className="relative text-center pt-3 mt-3 border-t border-[#e7ddcb]">
                    <span className={`text-xs font-serif tracking-[0.22em] uppercase ${isActive ? 'text-[#a8824a]' : 'text-[#6c655b]'}`}>
                      +{formatEuro(price)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Setup info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center gap-3 pt-6 border-t border-[#e7ddcb]"
      >
        <StarSeal className="w-2.5 h-2.5 text-[#C19A5B]/60" />
        <p className="text-[11px] text-[#8a8275] tracking-[0.22em] font-light uppercase">
          {t('menuBuilder.decoration.setupInfo')}
        </p>
        <StarSeal className="w-2.5 h-2.5 text-[#C19A5B]/60" />
      </motion.div>
    </div>
  );
}

export default memo(DecorationSelector);
