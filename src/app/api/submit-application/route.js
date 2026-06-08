import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get('name') || 'Applicant';
    const email = formData.get('email') || '';
    const phone = formData.get('phone') || '';
    const course = formData.get('course') || '';
    const idNo = formData.get('idNo') || 'N/A';
    const homeAddress = formData.get('homeAddress') || 'N/A';
    const kinName = formData.get('kinName') || 'N/A';
    const kinTel = formData.get('kinTel') || 'N/A';
    const admissionAmount = formData.get('admissionAmount') || '500';
    const formPdfFile = formData.get('formPdf');
    const letterPdfFile = formData.get('letterPdf');

    // Check if email credentials are provided
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('EMAIL_USER or EMAIL_PASS not set — simulating email send for development.');
      // Still save to DB even in dev mode
      try {
        const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');
        const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        if (!dbData.applications) dbData.applications = [];
        dbData.applications.unshift({
          id: 'app-' + Date.now(),
          name, email, phone, course, idNo,
          amount: admissionAmount,
          date: new Date().toISOString(),
          status: 'Paid via M-PESA'
        });
        fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
      } catch (e) {
        console.error('Error saving application to DB:', e);
      }
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

    // HTML Email body for the Applicant
    const htmlContent = `
      <div style="font-family: 'Times New Roman', Times, serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        
        <div style="background-color: #1a6e2e; padding: 20px; text-align: center;">
          <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 12px;">
            <img src="${baseUrl}/logo.png" alt="KVTC Logo" style="height: 60px;" />
            <img src="${baseUrl}/cgok-logo.png" alt="CGOK Logo" style="height: 60px;" />
          </div>
          <h1 style="color: #fff; margin: 0; font-size: 22px; letter-spacing: 1px;">ADMISSION APPLICATION SUCCESSFUL</h1>
          <p style="color: #f0c040; margin: 6px 0 0; font-size: 14px; font-weight: bold;">Kinoo Vocational Training Centre</p>
        </div>

        <div style="padding: 30px; background-color: #fcfcfc;">
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Dear <strong>${name}</strong>,
          </p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Congratulations! We are pleased to inform you that your application to Kinoo Vocational Training Centre has been successfully received, and your application fee of <strong>KSh ${admissionAmount}</strong> has been confirmed.
          </p>
          
          <div style="background: #f8f8f8; border-left: 4px solid #1a6e2e; padding: 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
            <h3 style="margin-top: 0; color: #1a6e2e; font-size: 16px;">Application Details:</h3>
            <p style="margin: 4px 0;"><strong>Course:</strong> ${course}</p>
            <p style="margin: 4px 0;"><strong>Applicant Name:</strong> ${name}</p>
            <p style="margin: 4px 0;"><strong>Phone:</strong> ${phone}</p>
          </div>

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Please find attached your official <strong>Admission Letter</strong> and <strong>Rules & Regulations</strong> document. Kindly print it out, sign the required sections, and bring it with you on your admission day.
          </p>

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            We look forward to welcoming you to our institution and helping you build a successful career!
          </p>

          <p style="font-size: 16px; line-height: 1.6; margin: 0;">
            Sincerely,<br/>
            <strong>Admissions Office</strong><br/>
            Kinoo Vocational Training Centre
          </p>
        </div>

        <div style="background-color: #ede9e0; padding: 20px; text-align: center; border-top: 2.5px solid #1a6e2e;">
          <p style="margin: 0; font-size: 12px; color: #555;"><strong>MOTTO:</strong> <em>"Serve with skills."</em></p>
          <p style="margin: 8px 0 0; font-size: 11px; color: #888;">&copy; ${new Date().getFullYear()} Kinoo Vocational Training Centre — Kikuyu, Kiambu County</p>
        </div>
      </div>
    `;

    // Convert PDFs to buffers
    const letterBuffer = letterPdfFile ? Buffer.from(await letterPdfFile.arrayBuffer()) : null;
    const formBuffer = formPdfFile ? Buffer.from(await formPdfFile.arrayBuffer()) : null;

    const adminEmail = process.env.RECEIVER_EMAIL || process.env.EMAIL_USER;

    // 1. Email to Applicant (contains the Admission Letter)
    const applicantMailOptions = {
      from: '"Kinoo VTC Admissions" <' + process.env.EMAIL_USER + '>',
      to: email, // Send directly to the applicant
      replyTo: adminEmail,
      subject: 'Your Admission Letter — Kinoo VTC (' + course + ')',
      html: htmlContent,
      attachments: letterBuffer ? [
        {
          filename: 'Admission_Letter_' + name.replace(/\s+/g, '_') + '.pdf',
          content: letterBuffer,
          contentType: 'application/pdf',
        },
      ] : [],
    };

    // HTML Email body for Admin
    const adminHtmlContent = `
      <div style="font-family: 'Times New Roman', Times, serif; color: #333; max-width: 600px; width: 100%; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-sizing: border-box;">
        <div style="background-color: #1a3a6e; padding: 20px; text-align: center;">
          <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 12px;">
            <img src="${baseUrl}/logo.png" alt="KVTC Logo" style="height: 60px;" />
            <img src="${baseUrl}/cgok-logo.png" alt="CGOK Logo" style="height: 60px;" />
          </div>
          <h1 style="color: #fff; margin: 0; font-size: 22px; letter-spacing: 1px;">NEW ADMISSION RECEIVED</h1>
          <p style="color: #60a5fa; margin: 6px 0 0; font-size: 14px; font-weight: bold;">Kinoo Vocational Training Centre</p>
        </div>
        <div style="padding: 24px 20px; background-color: #fcfcfc;">
          <p style="font-size: 16px; margin-bottom: 20px; line-height: 1.5;">A new admission application has been submitted and paid via M-PESA.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 15px;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; width: 130px; vertical-align: top;"><strong>Name</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee; word-break: break-word;">${name}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; vertical-align: top;"><strong>Course</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee; word-break: break-word;"><strong>${course}</strong></td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; vertical-align: top;"><strong>Phone</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee; word-break: break-word;">${phone}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; vertical-align: top;"><strong>Email</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee; word-break: break-word;">${email || 'N/A'}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; vertical-align: top;"><strong>ID No</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee; word-break: break-word;">${idNo}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; vertical-align: top;"><strong>Fee Paid</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee; color: #16a34a; font-weight: bold;">KSh ${admissionAmount} (M-PESA)</td></tr>
          </table>

          <p style="font-size: 15px; color: #555; background: #f0fdf4; padding: 12px; border-radius: 6px; border: 1px solid #bbf7d0; line-height: 1.5; margin: 0;">
            ✅ The fully filled and signed <strong>Admission Form</strong> is attached to this email.
          </p>
        </div>
      </div>
    `;

    // 2. Email to Admin (contains the filled Admission Form)
    const adminMailOptions = {
      from: '"Kinoo VTC Admissions" <' + process.env.EMAIL_USER + '>',
      to: adminEmail,
      replyTo: email,
      subject: 'NEW APPLICATION: ' + name + ' (' + course + ')',
      html: adminHtmlContent,
      attachments: formBuffer ? [
        {
          filename: 'Admission_Form_' + name.replace(/\s+/g, '_') + '.pdf',
          content: formBuffer,
          contentType: 'application/pdf',
        },
      ] : [],
    };

    // Send both emails
    await transporter.sendMail(applicantMailOptions);
    await transporter.sendMail(adminMailOptions);

    // Save to db.json
    try {
      const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');
      const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (!dbData.applications) dbData.applications = [];
      dbData.applications.unshift({
        id: 'app-' + Date.now(),
        name, email, phone, course, idNo,
        amount: admissionAmount,
        date: new Date().toISOString(),
        status: 'Paid via M-PESA'
      });
      fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    } catch (e) {
      console.error('Error saving application to DB:', e);
    }

    return NextResponse.json({ success: true, message: 'Application submitted and email sent.' });

  } catch (error) {
    console.error('Error in submit-application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send application', error: error.message },
      { status: 500 }
    );
  }
}
