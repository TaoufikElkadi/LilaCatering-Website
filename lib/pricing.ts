// Central pricing logic for the Catering Lila menu builder.
// Single source of truth shared by the UI (MenuBuilder) and the PDF generator
// so the estimated total is always computed the same way.

import type { MenuItem } from '@/data/menuData';

/** Base menu price per person. The menu "starts at" this amount. */
export const BASE_PRICE = 38.95;

/** Smallest bookable group size. */
export const MIN_GUESTS = 40;

/** Guests are selected in steps of this many people. */
export const GUEST_STEP = 10;

/**
 * Per-guest price multiplier. Smaller groups cost more per head; larger groups
 * less. Tiers (lower bound inclusive):
 *   40–100   → 1.4
 *   100–150  → 1.3
 *   150–250  → 1.2
 *   250–510  → 1.0
 *   510+     → 0.95
 */
export function getGuestMultiplier(guestCount: number): number {
  if (guestCount < 100) return 1.4;
  if (guestCount < 150) return 1.3;
  if (guestCount < 250) return 1.2;
  if (guestCount < 510) return 1.0;
  return 0.95;
}

/** Round a guest count to the nearest valid step, clamped to the minimum. */
export function normalizeGuestCount(count: number): number {
  if (!Number.isFinite(count)) return MIN_GUESTS;
  const stepped = Math.round(count / GUEST_STEP) * GUEST_STEP;
  return Math.max(MIN_GUESTS, stepped);
}

/**
 * Per-person price from the selected dishes: BASE_PRICE plus the surcharge of
 * every selected non-flat-fee dish. Flat-fee items (e.g. the tyaffer tea
 * ceremony) are excluded here and added once in the total.
 */
export function getPerPersonPrice(selectedItems: MenuItem[]): number {
  return selectedItems.reduce(
    (total, item) => total + (item.flatFee ? 0 : item.surcharge),
    BASE_PRICE
  );
}

/** Sum of all one-time flat fees among the selected dishes. */
export function getFlatFeesTotal(selectedItems: MenuItem[]): number {
  return selectedItems.reduce(
    (total, item) => total + (item.flatFee ? item.surcharge : 0),
    0
  );
}

export interface ServiceOptions {
  /** Upgrade the included coffee service to the luxe selection (+per guest). */
  coffeeLuxe?: boolean;
  /** Upgrade the included Moroccan cookies to the luxe assortment (+per guest). */
  cookiesLuxe?: boolean;
  /** One-time decoration-collection fee. */
  decorationFee?: number;
  /** One-time transport fee (added as-is, NOT marked up by the guest multiplier). */
  transportFee?: number;
}

/** Transport: flat fee within Amsterdam, otherwise a per-km rate. */
export const AMSTERDAM_TRANSPORT = 150;
export const TRANSPORT_PER_KM = 3.5;

/** Transport cost for a venue (Amsterdam → flat; else km × rate). */
export function getTransportCost(
  venue: { isAmsterdam?: boolean; distanceKm: number } | null | undefined
): number {
  if (!venue) return 0;
  if (venue.isAmsterdam) return AMSTERDAM_TRANSPORT;
  return venue.distanceKm * TRANSPORT_PER_KM;
}

/**
 * Standard coffee, Moroccan tea and Moroccan cookies are INCLUDED with every
 * package. These are the per-guest surcharges for the optional luxe upgrades.
 */
export const COFFEE_LUXE_PER_GUEST = 4.5;
export const COOKIES_LUXE_PER_GUEST = 3;

/** Per-guest surcharge for the chosen service upgrades (0 when both standard). */
export function getServicePerGuest(service: ServiceOptions = {}): number {
  return (
    (service.coffeeLuxe ? COFFEE_LUXE_PER_GUEST : 0) +
    (service.cookiesLuxe ? COOKIES_LUXE_PER_GUEST : 0)
  );
}

/**
 * Full estimated total. The guest multiplier is an internal pricing factor
 * (NOT shown to the customer) applied to the WHOLE total:
 *
 *   ( per-person menu price × guests
 *     + per-person service upgrades × guests
 *     + one-time flat fees
 *     + one-time decoration fee ) × multiplier
 *   + transport fee   (pass-through cost, not marked up)
 */
export function getEstimatedTotal(
  selectedItems: MenuItem[],
  guestCount: number,
  service: ServiceOptions = {}
): number {
  const guests = Math.max(0, guestCount);
  const multiplier = getGuestMultiplier(guests);

  const menuTotal = getPerPersonPrice(selectedItems) * guests;
  const serviceTotal = getServicePerGuest(service) * guests;

  const flatFees = getFlatFeesTotal(selectedItems);
  const decorationFee = service.decorationFee ?? 0;
  const transportFee = service.transportFee ?? 0;

  return (menuTotal + serviceTotal + flatFees + decorationFee) * multiplier + transportFee;
}

/** Format a number as a euro string, e.g. 38.95 → "€38,95". */
export function formatEuro(amount: number): string {
  return `€${amount.toFixed(2).replace('.', ',')}`;
}
