'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { useLanguage } from './LanguageProvider';
import { StepHeader, StarSeal, InsetFrame, cardShell, CheckSeal } from './MenuDecor';

export type DecorationType = 'basic' | 'classic' | 'grace' | 'custom';

interface DecorationSelectorProps {
  selectedDecoration: DecorationType;
  onDecorationChange: (decoration: DecorationType) => void;
}

// One-time fees (totals). Basic is included; Custom is quoted per event.
export const DECORATION_PRICES: Record<DecorationType, number> = {
  basic: 0,
  classic: 500,
  grace: 1000,
  custom: 0,
};

function DecorationSelector({ selectedDecoration, onDecorationChange }: DecorationSelectorProps) {
  const { t } = useLanguage();

  const collectionIds: DecorationType[] = ['basic', 'classic', 'grace', 'custom'];

  const priceLabel = (id: DecorationType): string => {
    if (id === 'custom') return t('menuBuilder.decoration.onRequest');
    if (DECORATION_PRICES[id] === 0) return t('menuBuilder.decoration.includedTag');
    return `+€${DECORATION_PRICES[id]}`;
  };

  return (
    <div className="space-y-12">
      <StepHeader title={t('menuBuilder.decoration.title')} subtitle={t('menuBuilder.decoration.subtitle')} />

      <div>
        <p className="text-[11px] tracking-[0.28em] text-[#a8824a] mb-6 text-center uppercase">
          {t('menuBuilder.decoration.packagesLabel')}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {collectionIds.map((id, index) => {
            const isActive = selectedDecoration === id;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDecorationChange(id)}
                className="group relative cursor-pointer"
              >
                <div className={`${cardShell(isActive)} p-6 h-full flex flex-col`}>
                  <InsetFrame isActive={isActive} />
                  <CheckSeal show={isActive} className="absolute top-3 right-3 z-10" />

                  <div className="relative space-y-2 text-center flex-1">
                    <h4 className={`text-sm font-serif font-light tracking-[0.05em] ${isActive ? 'text-[#1f1f1f]' : 'text-[#3a352c]'}`}>
                      {t(`menuBuilder.decoration.packages.${id}.name`)}
                    </h4>
                    <p className="text-[11px] text-[#6c655b] leading-relaxed font-light min-h-[3.75rem]">
                      {t(`menuBuilder.decoration.packages.${id}.description`)}
                    </p>
                  </div>

                  <div className="relative text-center pt-3 mt-3 border-t border-[#e7ddcb]">
                    <span className={`text-xs font-serif tracking-[0.22em] uppercase ${isActive ? 'text-[#a8824a]' : 'text-[#6c655b]'}`}>
                      {priceLabel(id)}
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
