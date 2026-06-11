import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export async function POST(req) {
  try {
    const formData = await req.formData();
    const fname = formData.get('fname') || '';
    const lname = formData.get('lname') || '';
    const phone = formData.get('phone') || '';
    const email = formData.get('email') || '';
    const course = formData.get('course') || 'General Inquiry';
    const msg = formData.get('msg') || 'N/A';

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('EMAIL_USER or EMAIL_PASS not set - skipping email send.');
      return NextResponse.json({ success: true, message: 'Simulated email send (no credentials)' });
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;
    const safeFname = escapeHtml(fname);
    const safeLname = escapeHtml(lname);
    const safePhone = escapeHtml(phone);
    const safeEmail = escapeHtml(email || 'Not provided');
    const safeCourse = escapeHtml(course);
    const safeMessage = escapeHtml(msg).replaceAll(/\r?\n/g, '<br>');
    const submittedAt = new Date().toLocaleString('en-KE', {
      timeZone: 'Africa/Nairobi',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    const replySubject = encodeURIComponent(`Re: Your Kinoo VTC enquiry about ${course}`);

    // Table-based markup keeps the official letterhead reliable in Gmail and Outlook.
    const htmlContent = `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="color-scheme" content="light only">
        <meta name="supported-color-schemes" content="light only">
        <title>New Kinoo VTC Website Enquiry</title>
        <style>
          :root { color-scheme: light only; supported-color-schemes: light only; }
          body, table, td, div, p, h1 { color-scheme: light only !important; }
          @media only screen and (max-width: 560px) {
            .email-page { padding: 0 !important; }
            .email-card { border-left: 0 !important; border-right: 0 !important; }
            .letterhead { padding: 9px 7px 8px !important; }
            .letterhead-logo { width: 58px !important; height: 58px !important; }
            .letterhead-logo-cell { width: 62px !important; }
            .letterhead-county { font-size: 8px !important; letter-spacing: .35px !important; }
            .letterhead-department { font-size: 8px !important; }
            .letterhead-name { font-size: 10px !important; letter-spacing: .25px !important; }
            .letterhead-contact { font-size: 7px !important; }
            .content-cell { padding-left: 20px !important; padding-right: 20px !important; }
            .detail-label { width: 38% !important; }
          }
          @media (prefers-color-scheme: dark) {
            .email-page, .email-card, .email-section, .letterhead {
              background-color: #ffffff !important;
              background-image: linear-gradient(#ffffff, #ffffff) !important;
            }
          }
        </style>
      </head>
      <body class="email-page" bgcolor="#ffffff" style="margin:0;padding:0;background:#ffffff!important;color:#405460;">
        <div class="email-page" style="padding:24px 10px;background:#f4f7f9!important;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
            <tr>
              <td align="center">
                <table class="email-card" role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:100%;max-width:640px;border-collapse:collapse;background:#ffffff!important;border:1px solid #dce5e9;">
                  <tr>
                    <td class="letterhead" bgcolor="#ffffff" style="padding:10px 14px 9px;background:#ffffff!important;border-bottom:4px solid #2f79b7;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                        <tr>
                          <td class="letterhead-logo-cell" width="94" align="left" valign="middle" style="width:94px;">
                            <img class="letterhead-logo" src="${baseUrl}/kvtc_logo.png" width="88" height="88" alt="Kinoo Vocational Training Centre" style="display:block;width:88px;height:88px;object-fit:cover;object-position:50% 18%;border:0;">
                          </td>
                          <td align="center" valign="middle" style="padding:0 8px;font-family:'Times New Roman',Times,serif;">
                            <p class="letterhead-county" style="margin:0 0 4px;color:#b59b69!important;font-size:11px;font-weight:700;letter-spacing:.7px;">COUNTY GOVERNMENT OF KIAMBU</p>
                            <p class="letterhead-department" style="margin:0 0 4px;color:#1f2f4d!important;font-size:11px;font-weight:700;line-height:1.25;">Department Of Education, Gender, Culture &amp; Social Services</p>
                            <p class="letterhead-name" style="margin:0 0 5px;color:#4c9daa!important;font-size:13px;font-weight:800;line-height:1.25;letter-spacing:.7px;">KINOO VOCATIONAL TRAINING CENTRE</p>
                            <p class="letterhead-contact" style="margin:0 0 2px;color:#30364b!important;font-size:10px;line-height:1.35;">P.O BOX 351-00902, Kikuyu. &nbsp; Tel: 0113582008</p>
                            <p class="letterhead-contact" style="margin:0;color:#30364b!important;font-size:10px;line-height:1.35;">kinoovtc@gmail.com &nbsp; www.kinoovtc.ac.ke</p>
                          </td>
                          <td class="letterhead-logo-cell" width="82" align="right" valign="middle" style="width:82px;">
                            <img class="letterhead-logo" src="${baseUrl}/cgok-logo.png" width="76" height="76" alt="County Government of Kiambu" style="display:block;width:76px;height:76px;margin-left:auto;object-fit:contain;border:0;">
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td class="email-section content-cell" bgcolor="#ffffff" style="padding:32px 38px 14px;background:#ffffff!important;font-family:Arial,Helvetica,sans-serif;">
                      <span style="display:inline-block;padding:6px 10px;background:#eef5fa;color:#245a87;border:1px solid #d5e5f1;border-radius:999px;font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">Website enquiry</span>
                      <h1 style="margin:14px 0 8px;color:#172b3a!important;font-size:25px;line-height:1.25;font-weight:750;">New enquiry from ${safeFname} ${safeLname}</h1>
                      <p style="margin:0;color:#60717d!important;font-size:14px;line-height:1.7;">A prospective trainee has contacted Kinoo VTC through the official website.</p>
                    </td>
                  </tr>

                  <tr>
                    <td class="email-section content-cell" bgcolor="#ffffff" style="padding:12px 38px 8px;background:#ffffff!important;font-family:Arial,Helvetica,sans-serif;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;background:#f8fafb;border:1px solid #dfe8ec;border-radius:12px;">
                        <tr>
                          <td colspan="2" style="padding:14px 17px 10px;color:#25384a;font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;border-bottom:1px solid #e3eaed;">Enquirer details</td>
                        </tr>
                        <tr>
                          <td class="detail-label" width="34%" style="padding:13px 17px 7px;color:#74838d;font-size:10px;font-weight:700;text-transform:uppercase;">Full name</td>
                          <td style="padding:13px 17px 7px;color:#223744;font-size:14px;font-weight:700;">${safeFname} ${safeLname}</td>
                        </tr>
                        <tr>
                          <td style="padding:7px 17px;color:#74838d;font-size:10px;font-weight:700;text-transform:uppercase;">Phone</td>
                          <td style="padding:7px 17px;color:#223744;font-size:14px;"><a href="tel:${safePhone}" style="color:#245a87;text-decoration:none;">${safePhone}</a></td>
                        </tr>
                        <tr>
                          <td style="padding:7px 17px;color:#74838d;font-size:10px;font-weight:700;text-transform:uppercase;">Email</td>
                          <td style="padding:7px 17px;color:#223744;font-size:14px;">${email ? `<a href="mailto:${safeEmail}" style="color:#245a87;text-decoration:none;">${safeEmail}</a>` : safeEmail}</td>
                        </tr>
                        <tr>
                          <td style="padding:7px 17px;color:#74838d;font-size:10px;font-weight:700;text-transform:uppercase;">Interest</td>
                          <td style="padding:7px 17px;color:#223744;font-size:14px;font-weight:700;">${safeCourse}</td>
                        </tr>
                        <tr>
                          <td style="padding:7px 17px 14px;color:#74838d;font-size:10px;font-weight:700;text-transform:uppercase;">Received</td>
                          <td style="padding:7px 17px 14px;color:#223744;font-size:13px;">${submittedAt} EAT</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td class="email-section content-cell" bgcolor="#ffffff" style="padding:12px 38px 10px;background:#ffffff!important;font-family:Arial,Helvetica,sans-serif;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;background:#fbfcfd;border:1px solid #dfe8ec;border-radius:12px;">
                        <tr>
                          <td style="padding:14px 17px 10px;color:#25384a;font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;border-bottom:1px solid #e3eaed;">Enquiry message</td>
                        </tr>
                        <tr>
                          <td style="padding:17px;color:#405460;font-size:14px;line-height:1.75;">${safeMessage}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td class="email-section content-cell" bgcolor="#ffffff" style="padding:12px 38px 34px;background:#ffffff!important;font-family:Arial,Helvetica,sans-serif;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          ${email ? `<td style="padding-right:10px;"><a href="mailto:${safeEmail}?subject=${replySubject}" style="display:inline-block;padding:12px 17px;border-radius:8px;background:#245a87;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;">Reply by email</a></td>` : ''}
                          <td><a href="tel:${safePhone}" style="display:inline-block;padding:11px 17px;border:1px solid #cbd8df;border-radius:8px;background:#ffffff;color:#29434f;text-decoration:none;font-size:13px;font-weight:700;">Call enquirer</a></td>
                        </tr>
                      </table>
                      <p style="margin:20px 0 0;color:#71818a;font-size:11px;line-height:1.6;">This notification was generated automatically from the official Kinoo VTC contact form.</p>
                    </td>
                  </tr>

                  <tr>
                    <td bgcolor="#f7f9fa" style="padding:19px 28px;background:#f7f9fa!important;border-top:1px solid #e2e9ec;text-align:center;font-family:Arial,Helvetica,sans-serif;">
                      <p style="margin:0 0 6px;color:#245a87;font-size:11px;font-weight:800;letter-spacing:.5px;">TECHNOLOGY FOR EMPOWERMENT</p>
                      <p style="margin:0;color:#7b8991;font-size:11px;line-height:1.6;">P.O. Box 351-00902, Kikuyu &nbsp;|&nbsp; Tel: 0113 582 008<br>kinoovtc@gmail.com &nbsp;|&nbsp; www.kinoovtc.ac.ke</p>
                      <p style="margin:9px 0 0;color:#9aa5ab;font-size:10px;">&copy; ${new Date().getFullYear()} Kinoo Vocational Training Centre, Kiambu County</p>
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

    const adminEmail = process.env.RECEIVER_EMAIL || process.env.EMAIL_USER;
    const mailOptions = {
      from: `"KVTC Website" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      replyTo: email || undefined,
      subject: `New Enquiry: ${course} - ${fname} ${lname}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: 'Enquiry sent successfully.' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return NextResponse.json({ success: false, message: 'Failed to send email' }, { status: 500 });
  }
}
