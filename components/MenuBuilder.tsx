'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';
import { X } from 'lucide-react';
import { menuItems, MenuItem, MenuCategory, MenuSubCategory } from '@/data/menuData';
import {
  BASE_PRICE,
  MIN_GUESTS,
  getPerPersonPrice,
  getServicePerGuest,
  getEstimatedTotal,
  formatEuro,
} from '@/lib/pricing';
import MenuCard from './MenuCard';
import EventTypeSelector, { EventType } from './EventTypeSelector';
import GuestCountSelector from './GuestCountSelector';
import ServiceSelector from './ExtrasSelector';
import DecorationSelector, { DecorationType, DECORATION_PRICES } from './DecorationSelector';
import DatePickerSelector from './DatePickerSelector';
import { useLanguage } from './LanguageProvider';
import { getTranslatedMenuItem } from '@/utils/translations';
import { StarSeal as DecorStar } from './MenuDecor';
import { smoothScrollTo, getLenis } from '@/lib/lenis';

type FlowStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type StepKind = 'event' | 'menu' | 'guests' | 'service' | 'decor' | 'date';

// Faint eight-pointed-star (khatam) zellige texture for the section atmosphere.
const ZELLIGE_TEXTURE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><g fill='none' stroke='%23C19A5B' stroke-width='1'><path d='M70 14 82 42 110 30 98 58 126 70 98 82 110 110 82 98 70 126 58 98 30 110 42 82 14 70 42 58 30 30 58 42z'/><circle cx='70' cy='70' r='10'/></g></svg>\")";

// A small ornamental divider: gold hairline flanked by an eight-pointed star.
function StarDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <span className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#C19A5B]/70" />
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#C19A5B]" aria-hidden="true">
        <path d="M12 1.6l2.47 4.2 4.73-1.27-1.27 4.73 4.2 2.47-4.2 2.47 1.27 4.73-4.73-1.27L12 22.4l-2.47-4.2-4.73 1.27 1.27-4.73L1.6 12l4.2-2.47L4.53 4.8l4.73 1.27L12 1.6z" />
      </svg>
      <span className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#C19A5B]/70" />
    </div>
  );
}

