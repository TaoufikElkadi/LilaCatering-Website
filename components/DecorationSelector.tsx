'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';
import { useLanguage } from './LanguageProvider';
import { StepHeader, cardShell, CheckSeal } from './MenuDecor';
import { formatEuro } from '@/lib/pricing';

export type DecorationComponentId = 'tafeldecoratie' | 'servies' | 'sfeeraankleding';
export type DecorationTier = 'basic' | 'premium' | 'luxury';

export const DECORATION_TIERS: DecorationTier[] = ['basic', 'premium', 'luxury'];

// Each component must be chosen at one of three tiers.
// NOTE: placeholder prices — adjust here.
export const DECORATION_COMPONENTS: { id: DecorationComponentId; tiers: Record<DecorationTier, number> }[] = [
  { id: 'tafeldecoratie', tiers: { basic: 100, premium: 175, luxury: 275 } }, // placeholder prices
  { id: 'servies', tiers: { basic: 125, premium: 225, luxury: 350 } }, // placeholder prices
  { id: 'sfeeraankleding', tiers: { basic: 150, premium: 275, luxury: 425 } }, // placeholder prices
];

export type DecorationSelection = Partial<Record<DecorationComponentId, DecorationTier>>;

/** Price of one component at the given tier. */
export function decorationPrice(id: DecorationComponentId, tier: DecorationTier): number {
  return DECORATION_COMPONENTS.find((c) => c.id === id)?.tiers[tier] ?? 0;
}

/** One-time decoration fee = sum of the chosen tier price per component. */
export function decorationFeeFor(selection: DecorationSelection): number {
  return DECORATION_COMPONENTS.reduce((sum, c) => {
    const tier = selection[c.id];
    return sum + (tier ? c.tiers[tier] : 0);
  }, 0);
}

/** Every component must have a tier chosen before proceeding. */
export function isDecorationComplete(selection: DecorationSelection): boolean {
  return DECORATION_COMPONENTS.every((c) => Boolean(selection[c.id]));
}

interface DecorationSelectorProps {
  selection: DecorationSelection;
  onSelect: (id: DecorationComponentId, tier: DecorationTier) => void;
}

function DecorationSelector({ selection, onSelect }: DecorationSelectorProps) {
  const { t } = useLanguage();
  const complete = isDecorationComplete(selection);

  return (
    <div className="space-y-12">
      <StepHeader title={t('menuBuilder.decoration.title')} subtitle={t('menuBuilder.decoration.subtitle')} />

      <div className="max-w-4xl mx-auto space-y-8">
        {DECORATION_COMPONENTS.map(({ id, tiers }, index) => {
          const chosen = selection[id];
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <div className="text-center sm:text-left mb-3">
                <h4 className="text-sm font-serif font-light tracking-[0.05em] text-[#1f1f1f]">
                  {t(`menuBuilder.decoration.components.${id}.name`)}
                </h4>
                <p className="text-[11px] text-[#6c655b] leading-relaxed font-light mt-1">
                  {t(`menuBuilder.decoration.components.${id}.description`)}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {DECORATION_TIERS.map((tier) => {
                  const isActive = chosen === tier;
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => onSelect(id, tier)}
                      className={`${cardShell(isActive)} relative p-4 text-center transition-transform hover:-translate-y-0.5`}
                    >
                      <CheckSeal show={isActive} className="absolute top-2 right-2 z-10" />
                      <span
                        className={`block text-[11px] uppercase tracking-[0.18em] ${isActive ? 'text-[#1f1f1f]' : 'text-[#3a352c]'}`}
                      >
                        {t(`menuBuilder.decoration.tiers.${tier}`)}
                      </span>
                      <span
                        className={`block mt-1.5 text-sm font-serif tracking-[0.1em] ${isActive ? 'text-[#a8824a]' : 'text-[#6c655b]'}`}
                      >
                        {formatEuro(tiers[tier])}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Setup info + required hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center pt-6 border-t border-[#e7ddcb] space-y-1"
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
