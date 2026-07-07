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
    return NextResponse.json({ status: p.status, amount: p.amount?.value ?? null });
  } catch {
    return NextResponse.json({ status: 'unknown' });
  }
}
