// Server-only Apple iCloud calendar access over CalDAV (via tsdav).
// The iCloud calendars are the single source of truth — no separate database.
//
// Two calendars are used:
//   APPLE_CALDAV_CALENDAR          appointments ("Lila Catering") — office visits
//   APPLE_CALDAV_BOOKINGS_CALENDAR event reservations ("Boekingen") — paid days
//
// Required env (set once the office Apple ID is available):
//   APPLE_CALDAV_USERNAME          Apple ID email
//   APPLE_CALDAV_APP_PASSWORD      app-specific password (appleid.apple.com)
//   APPLE_CALDAV_CALENDAR          (optional) appointments calendar display name
//   APPLE_CALDAV_BOOKINGS_CALENDAR (optional) reservations calendar, default "Boekingen"

import 'server-only';
import { createDAVClient, type DAVCalendar } from 'tsdav';
import { zonedWallTimeToInstant, todayInZone, OFFICE_TIMEZONE, type BusyRange } from './booking';

const SERVER_URL = 'https://caldav.icloud.com';
const BOOKINGS_CALENDAR_NAME = () => process.env.APPLE_CALDAV_BOOKINGS_CALENDAR || 'Boekingen';

/** Max event reservations allowed on a single calendar day. */
export const BOOKING_CAPACITY_PER_DAY = 2;

export function isCalendarConfigured(): boolean {
  return Boolean(process.env.APPLE_CALDAV_USERNAME && process.env.APPLE_CALDAV_APP_PASSWORD);
}

type DAVClient = Awaited<ReturnType<typeof createDAVClient>>;
let cached: Promise<{ client: DAVClient; calendars: DAVCalendar[] }> | null = null;

async function getClient() {
  if (!isCalendarConfigured()) throw new Error('calendar_not_configured');
  if (cached) return cached;

  cached = (async () => {
    const client = await createDAVClient({
      serverUrl: SERVER_URL,
      credentials: {
        username: process.env.APPLE_CALDAV_USERNAME!,
        password: process.env.APPLE_CALDAV_APP_PASSWORD!,
      },
      authMethod: 'Basic',
      defaultAccountType: 'caldav',
    });
    const calendars = await client.fetchCalendars();
    if (!calendars.length) throw new Error('no_calendar_found');
    return { client, calendars };
  })();

  return cached;
}

/** The appointments calendar (Lila Catering) — office visit bookings. */
async function getAppointmentsCalendar() {
  const { client, calendars } = await getClient();
  const wanted = process.env.APPLE_CALDAV_CALENDAR;
  const calendar =
    (wanted && calendars.find((c) => String(c.displayName) === wanted)) ||
    calendars.find((c) => (c.components ?? []).includes('VEVENT')) ||
    calendars[0];
  if (!calendar) throw new Error('no_calendar_found');
  return { client, calendar };
}

/** The reservations calendar (Boekingen) — paid event days. */
async function getBookingsCalendar() {
  const { client, calendars } = await getClient();
  const wanted = BOOKINGS_CALENDAR_NAME();
  const calendar = calendars.find((c) => String(c.displayName) === wanted);
  if (!calendar) throw new Error(`bookings_calendar_not_found: ${wanted}`);
  return { client, calendar };
}

/** Parse one iCalendar property value (handling TZID / UTC / DATE) to epoch ms. */
function parseICalDate(rawName: string, value: string): { ms: number; allDay: boolean } | null {
  // rawName like "DTSTART" or "DTSTART;TZID=Europe/Amsterdam" or "DTEND;VALUE=DATE"
  const isDate = /VALUE=DATE(?!-TIME)/.test(rawName);
  const tzMatch = rawName.match(/TZID=([^;:]+)/);
  const v = value.trim();

  if (isDate || /^\d{8}$/.test(v)) {
    const y = +v.slice(0, 4);
    const m = +v.slice(4, 6);
    const d = +v.slice(6, 8);
    return { ms: Date.UTC(y, m - 1, d, 0, 0, 0), allDay: true };
  }
  const dt = v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);
  if (!dt) return null;
  const [, ys, ms_, ds, hs, mins, ss, z] = dt;
  const y = +ys,
    mo = +ms_,
    d = +ds,
    h = +hs,
    mi = +mins,
    se = +ss;
  if (z === 'Z') return { ms: Date.UTC(y, mo - 1, d, h, mi, se), allDay: false };
  if (tzMatch) return { ms: zonedWallTimeToInstant(y, mo, d, h, mi, tzMatch[1]).getTime(), allDay: false };
  // Floating time → treat as office timezone.
  return { ms: zonedWallTimeToInstant(y, mo, d, h, mi, 'Europe/Amsterdam').getTime(), allDay: false };
}

