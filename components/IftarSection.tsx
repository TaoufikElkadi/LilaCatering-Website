'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Users, MapPin, Clock, type LucideIcon } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { StarSeal } from './MenuDecor';

const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwChARN//9k=';

// Photos are warm placeholders — swap for dedicated iftar shots when available.
const MAIN_IMG = '/images/decorations/beldi.jpg';
const SIDE_IMG = '/images/decorations/royal.jpg';
const DATES_IMG = '/images/dishes/lila-beldi-variety.jpg';

// Moorish pointed arch outline (viewBox 0 0 100 130, open at bottom).
const ARCH_OUTLINE = 'M0,130 L0,60 A72,72 0 0 1 50,0 A72,72 0 0 1 100,60 L100,130';

const FEATURE_ICONS: LucideIcon[] = [UtensilsCrossed, Users, MapPin];

/** Detached gold arch outline used as a decorative background element. */
function ArchOutline({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" fill="none" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d={ARCH_OUTLINE} stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
}

export default function IftarSection() {
  const { t } = useLanguage();
  const features = (t('iftar.features') as { title: string; text: string }[]) ?? [];
  const [word1, ...rest] = t('iftar.title').split(' ');
  const word2 = rest.join(' ');

  return (
    <section id="iftar" className="relative overflow-hidden bg-[#f6f1e8] text-[#1f1f1f] py-16 sm:py-20 lg:py-24">
      {/* Moorish arch clip path */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="iftarArch" clipPathUnits="objectBoundingBox">
            <path d="M0,1 L0,0.46 A0.62,0.62 0 0 1 0.5,0 A0.62,0.62 0 0 1 1,0.46 L1,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Faint corner star lattice */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #8a6a2f 1px, transparent 0)',
          backgroundSize: '26px 26px',
        }}
      />

      {/* Vertical side label + crescent (desktop) */}
      <div className="hidden lg:flex flex-col items-center justify-between absolute left-5 xl:left-9 top-16 bottom-14 z-10">
        <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] tracking-[0.45em] uppercase text-[#a8824a] font-light">
          {t('iftar.sideLabel')}
        </span>
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#C19A5B]" fill="currentColor" aria-hidden="true">
          <path d="M14.5 2.5a9.5 9.5 0 100 19 7.6 7.6 0 010-15.2 7.7 7.7 0 011 .05 9.5 9.5 0 00-2-.9z" />
          <path d="M19.6 4.8l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5z" />
        </svg>
      </div>

      <div className="relative max-w-[88rem] mx-auto px-6 sm:px-12 lg:px-24">
        <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] gap-12 lg:gap-10 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="flex items-center gap-3.5 mb-7">
              <StarSeal className="w-6 h-6 text-[#C19A5B]" />
              <span className="text-[12px] uppercase tracking-[0.42em] text-[#a8824a]">{t('iftar.kicker')}</span>
            </div>

            <h2 className="font-serif uppercase leading-[0.9] tracking-[0.06em] text-[3.4rem] sm:text-7xl lg:text-[5.6rem]">
              <span className="block text-[#1f1f1f]">{word1}</span>
              <span className="block text-[#b8905a]">{word2}</span>
            </h2>

            {/* Divider with diamond */}
            <div className="flex items-center gap-3 mt-7 mb-8">
              <span className="h-px w-28 bg-gradient-to-r from-[#C19A5B]/70 to-[#C19A5B]/70" />
              <span className="w-1.5 h-1.5 rotate-45 bg-[#C19A5B]" />
              <span className="h-px w-16 bg-gradient-to-r from-[#C19A5B]/70 to-transparent" />
            </div>

            <p className="text-[15px] sm:text-base text-[#4a4742] leading-[1.75] max-w-[34rem]">
              {t('iftar.body')}
            </p>

            <ul className="mt-9 space-y-5 max-w-[30rem]">
              {features.map((f, i) => {
                const Icon = FEATURE_ICONS[i] ?? UtensilsCrossed;
                return (
                  <li key={i} className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-full border border-[#e0d2b4] bg-[#faf6ee] text-[#C19A5B]">
                      <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    </span>
                    <div className="flex-1 border-b border-[#e7ddcb] pb-4">
                      <p className="text-[12px] uppercase tracking-[0.2em] text-[#1f1f1f] font-medium">{f.title}</p>
                      <p className="text-[13px] text-[#6c655b] mt-1.5 leading-relaxed">{f.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <a
              href="#menu-builder"
              className="group mt-9 inline-flex items-center justify-between gap-8 w-[20rem] max-w-full bg-gradient-to-r from-[#c8a25f] via-[#b8905a] to-[#a9814d] text-white pl-8 pr-4 py-4 text-[11px] uppercase tracking-[0.26em] shadow-[0_16px_38px_-16px_rgba(160,120,60,0.8)] hover:shadow-[0_20px_46px_-16px_rgba(160,120,60,0.95)] transition-shadow"
            >
              {t('iftar.cta')}
              <span className="flex items-center justify-center w-8 h-8 border border-white/40">
                <StarSeal className="w-4 h-4 text-white group-hover:rotate-45 transition-transform duration-500" />
              </span>
            </a>
          </motion.div>

          {/* Image composition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-1 lg:order-2 relative w-full max-w-lg mx-auto lg:max-w-none aspect-[5/6] sm:aspect-[7/6] lg:aspect-[6/6]"
          >
            {/* Decorative gold arch outlines behind the main arch */}
            <ArchOutline className="absolute left-[-9%] top-[-2%] w-[66%] h-[86%] text-[#c2a466]/55" />
            <ArchOutline className="absolute left-[-3%] top-[2%] w-[62%] h-[80%] text-[#c9b183]/40" />
            {/* Swirl accent */}
            <svg className="absolute left-[0%] top-[40%] w-16 h-24 text-[#cbb083]/50 hidden sm:block" viewBox="0 0 40 60" fill="none" aria-hidden="true">
              <path d="M20,2 C6,10 6,26 18,30 C28,33 30,20 22,18 C16,17 15,25 20,27" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
            </svg>
            {/* 8-point star outline behind secondary arch */}
            <svg viewBox="0 0 24 24" fill="none" className="absolute right-[7%] top-[1%] w-20 h-20 text-[#c2a466]/60" aria-hidden="true">
              <path d="M12 1.6l2.47 4.2 4.73-1.27-1.27 4.73 4.2 2.47-4.2 2.47 1.27 4.73-4.73-1.27L12 22.4l-2.47-4.2-4.73 1.27 1.27-4.73L1.6 12l4.2-2.47L4.53 4.8l4.73 1.27L12 1.6z" stroke="currentColor" strokeWidth="0.5" />
            </svg>

            {/* Main arch */}
            <div
              className="absolute left-[8%] top-[1%] w-[64%] h-[91%] bg-[#d8d2c6] drop-shadow-[0_28px_44px_rgba(80,60,30,0.3)]"
              style={{ clipPath: 'url(#iftarArch)' }}
            >
              <Image src={MAIN_IMG} alt="" fill className="object-cover" sizes="(max-width:1024px) 55vw, 30vw" quality={82} loading="lazy" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            </div>

            {/* Secondary arch with cream frame */}
            <div className="absolute right-[0%] top-[16%] w-[37%] h-[47%] bg-[#faf6ee] p-2 drop-shadow-[0_20px_36px_rgba(80,60,30,0.32)]" style={{ clipPath: 'url(#iftarArch)' }}>
              <div className="relative w-full h-full bg-[#d8d2c6]" style={{ clipPath: 'url(#iftarArch)' }}>
                <Image src={SIDE_IMG} alt="" fill className="object-cover" sizes="(max-width:1024px) 30vw, 16vw" quality={82} loading="lazy" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
              </div>
            </div>

            {/* Dates square */}
            <div className="absolute left-[3%] bottom-[3%] w-[28%] aspect-square overflow-hidden rounded-[6px] bg-[#d8d2c6] shadow-[0_18px_36px_-12px_rgba(80,60,30,0.5)] ring-1 ring-white/60">
              <Image src={DATES_IMG} alt="" fill className="object-cover" sizes="18vw" quality={80} loading="lazy" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            </div>

            {/* Note card */}
            <div className="absolute right-[0%] bottom-[9%] w-[38%] bg-[#faf6ee] border border-[#e7ddcb] rounded-[6px] px-4 py-4 sm:px-5 sm:py-5 shadow-[0_18px_40px_-18px_rgba(80,60,30,0.42)]">
              <span className="flex items-center justify-center w-9 h-9 rounded-full border border-[#e0d2b4] text-[#C19A5B] mb-3">
                <Clock className="w-4 h-4" strokeWidth={1.6} />
              </span>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#a8824a] font-medium">{t('iftar.noteTitle')}</p>
              <p className="text-[11px] sm:text-[12px] text-[#6c655b] mt-1.5 leading-relaxed">{t('iftar.noteText')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
