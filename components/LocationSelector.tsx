'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, X, Loader2, Check, ChevronRight, Info } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { searchPlaces, resolvePlace, Prediction, PlaceResult, BASE_COORD } from '@/lib/geocode';
import { getTransportCost, formatEuro } from '@/lib/pricing';
import { StepHeader } from './MenuDecor';

// Recommended partner venues — shown as cards under the search bar (name +
// location only). No service cost is shown or charged for these; that's arranged
// separately. Service costs only apply to venues the customer searches for.
const PARTNER_VENUES: { name: string; city: string; address: string }[] = [
  { name: 'Rey Events', city: 'Almere', address: 'Trekweg 21, 1338 GA Almere' },
  { name: 'Simplicity Zalenverhuur', city: 'Rijen', address: 'Rijksweg 112, 5121 RC Rijen' },
  { name: 'Noor Paleis', city: 'Almere', address: 'Markerkant 10 136d, 1316 AL Almere' },
  { name: 'de Koning', city: 'Amsterdam', address: 'Isolatorweg 29, 1014 AS Amsterdam' },
];

/** Build a PlaceResult for a recommended partner venue (no transport cost). */
function partnerToPlace(name: string, city: string): PlaceResult {
  return {
    label: `${name} · ${city}`,
    city,
    lat: BASE_COORD.lat,
    lon: BASE_COORD.lon,
    isAmsterdam: city.toLowerCase() === 'amsterdam',
    distanceKm: 0,
    isPartner: true,
  };
}

interface LocationSelectorProps {
  selectedLocation: PlaceResult | null;
  onLocationChange: (loc: PlaceResult | null) => void;
  unknown: boolean;
  onUnknownChange: (v: boolean) => void;
}

