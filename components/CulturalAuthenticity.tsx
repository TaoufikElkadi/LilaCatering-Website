'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useMemo } from 'react';
import Image from 'next/image';
import { useLanguage } from './LanguageProvider';

const baseCards = [
  {
    id: 1,
    image: '/h1.jpg',
  },
  {
    id: 2,
    image: '/h2.jpg',
  },
  {
    id: 3,
    image: '/h3.jpg',
  },
  {
    id: 4,
    image: '/h4.jpg',
  }
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

export default function CulturalAuthenticity() {
  const { t, lang } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const cards = useMemo(() => {
    return baseCards.map((baseCard, index) => ({
      ...baseCard,
      ...t(`culturalAuthenticity.cards.${index}`),
    }));
  }, [t, lang]);

  return (
    <section className="py-20 md:py-28 bg-[#f7f3ec] relative overflow-hidden">
      {/* Moroccan Geometric Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="moroccan-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              {/* Eight-pointed star */}
              <path d="M60 20 L65 40 L80 35 L70 50 L85 55 L70 60 L80 75 L65 70 L60 90 L55 70 L40 75 L50 60 L35 55 L50 50 L40 35 L55 40 Z" 
                    fill="#C19A5B" opacity="0.4"/>
              {/* Interlocking squares */}
              <rect x="35" y="35" width="50" height="50" fill="none" stroke="#C19A5B" strokeWidth="1" opacity="0.3"/>
              <rect x="42" y="42" width="36" height="36" fill="none" stroke="#C19A5B" strokeWidth="1" opacity="0.3" transform="rotate(45 60 60)"/>
              {/* Small decorative dots */}
              <circle cx="30" cy="30" r="2" fill="#C19A5B" opacity="0.2"/>
              <circle cx="90" cy="30" r="2" fill="#C19A5B" opacity="0.2"/>
              <circle cx="30" cy="90" r="2" fill="#C19A5B" opacity="0.2"/>
              <circle cx="90" cy="90" r="2" fill="#C19A5B" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#moroccan-pattern)"/>
        </svg>
      </div>

      {/* Decorative corner ornaments */}
      <div className="absolute top-0 left-0 w-48 h-48 opacity-[0.04]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 Q50,50 0,100 L0,0 M0,0 Q50,50 100,0 L0,0" fill="#C19A5B"/>
          <path d="M20,20 Q45,45 20,70 L20,20 M20,20 Q45,45 70,20 L20,20" fill="none" stroke="#C19A5B" strokeWidth="2"/>
        </svg>
      </div>
      
      <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.04] transform scale-x-[-1]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 Q50,50 0,100 L0,0 M0,0 Q50,50 100,0 L0,0" fill="#C19A5B"/>
          <path d="M20,20 Q45,45 20,70 L20,20 M20,20 Q45,45 70,20 L20,20" fill="none" stroke="#C19A5B" strokeWidth="2"/>
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-48 h-48 opacity-[0.04] transform scale-y-[-1]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 Q50,50 0,100 L0,0 M0,0 Q50,50 100,0 L0,0" fill="#C19A5B"/>
          <path d="M20,20 Q45,45 20,70 L20,20 M20,20 Q45,45 70,20 L20,20" fill="none" stroke="#C19A5B" strokeWidth="2"/>
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 w-48 h-48 opacity-[0.04] transform scale-[-1]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 Q50,50 0,100 L0,0 M0,0 Q50,50 100,0 L0,0" fill="#C19A5B"/>
          <path d="M20,20 Q45,45 20,70 L20,20 M20,20 Q45,45 70,20 L20,20" fill="none" stroke="#C19A5B" strokeWidth="2"/>
        </svg>
      </div>

      <div className="max-w-[90rem] mx-auto px-8 lg:px-12 xl:px-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 text-sm text-[#6c655b] mb-6">
            <StarIcon />
            <span className="uppercase tracking-[0.25em] font-light">{t('culturalAuthenticity.kicker')}</span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-[#1f1f1f] tracking-tight leading-[0.9] mb-3">
            {t('culturalAuthenticity.title')}
          </h2>
          <p className="text-base md:text-lg text-[#6c655b] font-light max-w-2xl">
            {t('culturalAuthenticity.description')}
          </p>
        </motion.div>

        {/* Cards Container */}
        <div ref={ref} className="relative overflow-visible py-8">
          <div className="flex justify-center items-center min-h-[500px] md:min-h-[650px]">
            {cards.map((card, index) => {
              // Calculate spread positions with overlap
              const totalCards = cards.length;
              const centerIndex = (totalCards - 1) / 2;
              const offset = (index - centerIndex) * 280; // subtle overlap
              
              // Outward tilts: left cards tilt left, right cards tilt right
              // Edge cards tilt more than inner cards
              const rotations = [-8, -3, 3, 8]; // degrees - outward tilt
              const spreadRotation = rotations[index];
              
              // Curve effect: edge cards are slightly lower
              const verticalOffset = [40, 15, 15, 40]; // pixels down for each card
              const yOffset = verticalOffset[index];
              
              return (
                <motion.div
                  key={card.id}
                  initial={{
                    x: 0,
                    y: 0,
                    rotate: 0,
                    scale: 0.88,
                    opacity: 0.7,
                    zIndex: index
                  }}
                  animate={isInView ? {
                    x: offset,
                    y: yOffset,
                    rotate: spreadRotation,
                    scale: 1,
                    opacity: 1,
                    zIndex: index
                  } : {
                    x: index * 30, // slight offset when stacked
                    y: 0,
                    rotate: 0,
                    scale: 0.88,
                    opacity: 0.7,
                    zIndex: index
                  }}
                  transition={{
                    duration: 1.2,
                    delay: index * 0.15,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  whileHover={{
                    y: yOffset - 16,
                    scale: 1.05,
                    rotate: 0,
                    zIndex: 50,
                    transition: { duration: 0.3 }
                  }}
                  className="absolute"
                  style={{
                    transformOrigin: 'center center'
                  }}
                >
                  <div className="relative w-[320px] h-[500px] md:w-[360px] md:h-[560px] overflow-hidden group cursor-pointer shadow-2xl">
                    {/* Card Background/Base */}
                    <div className="absolute inset-0 bg-white">
                      {/* Image */}
                      <div className="absolute inset-0">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                      </div>

                      {/* Decorative Moroccan Pattern Overlay - Subtle */}
                      <div className="absolute top-6 right-6 opacity-15 group-hover:opacity-25 transition-opacity duration-500">
                        <svg width="50" height="50" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 0L22.5 17.5L20 20L17.5 17.5L20 0Z" fill="white"/>
                          <path d="M40 20L22.5 22.5L20 20L22.5 17.5L40 20Z" fill="white"/>
                          <path d="M20 40L17.5 22.5L20 20L22.5 22.5L20 40Z" fill="white"/>
                          <path d="M0 20L17.5 17.5L20 20L17.5 22.5L0 20Z" fill="white"/>
                        </svg>
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7 text-white">
                        <div className="mb-3">
                          <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold tracking-tight leading-tight mb-2">
                            {card.title}
                          </h3>
                          <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/90 font-light">
                            {card.subtitle}
                          </p>
                        </div>
                        <div className="h-[2px] w-16 bg-[#C19A5B] mb-3 transition-all duration-500 group-hover:w-full" />
                        <p className="text-sm md:text-base text-white/95 font-light leading-relaxed">
                          {card.description}
                        </p>
                      </div>

                      {/* Card Border/Frame */}
                      <div className="absolute inset-0 border-2 border-white/20 group-hover:border-[#C19A5B]/60 transition-colors duration-300" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-[#6c655b] italic font-light">
            {t('culturalAuthenticity.bottomText')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

