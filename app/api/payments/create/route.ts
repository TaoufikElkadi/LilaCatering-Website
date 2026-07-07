import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';
import { getDepositAmount, todayInZone, OFFICE_TIMEZONE } from '@/lib/booking';
import { applyDiscount } from '@/lib/discount';
import { generateContractPdf, buildContractBooking, type ContractBooking } from '@/lib/contractPdf';
import { createContractTransaction, isSignhostConfigured } from '@/lib/signhost';
import { OFFICE_EMAIL } from '@/lib/mailer';

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
      contract,
      termsAccepted,
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
      customer?: { name?: string; firstName?: string; lastName?: string; email?: string; phone?: string; address?: string; postcode?: string; city?: string };
      contract?: { menu?: ContractBooking['menu']; decoration?: ContractBooking['decoration']; venue?: string };
      termsAccepted?: boolean;
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
    // While the coming-soon gate is up, the preview cookie may not survive the
    // Mollie round-trip — so carry the preview token on the return URL. The
    // middleware consumes it (sets a fresh cookie via a same-site redirect) and
    // strips it, so the paying customer always lands back on the builder.
    const gateOn = process.env.SITE_COMING_SOON !== 'false';
    const previewToken = process.env.SITE_PREVIEW_TOKEN || '';
    const previewSuffix = gateOn && previewToken ? `&preview=${encodeURIComponent(previewToken)}` : '';

    // Create the Signhost contract transaction now (generate PDF + upload), but
    // DON'T start it — the webhook starts it on payment success. Never block the
    // payment if Signhost is unconfigured or errors.
    let signhostTransactionId = '';
    if (isSignhostConfigured() && contract) {
      try {
        const booking = buildContractBooking({
          customer: {
            firstName,
            lastName: (customer?.lastName ?? '').trim(),
            name: fullName || firstName,
            email,
            phone,
            address: (customer?.address ?? '').trim(),
            postcode: (customer?.postcode ?? '').trim(),
            city: (customer?.city ?? '').trim(),
          },
          eventDateISO: eventDate!,
          eventStart,
          eventEnd,
          foodTime,
          guestCount: guestCount ?? 0,
          venue: contract.venue,
          menu: contract.menu ?? { hapjes: [], voorgerecht: [], hoofdgerecht: [], nagerecht: [] },
          decoration: contract.decoration ?? {},
          total: chargedTotal,
          deposit,
          todayISO: todayInZone(OFFICE_TIMEZONE),
        });
        const pdf = await generateContractPdf(booking);
        signhostTransactionId = await createContractTransaction({
          pdf,
          customer: { name: fullName || firstName, email },
          office: { name: 'Lila Catering', email: OFFICE_EMAIL },
          message:
            'Gelieve de overeenkomst voor uw evenement bij Lila Catering digitaal te ondertekenen.',
          postbackUrl: `${baseUrl}/api/signhost/webhook`,
          reference: `${eventDate} ${fullName || firstName}`.slice(0, 100),
        });
      } catch (e) {
        console.error('[payments/create] signhost setup failed (continuing):', e);
      }
    }

    const mollie = createMollieClient({ apiKey });
    const payment = await mollie.payments.create({
      amount: { currency: 'EUR', value: deposit.toFixed(2) },
      description: `Aanbetaling reservering ${eventDate} — Lila Catering`,
      redirectUrl: `${baseUrl}/${locale}?paid=1${previewSuffix}`,
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
        address: (customer?.address ?? '').trim(),
        postcode: (customer?.postcode ?? '').trim(),
        city: (customer?.city ?? '').trim(),
        signhostTransactionId,
        termsAccepted: termsAccepted ? 1 : 0,
        summary: (summary ?? '').slice(0, 600),
      },
    });

    const checkoutUrl = payment.getCheckoutUrl();
    if (!checkoutUrl) {
      return NextResponse.json({ error: 'no_checkout_url' }, { status: 502 });
    }
    // Stash the payment id so the confirmation can look up its status when Mollie
    // redirects back (it doesn't echo the id). Returned in the body too, so the
    // client can keep it in sessionStorage — resilient to cookies being dropped.
    const res = NextResponse.json({ checkoutUrl, paymentId: payment.id });
    res.cookies.set('lila-payment', payment.id, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    });
    return res;
  } catch (err) {
    console.error('[payments/create]', err);
    return NextResponse.json({ error: 'payment_create_failed' }, { status: 500 });
  }
}