function LocationSelector({ selectedLocation, onLocationChange, unknown, onUnknownChange }: LocationSelectorProps) {
  const { t } = useLanguage();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Debounced autocomplete search.
  useEffect(() => {
    if (selectedLocation || unknown) return;
    const q = query.trim();
    if (q.length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const r = await searchPlaces(q, ctrl.signal);
        setResults(r);
        setOpen(true);
      } catch {
        /* aborted or network error */
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(id);
      ctrl.abort();
    };
  }, [query, selectedLocation, unknown]);

  // Close the dropdown on outside click.
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const pick = async (pred: Prediction) => {
    setOpen(false);
    setResolving(true);
    try {
      const loc = await resolvePlace(pred);
      if (loc) onLocationChange(loc);
    } catch {
      /* ignore — user can retry */
    } finally {
      setResolving(false);
      setResults([]);
      setQuery('');
    }
  };

  const clearSelection = () => {
    onLocationChange(null);
    setQuery('');
    setResults([]);
  };

  const transportFor = (loc: PlaceResult) => getTransportCost(loc);

  return (
    <div className="space-y-10">
      <StepHeader title={t('menuBuilder.location.title')} subtitle={t('menuBuilder.location.subtitle')} />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Selected location card */}
        {selectedLocation && !unknown ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden border border-[#C19A5B] bg-gradient-to-br from-[#fdfbf7] to-[#f5efe3] p-5 sm:p-6 shadow-[0_16px_44px_-22px_rgba(80,60,30,0.34)]"
          >
            <div className="relative flex items-start gap-3">
              <motion.span
                initial={{ scale: 0.4, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 480, damping: 22, delay: 0.08 }}
                className="mt-0.5 flex items-center justify-center w-8 h-8 rounded-full bg-[#9E7F57] text-white shrink-0"
              >
                <Check className="w-4 h-4" strokeWidth={3} />
              </motion.span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#a8824a] mb-1">{t('menuBuilder.location.selectedLabel')}</p>
                <p className="text-sm text-[#1f1f1f] font-medium leading-snug">{selectedLocation.label}</p>
                {!selectedLocation.isPartner && (
                  <p className="mt-3 pt-3 border-t border-[#e7ddcb] text-[11px] uppercase tracking-[0.18em] text-[#6c655b]">
                    {t('menuBuilder.location.transport')}{' '}
                    <span className="text-[#a8824a]">{formatEuro(transportFor(selectedLocation))}</span>
                    {!selectedLocation.isAmsterdam && (
                      <span className="text-[#9a8a6a] normal-case tracking-normal"> · ~{selectedLocation.distanceKm} km</span>
                    )}
                  </p>
                )}
              </div>
              <button onClick={clearSelection} aria-label="change" className="p-1 -m-1 rounded-full text-[#a39e94] hover:text-[#1f1f1f] hover:bg-[#1f1f1f]/5 hover:rotate-90 active:scale-90 transition-[color,background-color,transform] duration-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* Search input */
          <div ref={boxRef} className={`relative ${unknown ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="relative flex items-center gap-3.5 bg-white border border-[#e2d8c5] focus-within:border-[#C19A5B] focus-within:ring-2 focus-within:ring-[#C19A5B]/15 px-6 py-4 shadow-[0_12px_34px_-22px_rgba(60,45,25,0.35)] transition-all duration-300">
              <Search className="w-5 h-5 shrink-0 text-[#C19A5B]" strokeWidth={1.75} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length && setOpen(true)}
                placeholder={t('menuBuilder.location.placeholder')}
                className="flex-1 min-w-0 bg-transparent text-base text-[#1f1f1f] outline-none placeholder:text-[#b3a892]"
              />
              {(loading || resolving) && <Loader2 className="w-4 h-4 text-[#C19A5B] animate-spin shrink-0" />}
            </div>

            <AnimatePresence>
              {open && (results.length > 0 || (!loading && query.trim().length >= 3)) && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute z-30 mt-2 w-full bg-white border border-[#e3d7c1] shadow-[0_24px_50px_-20px_rgba(80,60,30,0.4)] overflow-hidden"
                >
                  {results.map((r, i) => (
                    <motion.li
                      key={`${r.placeId}-${i}`}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: Math.min(i, 5) * 0.035 }}
                    >
                      <button
                        onClick={() => pick(r)}
                        className="group w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-[#f6f1e8] active:bg-[#efe5d2] transition-colors border-b border-[#f0e9da] last:border-0"
                      >
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#C19A5B] transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={1.75} />
                        <span className="flex-1 min-w-0 text-sm text-[#1f1f1f] leading-snug">{r.label}</span>
                      </button>
                    </motion.li>
                  ))}
                  {results.length === 0 && !loading && (
                    <li className="px-4 py-3 text-xs text-[#8a8275]">{t('menuBuilder.location.noResults')}</li>
                  )}
                </motion.ul>
              )}
            </AnimatePresence>

            {/* Suggested partner venues — text cards: name, address, chevron */}
            <div className="mt-10">
              <div className="flex flex-col items-center mb-7">
                <div className="flex w-full items-center gap-5 sm:gap-8">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C19A5B]/70" />
                  <span className="text-[12px] sm:text-[13px] uppercase tracking-[0.34em] text-[#2b2622] whitespace-nowrap">
                    {t('menuBuilder.location.suggestedLabel')}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C19A5B]/70" />
                </div>
                <span className="mt-2 h-2 w-2 rotate-45 bg-[#B4884A]" aria-hidden="true" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-7 sm:gap-y-5">
                {PARTNER_VENUES.map(({ name, city, address }, i) => (
                  <motion.button
                    key={name}
                    type="button"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.05 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    // framer owns transform here, so the hover lift lives in whileHover
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onLocationChange(partnerToPlace(name, city))}
                    className="group flex items-center gap-5 rounded-[10px] border border-[#e5d8c6] bg-[#fbf8f3] px-6 py-5 sm:px-8 sm:py-6 text-left shadow-[0_10px_26px_-22px_rgba(80,60,30,0.45)] transition-[border-color,background-color,box-shadow] duration-300 hover:border-[#C19A5B] hover:bg-[#fdfaf5] hover:shadow-[0_18px_34px_-22px_rgba(80,60,30,0.5)]"
                  >
                    <span className="flex-1 min-w-0">
                      <span className="block font-display text-[21px] sm:text-[24px] leading-tight text-[#1f1a17]">{name}</span>
                      <span className="block mt-1.5 text-[13px] sm:text-[14px] tracking-[0.02em] text-[#6b6359]">{address}</span>
                    </span>
                    <ChevronRight
                      className="w-6 h-6 text-[#B4884A] shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={1.75}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom row: no-location checkbox + external-venue note */}
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-0 border-t border-[#e7ddcb] pt-8">
          <label className="flex items-start gap-4 cursor-pointer select-none sm:pr-10">
            <motion.span
              animate={{ scale: unknown ? [1, 0.85, 1] : 1 }}
              transition={{ duration: 0.28 }}
              className={`mt-0.5 flex items-center justify-center w-[22px] h-[22px] rounded-[3px] border-[1.5px] transition-colors duration-200 ${
                unknown ? 'bg-[#9E7F57] border-[#9E7F57] text-white' : 'border-[#C9A46A] bg-[#fbf8f3] text-transparent'
              }`}
            >
              <AnimatePresence initial={false}>
                {unknown && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0, transition: { duration: 0.12 } }}
                    transition={{ type: 'spring', stiffness: 600, damping: 24 }}
                    className="flex"
                  >
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.span>
            <input
              type="checkbox"
              checked={unknown}
              onChange={(e) => {
                onUnknownChange(e.target.checked);
                if (e.target.checked) clearSelection();
              }}
              className="sr-only"
            />
            <span>
              <span className="block font-display text-[19px] sm:text-[21px] text-[#1f1a17] leading-snug">{t('menuBuilder.location.unknownCheckbox')}</span>
              <span className="block mt-1.5 text-[13px] sm:text-[14px] tracking-[0.02em] text-[#6b6359] leading-relaxed">{t('menuBuilder.location.unknownHelp')}</span>
            </span>
          </label>

          <div className="flex items-start gap-4 sm:border-l sm:border-[#C19A5B]/60 sm:pl-10">
            <Info className="w-7 h-7 shrink-0 text-[#B4884A]" strokeWidth={1.4} />
            <span>
              <span className="block text-[12px] uppercase tracking-[0.3em] text-[#B4884A]">{t('menuBuilder.location.noteLabel')}</span>
              <span className="block mt-1.5 text-[13px] sm:text-[14px] text-[#6b6359] leading-relaxed">{t('menuBuilder.location.noteText')}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(LocationSelector);
