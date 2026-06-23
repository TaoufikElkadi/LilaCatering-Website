// Minimal, dependency-free iCalendar (RFC 5545) builders for CalDAV writes and
// email invitations.

function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function toUTCStamp(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getUTCFullYear()}${p(date.getUTCMonth() + 1)}${p(date.getUTCDate())}` +
    `T${p(date.getUTCHours())}${p(date.getUTCMinutes())}${p(date.getUTCSeconds())}Z`
  );
}

function toDateStamp(dateStr: string): string {
  return dateStr.replace(/-/g, '');
}

/** Fold long content lines to 75 octets per RFC 5545. */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let rest = line;
  chunks.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 74) {
    chunks.push(' ' + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest.length) chunks.push(' ' + rest);
  return chunks.join('\r\n');
}

function buildCalendar(lines: string[], method?: string): string {
  const head = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lila Catering//Booking//NL',
    'CALSCALE:GREGORIAN',
    ...(method ? [`METHOD:${method}`] : []),
  ];
  return [...head, ...lines, 'END:VCALENDAR'].map(fold).join('\r\n');
}

export interface TimedEventInput {
  uid: string;
  start: Date;
  end: Date;
  summary: string;
  description?: string;
  location?: string;
  organizer?: { name: string; email: string };
  attendee?: { name: string; email: string };
  /** REQUEST for an invite that should prompt the attendee. */
  method?: 'REQUEST' | 'PUBLISH';
}

export function buildTimedEventICS(input: TimedEventInput): string {
  const now = new Date();
  const lines = [
    'BEGIN:VEVENT',
    `UID:${input.uid}`,
    `DTSTAMP:${toUTCStamp(now)}`,
    `DTSTART:${toUTCStamp(input.start)}`,
    `DTEND:${toUTCStamp(input.end)}`,
    `SUMMARY:${escapeText(input.summary)}`,
    ...(input.description ? [`DESCRIPTION:${escapeText(input.description)}`] : []),
    ...(input.location ? [`LOCATION:${escapeText(input.location)}`] : []),
    ...(input.organizer
      ? [`ORGANIZER;CN=${escapeText(input.organizer.name)}:mailto:${input.organizer.email}`]
      : []),
    ...(input.attendee
      ? [
          `ATTENDEE;CN=${escapeText(input.attendee.name)};ROLE=REQ-PARTICIPANT;` +
            `PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${input.attendee.email}`,
        ]
      : []),
    'STATUS:CONFIRMED',
    'END:VEVENT',
  ];
  return buildCalendar(lines, input.method);
}

export interface AllDayEventInput {
  uid: string;
  /** YYYY-MM-DD calendar date. */
  date: string;
  summary: string;
  description?: string;
  organizer?: { name: string; email: string };
}

export function buildAllDayEventICS(input: AllDayEventInput): string {
  const now = new Date();
  // DTEND for an all-day event is the day AFTER (non-inclusive).
  const next = new Date(`${input.date}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const p = (n: number) => String(n).padStart(2, '0');
  const endDate = `${next.getUTCFullYear()}-${p(next.getUTCMonth() + 1)}-${p(next.getUTCDate())}`;

  const lines = [
    'BEGIN:VEVENT',
    `UID:${input.uid}`,
    `DTSTAMP:${toUTCStamp(now)}`,
    `DTSTART;VALUE=DATE:${toDateStamp(input.date)}`,
    `DTEND;VALUE=DATE:${toDateStamp(endDate)}`,
    `SUMMARY:${escapeText(input.summary)}`,
    ...(input.description ? [`DESCRIPTION:${escapeText(input.description)}`] : []),
    ...(input.organizer
      ? [`ORGANIZER;CN=${escapeText(input.organizer.name)}:mailto:${input.organizer.email}`]
      : []),
    'TRANSP:TRANSPARENT',
    'STATUS:CONFIRMED',
    'END:VEVENT',
  ];
  return buildCalendar(lines);
}
