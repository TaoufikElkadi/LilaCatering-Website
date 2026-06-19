'use client';

import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ZelligePatternProps {
  className?: string;
  variant?: 'hero' | 'divider' | 'background' | 'corner';
  animated?: boolean;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

// 8-pointed star (khatam) - the iconic Moroccan zellige pattern
const EightPointedStarBase = ({
  size = 60,
  colors = { primary: '#C19A5B', secondary: '#D4B896', accent: '#050608' },
  delay = 0,
  animated = true
}: {
  size?: number;
  colors?: { primary: string; secondary: string; accent: string };
  delay?: number;
  animated?: boolean;
}) => {
  const starVariants = {
    hidden: { scale: 0, rotate: -45, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const center = size / 2;
  const outerRadius = size * 0.48;
  const innerRadius = size * 0.2;

  // Generate 8-pointed star path
  const generateStarPath = () => {
    const points: string[] = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI) / 8 - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    return points.join(' ') + ' Z';
  };

  const starPath = generateStarPath();

  const StarSVG = () => (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer star */}
      <path
        d={starPath}
        fill={colors.primary}
        stroke={colors.accent}
        strokeWidth="0.5"
      />
      {/* Inner decorative circle */}
      <circle
        cx={center}
        cy={center}
        r={innerRadius * 0.6}
        fill={colors.secondary}
        stroke={colors.accent}
        strokeWidth="0.3"
      />
      {/* Center dot */}
      <circle
        cx={center}
        cy={center}
        r={innerRadius * 0.2}
        fill={colors.accent}
      />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        variants={starVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <StarSVG />
      </motion.div>
    );
  }

  return <StarSVG />;
};
const EightPointedStar = memo(EightPointedStarBase);

// Arabesque border divider
const ArabesqueDividerBase = ({
  width = 200,
  color = '#C19A5B',
  animated = true
}: {
  width?: number;
  color?: string;
  animated?: boolean;
}) => {
  const dividerVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const DividerSVG = () => (
    <svg width={width} height="24" viewBox={`0 0 ${width} 24`} className="overflow-visible">
      <defs>
        <pattern id="arabesque-pattern" width="48" height="24" patternUnits="userSpaceOnUse">
          {/* Interlocking curves */}
          <path
            d="M0 12 Q12 0 24 12 Q36 24 48 12"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
          />
          <path
            d="M0 12 Q12 24 24 12 Q36 0 48 12"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            opacity="0.5"
          />
          {/* Small diamond accents */}
          <path
            d="M24 8 L26 12 L24 16 L22 12 Z"
            fill={color}
          />
        </pattern>
      </defs>
      <rect width={width} height="24" fill="url(#arabesque-pattern)" />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        variants={dividerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ originX: 0.5 }}
      >
        <DividerSVG />
      </motion.div>
    );
  }

  return <DividerSVG />;
};
const ArabesqueDivider = memo(ArabesqueDividerBase);

// Geometric corner decoration
const CornerDecorationBase = ({
  size = 120,
  position = 'top-left',
  color = '#C19A5B',
  animated = true
}: {
  size?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
  animated?: boolean;
}) => {
  const rotations = {
    'top-left': 0,
    'top-right': 90,
    'bottom-right': 180,
    'bottom-left': 270
  };

  const cornerVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const CornerSVG = () => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      style={{ transform: `rotate(${rotations[position]}deg)` }}
    >
      {/* Geometric interlocking pattern */}
      <path
        d="M0 0 L40 0 L40 10 L10 10 L10 40 L0 40 Z"
        fill={color}
        opacity="0.8"
      />
      <path
        d="M20 0 L60 0 L60 10 L30 10 L30 30 L20 30 Z"
        fill={color}
        opacity="0.5"
      />
      <path
        d="M0 20 L10 20 L10 60 L0 60 Z"
        fill={color}
        opacity="0.5"
      />
      {/* Small star accent */}
      <g transform="translate(25, 25)">
        <path
          d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z"
          fill={color}
        />
      </g>
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        variants={cornerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <CornerSVG />
      </motion.div>
    );
  }

  return <CornerSVG />;
};
const CornerDecoration = memo(CornerDecorationBase);

// Full zellige tile pattern background
const ZelligeTilePatternBase = ({
  className = '',
  opacity = 0.1
}: {
  className?: string;
  opacity?: number;
}) => {
  return (
    <svg
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ opacity }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="zellige-tile"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          {/* 8-pointed star */}
          <path
            d="M40 8 L46 20 L60 20 L50 30 L54 44 L40 36 L26 44 L30 30 L20 20 L34 20 Z"
            fill="#C19A5B"
            opacity="0.6"
          />
          {/* Cross elements */}
          <rect x="38" y="0" width="4" height="8" fill="#D4B896" />
          <rect x="38" y="72" width="4" height="8" fill="#D4B896" />
          <rect x="0" y="38" width="8" height="4" fill="#D4B896" />
          <rect x="72" y="38" width="8" height="4" fill="#D4B896" />
          {/* Corner diamonds */}
          <path d="M0 0 L4 4 L0 8 L-4 4 Z" fill="#C19A5B" transform="translate(4,4)" />
          <path d="M0 0 L4 4 L0 8 L-4 4 Z" fill="#C19A5B" transform="translate(76,4)" />
          <path d="M0 0 L4 4 L0 8 L-4 4 Z" fill="#C19A5B" transform="translate(4,76)" />
          <path d="M0 0 L4 4 L0 8 L-4 4 Z" fill="#C19A5B" transform="translate(76,76)" />
          {/* Central circle */}
          <circle cx="40" cy="40" r="4" fill="#D4B896" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#zellige-tile)" />
    </svg>
  );
};
const ZelligeTilePattern = memo(ZelligeTilePatternBase);

