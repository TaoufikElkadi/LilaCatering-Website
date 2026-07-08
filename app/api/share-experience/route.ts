import { NextRequest, NextResponse } from 'next/server';
import { sendMail, OFFICE_EMAIL } from '@/lib/mailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name ?? '').trim().slice(0, 100);
    const email = String(body.email ?? '').trim().slice(0, 160);
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    const text = String(body.text ?? '').trim().slice(0, 2000);

    if (!name || !text || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1f1f1f;padding:16px;text-align:center">
          <h2 style="color:#C19A5B;margin:0;letter-spacing:2px">LILA CATERING</h2>
        </div>
        <div style="padding:24px;color:#1f1f1f">
          <h3 style="margin-top:0">Nieuwe ervaring ingestuurd via de website</h3>
          <p><strong>Naam:</strong> ${name}<br/>
             <strong>E-mail:</strong> ${email}<br/>
             <strong>Beoordeling:</strong> ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</p>
          <p style="white-space:pre-wrap;border-left:3px solid #C19A5B;padding-left:12px">${text.replace(/</g, '&lt;')}</p>
          <p style="color:#8a8275;font-size:12px">Controleer en plaats deze ervaring handmatig op de site indien akkoord.</p>
        </div>
      </div>`;

    await sendMail({
      to: [OFFICE_EMAIL],
      subject: `Nieuwe ervaring van ${name} (${rating}★) — Lila Catering`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
