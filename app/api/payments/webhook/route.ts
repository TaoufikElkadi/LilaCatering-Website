import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient, PaymentStatus } from '@mollie/api-client';
import { createCalendarObject, isCalendarConfigured } from '@/lib/appleCalendar';
import { sendMail, OFFICE_EMAIL } from '@/lib/mailer';
import { buildAllDayEventICS } from '@/lib/ics';
import { formatEuro } from '@/lib/pricing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.MOLLIE_API_KEY;
    if (!apiKey) return NextResponse.json({ ok: true }); // nothing to do

    const form = await request.formData();
    const id = form.get('id') as string | null;
    if (!id) return NextResponse.json({ ok: true });

    const mollie = createMollieClient({ apiKey });
    const payment = await mollie.payments.get(id);
    if (payment.status !== PaymentStatus.paid) return NextResponse.json({ ok: true });

    const m = (payment.metadata ?? {}) as Record<string, unknown>;
    const eventDate = String(m.eventDate ?? '');
    const name = String(m.name ?? '');
    const email = String(m.email ?? '');
    const phone = String(m.phone ?? '');
    const eventType = String(m.eventType ?? '');
    const guestCount = Number(m.guestCount ?? 0);
    const totalPrice = Number(m.totalPrice ?? 0);
    const deposit = Number(m.deposit ?? 0);
    const summary = String(m.summary ?? '');
    if (!eventDate) return NextResponse.json({ ok: true });

    // Deterministic UID → repeated webhook calls won't create duplicate events.
    const uid = `lila-reservation-${payment.id}`;

    if (isCalendarConfigured()) {
      const description = [
        `GERESERVEERD via website (aanbetaling betaald).`,
        `Klant: ${name}`,
        `E-mail: ${email}`,
        `Telefoon: ${phone || '-'}`,
        `Type: ${eventType || '-'}`,
        `Aantal gasten: ${guestCount}`,
        `Geschat totaal: ${formatEuro(totalPrice)}`,
        `Aanbetaling: ${formatEuro(deposit)} (betaald)`,
        `Mollie: ${payment.id}`,
        '',
        summary ? `Offerte:\n${summary}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      try {
        const ics = buildAllDayEventICS({
          uid,
          date: eventDate,
          summary: `GERESERVEERD — ${name}${eventType ? ` (${eventType})` : ''} · ${guestCount}p`,
          description,
          organizer: { name: 'Lila Catering', email: OFFICE_EMAIL },
        });
        await createCalendarObject(uid, ics);
      } catch (e) {
        // Likely a duplicate (webhook retried) — treat as already processed.
        console.warn('[webhook] calendar write skipped (likely duplicate):', e);
        return NextResponse.json({ ok: true });
      }
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background:#1f1f1f;padding:20px;text-align:center;">
          <h1 style="color:#C19A5B;margin:0;letter-spacing:2px;">LILA CATERING</h1>
        </div>
        <div style="background:#f7f3ec;padding:30px;color:#1f1f1f;">
          <h2 style="margin-top:0;">Reservering bevestigd</h2>
          <p>Beste ${name},</p>
          <p>Bedankt! Uw datum <strong>${eventDate}</strong> is gereserveerd en uw aanbetaling van
          <strong>${formatEuro(deposit)}</strong> is ontvangen.</p>
          <p>Geschat totaal: ${formatEuro(totalPrice)} · ${guestCount} gasten${eventType ? ` · ${eventType}` : ''}.</p>
          <p>We nemen binnenkort contact met u op om alle details af te stemmen.</p>
        </div>
      </div>`;

    await sendMail({
      to: [email, OFFICE_EMAIL].filter(Boolean),
      subject: `Reservering bevestigd — ${eventDate} (Lila Catering)`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[payments/webhook]', err);
    // Return 200 so Mollie doesn't hammer retries on our parsing errors;
    // genuine retryable failures are logged for follow-up.
    return NextResponse.json({ ok: true });
  }
}