interface ParsedEvent {
  start: number; // epoch ms
  end: number; // epoch ms (exclusive)
  allDay: boolean;
}

/** Extract events from one VCALENDAR string (may contain several VEVENTs). */
function extractEvents(data: string): ParsedEvent[] {
  if (!data) return [];
  // Unfold folded lines (RFC 5545: continuation lines begin with space/tab).
  const unfolded = data.replace(/\r?\n[ \t]/g, '');
  const lines = unfolded.split(/\r?\n/);
  const out: ParsedEvent[] = [];
  let inEvent = false;
  let start: { ms: number; allDay: boolean } | null = null;
  let end: { ms: number; allDay: boolean } | null = null;

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      start = end = null;
      continue;
    }
    if (line === 'END:VEVENT') {
      if (start) {
        let endMs = end?.ms;
        if (endMs == null) endMs = start.allDay ? start.ms + 86400000 : start.ms + 3600000;
        out.push({ start: start.ms, end: endMs, allDay: start.allDay });
      }
      inEvent = false;
      continue;
    }
    if (!inEvent) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const name = line.slice(0, idx);
    const value = line.slice(idx + 1);
    if (name.startsWith('DTSTART')) start = parseICalDate(name, value);
    else if (name.startsWith('DTEND')) end = parseICalDate(name, value);
  }
  return out;
}

/** The office-timezone calendar dates (YYYY-MM-DD) an event covers. */
function datesSpanned(ev: ParsedEvent): string[] {
  const firstDate = todayInZone(OFFICE_TIMEZONE, new Date(ev.start));
  // DTEND is exclusive, so the last covered instant is end - 1ms.
  const lastDate = todayInZone(OFFICE_TIMEZONE, new Date(Math.max(ev.end - 1, ev.start)));
  const out: string[] = [];
  let dateStr = firstDate;
  for (let guard = 0; guard < 500; guard++) {
    out.push(dateStr);
    if (dateStr === lastDate) break;
    const d = new Date(`${dateStr}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    const p = (n: number) => String(n).padStart(2, '0');
    dateStr = `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`;
  }
  return out;
}

/** Busy ranges (appointments calendar) between two instants — [] if not set up. */
export async function getBusyRanges(start: Date, end: Date): Promise<BusyRange[]> {
  if (!isCalendarConfigured()) {
    console.warn('[appleCalendar] not configured — treating all slots as free');
    return [];
  }
  const { client, calendar } = await getAppointmentsCalendar();
  const objects = await client.fetchCalendarObjects({
    calendar,
    timeRange: { start: start.toISOString(), end: end.toISOString() },
  });
  return objects.flatMap((o) => extractEvents(o.data ?? '').map((e) => ({ start: e.start, end: e.end })));
}

/** Write an iCalendar object to the appointments calendar (office visits). */
export async function createCalendarObject(uid: string, iCalString: string): Promise<void> {
  const { client, calendar } = await getAppointmentsCalendar();
  await client.createCalendarObject({
    calendar,
    filename: `${uid}.ics`,
    iCalString,
  });
}

/**
 * Count event reservations per calendar day in the Boekingen calendar.
 * Returns a map of YYYY-MM-DD → number of events covering that day.
 * Returns {} if the calendar isn't configured.
 */
export async function getBookingCountsByDate(
  start: Date,
  end: Date
): Promise<Record<string, number>> {
  if (!isCalendarConfigured()) {
    console.warn('[appleCalendar] not configured — no booking counts');
    return {};
  }
  const { client, calendar } = await getBookingsCalendar();
  const objects = await client.fetchCalendarObjects({
    calendar,
    timeRange: { start: start.toISOString(), end: end.toISOString() },
  });
  const counts: Record<string, number> = {};
  for (const o of objects) {
    for (const ev of extractEvents(o.data ?? '')) {
      for (const date of datesSpanned(ev)) {
        counts[date] = (counts[date] ?? 0) + 1;
      }
    }
  }
  return counts;
}

/** Write an iCalendar object to the Boekingen (event reservations) calendar. */
export async function createBookingObject(uid: string, iCalString: string): Promise<void> {
  const { client, calendar } = await getBookingsCalendar();
  await client.createCalendarObject({
    calendar,
    filename: `${uid}.ics`,
    iCalString,
  });
}
