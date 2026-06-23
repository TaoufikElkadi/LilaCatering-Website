// Server-only Apple iCloud calendar access over CalDAV (via tsdav).
// The iCloud calendar is the single source of truth — no separate database.
//
// Required env (set once the office Apple ID is available):
//   APPLE_CALDAV_USERNAME      Apple ID email
//   APPLE_CALDAV_APP_PASSWORD  app-specific password (appleid.apple.com)
//   APPLE_CALDAV_CALENDAR      (optional) display name of the target calendar

import 'server-only';
import { createDAVClient, type DAVCalendar } from 'tsdav';
import { zonedWallTimeToInstant, type BusyRange } from './booking';

const SERVER_URL = 'https://caldav.icloud.com';

export function isCalendarConfigured(): boolean {
  return Boolean(process.env.APPLE_CALDAV_USERNAME && process.env.APPLE_CALDAV_APP_PASSWORD);
}

type DAVClient = Awaited<ReturnType<typeof createDAVClient>>;
let cached: Promise<{ client: DAVClient; calendar: DAVCalendar }> | null = null;

async function getClientAndCalendar() {
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
    const wanted = process.env.APPLE_CALDAV_CALENDAR;
    const calendar =
      (wanted && calendars.find((c) => String(c.displayName) === wanted)) ||
      calendars.find((c) => (c.components ?? []).includes('VEVENT')) ||
      calendars[0];
    if (!calendar) throw new Error('no_calendar_found');
    return { client, calendar };
  })();

  return cached;
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

/** Extract busy ranges from one VCALENDAR string (may contain several VEVENTs). */
function extractBusy(data: string): BusyRange[] {
  if (!data) return [];
  // Unfold folded lines (RFC 5545: continuation lines begin with space/tab).
  const unfolded = data.replace(/\r?\n[ \t]/g, '');
  const lines = unfolded.split(/\r?\n/);
  const out: BusyRange[] = [];
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
        out.push({ start: start.ms, end: endMs });
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

/** Busy ranges between two instants (returns [] if the calendar isn't set up). */
export async function getBusyRanges(start: Date, end: Date): Promise<BusyRange[]> {
  if (!isCalendarConfigured()) {
    console.warn('[appleCalendar] not configured — treating all slots as free');
    return [];
  }
  const { client, calendar } = await getClientAndCalendar();
  const objects = await client.fetchCalendarObjects({
    calendar,
    timeRange: { start: start.toISOString(), end: end.toISOString() },
  });
  return objects.flatMap((o) => extractBusy(o.data ?? ''));
}

/** Write an iCalendar object to the office calendar. */
export async function createCalendarObject(uid: string, iCalString: string): Promise<void> {
  const { client, calendar } = await getClientAndCalendar();
  await client.createCalendarObject({
    calendar,
    filename: `${uid}.ics`,
    iCalString,
  });
}
