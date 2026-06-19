'use client';

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuItem } from '@/data/menuData';
import Image from 'next/image';
import DietaryIcons from './DietaryIcons';
import { ChevronDown, ChevronUp, AlertCircle, Users, Info, Leaf, Plus, Check } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { formatEuro } from '@/lib/pricing';

// Shared warm beige/cream blur-up placeholder (tiny 10px JPEG) for smooth loading.
const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwChARN//9k=';

// Eight-pointed Moroccan star — a small ornamental seal.
const StarSeal = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 1.6l2.47 4.2 4.73-1.27-1.27 4.73 4.2 2.47-4.2 2.47 1.27 4.73-4.73-1.27L12 22.4l-2.47-4.2-4.73 1.27 1.27-4.73L1.6 12l4.2-2.47L4.53 4.8l4.73 1.27L12 1.6z" />
  </svg>
);

const SELECT_LABELS = {
  select: { en: 'Add to menu', nl: 'Toevoegen', fr: 'Ajouter' },
  selected: { en: 'Added', nl: 'Toegevoegd', fr: 'Ajouté' },
} as const;

interface MenuCardProps {
  item: MenuItem;
  isSelected: boolean;
  onSelect: (item: MenuItem) => void;
  /** When true and not selected, the card is locked (e.g. appetizer cap reached). */
  disabled?: boolean;
}

