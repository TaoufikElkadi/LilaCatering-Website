'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface DatePickerSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DatePickerSelector({ selectedDate, onDateChange }: DatePickerSelectorProps) {
  if (!onDateChange) {
    console.error('DatePickerSelector: onDateChange is required');
    return null;
  }

  const [tempDate, setTempDate] = useState(selectedDate);

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Get maximum date (2 years from now)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const handleDateChange = (date: string) => {
    setTempDate(date);
    onDateChange(date);
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-serif font-light mb-3 tracking-[0.08em] text-[#1f1f1f] uppercase">
          Event Date
        </h3>
        <p className="text-xs text-[#6c655b] tracking-[0.25em] font-light uppercase">
          Select the date for your event
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Date Picker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-[#dcd3c5] bg-white p-8 md:p-12"
        >
          <div className="flex flex-col items-center gap-8">
            {/* Date Input */}
            <div className="w-full">
              <label className="block text-sm tracking-[0.25em] text-[#6c655b] mb-4 text-center font-serif uppercase">
                Select your event date
              </label>
              <input
                type="date"
                min={today}
                max={maxDateStr}
                value={tempDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full bg-white border border-[#dcd3c5] focus:border-[#1f1f1f] text-center text-xl font-serif text-[#1f1f1f] py-5 px-6 outline-none transition-all duration-200 cursor-pointer"
              />
              <p className="text-xs text-[#8a8275] mt-4 text-center">
                Click the calendar icon or type a date
              </p>
            </div>

            {/* Display Selected Date */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center pt-6 border-t border-[#dcd3c5] w-full"
              >
                <p className="text-xs tracking-[0.25em] text-[#6c655b] uppercase mb-2">Your event date</p>
                <p className="text-base font-serif text-[#1f1f1f] tracking-[0.08em]">
                  {formatDisplayDate(selectedDate)}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-[#8a8275] tracking-[0.25em] font-light uppercase">
            We recommend booking at least 2 weeks in advance for optimal service
          </p>
        </motion.div>
      </div>
    </div>
  );
}