export default function MenuBuilder() {
  const { t, lang } = useLanguage();

  // Event and Menu selection state
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<MenuSubCategory | null>(null);
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);

  // Create translated menu items
  const translatedMenuItems = useMemo(() => {
    return menuItems.map((item) => {
      const translation = getTranslatedMenuItem(lang, item.id);
      if (translation) {
        return {
          ...item,
          name: translation.name,
          description: translation.description,
          ingredients: translation.ingredients || item.ingredients,
          culturalInfo: translation.culturalInfo || item.culturalInfo,
          servingSize: translation.servingSize || item.servingSize,
        };
      }
      return item;
    });
  }, [lang]);

  // Update selectedItems with translated names when language changes
  useEffect(() => {
    setSelectedItems((prevItems) => {
      return prevItems.map((item) => {
        const translation = getTranslatedMenuItem(lang, item.id);
        if (translation) {
          return {
            ...item,
            name: translation.name,
            description: translation.description,
            ingredients: translation.ingredients || item.ingredients,
            culturalInfo: translation.culturalInfo || item.culturalInfo,
            servingSize: translation.servingSize || item.servingSize,
          };
        }
        return item;
      });
    });
  }, [lang]);

  // Flow state
  const [currentStep, setCurrentStep] = useState<FlowStep>(1);
  const [guestCount, setGuestCount] = useState<number>(MIN_GUESTS);
  const [coffeeLuxe, setCoffeeLuxe] = useState<boolean>(false);
  const [cookiesLuxe, setCookiesLuxe] = useState<boolean>(false);
  const [selectedDecoration, setSelectedDecoration] = useState<DecorationType>('basic');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Mobile full-screen focused flow
  const [isDesktop, setIsDesktop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Fully lock the page while the mobile flow is open. body{overflow:hidden}
  // alone does NOT stop iOS touch-scroll, so we pin the body with position:fixed
  // (the gold-standard mobile lock), pause Lenis smooth-scroll, and flag the body
  // so the floating scroll-to-top hides. Scroll position is restored on close.
  useEffect(() => {
    if (!mobileOpen) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    const lenis = getLenis();
    lenis?.stop();
    body.classList.add('menu-flow-open');
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    return () => {
      body.classList.remove('menu-flow-open');
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
      lenis?.start();
    };
  }, [mobileOpen]);

  // Sub-categories available per top-level category.
  const subCategoryMap: Record<MenuCategory, MenuSubCategory[]> = {
    appetizer: ['warm', 'luxe'],
    starter: ['salad', 'soup', 'pastilla'],
    main: ['meat', 'chicken', 'fish', 'buffet', 'couscous'],
    dessert: [],
  };

  // The flow is one step per course (Hapjes / Voorgerechten / Hoofdgerechten /
  // Desserts) plus event, guests, service, decoration and date.
  const STEP_DEFS: { step: FlowStep; kind: StepKind; category?: MenuCategory }[] = [
    { step: 1, kind: 'event' },
    { step: 2, kind: 'menu', category: 'appetizer' },
    { step: 3, kind: 'menu', category: 'starter' },
    { step: 4, kind: 'menu', category: 'main' },
    { step: 5, kind: 'menu', category: 'dessert' },
    { step: 6, kind: 'guests' },
    { step: 7, kind: 'service' },
    { step: 8, kind: 'decor' },
    { step: 9, kind: 'date' },
  ];
  const TOTAL_STEPS = STEP_DEFS.length;
  const currentDef = STEP_DEFS[currentStep - 1];
  const activeMenuCategory: MenuCategory | null = currentDef.kind === 'menu' ? currentDef.category! : null;
  const activeSubCategories = activeMenuCategory ? subCategoryMap[activeMenuCategory] : [];

  // Reset the sub-category filter whenever the step changes.
  useEffect(() => {
    setSelectedSubCategory(null);
  }, [currentStep]);

  const filteredItems = useMemo(() => {
    if (!activeMenuCategory) return [];
    return translatedMenuItems.filter((item) => {
      if (item.category !== activeMenuCategory) return false;
      if (selectedSubCategory) {
        return item.subCategory === selectedSubCategory;
      }
      return true;
    });
  }, [translatedMenuItems, activeMenuCategory, selectedSubCategory]);

  // Hapjes (appetizers) are capped at 2 selections — 2 basic hapjes are included.
  const APPETIZER_MAX = 2;

  const handleSelectItem = useCallback((item: MenuItem) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev.filter((i) => i.id !== item.id);
      if (item.category === 'appetizer') {
        const appetizerCount = prev.filter((i) => i.category === 'appetizer').length;
        if (appetizerCount >= APPETIZER_MAX) return prev; // cap reached — ignore
      }
      return [...prev, item];
    });
  }, []);

  const appetizerCount = selectedItems.filter((i) => i.category === 'appetizer').length;

  const getTotalPrice = useCallback(() => {
    return getEstimatedTotal(selectedItems, guestCount, {
      coffeeLuxe,
      cookiesLuxe,
      decorationFee: DECORATION_PRICES[selectedDecoration],
    });
  }, [selectedItems, guestCount, coffeeLuxe, cookiesLuxe, selectedDecoration]);

  // Compact, customer-facing total (rounded euros, locale-grouped).
  const localeTag = lang === 'nl' ? 'nl-NL' : lang === 'fr' ? 'fr-FR' : 'en-US';
  const formatTotalCompact = useCallback(
    (amount: number) => `€${Math.round(amount).toLocaleString(localeTag)}`,
    [localeTag]
  );

  const handleDownloadPDF = useCallback(async () => {
    if (!selectedDate || !selectedEventType) return;

    // Lazily load the PDF generator (and its jspdf dependency) only on demand
    const { downloadOffertePDF } = await import('@/utils/pdfGenerator');

    downloadOffertePDF({
      eventType: selectedEventType,
      eventDate: selectedDate,
      selectedItems,
      guestCount,
      coffeeLuxe,
      cookiesLuxe,
      selectedDecoration,
      totalPrice: getTotalPrice(),
      lang,
    });
  }, [selectedDate, selectedEventType, selectedItems, guestCount, coffeeLuxe, cookiesLuxe, selectedDecoration, getTotalPrice, lang]);

  const hasStarter = selectedItems.some((item) => item.category === 'starter');
  const hasMain = selectedItems.some((item) => item.category === 'main');
  const hasDessert = selectedItems.some((item) => item.category === 'dessert');

  const canProceedToNextStep = () => {
    if (currentDef.kind === 'event') return selectedEventType !== null;
    if (currentDef.kind === 'date') return selectedDate !== '';
    // Leaving the last course step (Desserts) enforces menu completeness.
    if (currentStep === 5) {
      if (selectedEventType === 'wedding') {
        return hasStarter && hasMain && hasDessert;
      }
      return selectedItems.length > 0;
    }
    return true;
  };

  const getValidationMessage = () => {
    if (currentStep !== 5) return null;
    if (selectedEventType === 'wedding') {
      const missing = [] as string[];
      if (!hasStarter) missing.push(t('menuBuilder.validation.starter'));
      if (!hasMain) missing.push(t('menuBuilder.validation.main'));
      if (!hasDessert) missing.push(t('menuBuilder.validation.dessert'));
      if (missing.length > 0) {
        return t('menuBuilder.validation.weddingRequires').replace('{missing}', missing.join(', '));
      }
    } else if (selectedItems.length === 0) {
      return t('menuBuilder.validation.atLeastOne');
    }
    return null;
  };

  const scrollToBuilder = useCallback(() => {
    // On mobile the flow scrolls its own container; on desktop scroll the section.
    setTimeout(() => {
      if (mobileScrollRef.current) {
        mobileScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const section = document.getElementById('menu-builder');
      if (section) {
        const offset = window.innerWidth < 640 ? 70 : 90;
        smoothScrollTo(section, { offset: -offset });
      }
    }, 50);
  }, []);

  const handleNextStep = useCallback(() => {
    if (canProceedToNextStep() && currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => (s + 1) as FlowStep);
      scrollToBuilder();
    }
    // canProceedToNextStep is recreated each render; intentionally read latest
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, scrollToBuilder, selectedEventType, selectedItems, guestCount, selectedDate, hasStarter, hasMain, hasDessert]);

  const handlePrevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((s) => (s - 1) as FlowStep);
      scrollToBuilder();
    }
  }, [currentStep, scrollToBuilder]);

  // Step labels for progress indicator — courses use their category name.
  const stepKeyForKind: Record<Exclude<StepKind, 'menu'>, string> = {
    event: 'event',
    guests: 'guests',
    service: 'extras',
    decor: 'decor',
    date: 'date',
  };
  const stepLabels = STEP_DEFS.map((d) => ({
    step: d.step,
    label:
      d.kind === 'menu'
        ? t(`menuBuilder.categories.${d.category}`)
        : t(`menuBuilder.steps.${stepKeyForKind[d.kind]}`),
  }));

  // The Next button names the step it leads to.
  const nextLabel = currentStep < TOTAL_STEPS ? stepLabels[currentStep].label : '';

  // Short service summary line for the review screen.
  const serviceSummary = `${t('menuBuilder.extras.coffeeName')}: ${
    coffeeLuxe ? t('menuBuilder.extras.luxeName') : t('menuBuilder.extras.standardName')
  } · ${t('menuBuilder.extras.cookiesName')}: ${
    cookiesLuxe ? t('menuBuilder.extras.luxeName') : t('menuBuilder.extras.standardName')
  }`;

  // ---- Step content (shared by desktop inline layout and mobile flow) -------
  const renderStepContent = () => (
    <>
      {/* Step 1: Event Type Selection */}
      {currentStep === 1 && (
        <motion.div key="step-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="py-2 sm:py-6">
            <EventTypeSelector selectedEventType={selectedEventType} onEventTypeChange={setSelectedEventType} />
          </div>
        </motion.div>
      )}

      {/* Course steps: Hapjes / Voorgerechten / Hoofdgerechten / Desserts */}
      {currentDef.kind === 'menu' && activeMenuCategory && (
        <motion.div key={`menu-${activeMenuCategory}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div>
            {/* Course title */}
            <div className="text-center space-y-4 mb-8 sm:mb-10">
              <h3 className="text-2xl sm:text-3xl font-serif uppercase tracking-[0.06em] text-[#1f1f1f]">
                {t(`menuBuilder.categories.${activeMenuCategory}`)}
              </h3>
              <StarDivider />
            </div>

            {/* Sub-Category Selector */}
            {activeSubCategories.length > 0 && (
              <div className="mb-8 sm:mb-12">
                <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
                  <div className="flex sm:justify-center gap-2 sm:gap-4 min-w-max sm:min-w-0">
                    {activeSubCategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubCategory(selectedSubCategory === sub ? null : sub)}
                        className={`min-h-[40px] px-5 sm:px-5 py-2 text-[11px] uppercase tracking-[0.22em] whitespace-nowrap border transition-all duration-300 active:scale-[0.97] ${
                          selectedSubCategory === sub
                            ? 'border-[#C19A5B] bg-[#C19A5B] text-[#1f1f1f] shadow-[0_8px_20px_-8px_rgba(193,154,91,0.7)] font-medium'
                            : 'border-[#dcc8a4] bg-white/40 text-[#6c655b] hover:border-[#C19A5B] hover:text-[#1f1f1f]'
                        }`}
                      >
                        {t(`menuBuilder.subCategories.${sub}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items Grid */}
            <motion.div
              layout
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.95 },
                      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
                    }}
                  >
                    <MenuCard
                      item={item}
                      isSelected={!!selectedItems.find((i) => i.id === item.id)}
                      onSelect={handleSelectItem}
                      disabled={item.category === 'appetizer' && appetizerCount >= APPETIZER_MAX}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Step: Guest Count */}
      {currentDef.kind === 'guests' && (
        <motion.div key="step-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="py-2 sm:py-6">
            <GuestCountSelector guestCount={guestCount} onGuestCountChange={setGuestCount} />
          </div>
        </motion.div>
      )}

      {/* Step: Service (included + luxe upgrades) */}
      {currentDef.kind === 'service' && (
        <motion.div key="step-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="py-2 sm:py-6">
            <ServiceSelector
              coffeeLuxe={coffeeLuxe}
              cookiesLuxe={cookiesLuxe}
              onCoffeeLuxeToggle={setCoffeeLuxe}
              onCookiesLuxeToggle={setCookiesLuxe}
            />
          </div>
        </motion.div>
      )}

      {/* Step: Decoration */}
      {currentDef.kind === 'decor' && (
        <motion.div key="step-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="py-2 sm:py-6">
            <DecorationSelector selectedDecoration={selectedDecoration} onDecorationChange={setSelectedDecoration} />
          </div>
        </motion.div>
      )}

      {/* Step: Date Picker and Review */}
      {currentDef.kind === 'date' && (
        <motion.div key="step-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="space-y-12 py-2 sm:py-6">
            <DatePickerSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />

            {selectedDate && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="py-6 sm:py-10 border-t border-[#dcd3c5]">
                <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif uppercase tracking-[0.05em] text-[#1f1f1f]">
                      {t('menuBuilder.review.title')}
                    </h3>
                    <StarDivider />
                  </div>

                  {/* Summary Card */}
                  <div className="relative overflow-hidden border border-[#dfd2ba] p-4 sm:p-8 text-left space-y-4 sm:space-y-6 bg-gradient-to-br from-[#fdfbf7] to-[#f6f1e8] rounded-[3px] shadow-[0_20px_52px_-24px_rgba(80,60,30,0.36)]">
                    <DecorStar className="pointer-events-none absolute -top-7 -right-7 w-32 h-32 text-[#C19A5B]/[0.05]" />

                    {/* Event + date + guests */}
                    <div className="grid grid-cols-2 gap-4 border-b border-[#e6ddd0] pb-3 sm:pb-4">
                      <div>
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8a8275] mb-1">{t('menuBuilder.review.eventLabel')}</p>
                        <p className="text-sm text-[#1f1f1f] capitalize font-medium">{selectedEventType}</p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8a8275] mb-1">{t('menuBuilder.review.guestsLabel')}</p>
                        <p className="text-sm text-[#1f1f1f] font-medium">{guestCount}</p>
                      </div>
                    </div>

                    <div className="border-b border-[#e6ddd0] pb-3 sm:pb-4">
                      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8a8275] mb-1">{t('menuBuilder.review.eventDateLabel')}</p>
                      <p className="text-sm text-[#1f1f1f]">
                        {new Date(selectedDate + 'T00:00:00').toLocaleDateString(localeTag, {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="border-b border-[#e6ddd0] pb-3 sm:pb-4">
                      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8a8275] mb-2 sm:mb-3">{t('menuBuilder.review.menuSelectionLabel')}</p>
                      <div className="space-y-2 sm:space-y-3">
                        {selectedItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-[#1f1f1f] font-light truncate sm:whitespace-normal">{item.name}</p>
                              <p className="text-xs text-[#6c655b] mt-0.5 hidden sm:block">{item.description}</p>
                            </div>
                            <p className="text-sm text-[#1f1f1f] flex-shrink-0">
                              {item.included
                                ? t('menuBuilder.review.included')
                                : item.flatFee
                                ? `${formatEuro(item.surcharge)} ${t('menuBuilder.review.flatFee')}`
                                : `+${formatEuro(item.surcharge)}`}
                            </p>
                          </div>
                        ))}
                        <p className="text-xs text-[#8a8275] pt-2 border-t border-[#e6ddd0]">
                          {selectedItems.length === 1
                            ? t('menuBuilder.review.itemsSelected').replace('{count}', '1')
                            : t('menuBuilder.review.itemsSelectedPlural').replace('{count}', String(selectedItems.length))}
                        </p>
                      </div>
                    </div>

                    {/* Service & decoration */}
                    <div className="grid sm:grid-cols-2 gap-4 border-b border-[#e6ddd0] pb-3 sm:pb-4">
                      <div>
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8a8275] mb-1">{t('menuBuilder.review.serviceLabel')}</p>
                        <p className="text-xs sm:text-sm text-[#1f1f1f]">{serviceSummary}</p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8a8275] mb-1">{t('menuBuilder.review.decorationLabel')}</p>
                        <p className="text-xs sm:text-sm text-[#1f1f1f]">{t(`menuBuilder.decoration.packages.${selectedDecoration}.name`)}</p>
                      </div>
                    </div>

                    {/* Pricing breakdown */}
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8a8275]">{t('menuBuilder.review.basePrice')}</p>
                        <p className="text-sm text-[#1f1f1f]">{formatEuro(BASE_PRICE)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8a8275]">{t('menuBuilder.review.perPersonPrice')}</p>
                        <p className="text-sm text-[#1f1f1f]">{formatEuro(getPerPersonPrice(selectedItems) + getServicePerGuest({ coffeeLuxe, cookiesLuxe }))}</p>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="pt-2 sm:pt-4 bg-[#1f1f1f] -mx-4 sm:-mx-8 px-4 sm:px-8 py-4 sm:py-5 -mb-4 sm:-mb-8 rounded-b-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/70">{t('menuBuilder.review.estimatedTotal')}</p>
                        <p className="text-xl sm:text-2xl font-serif text-white">{formatEuro(getTotalPrice())}</p>
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-white/60 leading-relaxed mt-2 pt-2 border-t border-white/10">
                        {t('menuBuilder.review.priceDisclaimer')}
                      </p>
                    </div>
                  </div>

                  {/* Download PDF Button */}
                  <motion.button
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    onClick={handleDownloadPDF}
                    className="group/dl relative w-full sm:w-auto sm:mx-auto flex justify-center items-center gap-2.5 min-h-[56px] px-10 sm:px-16 text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#1f1f1f] bg-gradient-to-r from-[#cda769] via-[#C19A5B] to-[#b8905a] rounded-[3px] shadow-[0_16px_38px_-14px_rgba(193,154,91,0.75)] hover:shadow-[0_22px_50px_-14px_rgba(193,154,91,0.9)] transition-shadow duration-300 overflow-hidden"
                  >
                    <span className="pointer-events-none absolute inset-[5px] rounded-[2px] border border-white/30" />
                    <svg className="relative w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="relative">{t('menuBuilder.buttons.downloadPDF')}</span>
                  </motion.button>

                  {/* Calendly Scheduling Widget */}
                  <div className="mt-8 sm:mt-12 border-t border-[#dcd3c5] pt-8 sm:pt-12">
                    <div className="text-center mb-6 sm:mb-8">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#1f1f1f] mb-2 sm:mb-3">{t('menuBuilder.calendly.title')}</h3>
                      <p className="text-xs sm:text-sm text-[#6c655b] max-w-xl mx-auto px-2">{t('menuBuilder.calendly.description')}</p>
                    </div>

                    <div
                      className="calendly-inline-widget rounded-lg"
                      data-url="https://calendly.com/taoufik-el-kadi/offerte-gesprek?hide_gdpr_banner=1&background_color=ffffff&text_color=1f1f1f&primary_color=C19A5B"
                      style={{ minWidth: '280px', width: '100%', height: '700px' }}
                    />
                    <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />

                    <p className="text-[10px] sm:text-xs text-[#8a8275] text-center mt-4">{t('menuBuilder.calendly.confirmation')}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );

  // ---- Navigation buttons (shared) ------------------------------------------
  const renderNav = () => (
    <div className="flex gap-3 sm:gap-4">
      <motion.button
        onClick={handlePrevStep}
        disabled={currentStep === 1}
        whileTap={{ scale: currentStep === 1 ? 1 : 0.97 }}
        className={`flex-1 sm:flex-none min-h-[52px] sm:min-h-[48px] px-6 sm:px-8 text-xs uppercase tracking-[0.2em] sm:tracking-[0.28em] border rounded-sm transition-all duration-200 ${
          currentStep === 1 ? 'text-[#c1b8ab] border-[#e6ddd0] cursor-not-allowed' : 'text-[#1f1f1f] border-[#1f1f1f] active:bg-[#1f1f1f] active:text-white'
        }`}
      >
        {t('menuBuilder.buttons.previous')}
      </motion.button>

      {currentStep < TOTAL_STEPS && (
        <motion.button
          onClick={handleNextStep}
          disabled={!canProceedToNextStep()}
          whileTap={{ scale: canProceedToNextStep() ? 0.97 : 1 }}
          className={`flex-[2] sm:flex-1 min-h-[52px] sm:min-h-[48px] px-6 sm:px-10 text-xs uppercase tracking-[0.15em] sm:tracking-[0.28em] border rounded-sm transition-all duration-200 font-medium ${
            canProceedToNextStep() ? 'text-white bg-[#C19A5B] border-[#C19A5B] active:bg-[#b08a4e]' : 'text-[#c1b8ab] border-[#e6ddd0] bg-[#f0ebe3] cursor-not-allowed'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {nextLabel}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </motion.button>
      )}
    </div>
  );

  const showLiveTotal = currentStep >= 2 && currentStep < TOTAL_STEPS;

  return (
    <section id="menu-builder" className="relative isolate overflow-hidden py-16 sm:py-28 bg-gradient-to-b from-[#f8f4ed] via-[#f5efe5] to-[#f2ebdd] text-[#1f1f1f]">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-5%,rgba(193,154,91,0.12),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.045]" style={{ backgroundImage: ZELLIGE_TEXTURE, backgroundSize: '140px 140px' }} />
        <div className="absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(193,154,91,0.10),transparent_70%)] blur-2xl" />
        <div className="absolute -right-40 bottom-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(193,154,91,0.08),transparent_70%)] blur-2xl" />
        <div className="absolute inset-x-8 top-6 h-px bg-gradient-to-r from-transparent via-[#C19A5B]/25 to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#a8824a]">{t('menuBuilder.kicker')}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif uppercase tracking-[0.05em] sm:tracking-[0.08em] text-[#1f1f1f]">{t('menuBuilder.title')}</h2>
          <StarDivider className="pt-1" />
          <p className="text-sm text-[#4a4742] max-w-2xl mx-auto px-2 leading-relaxed font-light">{t('menuBuilder.description')}</p>
        </div>

        {isDesktop ? (
          /* ============ DESKTOP: inline layout ============ */
          <>
            {/* Desktop stepper — compact rail; centers when it fits, scrolls if not */}
            <div className="mt-14 mb-14">
              <div className="relative px-4 py-4 overflow-x-auto scrollbar-hide">
                <div className="flex items-center w-max mx-auto">
                  {stepLabels.map((s, index) => {
                    const isActive = s.step === currentStep;
                    const isDone = s.step < currentStep;
                    return (
                      <Fragment key={s.step}>
                        <button
                          onClick={() => s.step < currentStep && setCurrentStep(s.step as FlowStep)}
                          disabled={s.step > currentStep}
                          className={`relative shrink-0 px-3 lg:px-4 py-2.5 border text-[10px] uppercase tracking-[0.18em] transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-br from-[#cda769] to-[#b8905a] text-white border-[#C19A5B] shadow-[0_8px_20px_-8px_rgba(193,154,91,0.8)] font-medium'
                              : isDone
                              ? 'bg-[#f3e9d6] text-[#a8824a] border-[#C19A5B]/40 hover:bg-[#ecdfc4] cursor-pointer'
                              : 'bg-[#fdfbf7] text-[#b3a892] border-[#e3d7c1] cursor-default'
                          }`}
                        >
                          {s.label}
                        </button>
                        {index < stepLabels.length - 1 && (
                          <span className="shrink-0 w-5 lg:w-8 h-px mx-1 lg:mx-1.5 overflow-hidden bg-[#e3d7c1]">
                            <motion.span
                              className="block h-full origin-left bg-gradient-to-r from-[#C19A5B] to-[#cda769]"
                              initial={false}
                              animate={{ scaleX: s.step < currentStep ? 1 : 0 }}
                              transition={{ duration: 0.45, ease: 'easeOut' }}
                            />
                          </span>
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="min-h-[520px] mt-12 space-y-12">{renderStepContent()}</div>

            {/* Desktop bottom nav */}
            <div className="mt-14 pt-8 border-t border-[#dcd3c5]">
              {getValidationMessage() && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 text-center">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#C19A5B] bg-[#C19A5B]/10 px-4 py-2 rounded-lg inline-block">{getValidationMessage()}</p>
                </motion.div>
              )}
              {showLiveTotal && (
                <div className="text-center mb-4">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-[#8a8275]">
                    {t('menuBuilder.review.startingFrom')} <span className="text-[#1f1f1f] font-medium">{formatTotalCompact(getTotalPrice())}</span>
                  </p>
                </div>
              )}
              {renderNav()}
            </div>
          </>
        ) : (
          /* ============ MOBILE: entry card + full-screen flow ============ */
          <>
            <div className="mt-10">
              <div className="relative overflow-hidden rounded-[4px] border border-[#dfd2ba] bg-gradient-to-br from-[#fdfbf7] to-[#f3ecdf] p-6 shadow-[0_18px_44px_-26px_rgba(80,60,30,0.4)]">
                <DecorStar className="pointer-events-none absolute -top-6 -right-6 w-28 h-28 text-[#C19A5B]/[0.06]" />
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#a8824a] mb-2">{t('menuBuilder.steps.event')} → {t('menuBuilder.steps.date')}</p>
                <p className="text-sm text-[#4a4742] font-light leading-relaxed mb-5">{t('menuBuilder.description')}</p>
                <button
                  onClick={() => setMobileOpen(true)}
                  className="w-full min-h-[54px] flex items-center justify-center gap-2 text-xs uppercase tracking-[0.22em] font-medium text-white bg-gradient-to-r from-[#cda769] via-[#C19A5B] to-[#b8905a] rounded-[3px] shadow-[0_14px_34px_-14px_rgba(193,154,91,0.8)] active:scale-[0.98] transition-transform"
                >
                  {t('menuBuilder.buttons.start')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {createPortal(
            <AnimatePresence>
              {mobileOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="fixed inset-0 z-[80] flex flex-col bg-[#f7f3ec]"
                >
                  {/* Sticky top bar */}
                  <div className="shrink-0 bg-[#f7f3ec]/95 backdrop-blur-sm border-b border-[#e3d7c1] px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-baseline gap-1.5">
                        <span className="font-serif text-xl leading-none text-[#C19A5B]">{String(currentStep).padStart(2, '0')}</span>
                        <span className="text-[10px] tracking-[0.25em] text-[#b3a892]">/ {String(TOTAL_STEPS).padStart(2, '0')} · {stepLabels[currentStep - 1].label}</span>
                      </span>
                      <button
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close"
                        className="flex items-center justify-center w-9 h-9 rounded-full border border-[#e3d7c1] text-[#6c655b] active:bg-[#1f1f1f] active:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-1.5">
                      {stepLabels.map((s) => (
                        <button
                          key={s.step}
                          onClick={() => s.step < currentStep && setCurrentStep(s.step as FlowStep)}
                          disabled={s.step >= currentStep}
                          aria-label={s.label}
                          className="h-1.5 flex-1 rounded-full overflow-hidden bg-[#e7ddcb]"
                        >
                          <motion.span
                            className="block h-full origin-left rounded-full bg-gradient-to-r from-[#C19A5B] to-[#cda769]"
                            initial={false}
                            animate={{ scaleX: s.step <= currentStep ? 1 : 0 }}
                            transition={{ duration: 0.45, ease: 'easeOut' }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scrollable content — data-lenis-prevent lets this scroll natively
                      while Lenis keeps the background locked. */}
                  <div
                    ref={mobileScrollRef}
                    data-lenis-prevent
                    className="flex-1 overflow-y-auto overscroll-contain px-4 py-6 [-webkit-overflow-scrolling:touch]"
                  >
                    {renderStepContent()}
                  </div>

                  {/* Sticky bottom bar */}
                  <div className="shrink-0 bg-white border-t border-[#e3d7c1] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_30px_-18px_rgba(80,60,30,0.4)]">
                    {getValidationMessage() && (
                      <p className="mb-2.5 text-center text-[10px] uppercase tracking-[0.2em] text-[#C19A5B]">{getValidationMessage()}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePrevStep}
                        disabled={currentStep === 1}
                        className={`shrink-0 min-h-[52px] px-5 rounded-sm border text-xs uppercase tracking-[0.18em] transition-colors ${
                          currentStep === 1 ? 'text-[#c1b8ab] border-[#e6ddd0]' : 'text-[#1f1f1f] border-[#1f1f1f] active:bg-[#1f1f1f] active:text-white'
                        }`}
                      >
                        {t('menuBuilder.buttons.back')}
                      </button>

                      {showLiveTotal && (
                        <div className="flex-1 min-w-0 text-center leading-tight">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-[#8a8275]">{t('menuBuilder.review.startingFrom')}</p>
                          <p className="text-base font-serif text-[#1f1f1f] truncate">{formatTotalCompact(getTotalPrice())}</p>
                        </div>
                      )}

                      {currentStep < TOTAL_STEPS ? (
                        <button
                          onClick={handleNextStep}
                          disabled={!canProceedToNextStep()}
                          className={`shrink-0 min-h-[52px] px-7 rounded-sm border text-xs uppercase tracking-[0.18em] font-medium flex items-center gap-2 transition-colors ${
                            canProceedToNextStep() ? 'text-white bg-[#C19A5B] border-[#C19A5B] active:bg-[#b08a4e]' : 'text-[#c1b8ab] border-[#e6ddd0] bg-[#f0ebe3]'
                          }`}
                        >
                          {nextLabel}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => setMobileOpen(false)}
                          className="shrink-0 min-h-[52px] px-7 rounded-sm border border-[#1f1f1f] text-[#1f1f1f] text-xs uppercase tracking-[0.18em] font-medium active:bg-[#1f1f1f] active:text-white transition-colors"
                        >
                          {t('menuBuilder.buttons.done')}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
            )}
          </>
        )}
      </div>
    </section>
  );
}
