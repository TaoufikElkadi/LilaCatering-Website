import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const offerteFile = formData.get('offerte') as File | null;
    const offerteDataStr = formData.get('offerteData') as string | null;
    
    let offerteData = null;
    if (offerteDataStr) {
      try {
        offerteData = JSON.parse(offerteDataStr);
      } catch (e) {
        console.error('Failed to parse offerte data:', e);
      }
    }

    // Configure nodemailer transporter
    // NOTE: You'll need to set up environment variables for email configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Prepare email content
    const emailSubject = `New Call Booking Request from ${name}`;
    
    let emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1f1f1f; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">LILA CATERING</h1>
          <p style="color: #ffffff; margin: 5px 0;">New Call Booking Request</p>
        </div>
        
        <div style="background-color: #f7f3ec; padding: 30px;">
          <h2 style="color: #1f1f1f; margin-top: 0;">Contact Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6c655b; width: 120px;">Name:</td>
              <td style="padding: 8px 0; color: #1f1f1f;"><strong>${name}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c655b;">Email:</td>
              <td style="padding: 8px 0; color: #1f1f1f;"><strong>${email}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6c655b;">Phone:</td>
              <td style="padding: 8px 0; color: #1f1f1f;"><strong>${phone}</strong></td>
            </tr>
          </table>
    `;

    if (offerteData) {
      emailBody += `
          <h2 style="color: #1f1f1f; margin-top: 30px;">Event Details</h2>
          <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; padding: 15px; border: 1px solid #dcd3c5;">
            ${offerteData.eventType ? `
            <tr>
              <td style="padding: 8px; color: #6c655b; width: 120px;">Event Type:</td>
              <td style="padding: 8px; color: #1f1f1f; text-transform: capitalize;"><strong>${offerteData.eventType}</strong></td>
            </tr>
            ` : ''}
            ${offerteData.eventDate ? `
            <tr>
              <td style="padding: 8px; color: #6c655b;">Event Date:</td>
              <td style="padding: 8px; color: #1f1f1f;"><strong>${new Date(offerteData.eventDate + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</strong></td>
            </tr>
            ` : ''}
            ${offerteData.guestCount ? `
            <tr>
              <td style="padding: 8px; color: #6c655b;">Guests:</td>
              <td style="padding: 8px; color: #1f1f1f;"><strong>${offerteData.guestCount}</strong></td>
            </tr>
            ` : ''}
            ${offerteData.totalPrice ? `
            <tr>
              <td style="padding: 8px; color: #6c655b;">Estimated Total:</td>
              <td style="padding: 8px; color: #1f1f1f;"><strong>€${offerteData.totalPrice.toFixed(2)}</strong></td>
            </tr>
            ` : ''}
          </table>
      `;
    }

    if (message) {
      emailBody += `
          <h2 style="color: #1f1f1f; margin-top: 30px;">Additional Message</h2>
          <div style="background-color: #ffffff; padding: 15px; border: 1px solid #dcd3c5; white-space: pre-wrap;">
            ${message}
          </div>
      `;
    }

    emailBody += `
        </div>
        
        <div style="background-color: #1f1f1f; padding: 15px; text-align: center;">
          <p style="color: #ffffff; margin: 0; font-size: 12px;">
            LILA CATERING | Authentic Moroccan Catering
          </p>
        </div>
      </div>
    `;

    // Prepare email options
    const mailOptions: any = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || 'taoufik.elkadi@gmail.com',
      replyTo: email,
      subject: emailSubject,
      html: emailBody,
    };

    // Add PDF attachment if provided
    if (offerteFile) {
      const buffer = Buffer.from(await offerteFile.arrayBuffer());
      mailOptions.attachments = [
        {
          filename: offerteFile.name,
          content: buffer,
          contentType: 'application/pdf',
        },
      ];
    }

    // Send email
    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.log('Email would be sent with following details:');
      console.log('To:', mailOptions.to);
      console.log('Subject:', emailSubject);
      console.log('From:', name, email, phone);
      
      // For development/testing without SMTP configured
      return NextResponse.json({
        success: true,
        message: 'Booking request received (email not sent - SMTP not configured)',
        data: { name, email, phone, hasOfferte: !!offerteFile },
      });
    }

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Booking request sent successfully',
    });
  } catch (error) {
    console.error('Error processing booking request:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process booking request',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

