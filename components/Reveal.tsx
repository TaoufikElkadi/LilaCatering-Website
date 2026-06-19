'use client';

import { motion } from 'framer-motion';

/**
 * Gentle scroll-into-view reveal: content eases up + fades in once, with a long,
 * soft cubic-bezier so it feels calm and premium rather than snappy.
 */
export default function Reveal({
  children,
  y = 38,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  y?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
