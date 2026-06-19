'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageProvider';
import { useRef } from 'react';

export default function About() {
  const { t } = useLanguage();
  const hero = t('aboutPage.hero');
  const journey = t('aboutPage.journey');
  const tradition = t('aboutPage.tradition');
  const quote = t('aboutPage.quote');
  const philosophy = t('aboutPage.philosophy');
  const team = t('aboutPage.team');
  const cta = t('aboutPage.cta');

  // Ref for the first image section
  const imageRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"]
  });

  // Transform scale from 0.7 to 1 as user scrolls
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.7, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.5, 1]);

  // Track scroll progress for the animated line
  const { scrollYProgress: pageScrollProgress } = useScroll();
  const smoothProgress = useSpring(pageScrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Line height grows from 0% to 90% as user scrolls
  const lineHeight = useTransform(smoothProgress, [0, 1], ['0%', '90%']);

  return (
    <main className="min-h-screen bg-primary-black relative">
      {/* Progressive Vertical Guide Line */}
      <div className="fixed left-1/2 top-[5%] -translate-x-1/2 z-10 pointer-events-none hidden md:block">
        {/* The line that grows as you scroll */}
        <motion.div
          className="relative w-[2px] bg-gradient-to-b from-accent-gold/40 via-accent-gold/20 to-transparent"
          style={{
            height: lineHeight,
          }}
        >
          {/* Glowing tip at the bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-gold rounded-full shadow-lg shadow-accent-gold/50">
            <div className="absolute inset-0 bg-accent-gold rounded-full animate-ping opacity-75" />
          </div>
        </motion.div>
      </div>

      {/* Hero Section - OUR STORY */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 moroccan-pattern opacity-5" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <p className="text-xs md:text-sm tracking-[0.4em] text-accent-gold mb-2 font-light uppercase">
              {hero.tagline1}
            </p>
            <div className="w-12 h-px bg-accent-gold mx-auto my-6" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-7xl md:text-8xl lg:text-9xl font-serif font-light mb-8 text-primary-white tracking-wider"
          >
            {hero.title}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8"
          >
            <div className="w-12 h-px bg-accent-gold mx-auto my-6" />
            <p className="text-xs md:text-sm tracking-[0.4em] text-accent-gold mt-2 font-light uppercase">
              {hero.tagline2}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-base md:text-lg text-secondary-text max-w-3xl mx-auto leading-relaxed font-light mt-16"
          >
            {hero.subtitle}
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-16 bg-gradient-to-b from-accent-gold to-transparent" />
        </motion.div>
      </section>

      {/* Expanding Image Section */}
      <section ref={imageRef} className="py-20 md:py-32 px-4 md:px-8 lg:px-16 bg-primary-black">
        <motion.div
          style={{ scale, opacity }}
          className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden"
        >
          <Image
            src="/h1.jpg"
            alt="Restaurant interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-black/50 to-transparent" />
        </motion.div>
      </section>

      {/* Section I - Our Journey */}
      <section className="py-20 md:py-32 px-4 bg-primary-black relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-7xl md:text-8xl font-serif font-light text-accent-gold/20 mb-4">
              {journey.sectionNumber}
            </p>
            <div className="w-24 h-px bg-accent-gold mx-auto mb-8" />
            <h3 className="text-4xl md:text-6xl font-serif font-light text-primary-white tracking-wide">
              {journey.title}
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <p className="text-base md:text-lg text-secondary-text leading-relaxed font-light">
                {journey.paragraph1}
              </p>
              <p className="text-base md:text-lg text-secondary-text leading-relaxed font-light">
                {journey.paragraph2}
              </p>
              <p className="text-base md:text-lg text-secondary-text leading-relaxed font-light">
                {journey.paragraph3}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[500px] md:h-[600px] group"
            >
              <div className="absolute inset-0 border border-accent-gold/30 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
              <Image
                src="/h2.jpg"
                alt="Moroccan door"
                fill
                className="object-cover relative z-10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section II - Where Tradition Meets Modern Comfort */}
      <section className="relative py-32 md:py-40 bg-primary-charcoal">
        <div className="absolute inset-0 moroccan-pattern opacity-5" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-7xl md:text-8xl font-serif font-light text-accent-gold/20 mb-8">
              {tradition.sectionNumber}
            </p>
            <div className="w-24 h-px bg-accent-gold mx-auto mb-12" />
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light mb-16 leading-tight text-primary-white tracking-wide">
              {tradition.title}
            </h3>
            <p className="text-base md:text-lg text-secondary-text leading-relaxed font-light max-w-3xl mx-auto">
              {tradition.paragraph}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Full-width Restaurant Interior Image */}
      <section className="w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative w-full h-[70vh] md:h-[90vh]"
        >
          <Image
            src="/h3.jpg"
            alt="Restaurant seating"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-black/30 via-transparent to-primary-black/30" />
        </motion.div>
      </section>

      {/* Quote Section */}
      <section className="py-32 md:py-40 px-4 bg-primary-black relative">
        <div className="absolute inset-0 moroccan-pattern opacity-5" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="mb-12">
              <div className="w-1 h-16 bg-accent-gold mx-auto mb-8" />
            </div>
            <blockquote className="text-2xl md:text-4xl lg:text-5xl font-serif font-light italic text-primary-white mb-16 leading-relaxed">
              &ldquo;{quote.text}&rdquo;
            </blockquote>
            <div className="w-24 h-px bg-accent-gold mx-auto mb-8" />
            <p className="text-base md:text-lg text-accent-gold font-light tracking-wider mb-2">
              {quote.author}
            </p>
            <p className="text-sm md:text-base text-secondary-text font-light">
              {quote.role}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Full-width Restaurant Detail Image */}
      <section className="w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative w-full h-[60vh] md:h-[80vh]"
        >
          <Image
            src="/h4.jpg"
            alt="Restaurant details"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-black/50 to-primary-black/50" />
        </motion.div>
      </section>

      {/* Section III - Our Culinary Philosophy */}
      <section className="py-32 md:py-40 px-4 bg-primary-black relative">
        <div className="absolute inset-0 moroccan-pattern opacity-5" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <p className="text-7xl md:text-8xl font-serif font-light text-accent-gold/20 mb-8">
              {philosophy.sectionNumber}
            </p>
            <div className="w-24 h-px bg-accent-gold mx-auto mb-12" />
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-primary-white tracking-wide">
              {philosophy.title}
            </h3>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-16">
            {philosophy.principles.map((principle: any, index: number) => (
              <motion.div
                key={principle.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-start gap-8">
                  <div className="flex-shrink-0">
                    <span className="text-5xl md:text-6xl font-serif text-accent-gold/30 font-light">
                      {principle.number}
                    </span>
                  </div>
                  <div className="pt-2">
                    <div className="w-16 h-px bg-accent-gold mb-6" />
                    <h4 className="text-xl md:text-2xl font-serif font-light text-primary-white mb-4 tracking-wide">
                      {principle.title}
                    </h4>
                    <p className="text-base md:text-lg text-secondary-text leading-relaxed font-light">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section IV - The People Behind */}
      <section className="py-32 md:py-40 px-4 bg-primary-charcoal relative">
        <div className="absolute inset-0 moroccan-pattern opacity-5" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-7xl md:text-8xl font-serif font-light text-accent-gold/20 mb-8">
              {team.sectionNumber}
            </p>
            <div className="w-24 h-px bg-accent-gold mx-auto mb-12" />
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-primary-white mb-12 tracking-wide">
              {team.title}
            </h3>
            <p className="text-base md:text-lg text-secondary-text leading-relaxed font-light max-w-3xl mx-auto">
              {team.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] md:h-[600px] mt-16 group"
          >
            <div className="absolute inset-0 border border-accent-gold/30 -translate-x-4 -translate-y-4 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
            <Image
              src="/h5.jpg"
              alt="Team at work"
              fill
              className="object-cover relative z-10"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-40 px-4 bg-primary-black relative border-t border-accent-gold/20">
        <div className="absolute inset-0 moroccan-pattern opacity-5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-1 h-16 bg-accent-gold mx-auto mb-12" />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-primary-white mb-8 tracking-wide leading-tight">
              {cta.titleLine1}
              <br />
              {cta.titleLine2}
            </h2>
            <p className="text-base md:text-lg text-secondary-text mb-12 font-light max-w-2xl mx-auto">
              {cta.subtitle}
            </p>
            <motion.a
              href="#menu-builder"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-12 py-5 bg-accent-gold text-primary-black font-light text-base md:text-lg tracking-wider hover:bg-accent-gold-light transition-all duration-300 relative group overflow-hidden"
            >
              <span className="relative z-10">{cta.button}</span>
              <div className="absolute inset-0 bg-accent-gold-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