const MenuCard = memo(function MenuCard({ item, isSelected, onSelect, disabled = false }: MenuCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t, lang } = useLanguage();

  // Price display derived from the pricing shape.
  const priceDisplay = item.included
    ? t('menuCard.included')
    : item.flatFee
    ? formatEuro(item.surcharge)
    : `+${formatEuro(item.surcharge)}`;

  const selectLabel = isSelected ? SELECT_LABELS.selected[lang] : SELECT_LABELS.select[lang];

  // Appetizers (Hapjes) keep the side-by-side info | image layout; everything else stacks.
  const horizontal = item.category === 'appetizer';

  // Locked = cap reached and this card isn't one of the chosen ones.
  const locked = disabled && !isSelected;

  return (
    <motion.div
      onClick={() => {
        if (!locked) onSelect(item);
      }}
      whileHover={locked ? undefined : { y: -6 }}
      whileTap={locked ? undefined : { scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      aria-disabled={locked}
      className={`relative h-full group transition-opacity duration-300 ${
        locked ? 'cursor-not-allowed opacity-45' : 'cursor-pointer'
      }`}
    >
      {/* Main Card Container — sharp corners, framed ivory */}
      <div
        className={`relative h-full flex flex-col overflow-hidden bg-gradient-to-br from-[#fdfbf7] to-[#f6f1e8] transition-[box-shadow,border-color] duration-500 ${
          isSelected
            ? 'shadow-[0_22px_60px_-22px_rgba(120,90,40,0.55)] border border-[#C19A5B]'
            : 'shadow-[0_10px_34px_-18px_rgba(60,45,25,0.30)] border border-[#e7ddcb] group-hover:shadow-[0_26px_64px_-24px_rgba(80,60,30,0.40)] group-hover:border-[#d6c39d]'
        }`}
      >
        {/* Inset gold hairline frame — sits over the photo as a thin border */}
        <div
          className={`pointer-events-none absolute inset-[6px] z-20 border transition-opacity duration-500 ${
            isSelected
              ? 'border-[#C19A5B]/55 opacity-100'
              : 'border-[#C19A5B]/0 opacity-0 group-hover:border-[#C19A5B]/30 group-hover:opacity-100'
          }`}
        />

        {/* Layout wrapper: stacked by default, info | image (desktop) for appetizers */}
        <div className={horizontal ? 'flex flex-1 flex-col sm:grid sm:grid-cols-[1fr_42%] sm:min-h-[230px]' : 'flex flex-1 flex-col'}>

        {/* Image — clean (no gradient over the dish) */}
        <div className={horizontal ? 'relative h-56 sm:h-full sm:order-2 overflow-hidden' : 'relative aspect-[4/3] w-full overflow-hidden'}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-[1300ms] ease-out group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
            quality={82}
            loading="lazy"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />

          {/* Price chip (solid, legible without any scrim) */}
          <div className="absolute top-3.5 left-3.5 z-10">
            {item.included ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[#3a2e1c] bg-[#f6ecd6] border border-[#C19A5B]/50 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.25)]">
                <StarSeal className="w-2.5 h-2.5 text-[#C19A5B]" />
                {priceDisplay}
              </span>
            ) : (
              <span className="inline-flex items-center px-3.5 py-1.5 text-sm font-serif tracking-wide text-[#1f1f1f] bg-[#C19A5B] shadow-[0_3px_12px_-3px_rgba(0,0,0,0.5)]">
                {priceDisplay}
              </span>
            )}
          </div>

          {/* Selection seal */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ scale: 0, rotate: -40, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                className="absolute top-3.5 right-3.5 z-30"
              >
                <span className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11">
                  <StarSeal className="absolute inset-0 w-full h-full text-[#C19A5B] drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]" />
                  <Check className="relative w-4 h-4 sm:w-[18px] sm:h-[18px] text-white" strokeWidth={3} />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Content */}
        <div className={`relative flex flex-1 flex-col p-5 sm:p-6 ${horizontal ? 'sm:order-1' : ''}`}>
          {/* Name + tiny kicker */}
          <div className="relative space-y-2">
            <span className="block text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#b39256]">
              {t(`menuBuilder.subCategories.${item.subCategory}`) || t(`menuBuilder.categories.${item.category}`)}
            </span>
            <h3 className="text-lg sm:text-xl lg:text-[1.4rem] font-serif uppercase tracking-[0.06em] sm:tracking-[0.08em] text-[#1f1f1f] leading-[1.15]">
              {item.name}
            </h3>
            {/* gold hairline that grows on hover */}
            <div
              className={`h-px bg-gradient-to-r from-[#C19A5B] to-transparent transition-all duration-500 ${
                isSelected ? 'w-20' : 'w-10 group-hover:w-20'
              }`}
            />
          </div>

          {/* Description + dietary — flow directly under the name */}
          <div className="space-y-3.5 mt-3.5">
            {item.description && (
              <p className="text-xs sm:text-[13px] text-[#6c655b] leading-relaxed font-light line-clamp-2">
                {item.description}
              </p>
            )}
            <div className="flex items-center gap-2">
              <DietaryIcons subCategory={item.subCategory} dietaryTags={item.dietaryTags} size="sm" />
            </div>
          </div>

          {/* Bottom Section — pinned to the card base for even alignment */}
          <div className="mt-auto pt-5">
            {/* Actions row */}
            <div className="flex items-center justify-between gap-3">
                {/* Add / Added pill */}
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] border transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#1f1f1f] text-white border-[#1f1f1f]'
                      : 'text-[#6c655b] border-[#d6c39d] group-hover:border-[#C19A5B] group-hover:text-[#1f1f1f]'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 text-[#C19A5B]" strokeWidth={3} /> : <Plus className="w-3.5 h-3.5" />}
                  {selectLabel}
                </span>

                {/* Details link */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className={`flex items-center gap-1 whitespace-nowrap text-[10px] sm:text-[11px] uppercase tracking-[0.14em] transition-colors ${
                    isExpanded ? 'text-[#C19A5B]' : 'text-[#a39e94] hover:text-[#C19A5B]'
                  }`}
                >
                  {isExpanded ? t('menuCard.hideDetails') : t('menuCard.viewDetails')}
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Details Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-[#e7ddcb]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 sm:p-8 lg:p-9 bg-[#fbf7ef]/70 space-y-5 sm:space-y-6">
                {/* Cultural Authenticity */}
                {item.culturalInfo && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#C19A5B]">
                      <Info className="w-4 h-4" />
                      <h4 className="text-xs uppercase tracking-[0.2em] font-medium">
                        {t('menuCard.culturalAuthenticity')}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4a4742] leading-relaxed font-light">
                      {item.culturalInfo}
                    </p>
                  </div>
                )}

                {/* Ingredients */}
                {item.ingredients && item.ingredients.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#6c655b]">
                      <Leaf className="w-4 h-4" />
                      <h4 className="text-xs uppercase tracking-[0.2em] font-medium">
                        {t('menuCard.ingredients')}
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.ingredients.map((ingredient, index) => (
                        <span
                          key={index}
                          className="text-[10px] sm:text-xs px-2.5 py-1 bg-[#f7f3ec] text-[#4a4742] rounded-full border border-[#e6ddd0]"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Allergen Warning */}
                {item.allergens && item.allergens.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-amber-700">
                      <AlertCircle className="w-4 h-4" />
                      <h4 className="text-xs uppercase tracking-[0.2em] font-medium">
                        {t('menuCard.allergens')}
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.allergens.map((allergen, index) => (
                        <span
                          key={index}
                          className="text-[10px] sm:text-xs px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 capitalize"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Serving Size & Price Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#e6ddd0]">
                  {item.servingSize && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#6c655b]">
                        <Users className="w-3.5 h-3.5" />
                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium">
                          {t('menuCard.servingSize')}
                        </h4>
                      </div>
                      <p className="text-xs text-[#4a4742]">{item.servingSize}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#6c655b]">
                      {t('menuCard.pricePerPerson')}
                    </h4>
                    <p className="text-lg font-serif text-[#C19A5B]">
                      {priceDisplay}
                      {!item.included && !item.flatFee && ` ${t('menuCard.perPersonSuffix')}`}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export default MenuCard;
