# Kinoo Vocational Training Centre Website

## Project Documentation and Quotation

Prepared for: Kinoo Vocational Training Centre  
Prepared by: Jonathan Kamau  
Date: 1 July 2026  
Payment Till Number: 4272666

---

## 1. Executive Summary

The Kinoo Vocational Training Centre website is a modern institutional admissions platform built to help students, parents, and administrators complete key admission tasks online.

The website is not only a brochure site. It includes course discovery, online applications, M-PESA admission fee payment, automatic PDF admission documents, email notifications, an admin panel, analytics, downloadable documents, and ARIA, a virtual admissions assistant.

The design goal is simple: make KVTC easier to understand, easier to apply to, and more trustworthy to prospective students and parents.

---

## 2. Website Modules and Features

### Public Website

- Modern homepage with KVTC and County Government branding.
- Responsive navigation for desktop and mobile users.
- Course search and course discovery.
- Department pages.
- About page with leadership and faculty presentation.
- Contact page with inquiry workflow.
- FAQ page.
- Prospectus preview and download.
- Fee structure preview and download.
- Floating WhatsApp support.
- Newsletter subscription.
- SEO sitemap and robots configuration.

### Courses and Admissions

- Course catalogue with individual course pages.
- Course filtering and search shortcuts.
- Course requirements modal shown during application.
- Course comparison support through ARIA.
- Admission guidance for students and parents.
- Online application form.
- Required form fields and validation.
- Passport photo upload on application form.
- Signature capture on application form.
- Course-specific admission document generation.

### Application and Payment Flow

- Applicant interest can be captured early when a user starts an application or uses the application wizard.
- If a user starts an application but does not complete payment/submission, the institution can still view the captured lead details for follow-up.
- Captured follow-up details can include name, phone number, selected course, application stage, and time started, depending on the information the user has already provided.
- This helps the admissions office call or message interested students who got stuck, ran out of time, or needed help completing the process.
- Applicant fills the admission form online, including passport photo upload.
- System validates required details before payment.
- M-PESA STK Push request is sent to the applicant phone.
- Payment uses idempotency protection to prevent duplicate STK pushes.
- Payment status is tracked using checkout request IDs.
- Application submission requires a valid M-PESA receipt number.
- When M-PESA is configured, application submission verifies the transaction before accepting the form.
- Admission letter PDF and filled admission form PDF are generated.
- Applicant receives admission letter by email.
- Institution receives the completed admission form by email, including the payment reference, payment date, payment time, amount paid, and payment phone.
- Payment reference, date, time, amount, and payment phone are included in admission records and email summaries.

### ARIA Virtual Admissions Assistant

- Chat-based admissions guidance.
- Course recommendation support.
- Fee explanation.
- Intake guidance.
- Course comparison cards.
- Application guidance and wizard entry.
- WhatsApp, call, and email handoff options.
- Swahili and English handling.
- Verified local data guard for sensitive institutional facts.
- AI provider fallback chain:
  - GitHub Models Phi
  - Groq
  - Hugging Face
  - Gemini
  - Local verified fallback
- Rate limiting for chat abuse prevention.
- Safety rules to reduce hallucinated courses, wrong addresses, fake links, and unverified job claims.

### Admin Panel

- Admin login.
- Supabase-backed admin authentication support.
- Admin role verification.
- Legacy local password fallback for development.
- Password reset/change support for admins.
- Application data visibility for authenticated admins only.
- Started-but-not-completed application lead visibility for admissions follow-up.
- Application funnel tracking showing where users start, continue, pay, submit, or drop off.
- Content/data management through protected API routes.
- Image upload endpoint restricted to authenticated admins.
- ARIA insights management structure.
- Analytics endpoints for applications, course interest, and funnel tracking.

### Emails and Documents

- Applicant confirmation email.
- Institution notification email.
- PDF admission letter.
- PDF admission form.
- Rules and regulations section.
- Prospectus PDF.
- Fee structure PDF.
- Institutional letterhead styling.
- KVTC and County Government logo usage.
- Payment confirmation section on documents.

