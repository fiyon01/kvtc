"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useToast } from './ToastProvider';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const [db, setDb] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterBusy, setNewsletterBusy] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setDb(data);
        if (data?.intake?.isOngoing) {
          const end = new Date(data.intake.endDate || '2026-12-31').getTime();
          setIsActive(Date.now() <= end);
        } else {
          setIsActive(false);
        }
      })
      .catch(console.error);
  }, []);

  const subscribe = async (event) => {
    event.preventDefault();
    if (newsletterBusy) return;
    setNewsletterBusy(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Subscription failed.');
      setNewsletterEmail('');
      showToast(result.message, 'success', { title: 'Newsletter' });
    } catch (error) {
      showToast(error.message || 'Subscription failed. Please try again.', 'error', { title: 'Newsletter' });
    } finally {
      setNewsletterBusy(false);
    }
  };

  return (
    <footer className="kvtc-footer">
      
      {/* Admission CTA Banner */}
      {isActive && (
        <div className="footer-cta-wrapper">
          <div className="footer-cta">
            <div className="footer-cta-content">
              <h3>{db?.intake?.yearText} Intake is Now Open!</h3>
              <p>Don't miss your chance to enroll in Kenya's most affordable vocational training centre.</p>
            </div>
            <Link href="/apply" className="footer-cta-btn">
              Start Your Application
            </Link>
          </div>
        </div>
      )}

      {/* Main Footer Links */}
      <div className="footer-main">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <img src="/kvtc_logo.png" alt="KVTC" className="footer-logo" />
            <div>
              <strong>Kinoo VTC</strong>
              <span>Kiambu County</span>
            </div>
          </div>
          <p className="footer-desc">
            Kiambu County's premier public vocational training centre offering NITA & KNEC-certified courses in 13+ technical disciplines.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col border-col">
          <h4>Quick Links</h4>
          <ul>
            {[['/', 'Home'], ['/about', 'About Us'], ['/courses', 'Programmes'], ['/admissions', 'Fees & Admissions'], ['/faqs', 'FAQs'], ['/blog', 'Blog'], ['/contact', 'Contact']].map(([href, label]) => (
              <li key={href}><Link href={href}>{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Programmes */}
        <div className="footer-col border-col">
          <h4>Programmes</h4>
          <ul>
            {['NITA Grade 3 Courses', 'KNEC Artisan', 'Short Courses', 'Part-Time Classes', 'Computer Packages'].map(name => (
              <li key={name}><Link href="/courses">{name}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col border-col">
          <h4>Contact Us</h4>
          <ul className="footer-contact">
            <li>
              <MapPin size={16} className="contact-icon" />
              <span>P.O. Box 351-00902, Kikuyu, Kiambu County</span>
            </li>
            <li>
              <Phone size={16} className="contact-icon" />
              <div className="contact-links">
                <a href="tel:+254113582008">0113 582 008</a>
                <a href="tel:+254748455116">0748 455 116</a>
              </div>
            </li>
            <li>
              <Mail size={16} className="contact-icon" />
              <a href="mailto:kinoovtc@gmail.com">kinoovtc@gmail.com</a>
            </li>
            <li>
              <Clock size={16} className="contact-icon" />
              <span>Mon–Fri: 8am – 5pm</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter */}
      <section className="footer-newsletter">
        <div className="newsletter-text">
          <span>Stay Connected</span>
          <h3>Get intake dates & campus updates.</h3>
        </div>
        <form onSubmit={subscribe} className="newsletter-form">
          <div className="newsletter-input-wrapper">
            <Mail size={18} className="newsletter-icon" />
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
            />
          </div>
          <button type="submit" disabled={newsletterBusy}>
            {newsletterBusy ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </section>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-flex">
          <p>&copy; {year} Kinoo Vocational Training Centre. All rights reserved.</p>
          <div className="footer-legal-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
        <p className="footer-gov">County Government of Kiambu | Department of Education</p>
      </div>

      <style jsx>{`
        .kvtc-footer {
          background: #0B1120;
          color: rgba(255, 255, 255, 0.6);
          padding: 80px 5% 40px;
          font-family: var(--sans);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* CTA Banner */
        .footer-cta-wrapper {
          margin-bottom: 60px;
        }
        .footer-cta {
          background: linear-gradient(135deg, #0F6E56, #1D9E75);
          border-radius: 24px;
          padding: 40px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          box-shadow: 0 20px 40px rgba(15, 110, 86, 0.2);
          position: relative;
          overflow: hidden;
        }
        .footer-cta::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
        }
        .footer-cta-content h3 {
          font-family: var(--serif);
          color: #fff;
          font-size: 2rem;
          margin: 0 0 12px;
          letter-spacing: -0.02em;
        }
        .footer-cta-content p {
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          font-size: 1.05rem;
          max-width: 500px;
        }
        .footer-cta-btn {
          background: #EF9F27;
          color: #1a1a1a;
          padding: 16px 32px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1.05rem;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
        }
        .footer-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(239, 159, 39, 0.4);
        }

        /* Main Grid */
        .footer-main {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 48px;
          margin-bottom: 60px;
        }

        .footer-col h4 {
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0 24px;
        }
        .footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .footer-col a {
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s ease;
        }
        .footer-col a:hover {
          color: #1D9E75;
        }

        /* Brand */
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .footer-logo {
          width: 48px;
          height: 48px;
          border-radius: 8px;
        }
        .footer-brand strong {
          display: block;
          color: #fff;
          font-size: 16px;
        }
        .footer-brand span {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }
        .footer-desc {
          font-size: 14px;
          line-height: 1.8;
          margin-bottom: 24px;
          max-width: 320px;
        }
        .footer-socials {
          display: flex;
          gap: 12px;
        }
        .footer-socials a {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .footer-socials a:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* Contact */
        .footer-contact li {
          display: flex;
          gap: 12px;
          font-size: 14px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.6);
          align-items: flex-start;
        }
        .contact-icon {
          color: #1D9E75;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .contact-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .contact-links a { color: #1D9E75 !important; }

        /* Newsletter */
        .footer-newsletter {
          background: linear-gradient(135deg, rgba(30, 58, 138, 0.2), rgba(15, 110, 86, 0.15));
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 40px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          margin-bottom: 48px;
        }
        .newsletter-text span {
          color: #4ade80;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .newsletter-text h3 {
          font-family: var(--serif);
          color: #fff;
          font-size: 1.75rem;
          margin: 8px 0 0;
        }
        .newsletter-form {
          display: flex;
          gap: 12px;
          background: rgba(255, 255, 255, 0.05);
          padding: 8px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
          max-width: 500px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }
        .newsletter-input-wrapper {
          display: flex;
          align-items: center;
          flex: 1;
          gap: 10px;
          padding: 0 16px;
        }
        .newsletter-icon {
          color: rgba(255, 255, 255, 0.4);
          flex-shrink: 0;
        }
        .newsletter-form input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 14.5px;
          outline: none;
          width: 100%;
        }
        .newsletter-form input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        .newsletter-form button {
          background: linear-gradient(135deg, #0F6E56, #1D9E75);
          color: #fff;
          border: none;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14.5px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(15, 110, 86, 0.3);
        }
        .newsletter-form button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(15, 110, 86, 0.4);
        }

        /* Bottom */
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 32px;
        }
        .footer-bottom-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 13px;
        }
        .footer-bottom-flex p {
          margin: 0;
        }
        .footer-legal-links {
          display: flex;
          gap: 24px;
        }
        .footer-legal-links a {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-legal-links a:hover {
          color: #fff;
        }
        .footer-gov {
          margin: 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
        }

        /* Mobile Responsive & Premium Dividers */
        @media (max-width: 1024px) {
          .footer-main {
            grid-template-columns: 1fr 1fr;
          }
          .footer-newsletter {
            flex-direction: column;
            align-items: flex-start;
            padding: 32px;
          }
          .newsletter-form {
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .kvtc-footer {
            padding: 60px 24px 32px;
          }
          .footer-cta {
            flex-direction: column;
            text-align: center;
            padding: 32px 24px;
          }
          .footer-cta-btn {
            width: 100%;
            text-align: center;
          }
          .footer-main {
            grid-template-columns: 1fr;
            gap: 0;
          }
          
          /* Premium Mobile Dividers */
          .border-col {
            padding: 32px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
          }
          .brand-col {
            padding-bottom: 32px;
          }

          .footer-newsletter {
            padding: 24px;
          }
          .newsletter-form {
            flex-direction: column;
            background: transparent;
            padding: 0;
            border: none;
            gap: 12px;
            box-shadow: none;
            backdrop-filter: none;
          }
          .newsletter-input-wrapper {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 16px;
            border-radius: 12px;
            width: 100%;
          }
          .newsletter-form input {
            background: transparent;
            border: none;
            padding: 0;
          }
          .newsletter-form button {
            width: 100%;
            padding: 16px;
          }
          
          .footer-bottom-flex {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }
      `}</style>
    </footer>
  );
}
