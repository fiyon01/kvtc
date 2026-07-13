"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      
      {/* Premium Hero Section */}
      <section className="legal-hero">
        <div className="legal-hero-content">
          <h1>Privacy Policy</h1>
          <p>Last updated: July 2026</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="legal-content-wrapper">
        <div className="legal-content">
          <p className="lead-text">
            At Kinoo Vocational Training Centre (KVTC), accessible from www.kinoovtc.ac.ke, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by KVTC and how we use it.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            When you interact with our platform, we may collect the following information:
          </p>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, phone number, and educational background provided during the application process or when subscribing to our newsletter.</li>
            <li><strong>Chat Data:</strong> Conversations had with our AI Assistant (ARIA) may be securely logged to improve the quality of our responses and assist with your admission inquiries.</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent on the site, and interaction with various components to help us optimize the user experience.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect in various ways, including to:</p>
          <ul>
            <li>Process your admission applications and M-PESA fee payments.</li>
            <li>Communicate with you regarding your application status, intake dates, and institutional updates.</li>
            <li>Improve, personalize, and expand our platform's user experience.</li>
            <li>Send you emails or WhatsApp messages if you opt-in to our lead capture or newsletter systems.</li>
          </ul>

          <h2>3. Data Security & Storage</h2>
          <p>
            We prioritize the security of your data. All personal information and application records are securely encrypted and stored in our database (powered by Supabase). Access to this data is strictly limited to authorized KVTC administration personnel via a secure, password-protected dashboard.
          </p>

          <h2>4. Third-Party Services</h2>
          <p>
            We may employ third-party companies and services to facilitate our platform, such as payment gateways (M-PESA) and AI processing engines (OpenRouter, Groq). These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>

          <h2>5. Cookies and Tracking</h2>
          <p>
            Like any other website, KVTC uses "cookies" to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            You have the right to request access to the personal data we hold about you, request corrections to any inaccurate data, or request the deletion of your data from our systems. To exercise these rights, please contact the administration office.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>
          <div className="contact-box">
            <p><strong>Email:</strong> kinoovtc@gmail.com</p>
            <p><strong>Phone:</strong> 0113 582 008 / 0748 455 116</p>
            <p><strong>Address:</strong> P.O. Box 351-00902, Kikuyu, Kiambu County</p>
          </div>
          
          <div className="back-link">
            <Link href="/">← Return to Homepage</Link>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .legal-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          padding: 160px 24px 80px;
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
        }
        .legal-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .legal-hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
        }
        .legal-hero h1 {
          font-family: var(--serif);
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin: 0 0 16px;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .legal-hero p {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          font-weight: 500;
        }

        .legal-content-wrapper {
          background: #f8fafc;
          padding: 80px 24px;
        }
        .legal-content {
          max-width: 800px;
          margin: 0 auto;
          background: #ffffff;
          padding: 60px;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
          font-family: var(--sans);
          color: #334155;
          line-height: 1.8;
        }

        .lead-text {
          font-size: 1.2rem;
          color: #475569;
          margin-bottom: 40px;
          line-height: 1.7;
        }

        .legal-content h2 {
          font-family: var(--serif);
          color: #0f172a;
          font-size: 1.75rem;
          margin: 48px 0 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .legal-content p {
          margin-bottom: 20px;
          font-size: 1.05rem;
        }

        .legal-content ul {
          margin: 0 0 24px 0;
          padding-left: 24px;
        }
        
        .legal-content li {
          margin-bottom: 12px;
          font-size: 1.05rem;
        }

        .contact-box {
          background: #f1f5f9;
          padding: 24px;
          border-radius: 12px;
          margin-top: 32px;
          border-left: 4px solid #1e3a8a;
        }

        .contact-box p {
          margin-bottom: 8px;
        }
        .contact-box p:last-child {
          margin-bottom: 0;
        }

        .back-link {
          margin-top: 60px;
          padding-top: 32px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        }
        .back-link a {
          color: #1e3a8a;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .back-link a:hover {
          color: #172554;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .legal-content {
            padding: 40px 24px;
            border-radius: 16px;
          }
          .legal-hero {
            padding: 120px 24px 60px;
          }
        }
      `}</style>
    </>
  );
}
