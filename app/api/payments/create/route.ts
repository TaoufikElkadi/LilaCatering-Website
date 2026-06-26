import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';
import { getDepositAmount } from '@/lib/booking';
import { applyDiscount } from '@/lib/discount';

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
      eventStart,
      eventEnd,
      foodTime,
      discountCode,
      customer,
      summary,
      lang,
    } = body as {
      totalPrice?: number;
      eventDate?: string;
      eventType?: string;
      guestCount?: number;
      eventStart?: string;
      eventEnd?: string;
      foodTime?: string;
      discountCode?: string;
      customer?: { name?: string; firstName?: string; lastName?: string; email?: string; phone?: string };
      summary?: string;
      lang?: string;
    };

    const firstName = (customer?.firstName ?? '').trim();
    const fullName = (customer?.name ?? '').trim();
    const email = (customer?.email ?? '').trim();
    const phone = (customer?.phone ?? '').trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // First name, phone and a valid email are all mandatory.
    if (!totalPrice || !eventDate || !(firstName || fullName) || !emailValid || !phone) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    // Apply the discount SERVER-SIDE — never trust a client-sent amount.
    const discount = applyDiscount(totalPrice, discountCode);
    const chargedTotal = discount ? discount.discountedTotal : totalPrice;
    const deposit = getDepositAmount(chargedTotal);
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
        eventStart: eventStart ?? '',
        eventEnd: eventEnd ?? '',
        foodTime: foodTime ?? '',
        eventType: eventType ?? '',
        guestCount: guestCount ?? 0,
        totalPrice,
        discountCode: discount ? discount.code : '',
        discountAmount: discount ? discount.discountAmount : 0,
        chargedTotal,
        deposit,
        name: fullName || firstName,
        firstName,
        lastName: (customer?.lastName ?? '').trim(),
        email,
        phone,
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
