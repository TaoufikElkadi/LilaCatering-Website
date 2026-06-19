'use client';

import { motion } from 'framer-motion';

// Eight-pointed Moroccan star (khatam) — the shared ornamental motif.
export const StarSeal = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 1.6l2.47 4.2 4.73-1.27-1.27 4.73 4.2 2.47-4.2 2.47 1.27 4.73-4.73-1.27L12 22.4l-2.47-4.2-4.73 1.27 1.27-4.73L1.6 12l4.2-2.47L4.53 4.8l4.73 1.27L12 1.6z" />
  </svg>
);

// Gold hairline flanked by a star — divider under step titles.
export const StarDivider = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-4 ${className}`}>
    <span className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#C19A5B]/70" />
    <StarSeal className="w-3 h-3 text-[#C19A5B]" />
    <span className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#C19A5B]/70" />
  </div>
);

// Consistent ornamental header used on every builder step.
export function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center space-y-4">
      <h3 className="text-2xl md:text-3xl font-serif font-light tracking-[0.08em] text-[#1f1f1f] uppercase">
        {title}
      </h3>
      <StarDivider />
      <p className="text-xs text-[#6c655b] tracking-[0.25em] font-light uppercase">{subtitle}</p>
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
