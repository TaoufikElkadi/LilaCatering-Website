'use client';

import { motion } from 'framer-motion';

export type EventType = 'wedding' | 'dinner' | 'corporate' | 'celebration' | 'other';

interface EventTypeSelectorProps {
  selectedEventType: EventType | null;
  onEventTypeChange: (eventType: EventType) => void;
}

export default function EventTypeSelector({ selectedEventType, onEventTypeChange }: EventTypeSelectorProps) {
  if (!onEventTypeChange) {
    console.error('EventTypeSelector: onEventTypeChange is required');
    return null;
  }

  const eventTypes = [
    {
      id: 'wedding' as EventType,
      name: 'Wedding',
      description: 'Celebrate your special day with authentic Moroccan cuisine',
      requirements: 'Full menu required: Starter, Main, and Dessert',
    },
    {
      id: 'dinner' as EventType,
      name: 'Private Dinner',
      description: 'Intimate dining experience for family and friends',
      requirements: 'Flexible menu selection',
    },
    {
      id: 'corporate' as EventType,
      name: 'Corporate Event',
      description: 'Professional catering for business occasions',
      requirements: 'Flexible menu selection',
    },
    {
      id: 'celebration' as EventType,
      name: 'Celebration',
      description: 'Birthdays, anniversaries, and special occasions',
      requirements: 'Flexible menu selection',
    },
    {
      id: 'other' as EventType,
      name: 'Other Event',
      description: 'Custom event catering tailored to your needs',
      requirements: 'Flexible menu selection',
    },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-serif font-light mb-3 tracking-[0.08em] text-[#1f1f1f] uppercase">
          Event Type
        </h3>
        <p className="text-xs text-[#6c655b] tracking-[0.25em] font-light uppercase">
          Select the type of event you're planning
        </p>
      </div>

      {/* Event Type Options */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventTypes.map((eventType, index) => (
          <motion.div
            key={eventType.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onEventTypeChange(eventType.id)}
            className={`relative cursor-pointer border transition-all duration-300 p-7 ${
              selectedEventType === eventType.id
                ? 'border-[#1f1f1f] bg-white'
                : 'border-[#dcd3c5] hover:border-[#1f1f1f]'
            }`}
          >
            {/* Content */}
            <div className="space-y-3">
              <h4
                className={`text-lg font-serif font-light tracking-[0.06em] transition-colors duration-300 ${
                  selectedEventType === eventType.id ? 'text-[#1f1f1f]' : 'text-[#4a4742]'
                }`}
              >
                {eventType.name}
              </h4>
              <p className="text-xs text-[#6c655b] leading-relaxed font-light">
                {eventType.description}
              </p>
              <p
                className={`text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 ${
                  selectedEventType === eventType.id ? 'text-[#1f1f1f]' : 'text-[#8a8275]'
                }`}
              >
                {eventType.requirements}
              </p>
            </div>

            {/* Selection indicator */}
            <div className="flex items-center justify-between pt-4 border-t border-[#dcd3c5] mt-6">
              <span className="text-xs tracking-[0.25em] text-[#6c655b] uppercase">
                {selectedEventType === eventType.id ? 'Selected' : 'Select'}
              </span>
            </div>

            {/* Border animation */}
            {selectedEventType === eventType.id && (
              <motion.div
                layoutId="selectedEventType"
                className="absolute inset-0 border-2 border-[#1f1f1f]"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

