// Server-only email helper (reuses the SMTP env from /api/book-call).
import 'server-only';
import nodemailer from 'nodemailer';

export const OFFICE_EMAIL = process.env.OFFICE_EMAIL || 'info@lilacatering.nl';

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
}

interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
  ics?: { content: string; method?: 'REQUEST' | 'PUBLISH' };
}

export async function sendMail({ to, subject, html, ics }: SendArgs): Promise<void> {
  if (!isMailConfigured()) {
    console.warn('[mailer] SMTP not configured — skipping email:', subject);
    return;
  }
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `Lila Catering <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    ...(ics
      ? {
          icalEvent: {
            method: ics.method || 'REQUEST',
            content: ics.content,
            filename: 'afspraak.ics',
          },
        }
      : {}),
  });
}
