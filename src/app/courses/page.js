"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import db from '@/data/db.json';
const allCourses = db.courses;

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s ease`, ...style }}>
      {children}
    </div>
  );
}

const tabs = [
  { id: 'all', label: 'All Courses' },
  { id: 'nita', label: 'NITA Certified' },
  { id: 'knec', label: 'KNEC Certified' },
  { id: 'short', label: 'Short Courses' },
];

export default function Courses() {
  const [activeTab, setActiveTab] = useState('all');
  const filtered = allCourses.filter(c => activeTab === 'all' || c.type === activeTab);

  return (
    <>
      {/* Header */}
      <div style={{ padding: '140px 8% 70px', background: 'linear-gradient(135deg, rgba(15,110,86,0.07) 0%, #fff 100%)', borderBottom: '1px solid rgba(0,0,0,0.07)', textAlign: 'center' }}>
        <FadeIn>
          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px' }}>Our Programmes</span>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#1a1a1a', marginBottom: '16px' }}>Choose Your Path</h1>
          <p style={{ color: '#888', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto 24px' }}>17+ accredited courses across 8 departments. Full programmes run 1–2 years; short courses from 1–3 months.</p>
          {/* Prospectus download link */}
          <Link href="/prospectus" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#0F6E56', color: '#fff', padding: '12px 24px',
            borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none',
          }}>
            View Course Prospectus
          </Link>
        </FadeIn>
      </div>

      <section style={{ padding: '64px 8%', background: '#fff' }}>
        {/* Tabs */}
        <FadeIn style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '10px 22px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === tab.id ? '#0F6E56' : '#fff',
              color: activeTab === tab.id ? '#fff' : '#555',
              border: `1.5px solid ${activeTab === tab.id ? '#0F6E56' : 'rgba(0,0,0,0.1)'}`,
            }}>
              {tab.label}
            </button>
          ))}
        </FadeIn>

        {/* Course Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filtered.map((c, i) => (
            <FadeIn key={`${activeTab}-${i}`} delay={i * 0.04}>
              <Link href={`/courses/${c.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.25s, box-shadow 0.25s', height: '100%', display: 'flex', flexDirection: 'column' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 64px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#E1F5EE', position: 'relative', flexShrink: 0 }}>
                    <img src={c.img} alt={c.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                    <div style={{
                      position: 'absolute', bottom: '10px', right: '10px',
                      background: 'rgba(15,110,86,0.92)', color: '#fff',
                      fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px',
                    }}>View Details →</div>
                  </div>
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '4px 10px', borderRadius: '100px', alignSelf: 'flex-start', marginBottom: '10px' }}>{c.tag}</span>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', marginBottom: '16px', lineHeight: 1.4, flexGrow: 1 }}>{c.name}</h3>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.07)', marginBottom: '16px' }}>
                      {c.cert.toUpperCase() === 'NITA' && <img src="/nita.png" alt="NITA Certified" style={{ height: '18px', objectFit: 'contain', opacity: 0.9 }} title="NITA Certified" />}
                      {c.cert.toUpperCase() === 'KNEC' && <img src="/knec.png" alt="KNEC Certified" style={{ height: '18px', objectFit: 'contain', opacity: 0.9 }} title="KNEC Certified" />}
                      {!['NITA', 'KNEC'].includes(c.cert.toUpperCase()) && <span style={{ fontSize: '12px', color: '#555', fontWeight: 600 }}>🏅 {c.cert}</span>}
                      <span style={{ fontSize: '12px', color: '#555', fontWeight: 600, borderLeft: '1px solid rgba(0,0,0,0.1)', paddingLeft: '16px' }}>{c.dur}</span>
                    </div>
                    {/* Apply Now Button */}
                    <div
                      onClick={(e) => { e.preventDefault(); window.location.href = `/apply?course=${encodeURIComponent(c.name)}`; }}
                      style={{ 
                        textAlign: 'center', background: '#0F6E56', color: '#fff', padding: '10px', 
                        borderRadius: '8px', fontSize: '13px', fontWeight: 600, transition: 'background 0.2s', marginTop: 'auto'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#0a523f'}
                      onMouseLeave={e => e.currentTarget.style.background = '#0F6E56'}
                    >
                      Apply Now →
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <FadeIn style={{ textAlign: 'center', marginTop: '60px', padding: '48px', background: '#f8f7f4', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', color: '#1a1a1a', marginBottom: '12px' }}>Ready to Enroll?</h3>
          <p style={{ color: '#888', marginBottom: '24px' }}>View fees, requirements, and payment details on our admissions page.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/admissions" style={{ background: '#0F6E56', color: '#fff', padding: '14px 32px', borderRadius: '10px', fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>View Fees & Admissions</Link>
            <Link href="/prospectus" style={{ color: '#0F6E56', padding: '14px 32px', borderRadius: '10px', fontWeight: 600, fontSize: '15px', textDecoration: 'none', border: '1.5px solid #0F6E56', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>View Prospectus</Link>
            <a href="tel:+254113582008" style={{ color: '#555', padding: '14px 32px', borderRadius: '10px', fontWeight: 600, fontSize: '15px', textDecoration: 'none', border: '1.5px solid rgba(0,0,0,0.12)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>📞 Call Us</a>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