// Timeline connector with Moroccan motif
const TimelineConnectorBase = ({
  height = 100,
  color = '#C19A5B',
  animated = true
}: {
  height?: number;
  color?: string;
  animated?: boolean;
}) => {
  const lineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const Line = () => (
    <svg width="20" height={height} viewBox={`0 0 20 ${height}`}>
      <defs>
        <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Main line */}
      <line
        x1="10"
        y1="0"
        x2="10"
        y2={height}
        stroke="url(#timeline-gradient)"
        strokeWidth="2"
      />
      {/* Diamond accents */}
      <path
        d={`M10 ${height * 0.25} L14 ${height * 0.25 + 4} L10 ${height * 0.25 + 8} L6 ${height * 0.25 + 4} Z`}
        fill={color}
      />
      <path
        d={`M10 ${height * 0.75} L14 ${height * 0.75 + 4} L10 ${height * 0.75 + 8} L6 ${height * 0.75 + 4} Z`}
        fill={color}
      />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        variants={lineVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ originY: 0 }}
      >
        <Line />
      </motion.div>
    );
  }

  return <Line />;
};
export const TimelineConnector = memo(TimelineConnectorBase);

// Milestone marker
const MilestoneMarkerBase = ({
  index,
  color = '#C19A5B',
  animated = true
}: {
  index: number;
  color?: string;
  animated?: boolean;
}) => {
  const markerVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.2,
        type: 'spring',
        stiffness: 200
      }
    }
  };

  const Marker = () => (
    <svg width="48" height="48" viewBox="0 0 48 48">
      {/* Outer ring */}
      <circle
        cx="24"
        cy="24"
        r="22"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      {/* Inner 8-pointed star */}
      <path
        d="M24 8 L27 18 L38 18 L30 25 L33 36 L24 30 L15 36 L18 25 L10 18 L21 18 Z"
        fill={color}
      />
      {/* Center circle */}
      <circle
        cx="24"
        cy="24"
        r="5"
        fill="#050608"
      />
      {/* Number */}
      <text
        x="24"
        y="28"
        textAnchor="middle"
        fill="#F5F2EB"
        fontSize="10"
        fontFamily="Cormorant Garamond, serif"
        fontWeight="600"
      >
        {index + 1}
      </text>
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        variants={markerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Marker />
      </motion.div>
    );
  }

  return <Marker />;
};
export const MilestoneMarker = memo(MilestoneMarkerBase);

function ZelligePattern({
  className = '',
  variant = 'background',
  animated = true,
  colors = {
    primary: '#C19A5B',
    secondary: '#D4B896',
    accent: '#050608'
  }
}: ZelligePatternProps) {
  const fullColors = {
    primary: colors.primary || '#C19A5B',
    secondary: colors.secondary || '#D4B896',
    accent: colors.accent || '#050608'
  };

  // Respect prefers-reduced-motion: render the SVGs statically.
  const prefersReducedMotion = useReducedMotion();
  const anim = animated && !prefersReducedMotion;

  switch (variant) {
    case 'hero':
      return (
        <div className={`relative ${className}`}>
          {/* Large decorative stars */}
          <div className="absolute top-0 left-0">
            <EightPointedStar size={80} colors={fullColors} delay={0.2} animated={anim} />
          </div>
          <div className="absolute top-20 left-20">
            <EightPointedStar size={50} colors={fullColors} delay={0.4} animated={anim} />
          </div>
          <div className="absolute top-10 right-10">
            <EightPointedStar size={60} colors={fullColors} delay={0.3} animated={anim} />
          </div>
          <div className="absolute bottom-10 right-20">
            <EightPointedStar size={40} colors={fullColors} delay={0.5} animated={anim} />
          </div>
        </div>
      );

    case 'divider':
      return (
        <div className={`flex justify-center items-center gap-4 ${className}`}>
          <EightPointedStar size={24} colors={fullColors} delay={0} animated={anim} />
          <ArabesqueDivider width={120} color={fullColors.primary} animated={anim} />
          <EightPointedStar size={24} colors={fullColors} delay={0.2} animated={anim} />
          <ArabesqueDivider width={120} color={fullColors.primary} animated={anim} />
          <EightPointedStar size={24} colors={fullColors} delay={0.4} animated={anim} />
        </div>
      );

    case 'corner':
      return (
        <div className={className}>
          <CornerDecoration position="top-left" color={fullColors.primary} animated={anim} />
        </div>
      );

    case 'background':
    default:
      return <ZelligeTilePattern className={className} />;
  }
}

export default memo(ZelligePattern);

export { EightPointedStar, ArabesqueDivider, CornerDecoration, ZelligeTilePattern };
