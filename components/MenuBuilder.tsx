'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuItems, MenuItem } from '@/data/menuData';
import MenuCard from './MenuCard';
import EventTypeSelector, { EventType } from './EventTypeSelector';
import GuestCountSelector from './GuestCountSelector';
import ExtrasSelector from './ExtrasSelector';
import DecorationSelector, { DecorationType } from './DecorationSelector';
import DatePickerSelector from './DatePickerSelector';
import { downloadOffertePDF } from '@/utils/pdfGenerator';
import { useLanguage } from './LanguageProvider';

type FlowStep = 1 | 2 | 3 | 4 | 5 | 6;

export default function MenuBuilder() {
  const { t } = useLanguage();
  
  // Event and Menu selection state
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'starter' | 'main' | 'dessert'>('starter');
  const [selectedMainCategory, setSelectedMainCategory] = useState<'fish' | 'meat' | 'chicken' | 'vegetarian' | null>(null);
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);

  // Flow state
  const [currentStep, setCurrentStep] = useState<FlowStep>(1);
  const [guestCount, setGuestCount] = useState<number>(20);
  const [includeCoffee, setIncludeCoffee] = useState<boolean>(false);
  const [includeDrinks, setIncludeDrinks] = useState<boolean>(false);
  const [selectedDecoration, setSelectedDecoration] = useState<DecorationType>('none');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const categories = [
    { id: 'starter' as const, name: t('menuBuilder.categories.starter') },
    { id: 'main' as const, name: t('menuBuilder.categories.main') },
    { id: 'dessert' as const, name: t('menuBuilder.categories.dessert') },
  ];

  const mainCategories = [
    { id: 'fish' as const, name: t('menuBuilder.mainCategories.fish') },
    { id: 'meat' as const, name: t('menuBuilder.mainCategories.meat') },
    { id: 'chicken' as const, name: t('menuBuilder.mainCategories.chicken') },
    { id: 'vegetarian' as const, name: t('menuBuilder.mainCategories.vegetarian') },
  ];

  const filteredItems = menuItems.filter((item) => {
    if (item.category !== selectedCategory) return false;
    if (selectedCategory === 'main' && selectedMainCategory) {
      return item.mainCategory === selectedMainCategory;
    }
    return true;
  });

  const handleSelectItem = (item: MenuItem) => {
    if (selectedItems.find((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const getTotalPrice = () => {
    const menuTotal = selectedItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('€', ''));
      return total + price;
    }, 0);

    const extrasTotal = ((includeCoffee ? 5 : 0) + (includeDrinks ? 8 : 0)) * guestCount;

    const decorationPrices: Record<DecorationType, number> = {
      none: 0,
      minimal: 150,
      traditional: 350,
      luxury: 650,
      custom: 0,
    };

    return menuTotal * guestCount + extrasTotal + decorationPrices[selectedDecoration];
  };

  const handleDownloadPDF = () => {
    if (!selectedDate || !selectedEventType) return;
    
    downloadOffertePDF({
      eventType: selectedEventType,
      eventDate: selectedDate,
      selectedItems,
      guestCount,
      includeCoffee,
      includeDrinks,
      selectedDecoration,
      totalPrice: getTotalPrice(),
    });
  };

  // Load Calendly script when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="calendly"]')) {
      // Add Calendly script
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.head.appendChild(script);
      
      // Add Calendly CSS
      const link = document.createElement('link');
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  const hasStarter = selectedItems.some((item) => item.category === 'starter');
  const hasMain = selectedItems.some((item) => item.category === 'main');
  const hasDessert = selectedItems.some((item) => item.category === 'dessert');

  const canProceedToNextStep = () => {
    if (currentStep === 1) return selectedEventType !== null;
    if (currentStep === 2) {
      if (selectedEventType === 'wedding') {
        return hasStarter && hasMain && hasDessert;
      }
      return selectedItems.length > 0;
    }
    if (currentStep === 3) return guestCount > 0;
    if (currentStep === 6) return selectedDate !== '';
    return true;
  };

  const getValidationMessage = () => {
    if (currentStep === 2 && selectedEventType === 'wedding') {
      const missing = [] as string[];
      if (!hasStarter) missing.push(t('menuBuilder.validation.starter'));
      if (!hasMain) missing.push(t('menuBuilder.validation.main'));
      if (!hasDessert) missing.push(t('menuBuilder.validation.dessert'));
      if (missing.length > 0) {
        return t('menuBuilder.validation.weddingRequires').replace('{missing}', missing.join(', '));
      }
    }
    return null;
  };

  const handleNextStep = () => {
    if (canProceedToNextStep() && currentStep < 6) {
      setCurrentStep((currentStep + 1) as FlowStep);
      const section = document.getElementById('menu-builder');
      if (section) {
        const offset = 90;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as FlowStep);
      const section = document.getElementById('menu-builder');
      if (section) {
        const offset = 90;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="menu-builder" className="py-28 bg-[#f7f3ec] text-[#1f1f1f]">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-[#6c655b]">{t('menuBuilder.kicker')}</p>
          <h2 className="text-3xl md:text-4xl font-serif uppercase tracking-[0.08em]">
            {t('menuBuilder.title')}
          </h2>
          <p className="text-sm md:text-base text-[#4a4742] max-w-2xl mx-auto">
            {t('menuBuilder.description')}
          </p>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#8a8275]">
            {t('menuBuilder.stepOf').replace('{current}', currentStep.toString()).replace('{total}', '6')}
          </p>
        </div>

        <div className="min-h-[520px] mt-12 space-y-12">
          {/* Step 1: Event Type Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="py-6">
                <EventTypeSelector
                  selectedEventType={selectedEventType}
                  onEventTypeChange={setSelectedEventType}
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Menu Selection */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                {/* Category Selector */}
                <div className="flex justify-center gap-10 mb-12 border-b border-[#dcd3c5] pb-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedMainCategory(null);
                      }}
                      className={`text-xs uppercase tracking-[0.28em] pb-2 transition-colors duration-200 ${
                        selectedCategory === category.id
                          ? 'text-[#1f1f1f] border-b border-[#1f1f1f]'
                          : 'text-[#8a8275] border-b border-transparent hover:text-[#1f1f1f]'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Main Category Selector (only for mains) */}
                <AnimatePresence mode="wait">
                  {selectedCategory === 'main' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-center flex-wrap gap-6 mb-12"
                    >
                      {mainCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedMainCategory(category.id)}
                          className={`text-xs uppercase tracking-[0.24em] px-3 py-1 border ${
                            selectedMainCategory === category.id
                              ? 'border-[#1f1f1f] text-[#1f1f1f]'
                              : 'border-[#dcd3c5] text-[#6c655b] hover:text-[#1f1f1f]'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Menu Items Grid */}
                <motion.div
                  layout
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.1
                      }
                    }
                  }}
                  className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        variants={{
                          hidden: { 
                            opacity: 0, 
                            y: 20,
                            scale: 0.95
                          },
                          visible: { 
                            opacity: 1, 
                            y: 0,
                            scale: 1,
                            transition: {
                              duration: 0.5,
                              ease: [0.25, 0.46, 0.45, 0.94]
                            }
                          }
                        }}
                      >
                        <MenuCard
                        item={item}
                        isSelected={!!selectedItems.find((i) => i.id === item.id)}
                        onSelect={handleSelectItem}
                      />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Guest Count */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="py-6">
                <GuestCountSelector guestCount={guestCount} onGuestCountChange={setGuestCount} />
              </div>
            </motion.div>
          )}

          {/* Step 4: Coffee & Drinks */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="py-6">
                <ExtrasSelector
                  includeCoffee={includeCoffee}
                  includeDrinks={includeDrinks}
                  onCoffeeToggle={setIncludeCoffee}
                  onDrinksToggle={setIncludeDrinks}
                />
              </div>
            </motion.div>
          )}

          {/* Step 5: Decoration */}
          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="py-6">
                <DecorationSelector
                  selectedDecoration={selectedDecoration}
                  onDecorationChange={setSelectedDecoration}
                />
              </div>
            </motion.div>
          )}

          {/* Step 6: Date Picker and Review */}
          {currentStep === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-12 py-6">
                <DatePickerSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />

                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-10 border-t border-[#dcd3c5]"
                  >
                    <div className="max-w-3xl mx-auto space-y-8 text-center">
                      <h3 className="text-2xl md:text-3xl font-serif text-[#1f1f1f]">
                        Review your event
                      </h3>
                      <div className="border border-[#dcd3c5] p-8 text-left space-y-6 bg-white/60">
                        <div className="border-b border-[#e6ddd0] pb-4">
                          <p className="text-[11px] uppercase tracking-[0.25em] text-[#8a8275] mb-1">Event Type</p>
                          <p className="text-sm text-[#1f1f1f] capitalize">{selectedEventType}</p>
                        </div>
                        <div className="border-b border-[#e6ddd0] pb-4">
                          <p className="text-[11px] uppercase tracking-[0.25em] text-[#8a8275] mb-1">Event Date</p>
                          <p className="text-sm text-[#1f1f1f]">
                            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="border-b border-[#e6ddd0] pb-4">
                          <p className="text-[11px] uppercase tracking-[0.25em] text-[#8a8275] mb-3">Menu Selection</p>
                          <div className="space-y-3">
                            {selectedItems.map((item) => (
                              <div key={item.id} className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-sm text-[#1f1f1f] font-light">{item.name}</p>
                                  <p className="text-xs text-[#6c655b] mt-0.5">{item.description}</p>
                                </div>
                                <p className="text-sm text-[#1f1f1f] ml-4">{item.price}</p>
                              </div>
                            ))}
                            <p className="text-xs text-[#8a8275] pt-2 border-t border-[#e6ddd0]">
                              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                            </p>
                          </div>
                        </div>
                        <div className="border-b border-[#e6ddd0] pb-4">
                          <p className="text-[11px] uppercase tracking-[0.25em] text-[#8a8275] mb-1">Guests</p>
                          <p className="text-sm text-[#1f1f1f]">{guestCount} guests</p>
                        </div>
                        <div className="border-b border-[#e6ddd0] pb-4">
                          <p className="text-[11px] uppercase tracking-[0.25em] text-[#8a8275] mb-1">Extras</p>
                          <p className="text-sm text-[#1f1f1f]">
                            {includeCoffee && 'Moroccan Coffee & Tea'}
                            {includeCoffee && includeDrinks && ' • '}
                            {includeDrinks && 'Premium Beverages'}
                            {!includeCoffee && !includeDrinks && 'None'}
                          </p>
                        </div>
                        <div className="border-b border-[#e6ddd0] pb-4">
                          <p className="text-[11px] uppercase tracking-[0.25em] text-[#8a8275] mb-1">Decoration</p>
                          <p className="text-sm text-[#1f1f1f] capitalize">{selectedDecoration.replace('_', ' ')}</p>
                        </div>
                        <div className="pt-2">
                          <p className="text-[11px] uppercase tracking-[0.25em] text-[#8a8275] mb-1">Estimated total</p>
                          <p className="text-2xl font-serif text-[#1f1f1f]">
                            €{getTotalPrice().toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 justify-center">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleDownloadPDF}
                          className="inline-flex justify-center items-center px-10 py-3 text-sm uppercase tracking-[0.25em] border border-[#1f1f1f] text-[#1f1f1f] hover:bg-[#1f1f1f] hover:text-white transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {t('menuBuilder.buttons.downloadPDF')}
                        </motion.button>
                      </div>

                      {/* Calendly Scheduling Widget */}
                      <div className="mt-12 border-t border-[#dcd3c5] pt-12">
                        <div className="text-center mb-8">
                          <h3 className="text-2xl md:text-3xl font-serif text-[#1f1f1f] mb-3">
                            Schedule Your Consultation
                          </h3>
                          <p className="text-sm text-[#6c655b] max-w-xl mx-auto">
                            Choose a convenient time for us to discuss your event details and finalize your catering experience.
                          </p>
                        </div>
                        
                        <div 
                          className="calendly-inline-widget" 
                          data-url="https://calendly.com/taoufik-el-kadi/offerte-gesprek"
                          style={{ minWidth: '320px', height: '700px' }}
                        ></div>
                        
                        <p className="text-xs text-[#8a8275] text-center mt-4">
                          After scheduling, we'll send you a confirmation email with all the details.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-14 pt-8 border-t border-[#dcd3c5]">
          {/* Validation Message */}
          {getValidationMessage() && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 text-center"
            >
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#8a8275]">
                {getValidationMessage()}
              </p>
            </motion.div>
          )}

          <div className="flex justify-between items-center flex-wrap gap-4">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className={`text-xs uppercase tracking-[0.28em] px-6 py-3 border transition-colors duration-200 ${
                currentStep === 1
                  ? 'text-[#c1b8ab] border-[#e6ddd0] cursor-not-allowed'
                  : 'text-[#1f1f1f] border-[#1f1f1f] hover:bg-[#1f1f1f] hover:text-white'
              }`}
            >
              {t('menuBuilder.buttons.previous')}
            </button>

            <div className="flex items-center gap-4">
              {currentStep === 2 && selectedItems.length > 0 && (
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-[#8a8275]">
                    {selectedItems.length} items selected
                  </p>
                </div>
              )}
              {currentStep < 6 && (
                <button
                  onClick={handleNextStep}
                  disabled={!canProceedToNextStep()}
                  className={`text-xs uppercase tracking-[0.28em] px-8 py-3 border transition-colors duration-200 ${
                    canProceedToNextStep()
                      ? 'text-white bg-[#1f1f1f] border-[#1f1f1f] hover:bg-[#2b2b2b]'
                      : 'text-[#c1b8ab] border-[#e6ddd0] bg-white/60 cursor-not-allowed'
                  }`}
                >
                  {currentStep === 1 && t('menuBuilder.buttons.buildMenu')}
                  {currentStep === 2 && 'Set details →'}
                  {currentStep === 3 && 'Choose extras →'}
                  {currentStep === 4 && 'Select decoration →'}
                  {currentStep === 5 && 'Choose date →'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
