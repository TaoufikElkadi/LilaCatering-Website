import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';
import { getDepositAmount } from '@/lib/booking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.MOLLIE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'payments_not_configured' }, { status: 503 });
    }

    const body = await request.json();
    const {
      totalPrice,
      eventDate,
      eventType,
      guestCount,
      customer,
      summary,
      lang,
    } = body as {
      totalPrice?: number;
      eventDate?: string;
      eventType?: string;
      guestCount?: number;
      customer?: { name?: string; email?: string; phone?: string };
      summary?: string;
      lang?: string;
    };

    if (!totalPrice || !eventDate || !customer?.name || !customer?.email) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    const deposit = getDepositAmount(totalPrice);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const locale = lang === 'fr' ? 'fr' : lang === 'en' ? 'en' : 'nl';

    const mollie = createMollieClient({ apiKey });
    const payment = await mollie.payments.create({
      amount: { currency: 'EUR', value: deposit.toFixed(2) },
      description: `Aanbetaling reservering ${eventDate} — Lila Catering`,
      redirectUrl: `${baseUrl}/${locale}?reservation=done`,
      webhookUrl: `${baseUrl}/api/payments/webhook`,
      metadata: {
        kind: 'reservation',
        eventDate,
        eventType: eventType ?? '',
        guestCount: guestCount ?? 0,
        totalPrice,
        deposit,
        name: customer.name,
        email: customer.email,
        phone: customer.phone ?? '',
        summary: (summary ?? '').slice(0, 600),
      },
    });

    const checkoutUrl = payment.getCheckoutUrl();
    if (!checkoutUrl) {
      return NextResponse.json({ error: 'no_checkout_url' }, { status: 502 });
    }
    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error('[payments/create]', err);
    return NextResponse.json({ error: 'payment_create_failed' }, { status: 500 });
  }
}
