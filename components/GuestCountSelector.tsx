'use client';

import { memo } from 'react';
import type { ComponentType } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useEffect } from 'react';
import { Minus, Plus, Users, Check, Info } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { MIN_GUESTS } from '@/lib/pricing';
import { StepHeader, StarSeal, RollingNumber } from './MenuDecor';

// Split step and per-gender slider range.
const SPLIT_STEP = 5;
const GENDER_MAX = 400;
const WOMEN_COLOR = '#c98a8a';
const MEN_COLOR = '#7f9bcc';

/** Restroom-style woman silhouette (clearly reads female). */
const WomanGlyph = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <circle cx="12" cy="5" r="3" />
    <path d="M12 9c-2 0-3.4 1.3-4.2 3.4l-1.6 4.4c-.2.6.2 1.2.9 1.2h1.3l.6 4.2c.05.5.5.8 1 .8h4c.5 0 .95-.3 1-.8l.6-4.2h1.3c.7 0 1.1-.6.9-1.2l-1.6-4.4C15.4 10.3 14 9 12 9z" />
  </svg>
);

/** Restroom-style man silhouette (clearly reads male). */
const ManGlyph = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <circle cx="12" cy="5" r="3" />
    <path d="M9 9c-1.1 0-2 .9-2 2v4.5c0 .5.4.9.9.9H8v5.1c0 .3.2.5.5.5H10c.3 0 .5-.2.5-.5V16h3v6c0 .3.2.5.5.5h1.5c.3 0 .5-.2.5-.5v-5.1h.1c.5 0 .9-.4.9-.9V11c0-1.1-.9-2-2-2H9z" />
  </svg>
);

interface GuestCountSelectorProps {
  guestCount: number;
  onGuestCountChange: (count: number) => void;
  women: number;
  men: number;
  onWomenChange: (n: number) => void;
  onMenChange: (n: number) => void;
}

