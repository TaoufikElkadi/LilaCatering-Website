'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, MotionConfig, animate, useMotionValue, useTransform, useAnimationControls } from 'framer-motion';
import dynamic from 'next/dynamic';
import { X, Soup, Snowflake, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { menuItems, MenuItem, MenuCategory, MenuSubCategory } from '@/data/menuData';
import {
  MIN_GUESTS,
  getTransportCost,
  getEstimatedTotal,
  formatEuro,
  TABLE_EXTRA_PRICES,
  TEA_SHOW_FEES,
  type TableExtraId,
  type TeaShowId,
} from '@/lib/pricing';
import type { PlaceResult } from '@/lib/geocode';
import MenuCard from './MenuCard';
import EventTypeSelector, { EventType } from './EventTypeSelector';
import GuestCountSelector from './GuestCountSelector';
import LocationSelector from './LocationSelector';
import ServiceSelector from './ExtrasSelector';
import DecorationSelector, {
  DecorationCollectionId,
  DecorationSelection,
  decorationFeeFor,
  decorationPriceLabel,
  isDecorationComplete,
} from './DecorationSelector';
import DatePickerSelector from './DatePickerSelector';
import EventTimeSelector from './EventTimeSelector';
import { useLanguage } from './LanguageProvider';
import { getTranslatedMenuItem } from '@/utils/translations';
import { StarSeal as DecorStar, DiamondDivider, StepTitle, RollingNumber } from './MenuDecor';
import { smoothScrollTo, getLenis } from '@/lib/lenis';

// Only the final review step needs the booking/payment UI — keep it out of the
// initial bundle.
const BookingActions = dynamic(() => import('./BookingActions'), { ssr: false });

type FlowStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
type StepKind = 'event' | 'date' | 'time' | 'location' | 'guests' | 'starterTemp' | 'menu' | 'service' | 'decor' | 'review';

// Starter temperature: cold = salads, hot = pastilla + soups.
type StarterTemp = 'hot' | 'cold';
// Soups are now an extra service (see ServiceSelector), so a warm starter is
// pastilla only; cold is salads.
const STARTER_TEMP_SUBS: Record<StarterTemp, MenuSubCategory[]> = {
  cold: ['salad'],
  hot: ['pastilla'],
};

// Same gold as the header's Offerte CTA.
const GOLD = '#9E7F57';
const GOLD_DEEP = '#8B6E49';

const NEXT_LABEL = { nl: 'Volgende', en: 'Next', fr: 'Suivant' } as const;

// One easing for the whole flow: a quick start that settles softly.
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Pause after an auto-advancing choice, long enough for the selection to
// visibly confirm before the next step glides in.
const AUTO_ADVANCE_MS = 420;

// Euro total that counts smoothly to its new value instead of jumping.
function AnimatedTotal({ value, format }: { value: number; format: (n: number) => string }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => format(v));
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.6, ease: EASE_OUT });
    return () => controls.stop();
  }, [mv, value]);
  return <motion.span className="tabular-nums">{text}</motion.span>;
}

/*
 * Carved Moorish arch for the section's edges: the arch head (424x696 source,
 * drawn 280px wide) with its straight pillar continued below as a repeating
 * slice. The strip narrows with the viewport and fades on its inner edge; the
 * whole arch fades in at the top and out at the bottom, so it rises out of
 * and settles back into the neighbouring sections.
 */
const ARCH_STRIP_WIDTH = 'w-[clamp(90px,calc((100vw-1248px)/2+30px),280px)]';
const ARCH_FADE_Y = 'linear-gradient(to bottom, transparent, #000 140px, #000 calc(100% - 280px), transparent)';
const ARCH_FADE_X = 'linear-gradient(to right, transparent, #000 48px)';

function CarvedArch({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className={`absolute top-0 bottom-0 hidden lg:block ${ARCH_STRIP_WIDTH} ${side === 'right' ? 'right-0' : 'left-0 -scale-x-100'}`}
      style={{ maskImage: ARCH_FADE_X, WebkitMaskImage: ARCH_FADE_X }}
    >
      <div className="absolute inset-0" style={{ maskImage: ARCH_FADE_Y, WebkitMaskImage: ARCH_FADE_Y }}>
        <div
          className="absolute inset-x-0 top-[440px] bottom-0"
          style={{
            backgroundImage: "url('/images/menu-builder/arch-carved-pillar.webp')",
            backgroundRepeat: 'repeat-y',
            backgroundPosition: 'right top',
            backgroundSize: '280px 33px',
          }}
        />
        <div
          className="absolute right-0 top-0 h-[460px] w-[280px]"
          style={{
            backgroundImage: "url('/images/menu-builder/arch-carved.webp')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: '280px 460px',
          }}
        />
      </div>
    </div>
  );
}

