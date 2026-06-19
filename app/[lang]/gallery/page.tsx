'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Metadata } from 'next';
import { useLanguage } from '@/components/LanguageProvider';

interface GalleryImage {
  id: number;
  category: 'dishes' | 'events' | 'decor';
  title: string;
  emoji: string;
}

export default function Gallery() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'dishes' | 'events' | 'decor'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const hero = t('galleryPage.hero');
  const categories = t('galleryPage.categories');
  const cta = t('galleryPage.cta');

  const categoryList = [
    { id: 'all' as const, name: categories.all, icon: '🖼️' },
    { id: 'dishes' as const, name: categories.dishes, icon: '🍽️' },
    { id: 'events' as const, name: categories.events, icon: '🎉' },
    { id: 'decor' as const, name: categories.decor, icon: '✨' },
  ];

  const galleryImages: GalleryImage[] = [
    { id: 1, category: 'dishes', title: 'Lamb Tagine', emoji: '🍲' },
    { id: 2, category: 'dishes', title: 'Couscous Royal', emoji: '🥘' },
    { id: 3, category: 'events', title: 'Wedding Reception', emoji: '💒' },
    { id: 4, category: 'dishes', title: 'Fresh Baklava', emoji: '🥮' },
    { id: 5, category: 'decor', title: 'Table Setting', emoji: '🕯️' },
    { id: 6, category: 'events', title: 'Corporate Event', emoji: '🏢' },
    { id: 7, category: 'dishes', title: 'Moroccan Mezze', emoji: '🥗' },
    { id: 8, category: 'decor', title: 'Moroccan Lanterns', emoji: '🏮' },
    { id: 9, category: 'dishes', title: 'Mint Tea Service', emoji: '🫖' },
    { id: 10, category: 'events', title: 'Private Dinner', emoji: '🍷' },
    { id: 11, category: 'dishes', title: 'Seafood Pastilla', emoji: '🥟' },
    { id: 12, category: 'decor', title: 'Floral Arrangements', emoji: '💐' },
  ];

  const filteredImages =
    selectedCategory === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] bg-gradient-to-br from-primary-charcoal to-primary-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 moroccan-pattern opacity-20" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
            <span className="text-accent-gold">{hero.title}</span>
          </h1>
          <p className="text-xl text-secondary-text max-w-2xl mx-auto">
            {hero.subtitle}
          </p>
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-primary-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categoryList.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-accent-gold text-primary-black shadow-lg shadow-accent-gold/30'
                    : 'bg-primary-charcoal/50 text-accent-gold border border-accent-gold/30 hover:border-accent-gold'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -10 }}
                  onClick={() => setSelectedImage(image)}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                >
                  {/* Image Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-gold to-primary-charcoal">
                    <div className="absolute inset-0 moroccan-pattern opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center text-7xl">
                      {image.emoji}
                    </div>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-primary-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-xl font-serif font-bold text-accent-gold mb-2">
                        {image.title}
                      </h3>
                      <p className="text-primary-white text-sm">Click to view</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-primary-black/95 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full aspect-square rounded-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-accent-gold rounded-full flex items-center justify-center hover:bg-accent-golden-brown transition-colors"
              >
                <svg
                  className="w-6 h-6 text-primary-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Image */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-gold to-primary-charcoal">
                <div className="absolute inset-0 moroccan-pattern opacity-30" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-9xl mb-6">{selectedImage.emoji}</div>
                  <h3 className="text-3xl font-serif font-bold text-accent-gold">
                    {selectedImage.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black to-primary-dark-red/10 moroccan-pattern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              <span className="text-accent-gold">{cta.titleLine1}</span>
              <br />
              <span className="text-primary-white">{cta.titleLine2}</span>
            </h2>
            <p className="text-secondary-text text-lg mb-8">
              {cta.subtitle}
            </p>
            <motion.a
              href="#menu-builder"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 gold-gradient text-primary-black font-semibold rounded-full text-lg hover:shadow-lg hover:shadow-primary-gold/50 transition-all duration-300"
            >
              {cta.button}
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
