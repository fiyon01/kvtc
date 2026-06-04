"use client";

import { useState } from 'react';
import Link from 'next/link';

const inputStyle = {
  width: '100%', padding: '12px 14px',
  border: '1.5px solid rgba(0,0,0,0.1)', borderRadius: '10px',
  fontFamily: 'var(--sans)', fontSize: '14px', color: '#1a1a1a',
  background: '#f8f7f4', outline: 'none', transition: 'border-color 0.2s, background 0.2s',
};

export default function SubmitTestimonial() {
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const focusStyle = (name) => focused === name
    ? { ...inputStyle, borderColor: '#0F6E56', background: '#fff' }
    : inputStyle;

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f7f4', padding: '120px 8% 80px', textAlign: 'center', flexDirection: 'column', gap: '20px' }}>
        <div style={{ fontSize: '4rem' }}>🎉</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', color: '#1a1a1a' }}>Thank You!</h2>
        <p style={{ color: '#888', fontSize: '1.1rem', maxWidth: '480px' }}>Your story has been submitted. It will be reviewed and featured on our website to inspire other students.</p>
        <Link href="/" style={{ background: '#0F6E56', color: '#fff', padding: '14px 32px', borderRadius: '10px', fontWeight: 600, fontSize: '15px', textDecoration: 'none', marginTop: '12px' }}>Back to Home</Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div style={{ padding: '140px 8% 70px', background: 'linear-gradient(135deg, rgba(15,110,86,0.07) 0%, #fff 100%)', borderBottom: '1px solid rgba(0,0,0,0.07)', textAlign: 'center' }}>
        <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px' }}>Alumni & Students</span>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#1a1a1a', marginBottom: '16px' }}>Share Your Story</h1>
        <p style={{ color: '#888', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto' }}>Your journey inspires the next generation. Tell us how Kinoo VTC helped shape your career.</p>
      </div>

      <section style={{ padding: '80px 8%', background: '#f8f7f4', minHeight: '60vh' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 32px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '28px' }}>Testimonial Form</h3>
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="ts-r">
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1a1a1a', marginBottom: '6px' }}>Full Name *</label>
                  <input type="text" placeholder="e.g. Wanjiku Kamau" required style={focusStyle('name')} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1a1a1a', marginBottom: '6px' }}>Graduation Year *</label>
                  <input type="text" placeholder="e.g. 2024" required style={focusStyle('year')} onFocus={() => setFocused('year')} onBlur={() => setFocused(null)} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1a1a1a', marginBottom: '6px' }}>Course Completed *</label>
                <input type="text" placeholder="e.g. Hair Dressing and Beauty Therapy" required style={focusStyle('course')} onFocus={() => setFocused('course')} onBlur={() => setFocused(null)} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1a1a1a', marginBottom: '6px' }}>Current Role / Employment *</label>
                <input type="text" placeholder="e.g. Salon Owner, Kikuyu Town" required style={focusStyle('role')} onFocus={() => setFocused('role')} onBlur={() => setFocused(null)} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1a1a1a', marginBottom: '6px' }}>Your Rating *</label>
                <select required style={focusStyle('rating')} onFocus={() => setFocused('rating')} onBlur={() => setFocused(null)} defaultValue="5">
                  <option value="5">★★★★★ – Excellent</option>
                  <option value="4">★★★★☆ – Very Good</option>
                  <option value="3">★★★☆☆ – Good</option>
                  <option value="2">★★☆☆☆ – Fair</option>
                  <option value="1">★☆☆☆☆ – Poor</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1a1a1a', marginBottom: '6px' }}>Your Testimonial *</label>
                <textarea placeholder="Describe your experience at Kinoo VTC and how it impacted your career and life..." rows={6} required style={{ ...focusStyle('text'), resize: 'vertical', minHeight: '140px' }} onFocus={() => setFocused('text')} onBlur={() => setFocused(null)} />
              </div>

              <button type="submit" style={{ width: '100%', padding: '15px', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: '10px', fontFamily: 'var(--sans)', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s, transform 0.15s' }}
                onMouseEnter={e => { e.target.style.background = '#1D9E75'; e.target.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.target.style.background = '#0F6E56'; e.target.style.transform = 'translateY(0)'; }}>
                Submit My Story →
              </button>
            </form>
          </div>
        </div>
        <style>{`@media(max-width:600px){.ts-r{grid-template-columns:1fr !important;}}`}</style>
      </section>
    </>
  );
}
