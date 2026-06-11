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
    const rawPaymentReference = String(formData.get('paymentReference') || '').trim();
    const paymentReference = /^[A-Z0-9]{8,16}$/i.test(rawPaymentReference)
      ? rawPaymentReference.toUpperCase()
      : '';
    if (!paymentReference) {
      return NextResponse.json({
        success: false,
        message: 'A valid M-PESA receipt number is required before an application can be submitted.',
      }, { status: 400 });
    }
    const paymentDate = formData.get('paymentDate') || new Date().toISOString();
    const paymentPhone = formData.get('paymentPhone') || phone;
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
          paymentReference,
          paymentDate,
          paymentPhone,
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
    const legacyHtmlContent = `
      <div style="font-family: 'Times New Roman', Times, serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        
        <div style="background-color: #1a6e2e; padding: 20px; text-align: center;">
          <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 12px;">
            <img src="${baseUrl}/kvtc_logo.png" alt="KVTC Logo" style="width: 78px; height: 78px; object-fit: cover; object-position: 50% 18%;" />
            <img src="${baseUrl}/cgok-logo.png" alt="CGOK Logo" style="width: 64px; height: 64px; object-fit: contain;" />
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
            <p style="margin: 4px 0;"><strong>M-PESA Receipt:</strong> ${paymentReference}</p>
            <p style="margin: 4px 0;"><strong>Payment Date:</strong> ${new Date(paymentDate).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}</p>
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

    const htmlContent = `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="color-scheme" content="light only">
        <meta name="supported-color-schemes" content="light only">
        <title>Kinoo VTC Admission Confirmation</title>
        <style>
          :root { color-scheme: light only; supported-color-schemes: light only; }
          body, table, td, div, p, h1 { color-scheme: light only !important; }
          @media (prefers-color-scheme: dark) {
            .email-page, .email-card, .email-section, .email-letterhead {
              background-color: #ffffff !important;
              background-image: linear-gradient(#ffffff, #ffffff) !important;
            }
            .email-copy { color: #405460 !important; }
            .email-heading { color: #172b3a !important; }
          }
        </style>
      </head>
      <body class="email-page" bgcolor="#ffffff" style="margin:0;padding:0;background-color:#ffffff!important;background-image:linear-gradient(#ffffff,#ffffff)!important;color:#405460;">
      <div class="email-page" bgcolor="#ffffff" style="margin:0;padding:24px 10px;background-color:#ffffff!important;background-image:linear-gradient(#ffffff,#ffffff)!important;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%;border-collapse:collapse;background-color:#ffffff!important;">
          <tr>
            <td align="center">
              <table class="email-card" role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%;max-width:640px;border-collapse:collapse;background-color:#ffffff!important;border:1px solid #dce5e9;">
                <tr>
                  <td class="email-letterhead" bgcolor="#ffffff" style="padding:10px 14px 9px;background-color:#ffffff!important;border-bottom:4px solid #2f79b7;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                      <tr>
                        <td width="94" align="left" valign="middle" style="width:94px;vertical-align:middle;">
                          <img src="${baseUrl}/kvtc_logo.png" width="88" height="88" alt="Kinoo Vocational Training Centre" style="display:block;width:88px;height:88px;margin:0;object-fit:cover;object-position:50% 18%;border:0;" />
                        </td>
                        <td align="center" valign="middle" style="padding:0 9px;vertical-align:middle;font-family:'Times New Roman',Times,serif;">
                          <p style="margin:0 0 4px;color:#b59b69!important;font-size:11px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;">COUNTY GOVERNMENT OF KIAMBU</p>
                          <p style="margin:0 0 4px;color:#1f2f4d!important;font-size:11px;font-weight:700;line-height:1.25;">Department Of Education, Gender, Culture &amp; Social Services</p>
                          <p style="margin:0 0 5px;color:#4c9daa!important;font-size:13px;font-weight:700;line-height:1.25;letter-spacing:.7px;">KINOO VOCATIONAL TRAINING CENTRE</p>
                          <p style="margin:0 0 2px;color:#30364b!important;font-size:10px;line-height:1.35;">P.O BOX 351-00902, Kikuyu. &nbsp;&nbsp; Tel: 0113582008</p>
                          <p style="margin:0;color:#30364b!important;font-size:10px;line-height:1.35;">Email: kinoovtc@gmail.com &nbsp;&nbsp; www.kinoovtc.ac.ke</p>
                        </td>
                        <td width="82" align="right" valign="middle" style="width:82px;vertical-align:middle;">
                          <img src="${baseUrl}/cgok-logo.png" width="76" height="76" alt="County Government of Kiambu" style="display:block;width:76px;height:76px;margin:0 0 0 auto;object-fit:contain;border:0;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td class="email-section" bgcolor="#ffffff" style="padding:34px 38px 14px;background-color:#ffffff!important;font-family:Arial,Helvetica,sans-serif;">
                    <span style="display:inline-block;padding:6px 11px;background:#eaf6f2;color:#0F6E56;border:1px solid #cce8df;border-radius:999px;font-size:10px;font-weight:800;letter-spacing:1.1px;text-transform:uppercase;">Application confirmed</span>
                    <h1 class="email-heading" style="margin:14px 0 8px;color:#172b3a!important;font-size:26px;line-height:1.25;font-weight:750;letter-spacing:-.3px;">Welcome to Kinoo VTC, ${name}</h1>
                    <p class="email-copy" style="margin:0;color:#60717d!important;font-size:15px;line-height:1.7;">Your application has been received successfully and your admission payment has been verified.</p>
                  </td>
                </tr>

                <tr>
                  <td class="email-section" bgcolor="#ffffff" style="padding:14px 38px 7px;background-color:#ffffff!important;font-family:Arial,Helvetica,sans-serif;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;background:#f8fafb;border:1px solid #dfe8ec;border-radius:12px;">
                      <tr><td colspan="2" style="padding:15px 18px 10px;color:#25384a;font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;border-bottom:1px solid #e3eaed;">Application summary</td></tr>
                      <tr>
                        <td style="width:36%;padding:13px 18px 7px;color:#74838d;font-size:10px;font-weight:700;text-transform:uppercase;">Programme</td>
                        <td style="padding:13px 18px 7px;color:#223744;font-size:14px;font-weight:700;">${course}</td>
                      </tr>
                      <tr>
                        <td style="padding:7px 18px;color:#74838d;font-size:10px;font-weight:700;text-transform:uppercase;">Applicant</td>
                        <td style="padding:7px 18px;color:#223744;font-size:14px;">${name}</td>
                      </tr>
                      <tr>
                        <td style="padding:7px 18px 14px;color:#74838d;font-size:10px;font-weight:700;text-transform:uppercase;">Phone</td>
                        <td style="padding:7px 18px 14px;color:#223744;font-size:14px;">${phone}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td class="email-section" bgcolor="#ffffff" style="padding:12px 38px 8px;background-color:#ffffff!important;font-family:Arial,Helvetica,sans-serif;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;background:#fbfdfc;border:1px solid #cfe6dc;border-radius:12px;">
                      <tr>
                        <td style="padding:14px 18px;border-bottom:1px solid #dcebe5;color:#173f32;font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;">M-PESA payment confirmation</td>
                        <td align="right" style="padding:14px 18px;border-bottom:1px solid #dcebe5;"><span style="display:inline-block;padding:4px 9px;background:#0F6E56;color:#ffffff;border-radius:999px;font-size:10px;font-weight:800;letter-spacing:.6px;">PAID</span></td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding:16px 18px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                            <tr>
                              <td valign="top" style="width:31%;padding-right:10px;">
                                <p style="margin:0 0 5px;color:#77868e;font-size:9px;font-weight:700;text-transform:uppercase;">Amount</p>
                                <p style="margin:0;color:#173f32;font-size:17px;font-weight:800;">KSh ${admissionAmount}</p>
                              </td>
                              <td valign="top" style="width:34%;padding:0 10px;border-left:1px solid #dcebe5;">
                                <p style="margin:0 0 5px;color:#77868e;font-size:9px;font-weight:700;text-transform:uppercase;">Receipt</p>
                                <p style="margin:0;color:#0F6E56;font-size:13px;font-weight:800;letter-spacing:.4px;">${paymentReference}</p>
                              </td>
                              <td valign="top" style="width:35%;padding-left:10px;border-left:1px solid #dcebe5;">
                                <p style="margin:0 0 5px;color:#77868e;font-size:9px;font-weight:700;text-transform:uppercase;">Date &amp; time</p>
                                <p style="margin:0;color:#223744;font-size:11px;line-height:1.45;">${new Date(paymentDate).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td class="email-section" bgcolor="#ffffff" style="padding:20px 38px 34px;background-color:#ffffff!important;font-family:Arial,Helvetica,sans-serif;">
                    <p style="margin:0 0 16px;color:#405460;font-size:14px;line-height:1.75;">Your official <strong style="color:#223744;">Admission Letter</strong>, including the Rules &amp; Regulations, is attached to this email. Please review it carefully, print it, sign the required sections, and bring it with you on your admission day.</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;background:#f5f8fa;border-radius:10px;">
                      <tr>
                        <td width="40" align="center" valign="top" style="padding:14px 0 14px 14px;color:#2F79B7;font-size:18px;">&#128206;</td>
                        <td style="padding:14px 16px 14px 10px;color:#405460;font-size:13px;line-height:1.55;"><strong style="color:#223744;">Attached document</strong><br/>Official Admission Letter and institutional requirements (PDF)</td>
                      </tr>
                    </table>
                    <p style="margin:24px 0 0;color:#405460;font-size:14px;line-height:1.65;">We look forward to welcoming you to Kinoo VTC.</p>
                    <p style="margin:20px 0 0;color:#223744;font-size:14px;line-height:1.55;"><strong>Admissions Office</strong><br/>Kinoo Vocational Training Centre</p>
                  </td>
                </tr>

                <tr>
                  <td bgcolor="#f7f9fa" style="padding:20px 28px;background-color:#f7f9fa!important;border-top:1px solid #e2e9ec;text-align:center;font-family:Arial,Helvetica,sans-serif;">
                    <p style="margin:0 0 6px;color:#0F6E56;font-size:11px;font-weight:800;letter-spacing:.5px;">TECHNOLOGY FOR EMPOWERMENT</p>
                    <p style="margin:0;color:#7b8991;font-size:11px;line-height:1.6;">P.O. Box 351-00902, Kikuyu &nbsp;|&nbsp; Tel: 0113 582 008<br/>kinoovtc@gmail.com &nbsp;|&nbsp; www.kinoovtc.ac.ke</p>
                    <p style="margin:10px 0 0;color:#9aa5ab;font-size:10px;">&copy; ${new Date().getFullYear()} Kinoo Vocational Training Centre, Kiambu County</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
      </body>
      </html>
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
    const legacyAdminHtmlContent = `
      <div style="font-family: 'Times New Roman', Times, serif; color: #333; max-width: 600px; width: 100%; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-sizing: border-box;">
        <div style="background-color: #fffdf8; padding: 20px; text-align: center; border-top: 5px solid #0F6E56; border-bottom: 2px solid #d7e9e2;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 12px;">
            <tr>
              <td style="padding: 0 14px; vertical-align: middle;">
                <img src="${baseUrl}/kvtc_logo.png" alt="KVTC Logo" style="display: block; width: 78px; height: 78px; object-fit: cover; object-position: 50% 18%;" />
              </td>
              <td style="padding: 0 14px; vertical-align: middle;">
                <img src="${baseUrl}/cgok-logo.png" alt="CGOK Logo" style="display: block; width: 64px; height: 64px; object-fit: contain;" />
              </td>
            </tr>
          </table>
          <h1 style="color: #17352c; margin: 0; font-size: 22px; letter-spacing: 1px;">NEW ADMISSION RECEIVED</h1>
          <p style="color: #0F6E56; margin: 6px 0 0; font-size: 14px; font-weight: bold;">Kinoo Vocational Training Centre</p>
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
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; vertical-align: top;"><strong>M-PESA Receipt</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee; word-break: break-word; font-weight: bold;">${paymentReference}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; vertical-align: top;"><strong>Payment Time</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee; word-break: break-word;">${new Date(paymentDate).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; color: #666; vertical-align: top;"><strong>Payment Phone</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee; word-break: break-word;">${paymentPhone}</td></tr>
          </table>

          <p style="font-size: 15px; color: #555; background: #f0fdf4; padding: 12px; border-radius: 6px; border: 1px solid #bbf7d0; line-height: 1.5; margin: 0;">
            ✅ The fully filled and signed <strong>Admission Form</strong> is attached to this email.
          </p>
        </div>
      </div>
    `;

    const adminHtmlContent = `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="color-scheme" content="light only">
        <meta name="supported-color-schemes" content="light only">
        <title>New Kinoo VTC Application</title>
        <style>
          :root { color-scheme:light only; supported-color-schemes:light only; }
          body, table, td, div, p, h1 { color-scheme:light only !important; }
          @media only screen and (max-width:560px) {
            .email-page { padding:0 !important; }
            .email-card { border-left:0 !important; border-right:0 !important; }
            .content-cell { padding-left:20px !important; padding-right:20px !important; }
            .summary-label { width:36% !important; }
          }
          @media (prefers-color-scheme:dark) {
            .email-page, .email-card, .email-section {
              background-color:#ffffff !important;
              background-image:linear-gradient(#ffffff,#ffffff) !important;
            }
          }
        </style>
      </head>
      <body class="email-page" bgcolor="#ffffff" style="margin:0;padding:0;background:#ffffff!important;color:#405460;">
        <div class="email-page" style="padding:24px 10px;background:#f2f5f7!important;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td align="center">
              <table class="email-card" role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%;max-width:640px;border-collapse:collapse;background:#ffffff!important;border:1px solid #dce5e9;">
                <tr>
                  <td bgcolor="#203b49" style="padding:11px 28px;background:#203b49!important;font-family:Arial,Helvetica,sans-serif;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                      <td style="color:#d7e4ea;font-size:10px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">Kinoo VTC Admissions</td>
                      <td align="right"><span style="display:inline-block;padding:5px 9px;border-radius:999px;background:#ffffff;color:#203b49;font-size:9px;font-weight:800;letter-spacing:.7px;">PAID APPLICATION</span></td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td class="email-section content-cell" bgcolor="#ffffff" style="padding:32px 38px 15px;background:#ffffff!important;font-family:Arial,Helvetica,sans-serif;">
                    <p style="margin:0 0 7px;color:#2f79b7;font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">New online application</p>
                    <h1 style="margin:0 0 9px;color:#172b3a!important;font-size:27px;line-height:1.25;font-weight:750;">${name}</h1>
                    <p style="margin:0;color:#60717d!important;font-size:14px;line-height:1.7;">A completed application for <strong style="color:#223744;">${course}</strong> has been received and its M-PESA payment verified.</p>
                  </td>
                </tr>
                <tr>
                  <td class="email-section content-cell" bgcolor="#ffffff" style="padding:12px 38px 8px;background:#ffffff!important;font-family:Arial,Helvetica,sans-serif;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#f8fafb;border:1px solid #dfe8ec;border-radius:12px;">
                      <tr><td colspan="2" style="padding:14px 17px 10px;color:#25384a;font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;border-bottom:1px solid #e3eaed;">Application summary</td></tr>
                      <tr><td class="summary-label" width="34%" style="padding:13px 17px 7px;color:#74838d;font-size:10px;font-weight:700;text-transform:uppercase;">Applicant</td><td style="padding:13px 17px 7px;color:#223744;font-size:14px;font-weight:700;">${name}</td></tr>
                      <tr><td style="padding:7px 17px;color:#74838d;font-size:10px;font-weight:700;text-transform:uppercase;">Programme</td><td style="padding:7px 17px;color:#223744;font-size:14px;font-weight:700;">${course}</td></tr>
                      <tr><td style="padding:7px 17px;color:#74838d;font-size:10px;font-weight:700;text-transform:uppercase;">Phone</td><td style="padding:7px 17px;color:#223744;font-size:14px;"><a href="tel:${phone}" style="color:#245a87;text-decoration:none;">${phone}</a></td></tr>
                      <tr><td style="padding:7px 17px;color:#74838d;font-size:10px;font-weight:700;text-transform:uppercase;">Email</td><td style="padding:7px 17px;color:#223744;font-size:14px;word-break:break-word;"><a href="mailto:${email}" style="color:#245a87;text-decoration:none;">${email || 'Not provided'}</a></td></tr>
                      <tr><td style="padding:7px 17px 14px;color:#74838d;font-size:10px;font-weight:700;text-transform:uppercase;">ID number</td><td style="padding:7px 17px 14px;color:#223744;font-size:14px;">${idNo}</td></tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="email-section content-cell" bgcolor="#ffffff" style="padding:12px 38px 8px;background:#ffffff!important;font-family:Arial,Helvetica,sans-serif;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#fbfdfc;border:1px solid #cfe6dc;border-radius:12px;">
                      <tr>
                        <td style="padding:14px 17px;border-bottom:1px solid #dcebe5;color:#173f32;font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;">M-PESA payment verification</td>
                        <td align="right" style="padding:14px 17px;border-bottom:1px solid #dcebe5;"><span style="display:inline-block;padding:4px 9px;background:#0f6e56;color:#ffffff;border-radius:999px;font-size:10px;font-weight:800;">CONFIRMED</span></td>
                      </tr>
                      <tr><td colspan="2" style="padding:17px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                          <td valign="top" width="30%" style="padding-right:12px;"><p style="margin:0 0 5px;color:#77868e;font-size:9px;font-weight:700;text-transform:uppercase;">Amount</p><p style="margin:0;color:#173f32;font-size:17px;font-weight:800;">KSh ${admissionAmount}</p></td>
                          <td valign="top" width="34%" style="padding:0 12px;border-left:1px solid #dcebe5;"><p style="margin:0 0 5px;color:#77868e;font-size:9px;font-weight:700;text-transform:uppercase;">Receipt</p><p style="margin:0;color:#0f6e56;font-size:13px;font-weight:800;letter-spacing:.3px;">${paymentReference}</p></td>
                          <td valign="top" width="36%" style="padding-left:12px;border-left:1px solid #dcebe5;"><p style="margin:0 0 5px;color:#77868e;font-size:9px;font-weight:700;text-transform:uppercase;">Date &amp; time</p><p style="margin:0;color:#223744;font-size:11px;line-height:1.45;">${new Date(paymentDate).toLocaleString('en-KE', { timeZone:'Africa/Nairobi' })}</p></td>
                        </tr></table>
                      </td></tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td class="email-section content-cell" bgcolor="#ffffff" style="padding:12px 38px 10px;background:#ffffff!important;font-family:Arial,Helvetica,sans-serif;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#f5f8fa;border:1px solid #dfe8ec;border-radius:12px;"><tr>
                      <td width="46" align="center" valign="top" style="padding:17px 0 17px 16px;color:#2f79b7;font-size:20px;">&#128206;</td>
                      <td style="padding:16px 17px 16px 10px;color:#405460;font-size:13px;line-height:1.6;"><strong style="display:block;margin-bottom:3px;color:#223744;font-size:14px;">Completed admission form attached</strong>The filled and signed PDF contains the remaining application details for institutional review.</td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td class="email-section content-cell" bgcolor="#ffffff" style="padding:12px 38px 34px;background:#ffffff!important;font-family:Arial,Helvetica,sans-serif;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                      <td style="padding-right:10px;"><a href="mailto:${email}?subject=${encodeURIComponent(`Re: Kinoo VTC application - ${course}`)}" style="display:inline-block;padding:12px 17px;border-radius:8px;background:#245a87;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;">Email applicant</a></td>
                      <td><a href="tel:${phone}" style="display:inline-block;padding:11px 17px;border:1px solid #cbd8df;border-radius:8px;background:#ffffff;color:#29434f;text-decoration:none;font-size:13px;font-weight:700;">Call applicant</a></td>
                    </tr></table>
                    <p style="margin:20px 0 0;color:#71818a;font-size:11px;line-height:1.6;">Payment phone: ${paymentPhone}. Automated admissions notification for internal institutional use.</p>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#f7f9fa" style="padding:18px 28px;background:#f7f9fa!important;border-top:1px solid #e2e9ec;text-align:center;font-family:Arial,Helvetica,sans-serif;">
                    <p style="margin:0 0 5px;color:#245a87;font-size:11px;font-weight:800;letter-spacing:.5px;">KINOO VOCATIONAL TRAINING CENTRE</p>
                    <p style="margin:0;color:#7b8991;font-size:10px;line-height:1.6;">Admissions administration notification &nbsp;|&nbsp; ${new Date().toLocaleString('en-KE', { timeZone:'Africa/Nairobi' })}</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </div>
      </body>
      </html>
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
        paymentReference,
        paymentDate,
        paymentPhone,
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
