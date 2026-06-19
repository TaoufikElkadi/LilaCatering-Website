'use client';

import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { MIN_GUESTS, GUEST_STEP, normalizeGuestCount } from '@/lib/pricing';
import { StepHeader, StarSeal } from './MenuDecor';

interface GuestCountSelectorProps {
  guestCount: number;
  onGuestCountChange: (count: number) => void;
}

function GuestCountSelector({ guestCount, onGuestCountChange }: GuestCountSelectorProps) {
  const { t } = useLanguage();

  const presetCounts = [40, 60, 80, 100, 150, 200, 300, 500];

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

      {/* Preset Guest Counts */}
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
              className={`group relative aspect-square overflow-hidden rounded-[3px] bg-gradient-to-br from-[#fdfbf7] to-[#f6f1e8] flex items-center justify-center transition-[box-shadow,border-color] duration-500 ${
                isActive
                  ? 'border border-[#C19A5B] shadow-[0_16px_40px_-20px_rgba(120,90,40,0.5)]'
                  : 'border border-[#e7ddcb] shadow-[0_8px_22px_-16px_rgba(60,45,25,0.25)] hover:border-[#d6c39d]'
              }`}
            >
              {/* inset gold hairline */}
              <span
                className={`pointer-events-none absolute inset-[5px] rounded-[2px] border transition-opacity duration-500 ${
                  isActive ? 'border-[#C19A5B]/55 opacity-100' : 'border-[#C19A5B]/0 opacity-0 group-hover:border-[#C19A5B]/30 group-hover:opacity-100'
                }`}
              />
              <StarSeal className="pointer-events-none absolute -top-2 -right-2 w-10 h-10 text-[#C19A5B]/[0.06]" />
              <div className="relative text-center">
                <p className={`text-xl md:text-2xl font-serif font-light leading-none ${isActive ? 'text-[#1f1f1f]' : 'text-[#3a352c]'}`}>
                  {count}
                </p>
                <p className="text-[9px] tracking-[0.25em] text-[#9a8a6a] uppercase mt-1.5">
                  {t('menuBuilder.guestCount.guests')}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Custom Guest Count Input — stepper enforces multiples of 10 */}
      <div className="flex flex-col items-center gap-4 pt-10">
        <span className="flex items-center gap-3 text-[11px] tracking-[0.28em] text-[#a8824a] uppercase">
          <StarSeal className="w-2.5 h-2.5 text-[#C19A5B]" />
          {t('menuBuilder.guestCount.customLabel')}
          <StarSeal className="w-2.5 h-2.5 text-[#C19A5B]" />
        </span>
        <div className="flex items-stretch gap-3">
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => step(-GUEST_STEP)}
            disabled={guestCount <= MIN_GUESTS}
            aria-label={`-${GUEST_STEP}`}
            className="flex items-center justify-center w-14 bg-white/70 border border-[#dcc8a4] text-[#a8824a] rounded-[3px] transition-colors duration-300 enabled:hover:border-[#C19A5B] enabled:hover:text-[#1f1f1f] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" strokeWidth={2} />
          </motion.button>

          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={(e) => handleCustomInput(e.target.value)}
              onBlur={handleCustomBlur}
              className="w-40 bg-white/70 border border-[#dcc8a4] focus:border-[#C19A5B] focus:ring-2 focus:ring-[#C19A5B]/20 text-center text-3xl font-serif text-[#1f1f1f] py-4 px-4 outline-none rounded-[3px] transition-all duration-300"
              placeholder={String(MIN_GUESTS)}
            />
            <div className="absolute -bottom-6 left-0 right-0 text-center">
              <span className="text-[10px] tracking-[0.25em] text-[#9a8a6a] uppercase">{t('menuBuilder.guestCount.guests')}</span>
            </div>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => step(GUEST_STEP)}
            aria-label={`+${GUEST_STEP}`}
            className="flex items-center justify-center w-14 bg-white/70 border border-[#dcc8a4] text-[#a8824a] rounded-[3px] transition-colors duration-300 hover:border-[#C19A5B] hover:text-[#1f1f1f]"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
          </motion.button>
        </div>
        <p className="text-[10px] tracking-[0.25em] text-[#9a8a6a] uppercase pt-4">{t('menuBuilder.guestCount.stepHint')}</p>
      </div>
    </div>
  );
}

export default memo(GuestCountSelector);
