// Shared, dependency-free booking logic. Safe to import on both client and
// server (no node-only modules here — CalDAV/Mollie/mail live in server files).

export const OFFICE_TIMEZONE = 'Europe/Amsterdam';
/**
 * Per-weekday office hours (local Amsterdam time). Key = weekday
 * (0=Sun..6=Sat). A day absent from this map is closed.
 * Slots start on the hour; the last slot starts so it ends by `endHour`.
 *   Tuesday  (2): 15:00–21:00  → starts 15,16,17,18,19,20
 *   Wednesday(3): 17:00–21:00  → starts 17,18,19,20
 */
export const OFFICE_SCHEDULE: Record<number, { startHour: number; endHour: number }> = {
  2: { startHour: 15, endHour: 21 },
  3: { startHour: 17, endHour: 21 },
};
export const APPOINTMENT_DURATION_MIN = 60;
/** Reservation deposit = this fraction of the estimated total. */
export const DEPOSIT_RATE = 0.1;
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

/** Minimum reservation deposit (floor), regardless of the percentage. */
export const DEPOSIT_MINIMUM = 1000;

/** Deposit amount (rounded to cents): DEPOSIT_RATE of the total, min €1000. */
export function getDepositAmount(totalPrice: number): number {
  const pct = Math.round(totalPrice * DEPOSIT_RATE * 100) / 100;
  return Math.max(DEPOSIT_MINIMUM, pct);
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
    const hours = OFFICE_SCHEDULE[weekdayOf(dateStr)];
    if (!hours) continue;

    const [y, m, d] = dateStr.split('-').map((n) => parseInt(n, 10));
    for (let hour = hours.startHour; hour + APPOINTMENT_DURATION_MIN / 60 <= hours.endHour; hour++) {
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
