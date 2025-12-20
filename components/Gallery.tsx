'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const galleryItems = [
  {
    id: 1,
    image: '/g1.jpg',
    alt: 'Culinary craft detail',
    span: 'col-span-1 row-span-1' // regular
  },
  {
    id: 2,
    image: '/g2.jpg',
    alt: 'Moroccan spices',
    span: 'col-span-1 row-span-2' // tall
  },
  {
    id: 3,
    image: '/g3.jpg',
    alt: 'Traditional cooking',
    span: 'col-span-1 row-span-1' // regular
  },
  {
    id: 4,
    image: '/g4.jpg',
    alt: 'Plated dish',
    span: 'col-span-2 row-span-1' // wide
  },
  {
    id: 5,
    image: '/g5.jpg',
    alt: 'Heritage kitchen',
    span: 'col-span-1 row-span-1' // regular
  },
  {
    id: 6,
    image: '/g6.jpg',
    alt: 'Artisan detail',
    span: 'col-span-1 row-span-1' // regular
  },
  {
    id: 7,
    image: '/g7.jpg',
    alt: 'Traditional tagine',
    span: 'col-span-1 row-span-2' // tall
  },
  {
    id: 8,
    image: '/g8.jpg',
    alt: 'Cultural authenticity',
    span: 'col-span-1 row-span-1' // regular
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

export default function Gallery() {
  return (
    <section className="py-20 md:py-28 bg-[#ebe6dc]">
      <div className="max-w-[90rem] mx-auto px-8 lg:px-12 xl:px-16">
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
            <span className="uppercase tracking-[0.25em] font-light">Visual Journey</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-[#1f1f1f] tracking-tight leading-[0.9] mb-3">
            Gallery.
          </h2>
          <p className="text-base md:text-lg text-[#6c655b] font-light max-w-2xl">
            A glimpse into our craft, heritage, and the artistry behind every dish.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[280px] gap-4">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`${item.span} group overflow-hidden cursor-pointer bg-[#dcd3c5]`}
            >
              <motion.div
                className="relative w-full h-full"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Image */}
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

