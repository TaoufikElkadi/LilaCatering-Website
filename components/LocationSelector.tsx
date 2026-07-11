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

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Selected location card */}
        {selectedLocation && !unknown ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden border border-[#C19A5B] bg-gradient-to-br from-[#fdfbf7] to-[#f5efe3] p-5 sm:p-6 shadow-[0_16px_44px_-22px_rgba(80,60,30,0.34)]"
          >
            <div className="relative flex items-start gap-3">
              <span className="mt-0.5 flex items-center justify-center w-8 h-8 rounded-full bg-[#C19A5B] text-white shrink-0">
                <Check className="w-4 h-4" strokeWidth={3} />
              </span>
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
              <button onClick={clearSelection} aria-label="change" className="text-[#a39e94] hover:text-[#1f1f1f] transition-colors">
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
                    <li key={`${r.placeId}-${i}`}>
                      <button
                        onClick={() => pick(r)}
                        className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-[#f6f1e8] transition-colors border-b border-[#f0e9da] last:border-0"
                      >
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#C19A5B]" strokeWidth={1.75} />
                        <span className="flex-1 min-w-0 text-sm text-[#1f1f1f] leading-snug">{r.label}</span>
                      </button>
                    </li>
                  ))}
                  {results.length === 0 && !loading && (
                    <li className="px-4 py-3 text-xs text-[#8a8275]">{t('menuBuilder.location.noResults')}</li>
                  )}
                </motion.ul>
              )}
            </AnimatePresence>

            {/* Suggested partner venues */}
            <div className="mt-8">
              <div className="flex items-center gap-4 mb-5">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C19A5B]/40" />
                <span className="text-[11px] uppercase tracking-[0.28em] text-[#a8824a] whitespace-nowrap">
                  {t('menuBuilder.location.suggestedLabel')}
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C19A5B]/40" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PARTNER_VENUES.map(({ name, city, address }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => onLocationChange(partnerToPlace(name, city))}
                    className="group flex items-center gap-4 border border-[#e2d8c5] bg-[#faf6ee] px-5 py-4 text-left transition-colors duration-300 hover:border-[#C19A5B] hover:bg-[#f6efe1]"
                  >
                    <span className="flex items-center justify-center w-11 h-11 rounded-full bg-[#f0e7d4] text-[#C19A5B] shrink-0">
                      <MapPin className="w-5 h-5" strokeWidth={1.75} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-base font-serif text-[#1f1f1f] leading-snug">{name}</span>
                      <span className="block text-[12px] text-[#8a8275] mt-0.5">{address}</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#b39256] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom row: no-location checkbox + external-venue note */}
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-10 border-t border-[#e7ddcb] pt-7">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <span
              className={`mt-0.5 flex items-center justify-center w-5 h-5 border transition-colors duration-200 ${
                unknown ? 'bg-[#C19A5B] border-[#C19A5B] text-white' : 'border-[#c9b78f] bg-white text-transparent'
              }`}
            >
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
            </span>
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
              <span className="block text-base font-serif text-[#1f1f1f] leading-snug">{t('menuBuilder.location.unknownCheckbox')}</span>
              <span className="block mt-1 text-[12px] text-[#9a8a6a] font-light leading-relaxed">{t('menuBuilder.location.unknownHelp')}</span>
            </span>
          </label>

          <div className="flex items-start gap-3 sm:border-l sm:border-[#e7ddcb] sm:pl-10">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f0e7d4] text-[#C19A5B] shrink-0">
              <Info className="w-[18px] h-[18px]" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block text-[11px] uppercase tracking-[0.24em] text-[#a8824a]">{t('menuBuilder.location.noteLabel')}</span>
              <span className="block mt-1 text-[12px] text-[#9a8a6a] font-light leading-relaxed">{t('menuBuilder.location.noteText')}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(LocationSelector);
