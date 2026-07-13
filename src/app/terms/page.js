"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      
      {/* Premium Hero Section */}
      <section className="legal-hero">
        <div className="legal-hero-content">
          <h1>Terms of Service</h1>
          <p>Last updated: July 2026</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="legal-content-wrapper">
        <div className="legal-content">
          <p className="lead-text">
            Welcome to the Kinoo Vocational Training Centre (KVTC) platform. By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use the KVTC platform if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2>2. Educational Services</h2>
          <p>
            KVTC provides vocational training, technical education, and certification in various disciplines. The course information, fee structures, and intake dates published on this website are subject to change based on institutional policies or government directives.
          </p>

          <h2>3. Application and Enrollment</h2>
          <ul>
            <li>Application fees paid via the platform (M-PESA) are non-refundable unless otherwise stated by the KVTC administration.</li>
            <li>Submission of an application does not guarantee admission. Admissions are subject to meeting the course requirements and availability of slots.</li>
            <li>Users must provide accurate, current, and complete information during the application process.</li>
          </ul>

          <h2>4. Platform Usage & AI Assistant (ARIA)</h2>
          <p>
            Our intelligent assistant, ARIA, is designed to provide guidance on admissions, courses, and fees. While we strive for 100% accuracy, the responses provided by ARIA are for informational purposes. Final decisions regarding admissions and fees are governed by the official institutional documentation provided by the KVTC administration office.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            Unless otherwise stated, KVTC and/or its licensors own the intellectual property rights for all material on this platform. All intellectual property rights are reserved. You may access this from KVTC for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from the KVTC platform</li>
            <li>Sell, rent, or sub-license material from the KVTC platform</li>
            <li>Reproduce, duplicate or copy material from the KVTC platform</li>
          </ul>

          <h2>6. Limitation of Liability</h2>
          <p>
            In no event shall KVTC, nor any of its officers, directors, or employees, be held liable for anything arising out of or in any way connected with your use of this website. KVTC shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website.
          </p>

          <h2>7. Contact Information</h2>
          <p>
            If you have any queries regarding any of our terms, please contact us at:
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
          background: linear-gradient(135deg, #0f172a 0%, #0F6E56 100%);
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
          border-left: 4px solid #0F6E56;
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
          color: #0F6E56;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .back-link a:hover {
          color: #0c5a46;
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
