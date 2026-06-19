'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/components/LanguageProvider';

export default function OurStory() {
  const { t } = useLanguage();
  const hero = t('aboutPage.hero');
  const journey = t('aboutPage.journey');
  const tradition = t('aboutPage.tradition');
  const quote = t('aboutPage.quote');
  const philosophy = t('aboutPage.philosophy');
  const team = t('aboutPage.team');
  const cta = t('aboutPage.cta');

  return (
    <main className="min-h-screen bg-[#f7f3ec]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 bg-[#f7f3ec]">
        <div className="absolute inset-0 moroccan-pattern opacity-[0.03]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto relative z-10 space-y-3 sm:space-y-4"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#C19A5B]"
          >
            {hero.tagline1}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-[#1f1f1f] tracking-[0.06em] sm:tracking-[0.08em] uppercase leading-snug"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#C19A5B]"
          >
            {hero.tagline2}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg text-[#1f1f1f]/70 max-w-3xl mx-auto leading-relaxed font-light pt-6"
          >
            {hero.subtitle}
          </motion.p>
        </motion.div>
      </section>

      {/* Main Image Section */}
      <section className="py-12 sm:py-20 md:py-28 px-4 md:px-8 lg:px-16 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden max-w-6xl mx-auto"
        >
          <Image
            src="/h1.jpg"
            alt="Restaurant interior"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </section>

      {/* Section I - Our Journey */}
      <section className="py-12 sm:py-20 md:py-28 px-4 bg-[#f7f3ec] relative">
        <div className="absolute inset-0 moroccan-pattern opacity-[0.03]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4"
          >
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#C19A5B]">
              {journey.sectionNumber}
            </p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-[#1f1f1f] tracking-[0.06em] sm:tracking-[0.08em] uppercase">
              {journey.title}
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-sm sm:text-base md:text-lg text-[#1f1f1f]/70 leading-relaxed font-light">
                {journey.paragraph1}
              </p>
              <p className="text-sm sm:text-base md:text-lg text-[#1f1f1f]/70 leading-relaxed font-light">
                {journey.paragraph2}
              </p>
              <p className="text-sm sm:text-base md:text-lg text-[#1f1f1f]/70 leading-relaxed font-light">
                {journey.paragraph3}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative aspect-[3/4] sm:h-[500px] md:h-[600px]"
            >
              <Image
                src="/h2.jpg"
                alt="Moroccan door"
                fill
                className="object-cover"
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
