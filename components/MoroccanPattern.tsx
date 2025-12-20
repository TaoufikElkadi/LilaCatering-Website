'use client';

import { motion } from 'framer-motion';

export default function MoroccanPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute w-full h-full opacity-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="moroccan-pattern"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <motion.path
              d="M50,10 L60,30 L80,30 L65,45 L70,65 L50,50 L30,65 L35,45 L20,30 L40,30 Z"
              fill="currentColor"
              className="text-accent-gold"
              initial={{ opacity: 0.1 }}
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <circle
              cx="50"
              cy="50"
              r="3"
              fill="currentColor"
              className="text-accent-gold"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#moroccan-pattern)" />
      </svg>
    </div>
  );
}