---

## 3. Security Implementation

### HTTP Security Headers

The application includes security headers configured in `next.config.mjs`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Cross-Origin-Opener-Policy: same-origin`
- Content Security Policy with:
  - `default-src 'self'`
  - `object-src 'none'`
  - `frame-ancestors 'none'`
  - `form-action 'self'`
  - restricted image, font, style, script, and connection sources

### Admin Security

- Admin routes require authentication.
- Admin session cookie is HTTP-only.
- Cookie uses `sameSite: strict`.
- Cookie is secure in production.
- Session is HMAC-signed.
- Session duration is limited to 8 hours.
- Password comparison uses timing-safe comparison.
- Supabase admin login verifies that the user has an admin role.
- Public API responses hide sensitive admin-only data such as applications and newsletter subscribers.

### Rate Limiting

Rate limiting is implemented for:

- Admin login attempts.
- ARIA chat messages.
- M-PESA STK Push requests.
- Application submissions.

This reduces brute-force login attempts, payment abuse, spam, and bot activity.

### M-PESA Payment Security

- M-PESA credentials are read from environment variables.
- Daraja OAuth token is cached temporarily to reduce unnecessary requests.
- Daraja requests use a timeout.
- Phone numbers are normalized before sending to Daraja.
- STK Push requests require:
  - phone number
  - amount
  - idempotency key
  - applicant name
  - applicant ID or birth certificate number
  - selected course
- Duplicate payment attempts are prevented within the same payment window.
- Callback URL includes an HMAC token.
- Application submission verifies payment receipt and amount when M-PESA credentials are configured.

### Upload Security

- Upload endpoint is admin-only.
- Allowed file types:
  - JPEG
  - PNG
  - WebP
  - GIF
- Maximum upload size: 5 MB.
- Uploaded filenames use random UUIDs.

### Application Data Protection

- Application PDFs have a 10 MB limit.
- Application submission is rate-limited.
- Payment reference format is validated.
- Public data endpoint removes sensitive data for unauthenticated users.

---

## 4. Performance and Speed

The website is built on Next.js 16 with React 19.

Performance-focused implementation includes:

- Static generation for public pages where possible.
- Server-rendered API routes for dynamic workflows.
- Route-based code splitting.
- Optimized production build.
- Sitemap generation for SEO.
- Robots configuration.
- Reduced external dependencies.
- Local public assets for logos and branding.
- Responsive layouts for mobile and desktop.
- Clean PDF/document generation through server-side APIs.

The latest production build completed successfully, including static generation for 60 routes.

---

## 5. Technology Stack

- Next.js 16
- React 19
- Node.js API routes
- Supabase authentication support
- Safaricom Daraja M-PESA STK Push
- Nodemailer email delivery
- React PDF document generation
- Local JSON data storage with Supabase-ready architecture
- CSS-in-JS and custom responsive styling
- AI provider fallback architecture for ARIA

---

## 6. Deployment and Hosting

Hosting for this website is provided at no charge to the institution.

Quoted hosting cost: KSh 0

The institution should still budget separately for:

- Domain registration or renewal, if not already handled.
- SSL certificate.
- Email account/app-password configuration.
- M-PESA Daraja production credentials.
- Optional WhatsApp Business API or SMS costs.
- Optional future Supabase paid plan if traffic and storage grow.

---

## 7. Current Production Readiness Notes

The application has strong foundations for production use. Before final public launch, the following operational items should be confirmed:

- Production M-PESA credentials are correct.
- M-PESA callback URL points to the live domain.
- Admin password is changed from any temporary setup password.
- Email sending account is configured using secure app credentials.
- Supabase production tables are deployed where applicable.
- Backups are enabled for application data.
- Domain DNS is correctly pointed.
- SSL certificate is installed.
- Final client review of course names, fees, contacts, and leadership details is completed.

---

## 8. Quotation

### Recommended Project Fee

| Item | Description | Amount |
|---|---|---:|
| UI/UX design and institutional branding | Modern KVTC interface, responsive layouts, navigation, homepage, course pages, contact page, and client polish | KSh 20,000 |
| Frontend website development | Public pages, course catalogue, search/filtering, document preview pages, forms, and mobile responsiveness | KSh 28,000 |
| Online admissions system | Admission form, required-field validation, passport photo upload, signature capture, and course requirements display | KSh 22,000 |
| M-PESA admission payment flow | STK Push, duplicate request protection, payment reference handling, and payment verification checks | KSh 20,000 |
| PDF and email automation | Admission letter, admission form, fee structure, prospectus, applicant email, institution email, and letterhead styling | KSh 23,000 |
| ARIA virtual admissions assistant | Chat UI, AI provider fallback, verified data guard, course guidance, comparisons, and human handoff | KSh 20,000 |
| Admin panel and analytics | Admin login, protected application visibility, uploads, basic analytics, and content/data management | KSh 12,000 |
| Security hardening and testing | Security headers, rate limiting, upload restrictions, payment checks, admin session protection, and build verification | KSh 10,500 |
| Deployment and configuration | Production build, environment setup guidance, DNS/hosting setup support, and launch support | KSh 8,000 |
| Hosting | Provided free | KSh 0 |
| SSL certificate | Client-requested SSL certificate line item | KSh 1,500 |
| **Total** |  | **KSh 145,000** |

### Payment Plan

| Stage | Percentage | Amount |
|---|---:|---:|
| Down payment | 60% | KSh 87,000 |
| Balance on delivery | 40% | KSh 58,000 |
| **Total** | **100%** | **KSh 145,000** |

Payment should be made through Till Number: 4272666

---

## 9. Deliverables Included

- Fully responsive institutional website.
- Course catalogue and department pages.
- Online admissions flow.
- Started application lead tracking for admissions follow-up.
- M-PESA admission fee payment workflow.
- PDF admission letter and form generation.
- Fee structure and prospectus preview/download.
- Applicant and institution email notifications.
- ARIA admissions assistant.
- Admin panel.
- Basic analytics and funnel tracking.
- Security headers and rate limiting.
- SSL certificate line item.
- Free hosting setup.
- Launch support.

---

## 10. Items Not Included Unless Separately Agreed

- Paid hosting upgrades.
- Domain registration or renewal.
- WhatsApp Business API charges.
- Bulk SMS charges.
- Safaricom transaction fees.
- Paid AI API credits beyond available/free quotas.
- Long-term content entry after handover.
- Monthly maintenance after launch.
- Hardware, networking, or school IT infrastructure.

---

## 11. Monthly Maintenance Plan

After delivery, ongoing maintenance is available at:

Monthly maintenance fee: **KSh 10,000 per month**

Maintenance can include:

- Minor content updates.
- Monitoring.
- Security updates.
- Backup checks.
- M-PESA/email issue support.
- ARIA knowledge updates.
- Small layout fixes.
- Course, fee, intake, and contact information updates when provided by the institution.
- Assistance with uploaded documents such as fee structure and prospectus updates.

---

## 12. Professional Assessment

From a senior engineering and product perspective, this website is closer to an admissions platform than a standard school website.

The strongest business value is that it reduces friction in the student journey:

- Students can understand courses faster.
- Parents can ask questions before visiting.
- Applicants can apply online.
- The admissions team can follow up with interested users who started but did not finish their application.
- The institution receives structured applications.
- Payment confirmation is tied to the admission workflow.
- Documents are generated consistently.
- The admin team has better visibility.

The recommended quotation is therefore justified by the custom workflows, payment integration, document automation, security implementation, and AI-assisted admissions experience.

---

## 13. Acceptance

Client Name: _______________________________

Signature: _________________________________

Date: ______________________________________

Developer Signature: ________________________