export default function MenuBuilder() {
  const { t, lang } = useLanguage();

  // Event and Menu selection state
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<MenuSubCategory | null>(null);
  const [starterTemp, setStarterTemp] = useState<StarterTemp | null>(null);
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
  // Women/men split (total = women + men, kept in sync with guestCount).
  const [womenCount, setWomenCount] = useState<number>(Math.round(MIN_GUESTS / 2));
  const [menCount, setMenCount] = useState<number>(MIN_GUESTS - Math.round(MIN_GUESTS / 2));
  const handleGuestPreset = useCallback((total: number) => {
    const w = Math.round(total / 2);
    setWomenCount(w);
    setMenCount(total - w);
    setGuestCount(total);
  }, []);
  const handleWomenChange = useCallback((w: number) => {
    setWomenCount(w);
    setGuestCount(w + menCount);
  }, [menCount]);
  const handleMenChange = useCallback((m: number) => {
    setMenCount(m);
    setGuestCount(womenCount + m);
  }, [womenCount]);
  const [coffeeLuxe, setCoffeeLuxe] = useState<boolean>(false);
  const [cookiesLuxe, setCookiesLuxe] = useState<boolean>(false);
  const [tableExtras, setTableExtras] = useState<TableExtraId[]>([]);
  const [teaShow, setTeaShow] = useState<TeaShowId>('standard');
  const [cookieBuffet, setCookieBuffet] = useState<boolean>(false);
  const [decoration, setDecoration] = useState<DecorationSelection>(null);
  const selectDecoration = useCallback((id: DecorationCollectionId) => {
    setDecoration(id);
  }, []);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [eventStart, setEventStart] = useState<string>('');
  const [eventEnd, setEventEnd] = useState<string>('');
  const [foodTime, setFoodTime] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<PlaceResult | null>(null);
  const [locationUnknown, setLocationUnknown] = useState<boolean>(false);

  // After Mollie redirects back with ?paid=1 we restore the offerte from
  // sessionStorage and show a "date locked" confirmation + the scheduler.
  const [paidReturn, setPaidReturn] = useState(false);
  const [paidInfo, setPaidInfo] = useState<
    { status?: string; deposit?: number; eventDate?: string } | null
  >(null);
  // Captured during the first render (before any effect can overwrite it) so a
  // ?paid=1 return can restore the exact offerte.
  const [bootSnapshot] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    if (new URLSearchParams(window.location.search).get('paid') !== '1') return null;
    try {
      return sessionStorage.getItem('lila-builder-snapshot');
    } catch {
      return null;
    }
  });

  const transportFee = locationUnknown || !selectedLocation ? 0 : getTransportCost(selectedLocation);

  // Mobile full-screen focused flow
  const [isDesktop, setIsDesktop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  // Latest-value refs so stable callbacks/listeners avoid stale closures.
  const advanceStepRef = useRef<() => void>(() => {});
  const currentStepRef = useRef<FlowStep>(1);

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
    starter: ['salad', 'pastilla'],
    main: ['meat', 'chicken', 'fish', 'buffet', 'couscous'],
    dessert: [],
  };

  // The flow is one step per course (Hapjes / Voorgerechten / Hoofdgerechten /
  // Desserts) plus event, guests, service, decoration and date.
  // Times are asked AFTER service (later in the flow, once the menu is set).
  const STEP_DEFS: { step: FlowStep; kind: StepKind; category?: MenuCategory }[] = [
    { step: 1, kind: 'event' },
    { step: 2, kind: 'date' },
    { step: 3, kind: 'location' },
    { step: 4, kind: 'guests' },
    { step: 5, kind: 'menu', category: 'appetizer' },
    { step: 6, kind: 'starterTemp' },
    { step: 7, kind: 'menu', category: 'starter' },
    { step: 8, kind: 'menu', category: 'main' },
    { step: 9, kind: 'menu', category: 'dessert' },
    { step: 10, kind: 'service' },
    { step: 11, kind: 'time' },
    { step: 12, kind: 'decor' },
    { step: 13, kind: 'review' },
  ];
  useEffect(() => {
    const rail = tabsRef.current;
    const tab = rail?.querySelector<HTMLElement>('[data-active]');
    if (!rail || !tab) return;
    const target = tab.offsetLeft - (rail.clientWidth - tab.offsetWidth) / 2;
    rail.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [currentStep]);

  // Direction of the last step change (derived during render), so steps slide
  // in from the right going forward and from the left going back.
  const [stepNav, setStepNav] = useState({ step: currentStep, dir: 1 });
  if (stepNav.step !== currentStep) {
    setStepNav({ step: currentStep, dir: currentStep > stepNav.step ? 1 : -1 });
  }
  const stepMotion = {
    initial: { opacity: 0, x: 28 * stepNav.dir },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.45, ease: EASE_OUT },
  };

  const TOTAL_STEPS = STEP_DEFS.length;
  const REVIEW_STEP = (STEP_DEFS.find((d) => d.kind === 'review')?.step ?? TOTAL_STEPS) as FlowStep;
  const currentDef = STEP_DEFS[currentStep - 1];
  const activeMenuCategory: MenuCategory | null = currentDef.kind === 'menu' ? currentDef.category! : null;

  // Persist the offerte so a Mollie payment round-trip can restore it verbatim.
  useEffect(() => {
    if (paidReturn) return; // don't overwrite the snapshot while confirming
    try {
      sessionStorage.setItem(
        'lila-builder-snapshot',
        JSON.stringify({
          selectedEventType, selectedDate, eventStart, eventEnd, foodTime, guestCount,
          womenCount, menCount,
          selectedItems, coffeeLuxe, cookiesLuxe, tableExtras, teaShow, cookieBuffet,
          decoration, selectedLocation, locationUnknown, starterTemp,
        })
      );
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, [
    selectedEventType, selectedDate, eventStart, eventEnd, foodTime, guestCount,
    womenCount, menCount,
    selectedItems, coffeeLuxe, cookiesLuxe, tableExtras, teaShow, cookieBuffet,
    decoration, selectedLocation, locationUnknown, starterTemp, paidReturn,
  ]);

  // On return from Mollie (?paid=1): restore the offerte, jump to the review in
  // confirmation mode, verify the real status, and clean the URL.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('paid') !== '1') return;
    try {
      if (bootSnapshot) {
        const s = JSON.parse(bootSnapshot);
        if (s.selectedEventType) setSelectedEventType(s.selectedEventType);
        if (s.selectedDate) setSelectedDate(s.selectedDate);
        setEventStart(s.eventStart || '');
        setEventEnd(s.eventEnd || '');
        setFoodTime(s.foodTime || '');
        if (typeof s.guestCount === 'number') setGuestCount(s.guestCount);
        if (typeof s.womenCount === 'number') setWomenCount(s.womenCount);
        if (typeof s.menCount === 'number') setMenCount(s.menCount);
        if (Array.isArray(s.selectedItems)) setSelectedItems(s.selectedItems);
        setCoffeeLuxe(!!s.coffeeLuxe);
        setCookiesLuxe(!!s.cookiesLuxe);
        if (Array.isArray(s.tableExtras)) setTableExtras(s.tableExtras);
        if (s.teaShow) setTeaShow(s.teaShow);
        setCookieBuffet(!!s.cookieBuffet);
        if (s.decoration) setDecoration(s.decoration);
        setSelectedLocation(s.selectedLocation ?? null);
        setLocationUnknown(!!s.locationUnknown);
        setStarterTemp(s.starterTemp ?? null);
      }
    } catch {
      /* ignore malformed snapshot */
    }
    setPaidReturn(true);
    setCurrentStep(REVIEW_STEP);
    if (!window.matchMedia('(min-width: 640px)').matches) setMobileOpen(true);
    // Resolve the payment id: the return URL (?pid=) is most reliable, then the
    // sessionStorage stash, then the server-side cookie fallback.
    let pid = new URLSearchParams(window.location.search).get('pid') || '';
    if (!pid) {
      try {
        pid = sessionStorage.getItem('lila-payment-id') || '';
      } catch {
        /* ignore */
      }
    }
    const statusUrl = '/api/payments/status' + (pid ? `?id=${encodeURIComponent(pid)}` : '');
    fetch(statusUrl)
      .then((r) => r.json())
      .then((d) => setPaidInfo(d))
      .catch(() => {});
    window.history.replaceState({}, '', window.location.pathname);
    setTimeout(() => document.getElementById('menu-builder')?.scrollIntoView({ behavior: 'smooth' }), 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // For the starter course, only show the sub-categories that match the chosen
  // temperature (cold = salads, hot = pastilla + soups).
  const activeSubCategories = (() => {
    if (!activeMenuCategory) return [];
    const subs = subCategoryMap[activeMenuCategory];
    if (activeMenuCategory === 'starter' && starterTemp) {
      const allowed = STARTER_TEMP_SUBS[starterTemp];
      return subs.filter((s) => allowed.includes(s));
    }
    return subs;
  })();

  // Reset the sub-category filter whenever the step changes.
  useEffect(() => {
    setSelectedSubCategory(null);
  }, [currentStep]);

  const filteredItems = useMemo(() => {
    if (!activeMenuCategory) return [];
    const subOrder = subCategoryMap[activeMenuCategory];
    const items = translatedMenuItems.filter((item) => {
      if (item.category !== activeMenuCategory) return false;
      // Starters are gated by the chosen temperature first.
      if (activeMenuCategory === 'starter' && starterTemp) {
        if (!STARTER_TEMP_SUBS[starterTemp].includes(item.subCategory as MenuSubCategory)) return false;
      }
      if (selectedSubCategory) {
        return item.subCategory === selectedSubCategory;
      }
      return true;
    });
    // Group by sub-category order (e.g. warm hapjes first, then luxe extras),
    // keeping the original order within each group (stable sort).
    return items.sort(
      (a, b) =>
        subOrder.indexOf(a.subCategory as MenuSubCategory) -
        subOrder.indexOf(b.subCategory as MenuSubCategory)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translatedMenuItems, activeMenuCategory, selectedSubCategory, starterTemp]);

  // Hapjes (appetizers) are capped at 2 selections — 2 basic hapjes are included.
  const APPETIZER_MAX = 2;

  // Once a course reaches its threshold, the flow auto-continues to the next
  // step (appetizers need 2, every other course needs 1).
  const COURSE_THRESHOLDS: Record<MenuCategory, number> = {
    appetizer: 2,
    starter: 1,
    main: 1,
    dessert: 1,
  };

  // Latest selection, read by the stable handleSelectItem below so the memoised
  // MenuCards don't all re-render on every pick.
  const selectedItemsRef = useRef(selectedItems);
  selectedItemsRef.current = selectedItems;

  const handleSelectItem = useCallback((item: MenuItem) => {
    const selectedItems = selectedItemsRef.current;
    const isRemoval = selectedItems.some((i) => i.id === item.id);

    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev.filter((i) => i.id !== item.id);
      if (item.category === 'appetizer') {
        const appetizerCount = prev.filter((i) => i.category === 'appetizer').length;
        if (appetizerCount >= APPETIZER_MAX) return prev; // cap reached — ignore
      }
      return [...prev, item];
    });

    // Auto-continue when this add completes the current course (adds only).
    if (isRemoval) return;
    if (currentDef.kind !== 'menu' || !activeMenuCategory) return;
    if (item.category !== activeMenuCategory) return;
    const currentCount = selectedItems.filter((i) => i.category === activeMenuCategory).length;
    if (item.category === 'appetizer' && currentCount >= APPETIZER_MAX) return; // add was ignored
    const newCount = currentCount + 1;
    if (newCount >= COURSE_THRESHOLDS[activeMenuCategory]) {
      const category = activeMenuCategory;
      scheduleAdvance(
        () => selectedItemsRef.current.filter((i) => i.category === category).length >= COURSE_THRESHOLDS[category]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDef.kind, activeMenuCategory]);

  const selectedIds = useMemo(() => new Set(selectedItems.map((i) => i.id)), [selectedItems]);

  const appetizerCount = selectedItems.filter((i) => i.category === 'appetizer').length;

  const getTotalPrice = useCallback(() => {
    return getEstimatedTotal(selectedItems, guestCount, {
      coffeeLuxe,
      cookiesLuxe,
      tableExtras,
      cookieBuffet,
      teaShowFee: TEA_SHOW_FEES[teaShow],
      decorationFee: decorationFeeFor(decoration),
      transportFee,
    });
  }, [selectedItems, guestCount, coffeeLuxe, cookiesLuxe, tableExtras, cookieBuffet, teaShow, decoration, transportFee]);

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
      tableExtras,
      cookieBuffet,
      teaShow,
      decoration,
      venueName: locationUnknown ? t('menuBuilder.location.unknownShort') : selectedLocation?.label,
      transportFee,
      transportOnRequest: locationUnknown,
      totalPrice: getTotalPrice(),
      lang,
    });
  }, [selectedDate, selectedEventType, selectedItems, guestCount, coffeeLuxe, cookiesLuxe, tableExtras, cookieBuffet, teaShow, decoration, selectedLocation, locationUnknown, transportFee, getTotalPrice, lang, t]);

  // Step index of the last course (Desserts) — leaving it requires ≥1 dish.
  // Last course (dessert) step — derived so it survives step reordering.
  const LAST_COURSE_STEP = STEP_DEFS.filter((d) => d.kind === 'menu').slice(-1)[0]?.step ?? TOTAL_STEPS;

  const canProceedToNextStep = () => {
    if (currentDef.kind === 'event') return selectedEventType !== null;
    if (currentDef.kind === 'date') return selectedDate !== '';
    if (currentDef.kind === 'location') return locationUnknown || selectedLocation !== null;
    if (currentDef.kind === 'starterTemp') return starterTemp !== null;
    // Decoration: a tier must be chosen for every component.
    if (currentDef.kind === 'decor') return isDecorationComplete(decoration);
    // Same rule for every event type: at least one dish before continuing.
    if (currentStep === LAST_COURSE_STEP) return selectedItems.length > 0;
    return true;
  };

  // "Volgende" gives one soft pulse the moment it becomes available — a quiet
  // cue that the step is complete. Not on mount, only on the change.
  const canNextNow = canProceedToNextStep();
  const nextPulse = useAnimationControls();
  const prevCanNext = useRef(canNextNow);
  useEffect(() => {
    if (canNextNow && !prevCanNext.current) {
      nextPulse.start({ scale: [1, 1.045, 1], transition: { duration: 0.5, ease: 'easeOut' } });
    }
    prevCanNext.current = canNextNow;
  }, [canNextNow, nextPulse]);

  const getValidationMessage = () => {
    if (currentStep === LAST_COURSE_STEP && selectedItems.length === 0) {
      return t('menuBuilder.validation.atLeastOne');
    }
    return null;
  };

  const scrollToBuilder = useCallback(() => {
    // Wait for the new step to commit, then re-anchor.
    requestAnimationFrame(() => {
      // On mobile the flow scrolls its own container.
      if (mobileScrollRef.current) {
        mobileScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      // On desktop, anchor on the step tabs just under the fixed header — but
      // leave the page alone when they're already comfortably in view, so short
      // steps don't cause a pointless scroll.
      const rail = tabsRef.current ?? document.getElementById('menu-builder');
      if (!rail) return;
      const headerOffset = 140;
      const top = rail.getBoundingClientRect().top;
      if (top >= headerOffset - 8 && top <= window.innerHeight * 0.35) return;
      smoothScrollTo(rail, { offset: -headerOffset, duration: 0.9 });
    });
  }, []);

  const handleNextStep = useCallback(() => {
    if (canProceedToNextStep() && currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => (s + 1) as FlowStep);
      scrollToBuilder();
    }
    // handleNextStep captures canProceedToNextStep from its creating render, so
    // EVERY piece of state that gating reads must be a dep — otherwise the button
    // enables (disabled= reads fresh) but the click runs a stale check and no-ops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, scrollToBuilder, selectedEventType, selectedItems, guestCount, selectedDate, selectedLocation, locationUnknown, starterTemp, decoration]);

  const handlePrevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((s) => (s - 1) as FlowStep);
      scrollToBuilder();
    }
  }, [currentStep, scrollToBuilder]);

  // Advance to the next step regardless of the (just-set) validation — used by
  // the auto-advance selections below, where the new choice is always valid.
  const advanceStep = useCallback(() => {
    setCurrentStep((s) => (s < TOTAL_STEPS ? ((s + 1) as FlowStep) : s));
    scrollToBuilder();
  }, [scrollToBuilder]);

  // Auto-advance after a short confirmation pause — but only if the visitor is
  // still on the step the choice was made on (a quick manual "Volgende" in the
  // meantime must not advance twice). `stillValid` is re-checked when the pause
  // ends, so undoing the choice during it cancels the advance.
  const scheduleAdvance = useCallback((stillValid: () => boolean = () => true) => {
    const from = currentStepRef.current;
    window.setTimeout(() => {
      if (currentStepRef.current === from && stillValid()) advanceStepRef.current();
    }, AUTO_ADVANCE_MS);
  }, []);

  // Keep latest-value refs in sync for stable callbacks / event listeners.
  useEffect(() => {
    advanceStepRef.current = advanceStep;
  }, [advanceStep]);
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  // Browser Back steps the builder backward instead of leaving the site — on
  // desktop (inline) and mobile (full-screen) alike. We arm one guard history
  // entry once the builder is "engaged" (past step 1, or the mobile flow open)
  // and re-arm it after each step-back; at step 1, Back leaves / closes the flow.
  const guardArmedRef = useRef(false);
  const mobileOpenRef = useRef(false);
  useEffect(() => {
    mobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  useEffect(() => {
    const onPop = () => {
      if (currentStepRef.current > 1) {
        setCurrentStep((s) => (s > 1 ? ((s - 1) as FlowStep) : s));
        scrollToBuilder();
        history.pushState({ lilaGuard: true }, ''); // re-arm
      } else {
        guardArmedRef.current = false;
        if (mobileOpenRef.current) setMobileOpen(false);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [scrollToBuilder]);

  useEffect(() => {
    const engaged = mobileOpen || currentStep > 1;
    if (engaged && !guardArmedRef.current) {
      history.pushState({ lilaGuard: true }, '');
      guardArmedRef.current = true;
    }
  }, [mobileOpen, currentStep]);

  // Picking an event type or a date moves the flow forward automatically (the
  // short delay lets the selection state register). Users can always step back.
  const handleEventTypeSelect = useCallback((eventType: EventType) => {
    setSelectedEventType(eventType);
    scheduleAdvance();
  }, [scheduleAdvance]);

  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
    if (date) scheduleAdvance();
  }, [scheduleAdvance]);

  // Choosing hot/cold for the starter: drop any already-selected starters that
  // don't match the new temperature, then advance to the starter dishes.
  const handleStarterTempSelect = useCallback((temp: StarterTemp) => {
    setStarterTemp((prev) => {
      if (prev !== temp) {
        const allowed = STARTER_TEMP_SUBS[temp];
        setSelectedItems((items) =>
          items.filter((i) => i.category !== 'starter' || allowed.includes(i.subCategory as MenuSubCategory))
        );
      }
      return temp;
    });
    scheduleAdvance();
  }, [scheduleAdvance]);

  // Picking a venue moves the flow forward automatically, mirroring the event
  // type / date steps. Ticking "venue unknown" is an equally valid answer, so it
  // advances too — but only on check, never when the user unticks it.
  const handleLocationSelect = useCallback((loc: typeof selectedLocation) => {
    setSelectedLocation(loc);
    if (loc) scheduleAdvance();
  }, [scheduleAdvance]);

  const handleLocationUnknown = useCallback((unknown: boolean) => {
    setLocationUnknown(unknown);
    if (unknown) scheduleAdvance();
  }, [scheduleAdvance]);

  // Step labels for progress indicator — courses use their category name.
  const stepKeyForKind: Record<Exclude<StepKind, 'menu'>, string> = {
    event: 'event',
    date: 'date',
    time: 'time',
    location: 'location',
    guests: 'guests',
    starterTemp: 'starterTemp',
    service: 'extras',
    decor: 'decor',
    review: 'review',
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
  const serviceSummary = (() => {
    const parts = [
      `${t('menuBuilder.extras.coffeeName')}: ${coffeeLuxe ? t('menuBuilder.extras.luxeName') : t('menuBuilder.extras.standardName')}`,
      `${t('menuBuilder.extras.cookiesName')}: ${cookiesLuxe ? t('menuBuilder.extras.luxeName') : t('menuBuilder.extras.standardName')}`,
    ];
    tableExtras.forEach((id) => parts.push(t(`menuBuilder.extras.items.${id}`)));
    if (cookieBuffet) parts.push(t('menuBuilder.extras.cookieBuffetName'));
    parts.push(`${t('menuBuilder.extras.teaShowLabel')}: ${t(`menuBuilder.extras.teaShows.${teaShow}`)}`);
    return parts.join(' · ');
  })();

  // Human-readable timing line (only the parts the customer filled in).
  const timesSummary = (() => {
    const parts: string[] = [];
    if (eventStart) parts.push(`${t('menuBuilder.eventTime.startLabel')} ${eventStart}`);
    if (foodTime) parts.push(`${t('menuBuilder.eventTime.foodLabel')} ${foodTime}`);
    if (eventEnd) parts.push(`${t('menuBuilder.eventTime.endLabel')} ${eventEnd}`);
    return parts.join(' · ');
  })();

  // Chosen decoration collection (single selection), shown in the review/offerte
  // with its per-table price.
  const decorationLines = decoration
    ? [`${t(`menuBuilder.decoration.collections.${decoration}.name`)} (${decorationPriceLabel(decoration, t)})`]
    : [];

  // Compact text offerte used in booking emails / calendar invites.
  const offerteSummary = (() => {
    const eventName = selectedEventType ? t(`menuBuilder.eventType.types.${selectedEventType}.name`) : '';
    const dishes = selectedItems.map((i) => i.name).join(', ');
    return [
      `${eventName} · ${guestCount} ${t('menuBuilder.guestCount.guests')} (${womenCount} ${t('menuBuilder.guestCount.womenWord')} / ${menCount} ${t('menuBuilder.guestCount.menWord')}) · ${selectedDate}`,
      timesSummary ? `${t('menuBuilder.eventTime.title')}: ${timesSummary}` : '',
      dishes ? `Menu: ${dishes}` : '',
      serviceSummary,
      decorationLines.length
        ? `${t('menuBuilder.review.decorationLabel')}: ${decorationLines.join(', ')}`
        : '',
      `${t('menuBuilder.review.estimatedTotal')}: ${formatEuro(getTotalPrice())}`,
    ]
      .filter(Boolean)
      .join('\n');
  })();

  // Structured booking for the Signhost contract (menu grouped by course).
  const contractData = {
    menu: {
      hapjes: selectedItems.filter((i) => i.category === 'appetizer').map((i) => i.name),
      voorgerecht: selectedItems.filter((i) => i.category === 'starter').map((i) => i.name),
      hoofdgerecht: selectedItems.filter((i) => i.category === 'main').map((i) => i.name),
      nagerecht: selectedItems.filter((i) => i.category === 'dessert').map((i) => i.name),
    },
    decoration,
    venue: locationUnknown ? '' : selectedLocation?.label ?? '',
  };

  // ---- Step content (shared by desktop inline layout and mobile flow) -------
  const renderStepContent = () => (
    <>
      {/* Step 1: Event Type Selection */}
      {currentStep === 1 && (
        <motion.div key="step-1" {...stepMotion}>
          <div className="py-2 sm:py-6">
            <EventTypeSelector selectedEventType={selectedEventType} onEventTypeChange={handleEventTypeSelect} />
          </div>
        </motion.div>
      )}

      {/* Step: Starter temperature — warm of koud */}
      {currentDef.kind === 'starterTemp' && (
        <motion.div key="step-startertemp" {...stepMotion}>
          <div className="space-y-8 sm:space-y-12 py-2 sm:py-6">
            <div className="text-center">
              <StepTitle>{t('menuBuilder.starterTemp.title')}</StepTitle>
              <p className="mt-4 font-display text-[11px] sm:text-[13px] uppercase tracking-[0.28em] text-[#3d3630]">
                {t('menuBuilder.starterTemp.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto">
              {([
                { temp: 'hot' as StarterTemp, Icon: Soup, image: '/images/dishes/lila-hermitage-kippastilla.jpg' },
                { temp: 'cold' as StarterTemp, Icon: Snowflake, image: '/images/dishes/lila-luxe-saladismo.jpg' },
              ]).map(({ temp, Icon, image }) => {
                const isSelected = starterTemp === temp;
                return (
                  <motion.button
                    key={temp}
                    type="button"
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.995 }}
                    onClick={() => handleStarterTempSelect(temp)}
                    className={`group relative overflow-hidden bg-gradient-to-br from-[#fdfbf7] to-[#f6f1e8] text-left transition-[box-shadow,border-color] duration-500 ${
                      isSelected
                        ? 'border border-[#C19A5B] shadow-[0_22px_56px_-22px_rgba(120,90,40,0.5)]'
                        : 'border border-[#e7ddcb] shadow-[0_10px_30px_-18px_rgba(60,45,25,0.28)] hover:border-[#d6c39d] hover:shadow-[0_24px_58px_-24px_rgba(80,60,30,0.38)]'
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-[44%_1fr] sm:min-h-[320px]">
                      {/* Dish photo (warm = soup, cold = salad) */}
                      <div className="relative h-48 sm:h-full overflow-hidden bg-[#1a1a1a]">
                        <Image
                          src={image}
                          alt=""
                          aria-hidden="true"
                          fill
                          className="object-cover transition-transform duration-[1300ms] ease-out group-hover:scale-[1.05]"
                          sizes="(max-width: 1024px) 100vw, 24vw"
                          quality={82}
                        />
                      </div>

                      {/* Content panel */}
                      <div className="relative flex flex-col items-center justify-center text-center gap-3.5 p-6 sm:p-8">
                        <span className={`flex items-center justify-center w-16 h-16 rounded-full transition-colors ${isSelected ? 'bg-[#C19A5B] text-white' : 'bg-[#f0e7d4] text-[#a8824a] group-hover:text-[#1f1f1f]'}`}>
                          <Icon className="w-7 h-7" strokeWidth={1.75} />
                        </span>
                        <h4 className="text-2xl font-serif font-light tracking-[0.1em] text-[#1f1f1f] uppercase">
                          {t(`menuBuilder.starterTemp.${temp}.name`)}
                        </h4>
                        <span className={`h-px bg-gradient-to-r from-transparent via-[#C19A5B] to-transparent transition-all duration-500 ${isSelected ? 'w-16' : 'w-10 group-hover:w-16'}`} />
                        <p className="text-[13px] text-[#6c655b] leading-relaxed font-light max-w-[17rem]">
                          {t(`menuBuilder.starterTemp.${temp}.description`)}
                        </p>
                        <span className={`mt-2 inline-flex items-center justify-between gap-10 min-w-[190px] px-6 py-3 text-[11px] uppercase tracking-[0.24em] border transition-colors ${isSelected ? 'border-[#C19A5B] bg-[#C19A5B] text-[#1f1f1f]' : 'border-[#d6c39d] text-[#a8824a] group-hover:border-[#C19A5B] group-hover:text-[#1f1f1f]'}`}>
                          {t('menuBuilder.starterTemp.choose')}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Course steps: Hapjes / Voorgerechten / Hoofdgerechten / Desserts */}
      {currentDef.kind === 'menu' && activeMenuCategory && (
        <motion.div key={`menu-${activeMenuCategory}`} {...stepMotion}>
          <div>
            {/* Course title */}
            <div className="text-center space-y-4 mb-8 sm:mb-10">
              <StepTitle>{t(`menuBuilder.categories.${activeMenuCategory}`)}</StepTitle>
              {activeMenuCategory === 'appetizer' && (
                <div className="flex flex-col items-center gap-2.5 pt-1">
                  <p className="text-sm text-[#6c655b] font-light">
                    <span className="text-[#1f1f1f]">{t('menuBuilder.hapjes.choose')}</span>
                    {' — '}
                    <span className="text-[#a8824a]">{t('menuBuilder.hapjes.included')}</span>
                  </p>
                  <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-[3px] border border-[#C19A5B]/40 bg-[#C19A5B]/[0.07] text-[11px] uppercase tracking-[0.22em] text-[#a8824a]">
                    {/* one dot per included hapje, filling as they're picked */}
                    <span className="flex gap-1">
                      {Array.from({ length: APPETIZER_MAX }).map((_, i) => (
                        <span key={i} className="relative w-1.5 h-1.5 rounded-full border border-[#C19A5B]/60">
                          <motion.span
                            initial={false}
                            animate={{ scale: i < appetizerCount ? 1 : 0 }}
                            transition={{ type: 'spring', stiffness: 600, damping: 22 }}
                            className="absolute -inset-px rounded-full bg-[#9E7F57]"
                          />
                        </span>
                      ))}
                    </span>
                    {(() => {
                      const [before, after] = t('menuBuilder.hapjes.counter').split('{count}');
                      return (
                        <span className="inline-flex items-baseline">
                          {before}
                          <RollingNumber value={appetizerCount} />
                          {after}
                        </span>
                      );
                    })()}
                  </span>
                </div>
              )}
            </div>

            {/* Sub-Category Selector (hidden when there's only one option) */}
            {activeSubCategories.length > 1 && (
              <div className="mb-8 sm:mb-12">
                <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
                  <div className="flex sm:justify-center gap-2 sm:gap-4 min-w-max sm:min-w-0">
                    {activeSubCategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubCategory(selectedSubCategory === sub ? null : sub)}
                        className={`relative min-h-[40px] px-5 sm:px-5 py-2 text-[11px] uppercase tracking-[0.22em] whitespace-nowrap border transition-[color,border-color,transform] duration-300 active:scale-[0.97] ${
                          selectedSubCategory === sub
                            ? 'border-[#9E7F57] text-white'
                            : 'border-[#dcc8a4] bg-white/40 text-[#6c655b] hover:border-[#C19A5B] hover:text-[#1f1f1f]'
                        }`}
                      >
                        {/* the gold fill slides between filters */}
                        {selectedSubCategory === sub && (
                          <motion.span
                            layoutId="menu-subcategory-fill"
                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                            className="absolute -inset-px bg-[#9E7F57] shadow-[0_8px_20px_-10px_rgba(110,80,40,0.8)]"
                          />
                        )}
                        <span className="relative">{t(`menuBuilder.subCategories.${sub}`)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout="position"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT, delay: Math.min(index, 6) * 0.04 } }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
                    transition={{ layout: { duration: 0.4, ease: EASE_OUT } }}
                  >
                    <MenuCard
                      item={item}
                      isSelected={selectedIds.has(item.id)}
                      onSelect={handleSelectItem}
                      disabled={item.category === 'appetizer' && appetizerCount >= APPETIZER_MAX}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <p className="mt-8 text-center text-[10px] tracking-[0.12em] text-[#a89e8d] font-light italic">
              {t('menuBuilder.imageDisclaimer')}
            </p>
          </div>
        </motion.div>
      )}

      {/* Step: Guest Count */}
      {currentDef.kind === 'guests' && (
        <motion.div key="step-3" {...stepMotion}>
          <div className="py-2 sm:py-6">
            <GuestCountSelector
              guestCount={guestCount}
              onGuestCountChange={handleGuestPreset}
              women={womenCount}
              men={menCount}
              onWomenChange={handleWomenChange}
              onMenChange={handleMenChange}
            />
          </div>
        </motion.div>
      )}

      {/* Step: Service (included + luxe upgrades) */}
      {currentDef.kind === 'service' && (
        <motion.div key="step-4" {...stepMotion}>
          <div className="py-2 sm:py-6">
            <ServiceSelector
              coffeeLuxe={coffeeLuxe}
              cookiesLuxe={cookiesLuxe}
              onCoffeeLuxeToggle={setCoffeeLuxe}
              onCookiesLuxeToggle={setCookiesLuxe}
              tableExtras={tableExtras}
              onToggleTableExtra={(id) =>
                setTableExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
              }
              cookieBuffet={cookieBuffet}
              onCookieBuffetToggle={setCookieBuffet}
              teaShow={teaShow}
              onTeaShowChange={setTeaShow}
            />
          </div>
        </motion.div>
      )}

      {/* Step: Decoration */}
      {currentDef.kind === 'decor' && (
        <motion.div key="step-5" {...stepMotion}>
          <div className="py-2 sm:py-6">
            <DecorationSelector selection={decoration} onSelect={selectDecoration} />
          </div>
        </motion.div>
      )}

      {/* Step: Date */}
      {currentDef.kind === 'date' && (
        <motion.div key="step-date" {...stepMotion}>
          <div className="py-2 sm:py-6">
            <DatePickerSelector selectedDate={selectedDate} onDateChange={handleDateSelect} />
          </div>
        </motion.div>
      )}

      {/* Step: Event timing — start / food served / end */}
      {currentDef.kind === 'time' && (
        <motion.div key="step-time" {...stepMotion}>
          <div className="py-2 sm:py-6">
            <EventTimeSelector
              eventStart={eventStart}
              eventEnd={eventEnd}
              foodTime={foodTime}
              onEventStartChange={setEventStart}
              onEventEndChange={setEventEnd}
              onFoodTimeChange={setFoodTime}
            />
          </div>
        </motion.div>
      )}

      {/* Step: Location (venue → transport cost) */}
      {currentDef.kind === 'location' && (
        <motion.div key="step-location" {...stepMotion}>
          <div className="py-2 sm:py-6">
            <LocationSelector
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationSelect}
              unknown={locationUnknown}
              onUnknownChange={handleLocationUnknown}
            />
          </div>
        </motion.div>
      )}

      {/* Step: Review (summary + PDF + scheduling) */}
      {currentDef.kind === 'review' && (
        <motion.div key="step-review" {...stepMotion}>
          <div className="py-2 sm:py-6">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
                  <div className="text-center space-y-4">
                    <StepTitle>{t('menuBuilder.review.title')}</StepTitle>
                  </div>

                  {/* Summary Card */}
                  <div className="relative overflow-hidden border border-[#dfd2ba] p-4 sm:p-8 text-left space-y-4 sm:space-y-6 bg-gradient-to-br from-[#fdfbf7] to-[#f6f1e8] rounded-[3px] shadow-[0_20px_52px_-24px_rgba(80,60,30,0.36)]">
                    <DecorStar className="pointer-events-none absolute -top-7 -right-7 w-32 h-32 text-[#C19A5B]/[0.05]" />

                    {/* Event + date + guests */}
                    <div className="grid grid-cols-2 gap-4 border-b border-[#e6ddd0] pb-3 sm:pb-4">
                      <div>
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8a8275] mb-1">{t('menuBuilder.review.eventLabel')}</p>
                        <p className="text-sm text-[#1f1f1f] font-medium">{selectedEventType ? t(`menuBuilder.eventType.types.${selectedEventType}.name`) : ''}</p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8a8275] mb-1">{t('menuBuilder.review.guestsLabel')}</p>
                        <p className="text-sm text-[#1f1f1f] font-medium">{guestCount} <span className="text-[#8a8275] font-normal">({womenCount} {t('menuBuilder.guestCount.womenWord')} / {menCount} {t('menuBuilder.guestCount.menWord')})</span></p>
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
                        <p className="text-xs sm:text-sm text-[#1f1f1f]">{decorationLines.length ? decorationLines.join(', ') : t('menuBuilder.decoration.noneSelected')}</p>
                      </div>
                    </div>

                    {/* Location & transport */}
                    <div className="grid sm:grid-cols-2 gap-4 border-b border-[#e6ddd0] pb-3 sm:pb-4">
                      <div>
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8a8275] mb-1">{t('menuBuilder.review.locationLabel')}</p>
                        <p className="text-xs sm:text-sm text-[#1f1f1f]">
                          {locationUnknown
                            ? t('menuBuilder.location.unknownShort')
                            : selectedLocation
                            ? selectedLocation.label
                            : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8a8275] mb-1">{t('menuBuilder.review.transportLabel')}</p>
                        <p className="text-xs sm:text-sm text-[#1f1f1f]">
                          {locationUnknown ? t('menuBuilder.location.onRequest') : formatEuro(transportFee)}
                        </p>
                      </div>
                    </div>

                    {/* Pricing breakdown */}
                    <div className="space-y-1.5 sm:space-y-2">
                      {!locationUnknown && transportFee > 0 && (
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#8a8275]">{t('menuBuilder.review.transportLabel')}</p>
                          <p className="text-sm text-[#1f1f1f]">{formatEuro(transportFee)}</p>
                        </div>
                      )}
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

                  {/* Reserve (deposit) or schedule an office appointment */}
                  <BookingActions
                    totalPrice={getTotalPrice()}
                    eventDate={selectedDate}
                    eventType={selectedEventType ? t(`menuBuilder.eventType.types.${selectedEventType}.name`) : ''}
                    guestCount={guestCount}
                    eventStart={eventStart}
                    eventEnd={eventEnd}
                    foodTime={foodTime}
                    offerteSummary={offerteSummary}
                    contractData={contractData}
                    paid={paidReturn ? { status: paidInfo?.status, deposit: paidInfo?.deposit } : null}
                  />
                </div>
              </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );

  // ---- Navigation buttons (shared) ------------------------------------------
  const renderNav = () => {
    const canNext = canProceedToNextStep();
    return (
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className="group flex items-center gap-3 py-3 font-display text-[13px] uppercase tracking-[0.3em] text-[#8a6a45] transition-[opacity,color,transform] duration-200 enabled:active:scale-[0.97] disabled:opacity-40 disabled:cursor-default enabled:hover:text-[#5e4529]"
        >
          <svg className="w-[18px] h-[10px] transition-transform duration-300 group-enabled:group-hover:-translate-x-1" viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M17 5H1M5 1 1 5l4 4" /></svg>
          {t('menuBuilder.buttons.previous').replace(/^←\s*/, '')}
        </button>

        {currentStep < TOTAL_STEPS && (
          <motion.button
            type="button"
            animate={nextPulse}
            whileTap={canNext ? { scale: 0.97 } : undefined}
            onClick={handleNextStep}
            disabled={!canNext}
            style={{ backgroundColor: GOLD }}
            onMouseEnter={(e) => canNext && (e.currentTarget.style.backgroundColor = GOLD_DEEP)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = GOLD)}
            className="group flex h-[50px] min-w-[213px] items-center justify-center gap-3 rounded-[2px] px-8 font-display text-[13px] uppercase tracking-[0.3em] text-white shadow-[0_14px_30px_-18px_rgba(90,65,35,0.7)] transition-[background-color,opacity,transform,box-shadow] duration-300 enabled:hover:shadow-[0_18px_34px_-18px_rgba(90,65,35,0.8)] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {NEXT_LABEL[lang]}
            <svg className="w-[18px] h-[10px] transition-transform duration-300 group-enabled:group-hover:translate-x-1" viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M1 5h16M13 1l4 4-4 4" /></svg>
          </motion.button>
        )}
      </div>
    );
  };

  // Live total is meaningful once we're into menu/service/decor (after guests),
  // not on the event, date, or final review screens.
  const showLiveTotal = ['location', 'guests', 'menu', 'service', 'decor'].includes(currentDef.kind);

  return (
    // reducedMotion="user": visitors who ask the OS for less motion get instant
    // state changes instead of slides and springs.
    <MotionConfig reducedMotion="user">
    <section id="menu-builder" className="relative isolate overflow-x-clip pt-16 pb-16 sm:pt-24 sm:pb-24 bg-gradient-to-b from-[#f6ece2] via-[#f5ede5] to-[#f2e9e0] text-[#1f1a17]">
      {/* Atmosphere: a carved Moorish arch framing each edge, the left one
          mirrored (its pillar continues down long steps). The arches start
          at the top of the section and fade in, so they belong to the menu
          builder rather than to Testimonials above. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-0 -z-10" aria-hidden="true">
        <CarvedArch side="right" />
        <CarvedArch side="left" />
        {/* hand the colour over to the Galerij section below */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-[#ebe6dc]" />
      </div>

      {/* On desktop the content narrows to the space between the two arches
          (each arch strip is clamp(90px, …, 280px) wide), with a gutter. */}
      <div
        className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-4"
        style={isDesktop ? { maxWidth: 'min(1180px, calc(100vw - 2 * clamp(90px, calc((100vw - 1248px) / 2 + 30px), 280px) - 72px))' } : undefined}
      >
        {/* Header */}
        <div className="text-center">
          <p className="font-display font-normal text-[11px] sm:text-[14px] uppercase tracking-[0.36em] text-[#4a4038]">{t('menuBuilder.kicker')}</p>
          <DiamondDivider className="mt-4" />
          <h2 className="mt-3 font-display text-[36px] sm:text-[48px] lg:text-[52px] leading-[1.1] font-normal text-[#1f1a17] tracking-[0]">{t('menuBuilder.title')}</h2>
          <p className="mt-4 font-display font-normal tracking-[0] text-[15px] sm:text-[17px] leading-relaxed text-[#2b2622] max-w-[860px] mx-auto px-2">{t('menuBuilder.description')}</p>
        </div>

        {isDesktop ? (
          /* ============ DESKTOP: inline layout ============ */
          <>
            {/* Step tabs — text tabs on a hairline, gold underline on the active
                one. Scrolls sideways when the steps don't fit. */}
            <div className="mt-10 border-b border-[#e3d8cb]">
              <div ref={tabsRef} className="overflow-x-auto scrollbar-hide [mask-image:linear-gradient(to_right,#000_92%,transparent)]">
                <div className="flex min-w-full w-max justify-between">
                  {stepLabels.map((s) => {
                    const isActive = s.step === currentStep;
                    const isDone = s.step < currentStep;
                    return (
                      <button
                        key={s.step}
                        data-active={isActive || undefined}
                        onClick={() => isDone && setCurrentStep(s.step as FlowStep)}
                        disabled={!isDone && !isActive}
                        className={`group/tab relative shrink-0 px-[30px] pt-2 pb-[18px] font-display text-[14px] uppercase tracking-[0.1em] whitespace-nowrap transition-colors duration-300 ${
                          isActive
                            ? 'font-semibold text-[#1f1a17]'
                            : isDone
                            ? 'text-[#4a4038] hover:text-[#1f1a17] cursor-pointer'
                            : 'text-[#4a4038]/80 cursor-default'
                        }`}
                      >
                        {s.label}
                        {isDone && (
                          <span className="absolute inset-x-[30px] -bottom-px h-px origin-left scale-x-0 bg-[#b98a4f]/60 transition-transform duration-300 ease-out group-hover/tab:scale-x-100" />
                        )}
                        {isActive && (
                          <motion.span
                            layoutId="menu-builder-tab"
                            className="absolute inset-x-0 -bottom-px h-[2px] bg-[#b98a4f]"
                            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="min-h-[400px] mt-[14px] space-y-12">{renderStepContent()}</div>

            {/* Desktop bottom nav */}
            <div className="mt-10">
              {getValidationMessage() && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-5 text-center">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#C19A5B] bg-[#C19A5B]/10 px-4 py-2 rounded-lg inline-block">{getValidationMessage()}</p>
                </motion.div>
              )}
              {showLiveTotal && (
                <div className="text-center mb-4">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-[#8a8275]">
                    {t('menuBuilder.review.startingFrom')} <span className="text-[#1f1f1f] font-medium"><AnimatedTotal value={getTotalPrice()} format={formatTotalCompact} /></span>
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
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#a8824a] mb-5">{stepLabels[0].label} → {stepLabels[stepLabels.length - 1].label}</p>
                <button
                  onClick={() => setMobileOpen(true)}
                  className="w-full min-h-[54px] flex items-center justify-center gap-2 text-xs uppercase tracking-[0.22em] font-medium text-white bg-[#9E7F57] active:bg-[#8B6E49] rounded-[2px] shadow-[0_14px_30px_-18px_rgba(90,65,35,0.7)] active:scale-[0.98] transition-transform"
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
                          <p className="text-base font-serif text-[#1f1f1f] truncate"><AnimatedTotal value={getTotalPrice()} format={formatTotalCompact} /></p>
                        </div>
                      )}

                      {currentStep < TOTAL_STEPS ? (
                        <button
                          onClick={handleNextStep}
                          disabled={!canProceedToNextStep()}
                          className={`shrink-0 min-h-[52px] px-7 rounded-sm border text-xs uppercase tracking-[0.18em] font-medium flex items-center gap-2 transition-colors ${
                            canProceedToNextStep() ? 'text-white bg-[#9E7F57] border-[#9E7F57] active:bg-[#8B6E49]' : 'text-[#c1b8ab] border-[#e6ddd0] bg-[#f0ebe3]'
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
    </MotionConfig>
  );
}
