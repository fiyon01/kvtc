"use client";

import { useState, useEffect, useRef } from 'react';
import db from '@/data/db.json';

const STORAGE_KEY = 'kvtc_lead_captured';
const DELAY_MS = 35000; // show after 35 seconds on site

export default function LeadCaptureModal() {
  const [visible, setVisible]   = useState(false);
  const [step, setStep]         = useState('form'); // 'form' | 'success'
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]         = useState({ name: '', phone: '', course: '' });
  const [error, setError]       = useState('');
  const timerRef                = useRef(null);
  const courseList              = db?.courses || [];

  useEffect(() => {
    // Don't show if already captured this session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    // --- Trigger 1: Exit intent (mouse leaves top of viewport) ---
    const handleMouseLeave = (e) => {
      if (e.clientY <= 5 && !sessionStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
        document.removeEventListener('mouseleave', handleMouseLeave);
        clearTimeout(timerRef.current);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);

    // --- Trigger 2: Time on page (35 seconds) ---
    timerRef.current = setTimeout(() => {
      if (!sessionStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    }, DELAY_MS);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timerRef.current);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, '1');
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Please enter your name and phone number.');
      return;
    }
    if (!/^(\+254|0)[17]\d{8}$/.test(form.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid Kenyan phone number (e.g. 0712 345 678).');
      return;
    }

    setSubmitting(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'exit_intent' }),
      });
      setStep('success');
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)', zIndex: 9998,
          animation: 'lcFadeIn 0.3s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', 
        bottom: '24px', 
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100vw - 32px)',
        maxWidth: '420px',
        background: '#ffffff', borderRadius: '24px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
        zIndex: 9999, overflow: 'hidden',
        animation: 'lcSlideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        fontFamily: 'var(--font-inter, system-ui, sans-serif)',
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F6E56 0%, #1D9E75 100%)',
          padding: '24px 24px 20px', position: 'relative',
        }}>
          <button
            onClick={dismiss}
            aria-label="Close"
            style={{
              position: 'absolute', top: '14px', right: '14px',
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '50%', width: '30px', height: '30px',
              color: '#fff', fontSize: '16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >✕</button>

          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎓</div>
          <h3 style={{ color: '#fff', margin: '0 0 6px', fontSize: '18px', fontWeight: 800, lineHeight: 1.2 }}>
            {step === 'success' ? 'You\'re on the list! 🎉' : 'Before you go…'}
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '13px', lineHeight: 1.5 }}>
            {step === 'success'
              ? 'Our admissions team will reach out to you on WhatsApp shortly!'
              : 'Leave your details and our team will send you everything you need to join Kinoo VTC — on WhatsApp!'}
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {step === 'form' ? (
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                <div>
                  <label style={labelStyle}>Your Name *</label>
                  <input
                    name="name" type="text" placeholder="e.g. John Kamau"
                    value={form.name} onChange={handleChange}
                    style={inputStyle} required
                  />
                </div>

                <div>
                  <label style={labelStyle}>Phone Number (WhatsApp) *</label>
                  <input
                    name="phone" type="tel" placeholder="e.g. 0712 345 678"
                    value={form.phone} onChange={handleChange}
                    style={inputStyle} required
                  />
                </div>

                <div>
                  <label style={labelStyle}>Course You're Interested In</label>
                  <select
                    name="course" value={form.course} onChange={handleChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">— Select a course (optional) —</option>
                    {courseList.map((c, i) => (
                      <option key={i} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {error && (
                  <p style={{ color: '#dc2626', fontSize: '13px', margin: 0, padding: '10px 14px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca' }}>
                    ⚠️ {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '14px', background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #25D366, #128C7E)',
                    color: '#fff', border: 'none', borderRadius: '14px',
                    fontSize: '14px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
                  }}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {submitting ? 'Saving…' : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Send Me Info on WhatsApp
                    </>
                  )}
                </button>

                <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                  🔒 We never spam. Your number is only used by our admissions team.
                </p>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <p style={{ color: '#334155', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
                Thank you, <strong>{form.name.split(' ')[0]}</strong>! Our admissions team will WhatsApp you at <strong>{form.phone}</strong> soon.
              </p>
              <a
                href={`https://wa.me/254113582008?text=Hello!%20I%20just%20registered%20my%20interest%20in%20${encodeURIComponent(form.course || 'your courses')}%20at%20Kinoo%20VTC.%20My%20name%20is%20${encodeURIComponent(form.name)}.`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '12px 24px', background: '#25D366', color: '#fff',
                  borderRadius: '12px', fontWeight: 700, fontSize: '14px',
                  textDecoration: 'none', marginBottom: '12px',
                }}
              >
                💬 Chat with Us Now
              </a>
              <br />
              <button onClick={dismiss} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', marginTop: '8px' }}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes lcFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lcSlideUp { 
          from { opacity: 0; transform: translate(-50%, 40px) scale(0.95); } 
          to { opacity: 1; transform: translate(-50%, 0) scale(1); } 
        }
      `}</style>
    </>
  );
}

const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: 700,
  color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px',
};

const inputStyle = {
  width: '100%', padding: '12px 14px',
  border: '1.5px solid #e2e8f0', borderRadius: '12px',
  fontSize: '14px', color: '#1e293b', background: '#f8fafc',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', transition: 'border-color 0.2s',
};
