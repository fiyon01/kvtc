import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const fname = formData.get('fname') || '';
    const lname = formData.get('lname') || '';
    const phone = formData.get('phone') || '';
    const email = formData.get('email') || '';
    const course = formData.get('course') || 'General Inquiry';
    const msg = formData.get('msg') || 'N/A';
    
    // Check if email credentials are provided
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('EMAIL_USER or EMAIL_PASS not set — skipping email send.');
      return NextResponse.json({ success: true, message: 'Simulated email send (no credentials)' });
    }

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Construct absolute URLs for the logos so they render in the email client
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;

    // HTML Email body for the Admin (since the user doesn't provide an email address in the form)
    const htmlContent = `
      <div style="font-family: 'Times New Roman', Times, serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        
        <div style="background-color: #1a6e2e; padding: 20px; text-align: center;">
          <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 12px;">
            <img src="${baseUrl}/kvtc_logo.png" alt="KVTC Logo" style="width: 78px; height: 78px; object-fit: cover; object-position: 50% 18%;" />
            <img src="${baseUrl}/cgok-logo.png" alt="CGOK Logo" style="width: 64px; height: 64px; object-fit: contain;" />
          </div>
          <h1 style="color: #fff; margin: 0; font-size: 22px; letter-spacing: 1px;">NEW WEBSITE ENQUIRY</h1>
          <p style="color: #f0c040; margin: 6px 0 0; font-size: 14px; font-weight: bold;">Kinoo Vocational Training Centre</p>
        </div>

        <div style="padding: 30px; background-color: #fcfcfc;">
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            A new enquiry has been submitted through the website contact form.
          </p>
          
          <div style="background: #f8f8f8; border-left: 4px solid #1a6e2e; padding: 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
            <p style="margin: 4px 0;"><strong>First Name:</strong> ${fname}</p>
            <p style="margin: 4px 0;"><strong>Last Name:</strong> ${lname}</p>
            <p style="margin: 4px 0;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin: 4px 0;"><strong>Email:</strong> ${email || 'N/A'}</p>
            <p style="margin: 4px 0;"><strong>Course of Interest:</strong> ${course}</p>
          </div>

          <div style="background: #f8f8f8; padding: 16px; border: 1px solid #eee; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold; color: #1a6e2e; margin-bottom: 8px;">Message:</p>
            <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #555; white-space: pre-wrap;">${msg}</p>
          </div>
        </div>

        <div style="background-color: #ede9e0; padding: 20px; text-align: center; border-top: 2.5px solid #1a6e2e;">
          <p style="margin: 0; font-size: 12px; color: #555;"><strong>MOTTO:</strong> <em>"Serve with skills."</em></p>
          <p style="margin: 8px 0 0; font-size: 11px; color: #888;">&copy; ${new Date().getFullYear()} Kinoo Vocational Training Centre — Kikuyu, Kiambu County</p>
        </div>
      </div>
    `;

    const adminEmail = process.env.RECEIVER_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
      from: '"KVTC Website" <' + process.env.EMAIL_USER + '>',
      to: adminEmail,
      subject: 'New Enquiry: ' + course + ' — ' + fname + ' ' + lname,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Enquiry sent successfully.' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return NextResponse.json({ success: false, message: 'Failed to send email' }, { status: 500 });
  }
}
