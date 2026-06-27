import { NextRequest, NextResponse } from 'next/server';
import {
  getTransaction,
  downloadFile,
  downloadReceipt,
  isSignhostConfigured,
  SIGNHOST_STATUS_SIGNED,
  CONTRACT_FILE_ID,
} from '@/lib/signhost';
import { sendMail, OFFICE_EMAIL } from '@/lib/mailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Signhost postback. We do NOT trust the posted body — we take the transaction
 * id from it and RE-FETCH the transaction with our API keys to verify the real
 * status. When fully signed, we email the signed PDF (+ receipt) to the office
 * and the customer.
 */
export async function POST(request: NextRequest) {
  try {
    if (!isSignhostConfigured()) return NextResponse.json({ ok: true });

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const txn = (body.Transaction ?? body) as { Id?: string };
    const id = txn?.Id;
    if (!id) return NextResponse.json({ ok: true });

    // Verify against the API (don't trust the unauthenticated postback body).
    const transaction = await getTransaction(id);
    if (transaction.Status !== SIGNHOST_STATUS_SIGNED) {
      return NextResponse.json({ ok: true }); // not fully signed yet — ignore
    }

    // Recipients: every signer (customer + office) plus the office mailbox.
    const recipients = Array.from(
      new Set([...(transaction.Signers ?? []).map((s) => s.Email).filter(Boolean), OFFICE_EMAIL])
    );

    let attachments;
    try {
      const signed = await downloadFile(id, CONTRACT_FILE_ID);
      const receipt = await downloadReceipt(id).catch(() => null);
      attachments = [
        { filename: 'overeenkomst-getekend.pdf', content: signed, contentType: 'application/pdf' },
        ...(receipt
          ? [{ filename: 'ondertekenbewijs.pdf', content: receipt, contentType: 'application/pdf' }]
          : []),
      ];
    } catch (e) {
      console.error('[signhost/webhook] download failed:', e);
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background:#1f1f1f;padding:20px;text-align:center;">
          <h1 style="color:#C19A5B;margin:0;letter-spacing:2px;">LILA CATERING</h1>
        </div>
        <div style="background:#f7f3ec;padding:30px;color:#1f1f1f;">
          <h2 style="margin-top:0;">Overeenkomst ondertekend</h2>
          <p>De overeenkomst is door alle partijen digitaal ondertekend. De getekende
          versie vindt u als bijlage.</p>
          <p>Met vriendelijke groet,<br/>Lila Catering</p>
        </div>
      </div>`;

    await sendMail({
      to: recipients,
      subject: 'Overeenkomst ondertekend — Lila Catering',
      html,
      attachments,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[signhost/webhook]', err);
    // 200 so Signhost doesn't hammer retries on our parsing errors.
    return NextResponse.json({ ok: true });
  }
}
