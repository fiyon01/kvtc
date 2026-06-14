# Kinoo Vocational Training Center (KVTC) Platform

![KVTC Platform Overview](/kvtc_logo.png)

A state-of-the-art educational institution platform built for Kinoo Vocational Training Center. This application serves as the primary gateway for prospective students, offering an unparalleled enrollment experience powered by multi-layered AI, exit-intent lead capture, and comprehensive institutional analytics.

## 🌟 Key Features

### 1. ARIA (AI Recruiting & Institutional Assistant)
An intelligent, multi-turn conversational AI embedded directly into the platform that acts as a 24/7 admissions officer.
- **Multi-Model Provider Waterfall:** Seamlessly cascades through OpenRouter, Gemini, Groq, and HuggingFace to ensure 100% uptime.
- **Local Fallback Engine:** Features a custom NLP local fallback engine ensuring ARIA can answer questions and assist users even if all external LLM APIs are completely down.
- **Rich Interactive Cards:** ARIA doesn't just return text; it returns interactive React cards (Course Requirements, Fee Advisors, Application Guides, and WhatsApp Handoffs).

### 2. High-Conversion Student Funnel
A highly optimized 5-stage student acquisition funnel (Visitors → Chats → Started App → Completed App → Enrolled).
- **Exit-Intent WhatsApp Lead Capture:** Automatically detects when a user is about to leave the site (or has spent 35+ seconds on page) and captures their Name, Phone, and Course of Interest.
- **Supabase Integration:** Analytics, funnel metrics, and captured leads are securely stored in a Supabase Postgres database via Service Role Keys, seamlessly bypassing client-side RLS.

### 3. Comprehensive Admin Dashboard
A secure, beautiful command center for institutional leadership.
- **Lead Management:** Instantly view captured leads with 1-click WhatsApp integration to contact prospective students.
- **Content Management System (CMS):** Full control over Courses, Departments, Events, Fee Structures, FAQs, and the Homepage Intake Banner.
- **Analytics:** Real-time visibility into the Student Funnel and popular course trends.

### 4. Seamless Admissions Flow
- **M-PESA Integration:** Ready-to-go architecture for application fee processing.
- **Responsive Premium UI:** Built with modern design principles, fluid gradients, glassmorphism, and micro-animations to create a premium, "wow" aesthetic across all devices.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Styling:** Vanilla CSS (Modular & Dynamic) + Lucide React Icons
- **Database:** [Supabase](https://supabase.com) (PostgreSQL) + Local JSON Fallback
- **AI Infrastructure:** Multiple LLM APIs orchestrated by a custom waterfall router
- **Email:** Nodemailer (for instant admin alerts)

## 🛠️ Getting Started

First, install dependencies:

```bash
npm install
```

Configure your environment variables by creating a `.env.local` file:

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin Security
ADMIN_PASSWORD=your_secure_password
ADMIN_SESSION_SECRET=your_jwt_secret

# AI Providers
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
OPENROUTER_API_KEY=your_openrouter_key
HUGGINGFACE_API_KEY=your_hf_key

# Communications
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The Admin Dashboard is accessible via `/admin`.

## 📜 License
This project is proprietary and built specifically for Kinoo Vocational Training Center.
