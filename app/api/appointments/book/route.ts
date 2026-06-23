import { NextRequest, NextResponse } from 'next/server';
import { getBusyRanges, createCalendarObject, isCalendarConfigured } from '@/lib/appleCalendar';
import { sendMail, OFFICE_EMAIL } from '@/lib/mailer';
import { buildTimedEventICS } from '@/lib/ics';
import { generateAvailableSlots, BOOKING_WINDOW_DAYS, OFFICE_TIMEZONE } from '@/lib/booking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const OFFICE_ADDRESS = process.env.OFFICE_ADDRESS || 'Lila Catering, Amsterdam';

export async function POST(request: NextRequest) {
  try {
    if (!isCalendarConfigured()) {
      return NextResponse.json({ error: 'calendar_not_configured' }, { status: 503 });
    }
    const body = await request.json();
    const { name, email, phone, startISO, offerteSummary } = body as {
      name?: string;
      email?: string;
      phone?: string;
      startISO?: string;
      offerteSummary?: string;
    };

    if (!name || !email || !startISO) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    // Re-check that the requested slot is still a valid, free office slot.
    const now = new Date();
    const end = new Date(now.getTime() + (BOOKING_WINDOW_DAYS + 2) * 86400000);
    const busy = await getBusyRanges(now, end);
    const slot = generateAvailableSlots(busy, now).find((s) => s.startISO === startISO);
    if (!slot) {
      return NextResponse.json({ error: 'slot_unavailable' }, { status: 409 });
    }

    const start = new Date(slot.startISO);
    const finish = new Date(slot.endISO);
    const uid = `lila-appt-${start.getTime()}-${crypto.randomUUID()}`;

    const descriptionLines = [
      `Kennismakingsafspraak met ${name}.`,
      `Telefoon: ${phone || '-'}`,
      `E-mail: ${email}`,
      '',
      offerteSummary ? `Offerte van de klant:\n${offerteSummary}` : '',
    ].filter(Boolean);

    const icsString = buildTimedEventICS({
      uid,
      start,
      end: finish,
      summary: `Afspraak — ${name} (Lila Catering)`,
      description: descriptionLines.join('\n'),
      location: OFFICE_ADDRESS,
      organizer: { name: 'Lila Catering', email: OFFICE_EMAIL },
      attendee: { name, email },
      method: 'REQUEST',
    });

    await createCalendarObject(uid, icsString);

    const localDate = start.toLocaleDateString('nl-NL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: OFFICE_TIMEZONE,
    });
    const localTime = start.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: OFFICE_TIMEZONE,
    });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background:#1f1f1f;padding:20px;text-align:center;">
          <h1 style="color:#C19A5B;margin:0;letter-spacing:2px;">LILA CATERING</h1>
        </div>
        <div style="background:#f7f3ec;padding:30px;color:#1f1f1f;">
          <h2 style="margin-top:0;">Afspraak bevestigd</h2>
          <p>Beste ${name},</p>
          <p>Uw afspraak op kantoor is ingepland:</p>
          <p style="font-size:16px;"><strong>${localDate}</strong><br/>${localTime} uur<br/>${OFFICE_ADDRESS}</p>
          <p>De afspraak vindt u als bijlage om aan uw agenda toe te voegen. Tot snel!</p>
        </div>
      </div>`;

    await sendMail({
      to: [email, OFFICE_EMAIL],
      subject: `Afspraak Lila Catering — ${localDate} ${localTime}`,
      html,
      ics: { content: icsString, method: 'REQUEST' },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[book]', err);
    return NextResponse.json({ error: 'booking_failed' }, { status: 500 });
  }
}
