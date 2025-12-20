'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useLanguage } from './LanguageProvider';

const useCounter = (end: number, duration: number = 2) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration, hasAnimated]);

  return { count, ref };
};

const testimonials = [
  {
    id: 1,
    name: 'Sophie Laurent',
    role: 'Corporate Event Manager',
    company: 'Hermès Paris',
    text: 'Lila Catering transformed our executive dinner into an unforgettable experience. The attention to detail and authentic Moroccan flavors exceeded all expectations.',
    rating: 5,
    image: 'SL',
  },
  {
    id: 2,
    name: 'David van Berg',
    role: 'Wedding Planner',
    company: 'Elite Events',
    text: 'The seamless service and exquisite presentation made our couple\'s special day truly magical. Every dish was a work of art.',
    rating: 5,
    image: 'DV',
  },
  {
    id: 3,
    name: 'Isabella Romano',
    role: 'Director of Operations',
    company: 'Four Seasons Hotel',
    text: 'Their commitment to quality and refined technique sets them apart. We trust Lila Catering for our most prestigious events.',
    rating: 5,
    image: 'IR',
  },
];

const StarIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-4 w-4" 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
);

export default function Testimonials() {
  const { t, lang } = useLanguage();
  const yearsCounter = useCounter(15, 2);
  const eventsCounter = useCounter(500, 2.5);
  const satisfactionCounter = useCounter(98, 2);
  const yearsBottomCounter = useCounter(15, 2);
  const eventsBottomCounter = useCounter(500, 2.5);
  const satisfactionBottomCounter = useCounter(98, 2);

  const testimonials = useMemo(() => {
    return [
      t('testimonials.testimonials.0'),
      t('testimonials.testimonials.1'),
      t('testimonials.testimonials.2'),
    ];
  }, [t, lang]);

  return (
    <section className="py-20 md:py-28 bg-[#ebe6dc]">
      <div className="max-w-[90rem] mx-auto px-8 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 md:p-8"
        >
          {/* Header */}
          <div className="flex items-center gap-2 text-sm text-[#6c655b] mb-6">
            <StarIcon />
            <span className="uppercase tracking-[0.25em] font-light">{t('testimonials.kicker')}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-[#1f1f1f] tracking-tight leading-[0.9] mb-2">
              {t('testimonials.title')}
            </h2>
            <p className="text-sm md:text-base text-[#6c655b] font-light">
              {t('testimonials.subtitle')}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Metrics Card */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col min-h-[420px] bg-white/60 backdrop-blur-sm border border-[#dcd3c5] p-5 md:p-6 justify-between"
            >
              <div className="space-y-5">
                <div ref={yearsCounter.ref} className="flex items-end gap-2">
                  <span className="text-5xl md:text-6xl text-[#1f1f1f] font-serif font-light tracking-tight">{yearsCounter.count}</span>
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
                    {testimonials[0].name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1f1f1f] leading-tight">{testimonials[0].name}</p>
                    <p className="text-xs text-[#6c655b]">{testimonials[0].company}</p>
                  </div>
                </div>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex flex-col min-h-[420px] bg-white/60 backdrop-blur-sm border border-[#dcd3c5] p-5 md:p-6 justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-0.5 text-[#C19A5B]">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                </div>
                <p className="text-2xl md:text-3xl text-right leading-snug text-[#1f1f1f] font-serif font-light tracking-tight">
                  {testimonials[0].text}
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
                <p className="text-2xl md:text-3xl text-center leading-snug text-[#1f1f1f] font-serif font-light tracking-tight">
                  {testimonials[1].text}
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
                  {testimonials[1].name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1f1f1f] leading-tight">{testimonials[1].name}</p>
                  <p className="text-xs text-[#6c655b]">{testimonials[1].company}</p>
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
                    {testimonials[2].name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1f1f1f] leading-tight">{testimonials[2].name}</p>
                    <p className="text-xs text-[#6c655b]">{testimonials[2].role}</p>
                  </div>
                </div>
              </motion.article>

              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-col min-h-[420px] bg-white/60 backdrop-blur-sm border border-[#dcd3c5] p-5 md:p-6 justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-0.5 text-[#C19A5B]">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                </div>
                <p className="text-2xl md:text-3xl text-right leading-snug text-[#1f1f1f] font-serif font-light tracking-tight">
                  {testimonials[2].text}
                </p>
              </motion.article>
            </div>
          </div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 pt-8 border-t border-[#dcd3c5] grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="text-center md:text-left">
              <div ref={satisfactionBottomCounter.ref} className="flex items-end justify-center md:justify-start gap-2 mb-2">
                <span className="text-4xl md:text-5xl text-[#1f1f1f] font-serif font-light tracking-tight">{satisfactionBottomCounter.count}</span>
                <span className="text-[#6c655b] text-base font-light mb-1">%</span>
              </div>
              <p className="text-sm text-[#6c655b] uppercase tracking-[0.2em] font-light">{t('testimonials.stats.satisfaction')}</p>
            </div>
            <div className="text-center">
              <div ref={eventsBottomCounter.ref} className="flex items-end justify-center gap-2 mb-2">
                <span className="text-4xl md:text-5xl text-[#1f1f1f] font-serif font-light tracking-tight">{eventsBottomCounter.count}</span>
                <span className="text-[#6c655b] text-base font-light mb-1">+</span>
              </div>
              <p className="text-sm text-[#6c655b] uppercase tracking-[0.2em] font-light">{t('testimonials.stats.events')}</p>
            </div>
            <div className="text-center md:text-right">
              <div ref={yearsBottomCounter.ref} className="flex items-end justify-center md:justify-end gap-2 mb-2">
                <span className="text-4xl md:text-5xl text-[#1f1f1f] font-serif font-light tracking-tight">{yearsBottomCounter.count}</span>
                <span className="text-[#6c655b] text-base font-light mb-1">years</span>
              </div>
              <p className="text-sm text-[#6c655b] uppercase tracking-[0.2em] font-light">{t('testimonials.stats.excellence')}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

