import { NextResponse } from 'next/server';
import { generateContractPdf, sampleBooking } from '@/lib/contractPdf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Dev-only: render a sample contract PDF so the layout can be eyeballed.
// Never exposed in production.
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  const pdf = await generateContractPdf(sampleBooking());
  return new NextResponse(Buffer.from(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="contract-preview.pdf"',
    },
  });
}
