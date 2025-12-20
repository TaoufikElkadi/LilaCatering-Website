'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export type DecorationType = 'none' | 'minimal' | 'traditional' | 'luxury' | 'custom';

interface DecorationSelectorProps {
  selectedDecoration: DecorationType;
  onDecorationChange: (decoration: DecorationType) => void;
}

export default function DecorationSelector({ selectedDecoration, onDecorationChange }: DecorationSelectorProps) {
  if (!onDecorationChange) {
    console.error('DecorationSelector: onDecorationChange is required');
    return null;
  }

  const [selectedElements, setSelectedElements] = useState<string[]>([]);

  const decorationPackages = [
    {
      id: 'none' as DecorationType,
      name: 'No Decoration',
      description: 'Simple and elegant event setup without additional decorative elements',
      icon: '○',
      price: '€0',
    },
    {
      id: 'minimal' as DecorationType,
      name: 'Minimal Package',
      description: 'Subtle Moroccan touches with candles and simple settings',
      icon: '✦',
      price: '€150',
    },
    {
      id: 'traditional' as DecorationType,
      name: 'Traditional Package',
      description: 'Authentic Moroccan lanterns, textiles, and cushions',
      icon: '❋',
      price: '€350',
    },
    {
      id: 'luxury' as DecorationType,
      name: 'Luxury Package',
      description: 'Premium setup with ornate lanterns and silk fabrics',
      icon: '✵',
      price: '€650',
    },
    {
      id: 'custom' as DecorationType,
      name: 'Custom Design',
      description: 'Bespoke decoration - select individual elements below',
      icon: '◈',
      price: 'Quote',
    },
  ];

  const decorationElements = [
    { id: 'lanterns', name: 'Moroccan Lanterns', icon: '🏮', price: 50 },
    { id: 'candles', name: 'Candle Arrangements', icon: '🕯️', price: 30 },
    { id: 'textiles', name: 'Decorative Textiles', icon: '🧵', price: 80 },
    { id: 'cushions', name: 'Floor Cushions', icon: '💺', price: 40 },
    { id: 'flowers', name: 'Floral Arrangements', icon: '🌸', price: 120 },
    { id: 'tables', name: 'Low Moroccan Tables', icon: '🪑', price: 100 },
    { id: 'rugs', name: 'Traditional Rugs', icon: '🧶', price: 70 },
    { id: 'lighting', name: 'Ambient Lighting', icon: '💡', price: 90 },
  ];

  const handleElementToggle = (elementId: string) => {
    if (selectedElements.includes(elementId)) {
      setSelectedElements(selectedElements.filter((id) => id !== elementId));
    } else {
      setSelectedElements([...selectedElements, elementId]);
    }
    // Auto-select custom if elements are being selected
    if (selectedDecoration !== 'custom') {
      onDecorationChange('custom');
    }
  };

  const getElementsTotal = () => {
    return decorationElements
      .filter((el) => selectedElements.includes(el.id))
      .reduce((total, el) => total + el.price, 0);
  };

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-serif font-light mb-3 tracking-[0.08em] text-[#1f1f1f] uppercase">
          Decoration & Ambiance
        </h3>
        <p className="text-xs text-[#6c655b] tracking-[0.25em] font-light uppercase">
          Choose a package or build your custom decoration
        </p>
      </div>

      {/* Decoration Packages */}
      <div>
        <p className="text-xs tracking-[0.25em] text-[#6c655b] mb-6 text-center uppercase">Decoration packages</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {decorationPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                onDecorationChange(pkg.id);
                if (pkg.id !== 'custom') setSelectedElements([]);
              }}
              className={`relative cursor-pointer border transition-all duration-200 p-6 ${
                selectedDecoration === pkg.id
                  ? 'border-[#1f1f1f] bg-white'
                  : 'border-[#dcd3c5] hover:border-[#1f1f1f]'
              }`}
            >
              {/* Content */}
              <div className="mb-4 space-y-2 text-center">
                <h4
                  className={`text-sm font-serif font-light tracking-[0.06em] transition-colors duration-200 ${
                    selectedDecoration === pkg.id ? 'text-[#1f1f1f]' : 'text-[#4a4742]'
                  }`}
                >
                  {pkg.name}
                </h4>
                <p className="text-[10px] text-[#6c655b] leading-relaxed font-light min-h-[2.5rem]">
                  {pkg.description}
                </p>
              </div>

              {/* Price */}
              <div className="text-center pt-3 border-t border-[#dcd3c5]">
                <span
                  className={`text-xs font-serif tracking-[0.25em] uppercase transition-colors duration-200 ${
                    selectedDecoration === pkg.id ? 'text-[#1f1f1f]' : 'text-[#6c655b]'
                  }`}
                >
                  {pkg.price}
                </span>
              </div>

              {/* Selection indicator */}
              {selectedDecoration === pkg.id && (
                <motion.div
                  layoutId="selectedPackage"
                  className="absolute inset-0 border-2 border-[#1f1f1f]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Individual Decoration Elements */}
      <div className="pt-8 border-t border-[#dcd3c5]">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.25em] text-[#6c655b] mb-2 uppercase">Individual elements</p>
          <p className="text-[10px] text-[#8a8275] tracking-[0.25em] uppercase">
            Select individual items to create your custom decoration
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {decorationElements.map((element, index) => (
            <motion.div
              key={element.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleElementToggle(element.id)}
              className={`relative cursor-pointer border transition-all duration-200 p-4 ${
                selectedElements.includes(element.id)
                  ? 'border-[#1f1f1f] bg-white'
                  : 'border-[#dcd3c5] hover:border-[#1f1f1f]'
              }`}
            >
              {/* Content */}
              <div className="text-center">
                <h5
                  className={`text-xs font-serif font-light tracking-[0.06em] mb-1 transition-colors duration-200 ${
                    selectedElements.includes(element.id) ? 'text-[#1f1f1f]' : 'text-[#4a4742]'
                  }`}
                >
                  {element.name}
                </h5>
                <p
                  className={`text-xs tracking-[0.15em] uppercase transition-colors duration-200 ${
                    selectedElements.includes(element.id) ? 'text-[#1f1f1f]' : 'text-[#6c655b]'
                  }`}
                >
                  €{element.price}
                </p>
              </div>

              {/* Selection indicator */}
              {selectedElements.includes(element.id) && (
                <motion.div
                  layoutId={`selectedElement-${element.id}`}
                  className="absolute inset-0 border-2 border-[#1f1f1f]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Elements Total */}
        {selectedElements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center pt-6 mt-6 border-t border-[#dcd3c5]"
          >
            <p className="text-xs tracking-[0.25em] text-[#6c655b] uppercase mb-2">Custom elements total</p>
            <p className="text-xl font-serif font-light text-[#1f1f1f]">
              €{getElementsTotal()} <span className="text-sm text-[#6c655b]">+ setup fee</span>
            </p>
          </motion.div>
        )}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-6 border-t border-[#dcd3c5]"
      >
        <p className="text-xs text-[#8a8275] tracking-[0.25em] font-light uppercase">
          All decoration packages include setup and takedown services
        </p>
      </motion.div>
    </div>
  );
}