function GuestCountSelector({
  guestCount,
  onGuestCountChange,
  women,
  men,
  onWomenChange,
  onMenChange,
}: GuestCountSelectorProps) {
  const { t } = useLanguage();

  const presetCounts = [40, 80, 100, 150, 200, 250, 300, 500];
  const total = women + men;
  const womenPct = total > 0 ? (women / total) * 100 : 50;
  const menPct = 100 - womenPct;

  // Per-10-guests split, rounded so the two add up to 10.
  const womenPer10 = total > 0 ? Math.round((women / total) * 10) : 5;
  const menPer10 = 10 - womenPer10;

  const clamp = (n: number) => Math.max(0, Math.min(GENDER_MAX, n));

  return (
    <div className="space-y-10">
      <StepHeader title={t('menuBuilder.guestCount.title')} subtitle={t('menuBuilder.guestCount.subtitle')} />

      {/* Choose-preset label */}
      <div className="flex items-center justify-center gap-3 text-[11px] tracking-[0.28em] text-[#a8824a] uppercase">
        <StarSeal className="w-2.5 h-2.5 text-[#C19A5B]" />
        {t('menuBuilder.guestCount.chooseLabel')}
        <StarSeal className="w-2.5 h-2.5 text-[#C19A5B]" />
      </div>

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
              className={`group relative aspect-square bg-gradient-to-br from-[#fdfbf7] to-[#f6f1e8] flex flex-col items-center justify-center gap-2 border transition-[box-shadow,border-color] duration-500 ${
                isActive
                  ? 'border-transparent shadow-[0_16px_40px_-20px_rgba(120,90,40,0.5)]'
                  : 'border-[#e7ddcb] shadow-[0_8px_22px_-16px_rgba(60,45,25,0.25)] hover:border-[#d6c39d]'
              }`}
            >
              {/* one gold frame that glides to whichever count is chosen */}
              {isActive && (
                <motion.span
                  layoutId="guest-preset-frame"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  className="pointer-events-none absolute -inset-px border-2 border-[#9E7F57]"
                />
              )}
              {isActive && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                  className="absolute -top-2.5 -right-2.5 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#9E7F57] shadow-[0_3px_8px_-2px_rgba(120,90,40,0.6)]"
                >
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </motion.span>
              )}
              <Users className={`w-5 h-5 md:w-6 md:h-6 transition-[color,transform] duration-300 group-hover:-translate-y-0.5 ${isActive ? 'text-[#9E7F57]' : 'text-[#b39256]'}`} strokeWidth={1.6} />
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

      {/* Split by women & men */}
      <div className="space-y-6 pt-2">
        <div className="flex items-center gap-4 max-w-2xl mx-auto">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C19A5B]/50" />
          <span className="text-[11px] tracking-[0.28em] text-[#a8824a] uppercase whitespace-nowrap">
            {t('menuBuilder.guestCount.splitLabel')}
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C19A5B]/50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-6 lg:gap-4 border border-[#e2d8c5] bg-[#faf6ee] px-5 sm:px-8 py-7">
          {/* Women */}
          <GenderControl
            label={t('menuBuilder.guestCount.women')}
            guestsLabel={t('menuBuilder.guestCount.guests')}
            value={women}
            color={WOMEN_COLOR}
            Glyph={WomanGlyph}
            onChange={(n) => onWomenChange(clamp(n))}
            step={SPLIT_STEP}
            max={GENDER_MAX}
          />

          {/* Total donut */}
          <div className="flex flex-col items-center justify-center px-2 lg:px-6">
            <div className="relative w-28 h-28">
              <SplitRing womenPct={womenPct} />
              <div className="absolute inset-[10px] rounded-full bg-[#faf6ee] flex flex-col items-center justify-center">
                <RollingNumber value={total} className="text-2xl font-serif text-[#1f1f1f] leading-none" />
                <span className="text-[9px] tracking-[0.22em] text-[#a8824a] uppercase mt-1">{t('menuBuilder.guestCount.total')}</span>
              </div>
            </div>
          </div>

          {/* Men */}
          <GenderControl
            label={t('menuBuilder.guestCount.men')}
            guestsLabel={t('menuBuilder.guestCount.guests')}
            value={men}
            color={MEN_COLOR}
            Glyph={ManGlyph}
            onChange={(n) => onMenChange(clamp(n))}
            step={SPLIT_STEP}
            max={GENDER_MAX}
          />
        </div>

        {/* Per-10 split + info */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C19A5B]/40" />
            <span className="text-[10px] tracking-[0.25em] text-[#9a8a6a] uppercase whitespace-nowrap">{t('menuBuilder.guestCount.stepHint')}</span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C19A5B]/40" />
          </div>
          <p className="text-center text-[13px] text-[#6c655b] font-light">
            <RollingNumber value={womenPer10} /> {t('menuBuilder.guestCount.womenWord')} &amp; <RollingNumber value={menPer10} /> {t('menuBuilder.guestCount.menWord')}
          </p>

          <div className="flex items-start gap-3 border border-[#e2d8c5] bg-white/50 px-5 py-4">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f0e7d4] text-[#C19A5B] shrink-0">
              <Info className="w-[18px] h-[18px]" strokeWidth={1.75} />
            </span>
            <span className="text-[12px] leading-relaxed text-[#6c655b] font-light">
              <span className="text-[#1f1f1f]">{t('menuBuilder.guestCount.splitInfo1')}</span>{' '}
              {t('menuBuilder.guestCount.splitInfo2')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Women/men ring whose share glides to its new value instead of jumping. */
function SplitRing({ womenPct }: { womenPct: number }) {
  const share = useSpring(womenPct / 100, { stiffness: 140, damping: 22 });
  useEffect(() => {
    share.set(womenPct / 100);
  }, [share, womenPct]);
  return (
    <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
      <circle cx="18" cy="18" r="15.9155" fill="none" stroke={MEN_COLOR} strokeWidth="4.2" />
      <motion.circle
        cx="18"
        cy="18"
        r="15.9155"
        fill="none"
        stroke={WOMEN_COLOR}
        strokeWidth="4.2"
        style={{ pathLength: share }}
      />
    </svg>
  );
}

/** One gender: label, [-] glyph value [+], and a colored slider. */
function GenderControl({
  label,
  guestsLabel,
  value,
  color,
  Glyph,
  onChange,
  step,
  max,
}: {
  label: string;
  guestsLabel: string;
  value: number;
  color: string;
  Glyph: ComponentType<{ className?: string }>;
  onChange: (n: number) => void;
  step: number;
  max: number;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[10px] tracking-[0.28em] uppercase text-[#8a8275]">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(value - step)}
          disabled={value <= 0}
          aria-label={`-${step}`}
          className="flex items-center justify-center w-10 h-10 border border-[#dcc8a4] text-[#a8824a] transition-[background-color,color,transform] duration-150 enabled:hover:bg-[#C19A5B]/10 enabled:hover:text-[#1f1f1f] enabled:active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" strokeWidth={2} />
        </button>
        <div className="flex items-center gap-2 min-w-[6rem] justify-center">
          <span style={{ color }}>
            <Glyph className="w-5 h-5" />
          </span>
          <RollingNumber value={value} className="text-3xl font-serif text-[#1f1f1f] leading-none" />
        </div>
        <button
          type="button"
          onClick={() => onChange(value + step)}
          aria-label={`+${step}`}
          className="flex items-center justify-center w-10 h-10 border border-[#dcc8a4] text-[#a8824a] transition-[background-color,color,transform] duration-150 hover:bg-[#C19A5B]/10 hover:text-[#1f1f1f] active:scale-90"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
      <span className="text-[9px] tracking-[0.25em] text-[#a8824a] uppercase">{guestsLabel}</span>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full max-w-[15rem] h-1.5 appearance-none rounded-full cursor-pointer"
        style={{
          accentColor: color,
          background: `linear-gradient(to right, ${color} 0 ${(value / max) * 100}%, #e6ddcd ${(value / max) * 100}% 100%)`,
        }}
      />
    </div>
  );
}

export const DEFAULT_WOMEN = Math.round(MIN_GUESTS / 2);

export default memo(GuestCountSelector);
