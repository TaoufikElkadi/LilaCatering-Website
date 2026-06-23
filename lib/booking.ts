// Shared, dependency-free booking logic. Safe to import on both client and
// server (no node-only modules here — CalDAV/Mollie/mail live in server files).

export const OFFICE_TIMEZONE = 'Europe/Amsterdam';
/** Office appointment days: Sunday (0) and Wednesday (3). */
export const OFFICE_DAYS = [0, 3];
/** Office hours (local Amsterdam time). Slots start on the hour. */
export const OFFICE_START_HOUR = 9;
export const OFFICE_END_HOUR = 17;
export const APPOINTMENT_DURATION_MIN = 60;
/** Reservation deposit = this fraction of the estimated total. */
export const DEPOSIT_RATE = 0.2;
/** How far ahead appointments can be booked. */
export const BOOKING_WINDOW_DAYS = 56;
/** Earliest an appointment may start, measured from "now". */
export const BOOKING_LEAD_MS = 24 * 60 * 60 * 1000;

export interface Slot {
  /** Calendar date in the office timezone, YYYY-MM-DD. */
  date: string;
  /** Local start time, HH:MM. */
  time: string;
  /** Absolute start instant (UTC ISO). */
  startISO: string;
  /** Absolute end instant (UTC ISO). */
  endISO: string;
}

export interface BusyRange {
  start: number; // epoch ms
  end: number; // epoch ms
}

/** Deposit amount (rounded to cents) for a given estimated total. */
export function getDepositAmount(totalPrice: number): number {
  return Math.round(totalPrice * DEPOSIT_RATE * 100) / 100;
}

/** Timezone offset (minutes) for a given instant in a given IANA zone. */
function zoneOffsetMinutes(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = dtf.formatToParts(date);
  const map: Record<string, number> = {};
  for (const p of parts) if (p.type !== 'literal') map[p.type] = parseInt(p.value, 10);
  const asUTC = Date.UTC(map.year, map.month - 1, map.day, map.hour, map.minute, map.second);
  return (asUTC - date.getTime()) / 60000;
}

/** Convert a wall-clock time in `timeZone` to an absolute instant (Date). */
export function zonedWallTimeToInstant(
  year: number,
  month: number, // 1-12
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const guess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const offset = zoneOffsetMinutes(new Date(guess), timeZone);
  return new Date(guess - offset * 60000);
}

/** Weekday (0=Sun..6=Sat) of a YYYY-MM-DD calendar date. */
function weekdayOf(dateStr: string): number {
  return new Date(`${dateStr}T12:00:00Z`).getUTCDay();
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Add days to a YYYY-MM-DD string, returning a new YYYY-MM-DD string. */
function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** Today's date (YYYY-MM-DD) in the office timezone. */
export function todayInZone(timeZone = OFFICE_TIMEZONE, now = new Date()): string {
  const dtf = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return dtf.format(now); // en-CA → YYYY-MM-DD
}

/**
 * Generate all candidate appointment slots in the booking window that fall on
 * office days, are in the future (respecting the lead time), and do not overlap
 * any busy range.
 */
export function generateAvailableSlots(busy: BusyRange[], now = new Date()): Slot[] {
  const slots: Slot[] = [];
  const minStart = now.getTime() + BOOKING_LEAD_MS;
  const startDate = todayInZone(OFFICE_TIMEZONE, now);

  for (let i = 0; i <= BOOKING_WINDOW_DAYS; i++) {
    const dateStr = addDays(startDate, i);
    if (!OFFICE_DAYS.includes(weekdayOf(dateStr))) continue;

    const [y, m, d] = dateStr.split('-').map((n) => parseInt(n, 10));
    for (let hour = OFFICE_START_HOUR; hour + APPOINTMENT_DURATION_MIN / 60 <= OFFICE_END_HOUR; hour++) {
      const start = zonedWallTimeToInstant(y, m, d, hour, 0, OFFICE_TIMEZONE);
      const end = new Date(start.getTime() + APPOINTMENT_DURATION_MIN * 60000);
      if (start.getTime() < minStart) continue;

      const overlaps = busy.some((b) => start.getTime() < b.end && end.getTime() > b.start);
      if (overlaps) continue;

      slots.push({
        date: dateStr,
        time: `${pad(hour)}:00`,
        startISO: start.toISOString(),
        endISO: end.toISOString(),
      });
    }
  }
  return slots;
}
