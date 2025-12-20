'use client';

import { motion } from 'framer-motion';

interface GuestCountSelectorProps {
  guestCount: number;
  onGuestCountChange: (count: number) => void;
}

export default function GuestCountSelector({ guestCount, onGuestCountChange }: GuestCountSelectorProps) {
  if (!onGuestCountChange) {
    console.error('GuestCountSelector: onGuestCountChange is required');
    return null;
  }

  const presetCounts = [10, 20, 30, 50, 75, 100, 150, 200];

  const handleCustomInput = (value: string) => {
    const count = parseInt(value);
    if (!isNaN(count) && count > 0) {
      onGuestCountChange(count);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-serif font-light mb-3 tracking-[0.08em] text-[#1f1f1f] uppercase">
          Guest Count
        </h3>
        <p className="text-xs text-[#6c655b] tracking-[0.25em] font-light uppercase">
          Select the number of guests for your event
        </p>
      </div>

      {/* Preset Guest Counts */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {presetCounts.map((count) => (
          <motion.button
            key={count}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onGuestCountChange(count)}
            className={`relative aspect-square border transition-all duration-200 flex items-center justify-center ${
              guestCount === count
                ? 'border-[#1f1f1f] bg-white text-[#1f1f1f]'
                : 'border-[#dcd3c5] text-[#6c655b] hover:border-[#1f1f1f] hover:text-[#1f1f1f]'
            }`}
          >
            <div className="text-center">
              <p className="text-lg md:text-xl font-serif font-light">{count}</p>
              <p className="text-[10px] tracking-[0.25em] text-[#8a8275]">Guests</p>
            </div>
            {guestCount === count && (
              <motion.div
                layoutId="selectedGuest"
                className="absolute inset-0 border-2 border-[#1f1f1f]"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Custom Guest Count Input */}
      <div className="flex flex-col items-center gap-4 pt-8 border-top border-t border-[#dcd3c5]">
        <label className="text-xs tracking-[0.25em] text-[#6c655b] uppercase">
          Or enter custom amount
        </label>
        <div className="relative">
          <input
            type="number"
            min="1"
            value={guestCount}
            onChange={(e) => handleCustomInput(e.target.value)}
            className="w-48 bg-white border border-[#dcd3c5] focus:border-[#1f1f1f] text-center text-2xl font-serif text-[#1f1f1f] py-4 px-6 outline-none transition-all duration-200"
            placeholder="0"
          />
          <div className="absolute -bottom-6 left-0 right-0 text-center">
            <span className="text-[10px] tracking-[0.25em] text-[#8a8275] uppercase">Guests</span>
          </div>
        </div>
      </div>
    </div>
  );
}

