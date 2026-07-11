'use client';

import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Users, Check } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { MIN_GUESTS, GUEST_STEP, normalizeGuestCount } from '@/lib/pricing';
import { StepHeader, StarSeal } from './MenuDecor';

interface GuestCountSelectorProps {
  guestCount: number;
  onGuestCountChange: (count: number) => void;
}

function GuestCountSelector({ guestCount, onGuestCountChange }: GuestCountSelectorProps) {
  const { t } = useLanguage();

  const presetCounts = [40, 80, 100, 150, 200, 250, 300, 500];

  // Local text state so the field can be cleared and typed freely; we snap to a
  // valid multiple of GUEST_STEP (min MIN_GUESTS) only on blur.
  const [inputValue, setInputValue] = useState(String(guestCount));
  useEffect(() => {
    setInputValue(String(guestCount));
  }, [guestCount]);

  const handleCustomInput = (value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only (empty allowed while typing)
    setInputValue(value);
    const count = parseInt(value, 10);
    if (!isNaN(count) && count > 0) onGuestCountChange(count); // live, not yet snapped
  };

  // Snap to a valid multiple of GUEST_STEP (min MIN_GUESTS) on commit.
  const handleCustomBlur = () => {
    const parsed = parseInt(inputValue, 10);
    const norm = normalizeGuestCount(isNaN(parsed) ? MIN_GUESTS : parsed);
    onGuestCountChange(norm);
    setInputValue(String(norm));
  };

  const step = (delta: number) => {
    onGuestCountChange(normalizeGuestCount(guestCount + delta));
  };

  return (
    <div className="space-y-10">
      <StepHeader title={t('menuBuilder.guestCount.title')} subtitle={t('menuBuilder.guestCount.subtitle')} />

      {/* Choose-preset label */}
      <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.28em] text-[#a8824a] uppercase">
        <StarSeal className="w-2.5 h-2.5 text-[#C19A5B]" />
        {t('menuBuilder.guestCount.chooseLabel')}
        <StarSeal className="w-2.5 h-2.5 text-[#C19A5B]" />
      </div>

      {/* Preset Guest Counts — sharp-edged cards with icon + gold check when active */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
        {presetCounts.map((count) => {
          const isActive = guestCount === count;
          return (
            <motion.button
              key={count}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              onClick={() => onGuestCountChange(count)}
              className={`group relative aspect-square bg-gradient-to-br from-[#fdfbf7] to-[#f6f1e8] flex flex-col items-center justify-center gap-2 transition-[box-shadow,border-color] duration-500 ${
                isActive
                  ? 'border-2 border-[#C19A5B] shadow-[0_16px_40px_-20px_rgba(120,90,40,0.5)]'
                  : 'border border-[#e7ddcb] shadow-[0_8px_22px_-16px_rgba(60,45,25,0.25)] hover:border-[#d6c39d]'
              }`}
            >
              {/* Gold check disc — top-right corner, overlapping the border */}
              {isActive && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                  className="absolute -top-2.5 -right-2.5 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#C19A5B] shadow-[0_3px_8px_-2px_rgba(120,90,40,0.6)]"
                >
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </motion.span>
              )}
              <Users className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'text-[#C19A5B]' : 'text-[#b39256]'}`} strokeWidth={1.6} />
              <p className={`text-2xl md:text-[1.7rem] font-serif font-light leading-none ${isActive ? 'text-[#1f1f1f]' : 'text-[#3a352c]'}`}>
                {count}
              </p>
              <p className="text-[9px] tracking-[0.25em] text-[#a8824a] uppercase">
                {t('menuBuilder.guestCount.guests')}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Custom Guest Count — divider label + connected stepper bar */}
      <div className="flex flex-col items-center gap-6 pt-6">
        <div className="flex items-center gap-4 w-full max-w-md">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C19A5B]/50" />
          <span className="text-[11px] tracking-[0.28em] text-[#a8824a] uppercase whitespace-nowrap">
            {t('menuBuilder.guestCount.customLabel')}
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C19A5B]/50" />
        </div>

        <div className="flex items-stretch border border-[#dcc8a4] bg-white/70 shadow-[0_10px_28px_-20px_rgba(60,45,25,0.3)]">
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => step(-GUEST_STEP)}
            disabled={guestCount <= MIN_GUESTS}
            aria-label={`-${GUEST_STEP}`}
            className="flex items-center justify-center w-16 text-[#a8824a] transition-colors duration-300 enabled:hover:bg-[#C19A5B]/10 enabled:hover:text-[#1f1f1f] disabled:opacity-40 disabled:cursor-not-allowed border-r border-[#e2d3b4]"
          >
            <Minus className="w-4 h-4" strokeWidth={2} />
          </motion.button>

          <div className="flex flex-col items-center justify-center px-6 py-3 min-w-[9rem]">
            <input
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={(e) => handleCustomInput(e.target.value)}
              onBlur={handleCustomBlur}
              className="w-full bg-transparent text-center text-3xl font-serif text-[#1f1f1f] outline-none"
              placeholder={String(MIN_GUESTS)}
            />
            <span className="text-[10px] tracking-[0.25em] text-[#a8824a] uppercase mt-1">
              {t('menuBuilder.guestCount.guests')}
            </span>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => step(GUEST_STEP)}
            aria-label={`+${GUEST_STEP}`}
            className="flex items-center justify-center w-16 text-[#a8824a] transition-colors duration-300 hover:bg-[#C19A5B]/10 hover:text-[#1f1f1f] border-l border-[#e2d3b4]"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
          </motion.button>
        </div>

        <p className="text-[10px] tracking-[0.25em] text-[#9a8a6a] uppercase">{t('menuBuilder.guestCount.stepHint')}</p>
      </div>
    </div>
  );
}

export default memo(GuestCountSelector);
