'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useLanguage } from './LanguageProvider';

const useCounter = (end: number, duration: number = 2, isInView: boolean) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isInView || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;
    
    let startTime: number | null = null;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const currentCount = Math.floor(progress * end);
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrameIdRef.current = window.requestAnimationFrame(step);
      } else {
        // Ensure final value is set
        setCount(end);
        animationFrameIdRef.current = null;
      }
    };
    
    // Small delay to ensure smooth start
    const timeoutId = setTimeout(() => {
      animationFrameIdRef.current = window.requestAnimationFrame(step);
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameIdRef.current !== null) {
        window.cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isInView, end, duration]);

  return { count, ref };
};

const StarIcon = ({ size = 'sm' }: { size?: 'sm' | 'xs' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={size === 'sm' ? 'h-4 w-4' : 'h-3 w-3'}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
);

export default function Testimonials() {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  
  // Use Framer Motion's useInView for reliable mobile detection
  const isStatsInView = useInView(statsRef, { once: true, margin: '-100px' });

  // Check if stats section is visible on mount (for immediate animation)
  useEffect(() => {
    if (statsRef.current) {
      const rect = statsRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight + 100 && rect.bottom > -100;
      if (isVisible) {
        setShouldAnimate(true);
      }
    }
  }, []);

  // Trigger animation when stats come into view
  useEffect(() => {
    if (isStatsInView) {
      setShouldAnimate(true);
    }
  }, [isStatsInView]);

  // Counters - pass shouldAnimate to trigger animation
  const yearsCounter = useCounter(15, 2, shouldAnimate);
  const eventsCounter = useCounter(500, 2.5, shouldAnimate);
  const satisfactionCounter = useCounter(98, 2, shouldAnimate);

  const testimonials = useMemo(() => {
    return [
      t('testimonials.testimonials.0'),
      t('testimonials.testimonials.1'),
      t('testimonials.testimonials.2'),
    ];
  }, [t]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth * 0.85;
      const newActive = Math.round(scrollLeft / cardWidth);
      setActiveTestimonial(Math.min(newActive, testimonials.length - 1));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const deltaX = Math.abs(e.touches[0].clientX - touchStartRef.current.x);
    const deltaY = Math.abs(e.touches[0].clientY - touchStartRef.current.y);

    // Only allow one direction at a time
    if (deltaX > 10 || deltaY > 10) {
      if (deltaX > deltaY) {
        // Horizontal scroll - prevent page scroll
        e.preventDefault();
      } else {
        // Vertical scroll - prevent carousel scroll, allow page scroll
        if (scrollRef.current) {
          scrollRef.current.style.overflowX = 'hidden';
          setTimeout(() => {
            if (scrollRef.current) {
              scrollRef.current.style.overflowX = 'auto';
            }
          }, 100);
        }
      }
    }
  };


  return (
    <section className="py-12 sm:py-20 md:py-28 bg-[#ebe6dc]">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6c655b] mb-3 sm:mb-6">
            <StarIcon />
            <span className="uppercase tracking-[0.2em] sm:tracking-[0.25em] font-light">{t('testimonials.kicker')}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-[#1f1f1f] tracking-tight leading-[0.9] mb-2">
            {t('testimonials.title')}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#6c655b] font-light">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        {/* Mobile: Compact Stats Row */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="xl:hidden grid grid-cols-3 gap-3 mb-6 bg-white/60 backdrop-blur-sm border border-[#dcd3c5] p-4"
        >
          <div className="text-center">
            <div ref={yearsCounter.ref} className="flex flex-col items-center gap-1">
              <div className="flex items-end justify-center gap-1">
                <span className="text-2xl sm:text-3xl text-[#1f1f1f] font-serif font-light">{yearsCounter.count}</span>
              </div>
              <span className="text-[#6c655b] text-[10px] uppercase tracking-[0.1em]">{t('testimonials.stats.years')}</span>
            </div>
          </div>
          <div className="text-center border-x border-[#dcd3c5]">
            <div ref={eventsCounter.ref} className="flex flex-col items-center gap-1">
              <div className="flex items-end justify-center gap-1">
                <span className="text-2xl sm:text-3xl text-[#1f1f1f] font-serif font-light">{eventsCounter.count}</span>
                <span className="text-[#6c655b] text-xs mb-0.5">+</span>
              </div>
              <span className="text-[#6c655b] text-[10px] uppercase tracking-[0.1em]">{t('testimonials.stats.events')}</span>
            </div>
          </div>
          <div className="text-center">
            <div ref={satisfactionCounter.ref} className="flex flex-col items-center gap-1">
              <div className="flex items-end justify-center gap-1">
                <span className="text-2xl sm:text-3xl text-[#1f1f1f] font-serif font-light">{satisfactionCounter.count}</span>
                <span className="text-[#6c655b] text-xs mb-0.5">%</span>
              </div>
              <span className="text-[#6c655b] text-[10px] uppercase tracking-[0.1em]">{t('testimonials.stats.satisfaction')}</span>
            </div>
          </div>
        </motion.div>

        {/* Mobile: Horizontal Scrollable Testimonials */}
        <div className="xl:hidden -mx-4 sm:-mx-8">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 sm:px-8 pb-4 overscroll-x-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-[85vw] max-w-[340px] snap-center bg-white/60 backdrop-blur-sm border border-[#dcd3c5] p-5 select-none"
              >
                <div className="flex items-center gap-0.5 text-[#C19A5B] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} size="xs" />
                  ))}
                </div>
                <p className="text-base leading-relaxed text-[#1f1f1f] font-serif font-light mb-4 line-clamp-4">
                  <span aria-hidden="true">&ldquo;</span>
                  {testimonial.text}
                  <span aria-hidden="true">&rdquo;</span>
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-[#dcd3c5]">
                  <div className="h-8 w-8 bg-gradient-to-br from-[#C19A5B] to-[#D0A15A] flex items-center justify-center text-white text-xs font-medium">
                    {testimonial.name?.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1f1f1f] leading-tight">{testimonial.name}</p>
                    <p className="text-xs text-[#6c655b]">{testimonial.company}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollRef.current) {
                    const cardWidth = scrollRef.current.offsetWidth * 0.85 + 16;
                    scrollRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeTestimonial === index ? 'bg-[#C19A5B] w-6' : 'bg-[#C19A5B]/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA Button */}
          <div className="px-4 sm:px-8 mt-6">
            <motion.a
              href="#menu-builder"
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center h-12 w-full bg-[#1f1f1f] text-white text-xs uppercase tracking-[0.2em] active:bg-[#2f2a25] transition-colors"
            >
              {t('testimonials.stats.bookEvent')}
            </motion.a>
          </div>
        </div>

        {/* Desktop: Original 4-Column Grid */}
        <div className="hidden xl:block">
          <div className="grid grid-cols-4 gap-4">
            {/* Metrics Card */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col min-h-[420px] bg-white/60 backdrop-blur-sm border border-[#dcd3c5] p-6 justify-between"
            >
              <div className="space-y-5">
                <div ref={yearsCounter.ref} className="flex items-end gap-2">
                  <span className="text-6xl text-[#1f1f1f] font-serif font-light tracking-tight">{yearsCounter.count}</span>
                  <span className="text-[#6c655b] text-base font-light mb-1">{t('testimonials.stats.years')}</span>
                </div>
                <p className="text-sm text-[#4a4742] leading-relaxed">
                  Crafting authentic <span className="font-medium text-[#1f1f1f]">Moroccan experiences</span> with dedication to tradition and innovation.
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#1f1f1f] uppercase tracking-wider">{t('testimonials.stats.company')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 bg-gradient-to-br from-[#C19A5B] to-[#D0A15A] border border-[#C19A5B]/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M2 12h20" />
                    </svg>
                  </div>
                  <div className="h-7 w-7 bg-gradient-to-br from-[#C19A5B] to-[#D0A15A] border border-[#C19A5B]/30 -ml-2 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7" />
                      <path d="M15 7h6v6" />
                    </svg>
                  </div>
                  <div className="h-7 w-7 bg-gradient-to-br from-[#C19A5B] to-[#D0A15A] border border-[#C19A5B]/30 -ml-2 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span ref={eventsCounter.ref} className="inline-flex items-center justify-center -ml-1 h-7 px-2 bg-[#1f1f1f] text-white text-xs font-light uppercase tracking-wider">{eventsCounter.count}+</span>
                </div>
                <div className="flex items-center gap-1 text-[#C19A5B]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7" />
                    <path d="M15 7h6v6" />
                  </svg>
                  <span className="text-xs text-[#6c655b] font-light">{t('testimonials.stats.eventsLabel')}</span>
                </div>
              </div>
              <motion.a
                href="#menu-builder"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 h-11 w-full flex items-center justify-center bg-[#1f1f1f] text-white text-sm font-light uppercase tracking-[0.25em] hover:bg-[#2f2a25] transition-colors"
              >
                {t('testimonials.stats.bookEvent')}
              </motion.a>
            </motion.article>

            {/* Testimonial Column 1 */}
            <div className="grid grid-rows-[auto_1fr] gap-4">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex bg-white/60 backdrop-blur-sm border border-[#dcd3c5] p-4 items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-gradient-to-br from-[#C19A5B] to-[#D0A15A] border border-[#C19A5B]/30 flex items-center justify-center text-white text-xs font-medium">
                    {testimonials[0]?.name?.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1f1f1f] leading-tight">{testimonials[0]?.name}</p>
                    <p className="text-xs text-[#6c655b]">{testimonials[0]?.company}</p>
                  </div>
                </div>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex flex-col min-h-[420px] bg-white/60 backdrop-blur-sm border border-[#dcd3c5] p-6 justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-0.5 text-[#C19A5B]">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                </div>
                <p className="text-3xl text-right leading-snug text-[#1f1f1f] font-serif font-light tracking-tight">
                  {testimonials[0]?.text}
                </p>
              </motion.article>
            </div>

            {/* Testimonial Column 2 */}
            <div className="grid grid-rows-[1fr_auto] gap-4">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col min-h-[420px] bg-white/60 backdrop-blur-sm border border-[#dcd3c5] p-6 justify-between"
              >
                <p className="text-3xl text-center leading-snug text-[#1f1f1f] font-serif font-light tracking-tight">
                  {testimonials[1]?.text}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-[#C19A5B]">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                </div>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex gap-3 bg-white/60 backdrop-blur-sm border border-[#dcd3c5] p-4 items-center"
              >
                <div className="h-9 w-9 bg-gradient-to-br from-[#C19A5B] to-[#D0A15A] border border-[#C19A5B]/30 flex items-center justify-center text-white text-xs font-medium">
                  {testimonials[1]?.name?.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1f1f1f] leading-tight">{testimonials[1]?.name}</p>
                  <p className="text-xs text-[#6c655b]">{testimonials[1]?.company}</p>
                </div>
              </motion.article>
            </div>

            {/* Testimonial Column 3 */}
            <div className="grid grid-rows-[auto_1fr] gap-4">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex bg-white/60 backdrop-blur-sm border border-[#dcd3c5] p-4 items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-gradient-to-br from-[#C19A5B] to-[#D0A15A] border border-[#C19A5B]/30 flex items-center justify-center text-white text-xs font-medium">
                    {testimonials[2]?.name?.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1f1f1f] leading-tight">{testimonials[2]?.name}</p>
                    <p className="text-xs text-[#6c655b]">{testimonials[2]?.role}</p>
                  </div>
                </div>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-col min-h-[420px] bg-white/60 backdrop-blur-sm border border-[#dcd3c5] p-6 justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-0.5 text-[#C19A5B]">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                </div>
                <p className="text-3xl text-right leading-snug text-[#1f1f1f] font-serif font-light tracking-tight">
                  {testimonials[2]?.text}
                </p>
              </motion.article>
            </div>
          </div>

          {/* Bottom Stats - Desktop only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 pt-8 border-t border-[#dcd3c5] grid grid-cols-3 gap-6"
          >
            <div className="text-left">
              <div ref={satisfactionCounter.ref} className="flex items-end gap-2 mb-2">
                <span className="text-5xl text-[#1f1f1f] font-serif font-light tracking-tight">{satisfactionCounter.count}</span>
                <span className="text-[#6c655b] text-base font-light mb-1">%</span>
              </div>
              <p className="text-sm text-[#6c655b] uppercase tracking-[0.2em] font-light">{t('testimonials.stats.satisfaction')}</p>
            </div>
            <div className="text-center">
              <div ref={eventsCounter.ref} className="flex items-end justify-center gap-2 mb-2">
                <span className="text-5xl text-[#1f1f1f] font-serif font-light tracking-tight">{eventsCounter.count}</span>
                <span className="text-[#6c655b] text-base font-light mb-1">+</span>
              </div>
              <p className="text-sm text-[#6c655b] uppercase tracking-[0.2em] font-light">{t('testimonials.stats.events')}</p>
            </div>
            <div className="text-right">
              <div ref={yearsCounter.ref} className="flex items-end justify-end gap-2 mb-2">
                <span className="text-5xl text-[#1f1f1f] font-serif font-light tracking-tight">{yearsCounter.count}</span>
                <span className="text-[#6c655b] text-base font-light mb-1">years</span>
              </div>
              <p className="text-sm text-[#6c655b] uppercase tracking-[0.2em] font-light">{t('testimonials.stats.excellence')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
