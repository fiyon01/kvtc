"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  const [db, setDb] = useState(null);
  const [isActive, setIsActive] = useState(false);

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

  const socialStyle = { color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s', display: 'flex' };
  const colHeaderStyle = { color: '#fff', fontSize: '15px', fontWeight: 600, marginBottom: '20px' };
  const footerLinkStyle = { color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' };

  return (
    <footer style={{ background: '#111', color: 'rgba(255,255,255,0.6)', padding: '60px 5% 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr', gap: '40px', marginBottom: '48px' }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '8px',
              background: '#0F6E56',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: 'var(--serif)', fontSize: '16px', fontWeight: 700,
            }}>KV</div>
            <div>
              <strong style={{ display: 'block', color: '#fff', fontSize: '14px' }}>Kinoo VTC</strong>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Kiambu County</span>
            </div>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.7, marginBottom: '20px', maxWidth: '280px' }}>
            Kiambu County's premier public vocational training centre offering NITA & KNEC-certified courses in 13+ technical disciplines.
          </p>
          {/* Social Links */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="#" aria-label="Facebook" style={{...socialStyle}} onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.4)'}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" style={{...socialStyle}} onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.4)'}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" aria-label="TikTok" style={{...socialStyle}} onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.4)'}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={colHeaderStyle}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[['/', 'Home'], ['/about', 'About Us'], ['/courses', 'Programmes'], ['/admissions', 'Fees & Admissions'], ['/faqs', 'FAQs'], ['/blog', 'Blog'], ['/contact', 'Contact'], ['/prospectus', '⬇ Prospectus']].map(([href, label]) => (
              <li key={href}><Link href={href} style={footerLinkStyle} onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.6)'}>{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Programmes */}
        <div>
          <h4 style={colHeaderStyle}>Programmes</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['NITA Grade 3 Courses', 'KNEC Artisan', 'Short Courses', 'Part-Time Classes', 'Computer Packages'].map(name => (
              <li key={name}><Link href="/courses" style={footerLinkStyle} onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.6)'}>{name}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={colHeaderStyle}>Contact</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}>
              <span>📍</span>
              <span>P.O. Box 351-00902, Kikuyu, Kiambu County</span>
            </li>
            <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}>
              <span>📞</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <a href="tel:+254113582008" style={{ color: '#1D9E75', textDecoration: 'none' }}>0113 582 008</a>
                <a href="tel:+254748455116" style={{ color: '#1D9E75', textDecoration: 'none' }}>0748 455 116</a>
              </div>
            </li>
            <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}>
              <span>✉️</span>
              <a href="mailto:kinoovtc@gmail.com" style={{ color: '#1D9E75', textDecoration: 'none' }}>kinoovtc@gmail.com</a>
            </li>
            <li style={{ fontSize: '13px', display: 'flex', gap: '8px' }}>
              <span>🕐</span>
              <span>Mon–Fri: 8am – 5pm</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Admission CTA Banner */}
      {isActive && (
        <div style={{
          background: 'linear-gradient(135deg, #0F6E56, #085041)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          <h3 style={{ fontFamily: 'var(--serif)', color: '#fff', fontSize: '1.8rem', marginBottom: '12px' }}>
            {db?.intake?.yearText} Intake is Now Open!
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            Don't miss your chance to enroll in Kenya's most affordable vocational training centre.
          </p>
          <Link href="/apply" style={{
            background: '#EF9F27', color: '#1a1a1a', display: 'inline-block',
            padding: '14px 32px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none',
          }}>Start Your Application</Link>
        </div>
      )}

      {/* Footer Bottom */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px', fontSize: '12px',
      }}>
        <p>&copy; {year} Kinoo Vocational Training Centre. All rights reserved.</p>
        <p>County Government of Kiambu | Department of Education</p>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          footer > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

const colHeaderStyle = {
  fontSize: '13px', fontWeight: 600, color: '#fff',
  marginBottom: '16px', letterSpacing: '0.5px', textTransform: 'uppercase',
};
const footerLinkStyle = {
  fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none',
};
const socialStyle = {
  width: '36px', height: '36px', borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'all 0.2s',
};
