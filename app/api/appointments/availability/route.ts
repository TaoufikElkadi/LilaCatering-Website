import { NextResponse } from 'next/server';
import { getBusyRanges, isCalendarConfigured } from '@/lib/appleCalendar';
import { generateAvailableSlots, BOOKING_WINDOW_DAYS } from '@/lib/booking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const now = new Date();
    const end = new Date(now.getTime() + (BOOKING_WINDOW_DAYS + 2) * 86400000);
    const busy = await getBusyRanges(now, end);
    const slots = generateAvailableSlots(busy, now);
    return NextResponse.json({ slots, configured: isCalendarConfigured() });
  } catch (err) {
    console.error('[availability]', err);
    return NextResponse.json({ slots: [], configured: false, error: 'availability_failed' }, { status: 500 });
  }
}
