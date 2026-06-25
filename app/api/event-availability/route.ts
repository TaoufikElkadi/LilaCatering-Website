import { NextResponse } from 'next/server';
import { getBookingCountsByDate, isCalendarConfigured, BOOKING_CAPACITY_PER_DAY } from '@/lib/appleCalendar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** How far ahead event dates can be booked. */
const EVENT_WINDOW_DAYS = 365;

export async function GET() {
  try {
    const now = new Date();
    const end = new Date(now.getTime() + (EVENT_WINDOW_DAYS + 1) * 86400000);
    const counts = await getBookingCountsByDate(now, end);

    // Only expose dates that are at or above capacity (full) plus how many
    // remain elsewhere — the client computes "spots left" = capacity - count.
    return NextResponse.json({
      counts,
      capacity: BOOKING_CAPACITY_PER_DAY,
      windowDays: EVENT_WINDOW_DAYS,
      configured: isCalendarConfigured(),
    });
  } catch (err) {
    console.error('[event-availability]', err);
    // Fail open: if we can't read the calendar, don't block bookings.
    return NextResponse.json({
      counts: {},
      capacity: BOOKING_CAPACITY_PER_DAY,
      windowDays: EVENT_WINDOW_DAYS,
      configured: false,
      error: 'availability_failed',
    });
  }
}
