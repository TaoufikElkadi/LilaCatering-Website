// Discount codes for the reservation deposit flow.
// Single source of truth — used client-side for display and, authoritatively,
// server-side in the payment route (never trust a client-sent amount).

export interface Discount {
  type: 'percent';
  /** Percentage off (e.g. 10 = 10%). */
  value: number;
}

/** Add more codes here. Lookups are case-insensitive. */
export const DISCOUNTS: Record<string, Discount> = {
  LILA10: { type: 'percent', value: 10 },
};

/** Look up a code (case-insensitive, trimmed). Returns null if unknown. */
export function lookupDiscount(code: string | null | undefined): Discount | null {
  if (!code) return null;
  return DISCOUNTS[code.trim().toUpperCase()] ?? null;
}

export interface AppliedDiscount {
  /** Normalised (upper-case) code that was applied. */
  code: string;
  /** Amount subtracted from the original total. */
  discountAmount: number;
  /** Total after the discount. */
  discountedTotal: number;
}

/**
 * Apply a discount code to a total. Returns null if the code is unknown.
 * Rounds to cents.
 */
export function applyDiscount(total: number, code: string | null | undefined): AppliedDiscount | null {
  const discount = lookupDiscount(code);
  if (!discount) return null;
  const discountAmount = Math.round(total * (discount.value / 100) * 100) / 100;
  const discountedTotal = Math.round((total - discountAmount) * 100) / 100;
  return { code: code!.trim().toUpperCase(), discountAmount, discountedTotal };
}
