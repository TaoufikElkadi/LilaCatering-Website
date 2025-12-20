'use client';

import { motion } from 'framer-motion';
import { MenuItem } from '@/data/menuData';
import Image from 'next/image';

interface MenuCardProps {
  item: MenuItem;
  isSelected: boolean;
  onSelect: (item: MenuItem) => void;
}

export default function MenuCard({ item, isSelected, onSelect }: MenuCardProps) {
  return (
    <div
      onClick={() => onSelect(item)}
      className={`relative cursor-pointer group transition-all duration-500 ${
        isSelected ? 'opacity-100' : 'opacity-85 hover:opacity-100'
      }`}
    >
      {/* Main Card Container - Light theme */}
      <motion.div 
        layout
        className={`relative bg-gradient-to-br from-[#fdfbf7] to-[#f9f6f0] transition-all duration-500 ${
        isSelected 
          ? 'shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-2 ring-[#C19A5B] ring-offset-4 ring-offset-[#f7f3ec]' 
          : 'shadow-[0_4px_16px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgb(0,0,0,0.09)]'
      }`}>
        
        {/* Grid Layout: 2 columns - Text on left, Image on right */}
        <div className="grid grid-cols-2 gap-0 min-h-[280px]">
          
          {/* Left Column: Text Content */}
          <div className="flex flex-col justify-between p-8 lg:p-10">
            
            {/* Item Name */}
            <div className="space-y-2">
              <h3 className="text-2xl lg:text-3xl font-serif uppercase tracking-[0.18em] text-[#1f1f1f] leading-tight">
                {item.name}
              </h3>
              
              {/* Price and Weight info */}
              <p className="text-sm lg:text-base text-[#6c655b] font-light tracking-[0.08em]">
                {item.price}
              </p>
            </div>

            {/* Bottom Section */}
            <div className="space-y-4">
              {/* Decorative Divider Line */}
              <div className={`h-[1px] w-24 transition-all duration-500 ${
                isSelected 
                  ? 'bg-[#C19A5B]' 
                  : 'bg-gradient-to-r from-[#dcd3c5] to-transparent'
              }`}></div>
              
              {/* Description */}
              <p className="text-xs lg:text-sm text-[#6c655b] leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative overflow-hidden">
            <div className={`absolute inset-0 transition-all duration-500 ${
              isSelected ? 'ring-2 ring-inset ring-[#C19A5B]' : ''
            }`}>
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 40vw, 33vw"
                priority={item.category === 'starter'}
              />
            </div>
            
            {/* Selection Overlay */}
            {isSelected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-[#C19A5B]/15 backdrop-blur-[0.5px]"
              >
                <div className="absolute top-4 right-4 w-10 h-10 bg-[#C19A5B] rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

