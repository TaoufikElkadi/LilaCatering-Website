'use client';

import { useRef, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

// Shared warm beige/cream blur-up placeholder (tiny 10px JPEG) for smooth loading.
const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwChARN//9k=';

const baseServices = [
  { id: 'corporate', image: '/service1.jpg' },
  { id: 'wedding', image: '/service2.jpg' },
  { id: 'event', image: '/service3.jpg' },
];

export default function Services() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const middleY = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -80]);
  const rightY = useTransform(scrollYProgress, [0, 0.5, 1], [120, 0, -120]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth * 0.85;
      const newActive = Math.round(scrollLeft / cardWidth);
      setActiveCard(Math.min(newActive, baseServices.length - 1));
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

  const cards = useMemo(() => {
    const copy = t('services.cards') as Record<string, { title: string; description: string }>;
    return baseServices.map((service) => ({
      ...service,
      title: copy?.[service.id]?.title ?? '',
      description: copy?.[service.id]?.description ?? '',
    }));
  }, [t]);


  return (
    <section id="services" className="py-12 sm:py-20 md:py-28 bg-[#ebe6dc] text-[#1f1f1f]" ref={sectionRef}>
      <div className="max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-2 sm:space-y-4 mb-8 sm:mb-16"
        >
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#6c655b]">{t('services.kicker')}</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif uppercase tracking-[0.06em] leading-tight">
            {t('services.title')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#4a4742] max-w-4xl mx-auto leading-relaxed">
            {t('services.subtext')}
          </p>
        </motion.div>

        {/* Mobile: Horizontal Carousel */}
        <div className="lg:hidden -mx-4 sm:-mx-8">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 sm:px-8 pb-4 overscroll-x-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {cards.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-[85vw] max-w-[340px] snap-center select-none"
              >
                <div className="flex flex-col">
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#d9d0c3] mb-4">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      draggable={false}
                      sizes="(max-width: 768px) 85vw, 340px"
                      quality={80}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>
                  <h3 className="text-base font-serif uppercase tracking-[0.06em] text-center mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#4a4742] leading-relaxed text-center mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <a
                    href="#menu-builder"
                    className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#1f1f1f] py-2"
                  >
                    <span>{t('services.cta')}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollRef.current) {
                    const cardWidth = scrollRef.current.offsetWidth * 0.85 + 16;
                    scrollRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeCard === index ? 'bg-[#C19A5B] w-6' : 'bg-[#C19A5B]/30'
                }`}
                aria-label={`Go to service ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: 3-column grid with parallax */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-14 items-start mt-16">
          {cards.map((service, index) => {
            const y = index === 0 ? 0 : index === 1 ? middleY : rightY;
            return (
              <motion.div
                key={service.id}
                style={{ y: index === 0 ? undefined : y }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#d9d0c3] mb-6">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1440px) 30vw, 440px"
                    quality={80}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                </div>
                <h3 className="text-xl font-serif uppercase tracking-[0.06em] text-center mb-4">
                  {service.title}
                </h3>
                <p className="text-base text-[#4a4742] leading-relaxed text-center mb-6 px-2">
                  {service.description}
                </p>
                <div className="flex flex-col items-center gap-2 mt-auto">
                  <a
                    href="#menu-builder"
                    className="text-xs uppercase tracking-[0.22em] text-[#1f1f1f] hover:opacity-70 transition-opacity"
                  >
                    {t('services.cta')}
                  </a>
                  <div className="w-10 h-px bg-[#c7b9a5]" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
