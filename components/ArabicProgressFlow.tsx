'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

interface ArabicProgressFlowProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { number: 1, label: 'Event' },
  { number: 2, label: 'Menu' },
  { number: 3, label: 'Details' },
  { number: 4, label: 'Extras' },
  { number: 5, label: 'Decoration' },
  { number: 6, label: 'Date' },
];

function ArabicProgressFlow({ currentStep }: ArabicProgressFlowProps) {
  return (
    <div className="mb-20">
      {/* Arabic-inspired ornamental top border */}
      <div className="flex items-center justify-center mb-12">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-primary-gold/30 to-transparent w-full max-w-2xl"
        />
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 md:gap-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full border transition-all duration-500 flex items-center justify-center ${
                  currentStep >= step.number
                    ? 'border-accent-gold bg-accent-gold/10'
                    : 'border-accent-gold/20 bg-transparent'
                }`}
              >
                {/* Arabic-inspired decorative pattern */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      currentStep >= step.number ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      background: 'radial-gradient(circle at 50% 50%, rgba(197, 165, 114, 0.1) 0%, transparent 70%)',
                    }}
                  />
                </div>

                <span
                  className={`relative text-xs md:text-sm font-serif tracking-wider transition-colors duration-500 ${
                    currentStep >= step.number ? 'text-accent-gold' : 'text-primary-white/30'
                  }`}
                >
                  {step.number}
                </span>

                {/* Active indicator */}
                {currentStep === step.number && (
                  <motion.div
                    layoutId="activeStep"
                    className="absolute inset-0 rounded-full border-2 border-accent-gold"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>

              {/* Step Label */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                className={`mt-3 text-xs tracking-wider transition-colors duration-500 ${
                  currentStep >= step.number ? 'text-accent-gold/80' : 'text-primary-white/20'
                }`}
              >
                {step.label.toUpperCase()}
              </motion.p>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="w-8 md:w-16 h-px mb-8 mx-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-accent-gold/20" />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: currentStep > step.number ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  className="absolute inset-0 bg-accent-gold origin-left"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Arabic-inspired ornamental bottom border */}
      <div className="flex items-center justify-center mt-12">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-px bg-gradient-to-r from-transparent via-primary-gold/30 to-transparent w-full max-w-2xl"
        />
      </div>
    </div>
  );
}

export default memo(ArabicProgressFlow);

