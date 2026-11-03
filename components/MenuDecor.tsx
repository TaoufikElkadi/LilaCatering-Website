'use client';

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Eight-pointed Moroccan star (khatam) — the shared ornamental motif.
export const StarSeal = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 1.6l2.47 4.2 4.73-1.27-1.27 4.73 4.2 2.47-4.2 2.47 1.27 4.73-4.73-1.27L12 22.4l-2.47-4.2-4.73 1.27 1.27-4.73L1.6 12l4.2-2.47L4.53 4.8l4.73 1.27L12 1.6z" />
  </svg>
);

// Gold hairline flanked by a star — older ornamental divider.
export const StarDivider = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-4 ${className}`}>
    <span className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#C19A5B]/70" />
    <StarSeal className="w-3 h-3 text-[#C19A5B]" />
    <span className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#C19A5B]/70" />
  </div>
);

// Two gold hairlines around a small diamond — sits under the builder kicker.
export const DiamondDivider = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
    <span className="h-px w-12 sm:w-[52px] bg-gradient-to-r from-transparent to-[#b98a4f]" />
    <span className="w-2 h-2 rotate-45 bg-[#b98a4f]" />
    <span className="h-px w-12 sm:w-[52px] bg-gradient-to-l from-transparent to-[#b98a4f]" />
  </div>
);

// Step title in the display serif, flanked by long gold hairlines that sit on
// the text baseline.
export function StepTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-end justify-center gap-6 sm:gap-[60px] ${className}`}>
      <span className="hidden sm:block mb-[0.38em] h-px w-[106px] shrink-0 bg-[#c9a16a]" aria-hidden="true" />
      <h3 className="font-display text-[30px] sm:text-[42px] leading-[1.15] font-normal tracking-[0] text-[#1f1a17]">{children}</h3>
      <span className="hidden sm:block mb-[0.38em] h-px w-[106px] shrink-0 bg-[#c9a16a]" aria-hidden="true" />
    </div>
  );
}

// Consistent header used on every builder step.
export function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <StepTitle>{title}</StepTitle>
      <p className="mt-4 font-display font-normal text-[11px] sm:text-[13px] uppercase tracking-[0.28em] text-[#3d3630]">{subtitle}</p>
    </div>
  );
}

// Shared "framed ivory card" class string (luxury card shell).
export function cardShell(isActive: boolean) {
  return `relative overflow-hidden rounded-[3px] bg-gradient-to-br from-[#fdfbf7] to-[#f6f1e8] transition-[box-shadow,border-color] duration-500 ${
    isActive
      ? 'border border-[#C19A5B] shadow-[0_20px_50px_-22px_rgba(120,90,40,0.5)]'
      : 'border border-[#e7ddcb] shadow-[0_10px_28px_-18px_rgba(60,45,25,0.26)] group-hover:border-[#d6c39d] group-hover:shadow-[0_22px_54px_-24px_rgba(80,60,30,0.36)]'
  }`;
}

// Inset gold hairline frame overlay — place as a child of a card shell.
export function InsetFrame({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-[6px] rounded-[2px] border transition-opacity duration-500 ${
        isActive
          ? 'border-[#C19A5B]/55 opacity-100'
          : 'border-[#C19A5B]/0 opacity-0 group-hover:border-[#C19A5B]/30 group-hover:opacity-100'
      }`}
    />
  );
}

// Small gold check seal that pops in on selection (absolute-positioned).
export function CheckSeal({ show, className = '' }: { show: boolean; className?: string }) {
  if (!show) return null;
  return (
    <motion.span
      initial={{ scale: 0, rotate: -40, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 18 }}
      className={`flex items-center justify-center ${className}`}
    >
      <span className="relative flex items-center justify-center w-7 h-7">
        <StarSeal className="absolute inset-0 w-full h-full text-[#C19A5B]" />
        <svg className="relative w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    </motion.span>
  );
}

// A number that rolls to its new value: the old figure slides out and the new
// one slides in from the direction of change (up when it grows).
export function RollingNumber({ value, className = '' }: { value: number | string; className?: string }) {
  // Direction derived during render from the previous value (StrictMode-safe).
  const [last, setLast] = useState({ value, dir: 1 });
  if (last.value !== value) setLast({ value, dir: Number(value) >= Number(last.value) ? 1 : -1 });
  const dir = last.value !== value ? (Number(value) >= Number(last.value) ? 1 : -1) : last.dir;
  return (
    <span className={`relative inline-flex overflow-hidden tabular-nums ${className}`}>
      <AnimatePresence initial={false} mode="popLayout" custom={dir}>
        <motion.span
          key={String(value)}
          custom={dir}
          variants={{
            enter: (d: number) => ({ y: `${d * 70}%`, opacity: 0 }),
            center: { y: '0%', opacity: 1 },
            exit: (d: number) => ({ y: `${d * -70}%`, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
