'use client';

import { motion } from 'framer-motion';

interface ExtrasSelectorProps {
  includeCoffee: boolean;
  includeDrinks: boolean;
  onCoffeeToggle: (value: boolean) => void;
  onDrinksToggle: (value: boolean) => void;
}

export default function ExtrasSelector({
  includeCoffee,
  includeDrinks,
  onCoffeeToggle,
  onDrinksToggle,
}: ExtrasSelectorProps) {
  if (!onCoffeeToggle || !onDrinksToggle) {
    console.error('ExtrasSelector: toggle functions are required');
    return null;
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-serif font-light mb-3 tracking-[0.08em] text-[#1f1f1f] uppercase">
          Beverages & Extras
        </h3>
        <p className="text-xs text-[#6c655b] tracking-[0.25em] font-light uppercase">
          Enhance your experience with traditional Moroccan tea and beverages
        </p>
      </div>

      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Coffee & Tea Toggle */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => onCoffeeToggle(!includeCoffee)}
          className={`relative cursor-pointer border transition-all duration-200 p-8 ${
            includeCoffee
              ? 'border-[#1f1f1f] bg-white'
              : 'border-[#dcd3c5] hover:border-[#1f1f1f]'
          }`}
        >
          <div className="relative z-10">
            <h4 className="text-lg font-serif font-light tracking-[0.06em] text-[#1f1f1f] mb-3">
              Moroccan Coffee & Tea
            </h4>
            <p className="text-xs text-[#6c655b] leading-relaxed mb-6 font-light">
              Traditional mint tea service and authentic Moroccan coffee with aromatic spices
            </p>

            {/* Toggle indicator */}
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-[0.25em] text-[#6c655b] uppercase">
                {includeCoffee ? 'Included' : 'Add to event'}
              </span>
              <div
                className={`relative w-14 h-7 border transition-all duration-200 ${
                  includeCoffee ? 'border-[#1f1f1f] bg-[#1f1f1f]/10' : 'border-[#dcd3c5] bg-transparent'
                }`}
              >
                <motion.div
                  initial={false}
                  animate={{ x: includeCoffee ? 28 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`absolute top-0.5 left-0.5 w-6 h-6 transition-colors duration-300 ${
                    includeCoffee ? 'bg-[#1f1f1f]' : 'bg-[#e6ddd0]'
                  }`}
                />
              </div>
            </div>
          </div>

          {includeCoffee && (
            <motion.div
              layoutId="selectedExtra"
              className="absolute inset-0 border-2 border-accent-gold"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </motion.div>

        {/* Drinks Toggle */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => onDrinksToggle(!includeDrinks)}
          className={`relative cursor-pointer border transition-all duration-200 p-8 ${
            includeDrinks
              ? 'border-[#1f1f1f] bg-white'
              : 'border-[#dcd3c5] hover:border-[#1f1f1f]'
          }`}
        >
          <div className="relative z-10">
            <h4 className="text-lg font-serif font-light tracking-[0.06em] text-[#1f1f1f] mb-3">
              Premium Beverages
            </h4>
            <p className="text-xs text-[#6c655b] leading-relaxed mb-6 font-light">
              Curated selection of juices, soft drinks, and refreshing traditional beverages
            </p>

            {/* Toggle indicator */}
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-[0.25em] text-[#6c655b] uppercase">
                {includeDrinks ? 'Included' : 'Add to event'}
              </span>
              <div
                className={`relative w-14 h-7 border transition-all duration-200 ${
                  includeDrinks ? 'border-[#1f1f1f] bg-[#1f1f1f]/10' : 'border-[#dcd3c5] bg-transparent'
                }`}
              >
                <motion.div
                  initial={false}
                  animate={{ x: includeDrinks ? 28 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`absolute top-0.5 left-0.5 w-6 h-6 transition-colors duration-300 ${
                    includeDrinks ? 'bg-[#1f1f1f]' : 'bg-[#e6ddd0]'
                  }`}
                />
              </div>
            </div>
          </div>

          {includeDrinks && (
            <motion.div
              layoutId="selectedExtra2"
              className="absolute inset-0 border-2 border-accent-gold"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </motion.div>
      </div>

      {/* Price Summary */}
      {(includeCoffee || includeDrinks) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8 border-t border-[#dcd3c5]"
        >
          <p className="text-xs tracking-[0.25em] text-[#6c655b] uppercase mb-2">Extras total</p>
          <p className="text-xl font-serif font-light text-[#1f1f1f]">
            €{((includeCoffee ? 5 : 0) + (includeDrinks ? 8 : 0)).toFixed(2)} <span className="text-sm text-[#6c655b]">per guest</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}

