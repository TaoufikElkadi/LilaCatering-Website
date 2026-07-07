import { NextRequest, NextResponse } from 'next/server';
import { createMollieClient } from '@mollie/api-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lightweight status lookup for the confirmation page. The payment id is read
// from the `lila-payment` cookie set at checkout (or an explicit ?id=).
export async function GET(req: NextRequest) {
  const apiKey = process.env.MOLLIE_API_KEY;
  const id = req.nextUrl.searchParams.get('id') || req.cookies.get('lila-payment')?.value || '';
  if (!apiKey || !id) return NextResponse.json({ status: 'unknown' });
  try {
    const mollie = createMollieClient({ apiKey });
    const p = await mollie.payments.get(id);
    const m = (p.metadata ?? {}) as Record<string, unknown>;
    return NextResponse.json({
      status: p.status,
      amount: p.amount?.value ?? null,
      eventDate: String(m.eventDate ?? ''),
      deposit: Number(m.deposit ?? 0),
      name: String(m.name ?? ''),
      guestCount: Number(m.guestCount ?? 0),
    });
  } catch {
    return NextResponse.json({ status: 'unknown' });
  }
}
