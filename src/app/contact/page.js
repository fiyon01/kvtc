"use client";

import { useRef, useState, useEffect } from 'react';
import { useToast } from '@/components/ToastProvider';

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.05 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s ease`, ...style }}>
      {children}
    </div>
  );
}

const inputBase = {
  width: '100%', padding: '14px 16px',
  border: '1.5px solid rgba(0,0,0,0.1)',
  borderRadius: '12px',
  fontFamily: 'var(--sans)', fontSize: '15px', color: '#1a1a1a',
  background: '#f8f7f4', outline: 'none',
  transition: 'all 0.25s ease',
  boxSizing: 'border-box',
};

export default function Contact() {
  const { showToast } = useToast();
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const focusStyle = (name) => focused === name
    ? { ...inputBase, borderColor: '#0F6E56', background: '#fff', boxShadow: '0 0 0 4px rgba(15,110,86,0.08)' }
    : inputBase;

  const contactItems = [
    {
      emoji: 'MAP',
      bg: '#E1F5EE',
      label: 'Physical Address',
      value: 'Along Nairobi-Nakuru Highway, Kikuyu',
      sub: 'P.O. Box 351-00902, Kiambu County',
      href: 'https://maps.google.com/?q=Kinoo+VTC+Kikuyu',
    },
    {
      emoji: 'TEL',
      bg: '#E1F5EE',
      label: 'Phone Numbers',
      value: '0113 582 008',
      sub: '0748 455 116',
      href: 'tel:+254113582008',
    },
    {
      emoji: 'MAIL',
      bg: '#FFF8E8',
      label: 'Email Address',
      value: 'kinoovtc@gmail.com',
      href: 'mailto:kinoovtc@gmail.com',
    },
    {
      emoji: 'HRS',
      bg: '#E1F5EE',
      label: 'Office Hours',
      value: 'Mon - Fri: 8:00am - 5:00pm',
      sub: 'Closed weekends & public holidays',
    },
  ];

  return (
    <>
      {/* ── HERO (matches site theme) ── */}
      <div style={{
        padding: '132px 8% 64px',
        background: 'linear-gradient(135deg, rgba(15,110,86,0.09) 0%, rgba(47,121,183,0.07) 100%)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        textAlign: 'center',
        position: 'relative',
      }}>
        <FadeIn>
          <span style={{
            display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE',
            padding: '6px 16px', borderRadius: '100px', marginBottom: '20px',
          }}>
            Get in Touch
          </span>
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: 'clamp(2.6rem, 5vw, 4rem)',
            color: '#1a1a1a', marginBottom: '18px', lineHeight: 1.1,
          }}>
            We'd Love to Hear<br />
            <em style={{ fontStyle: 'normal', color: '#0F6E56' }}>From You</em>
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto 36px', lineHeight: 1.7 }}>
            Questions about courses, admission, or fees? Our team is ready to guide you through the next step.
          </p>

          {/* Quick-action pills — themed */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+254113582008" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#0F6E56', color: '#fff',
              padding: '12px 26px', borderRadius: '100px',
              fontSize: '14px', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(15,110,86,0.22)', transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              Call Us Now
            </a>
            <a href="https://wa.me/254113582008" target="_blank" rel="noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#fff', color: '#1a1a1a',
              border: '1.5px solid rgba(0,0,0,0.12)',
              padding: '12px 26px', borderRadius: '100px',
              fontSize: '14px', fontWeight: 600, textDecoration: 'none',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#25D366'; e.currentTarget.style.color = '#25D366'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = '#1a1a1a'; }}>
              <svg viewBox="0 0 24 24" fill="#25D366" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Chat
            </a>
          </div>
        </FadeIn>
      </div>

      {/* ── MAIN SECTION ── */}
      <section className="contact-main" style={{ padding: '72px 8% 96px', background: '#f8f7f4' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.35fr', gap: '48px', alignItems: 'start', maxWidth: '1200px', margin: '0 auto' }} className="contact-grid">

          {/* LEFT: Contact info cards */}
          <FadeIn style={{ order: 1 }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: '#1a1a1a', marginBottom: '8px' }}>Contact Information</h3>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '28px', lineHeight: 1.6 }}>Visit us Monday to Friday, 8am-5pm. We respond to all enquiries promptly.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {contactItems.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '16px', alignItems: 'flex-start',
                  background: '#fff', borderRadius: '16px', padding: '18px 20px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '12px',
                    background: item.bg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0, fontSize: '10px',
                    fontWeight: 800, letterSpacing: '0.5px', color: '#0F6E56',
                  }}>
                    {item.emoji}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#aaa', marginBottom: '4px' }}>{item.label}</div>
                    {item.href
                      ? <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" style={{ fontSize: '15px', fontWeight: 700, color: '#0F6E56', textDecoration: 'none', display: 'block' }}
                          onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                          onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>
                          {item.value}
                        </a>
                      : <span style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', display: 'block' }}>{item.value}</span>
                    }
                    {item.sub && <span style={{ fontSize: '13px', color: '#999', marginTop: '2px', display: 'block' }}>{item.sub}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Map CTA */}
            <a href="https://maps.google.com/?q=Kinoo+VTC+Kikuyu" target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              background: 'linear-gradient(135deg, #0F6E56, #1a8267)',
              borderRadius: '16px', padding: '20px 24px',
              textDecoration: 'none', color: '#fff',
              boxShadow: '0 8px 24px rgba(15,110,86,0.22)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              marginBottom: '24px',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(15,110,86,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,110,86,0.22)'; }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>MAP</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '2px' }}>Get Directions</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>Open in Google Maps</div>
              </div>
            </a>

            {/* Social links */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '20px 24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#aaa', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px' }}>Follow Us</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { label: 'Facebook', color: '#1877F2', icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                  { label: 'Instagram', color: '#E4405F', icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
                  { label: 'TikTok', color: '#010101', icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
                ].map(s => (
                  <a key={s.label} href="#" aria-label={s.label} style={{
                    width: '42px', height: '42px', borderRadius: '10px',
                    border: '1.5px solid rgba(0,0,0,0.08)', background: '#f8f7f4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#555', textDecoration: 'none', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = s.color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f8f7f4'; e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* RIGHT: Enquiry Form */}
          <FadeIn delay={0.15} style={{ order: 2 }}>
            {submitted ? (
              <div style={{ background: '#fff', borderRadius: '24px', padding: '64px 40px', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0F6E56, #1D9E75)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px', boxShadow: '0 12px 32px rgba(15,110,86,0.25)',
                  animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
                }}>
                  <svg width="36" height="36" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: '#1a1a1a', marginBottom: '12px' }}>Message Sent!</h3>
                <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto 32px' }}>
                  Thank you for reaching out. Our team will get back to you within <strong>24 hours</strong>.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => setSubmitted(false)} style={{
                    padding: '14px 28px', background: '#0F6E56', color: '#fff', border: 'none',
                    borderRadius: '12px', fontFamily: 'var(--sans)', fontSize: '15px', fontWeight: 700,
                    cursor: 'pointer', boxShadow: '0 6px 20px rgba(15,110,86,0.25)',
                  }}>
                    Send Another Enquiry
                  </button>
                  <a href="/" style={{
                    padding: '14px 28px', background: '#f8f7f4', color: '#1a1a1a', border: '1.5px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px', fontFamily: 'var(--sans)', fontSize: '15px', fontWeight: 600,
                    textDecoration: 'none', display: 'inline-block',
                  }}>
                    ← Back to Home
                  </a>
                </div>
                <style>{`@keyframes popIn { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
              </div>
            ) : (
              <div className="contact-form-card" style={{ background: '#fff', border: '1px solid rgba(15,110,86,0.12)', borderRadius: '24px', padding: '44px', boxShadow: '0 18px 55px rgba(24,55,47,0.1)' }}>
                <div style={{ marginBottom: '32px' }}>
                  <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '5px 14px', borderRadius: '100px', marginBottom: '12px' }}>
                    Enquiry Form
                  </span>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.9rem', color: '#1a1a1a', marginBottom: '8px' }}>Send a Message</h3>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: '14px', color: '#888', lineHeight: 1.6 }}>
                    Fill out the form below. We'll respond within 24 hours, or reach us directly on WhatsApp for an instant reply.
                  </p>
                </div>

                <form noValidate onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  const fname = String(fd.get('fname') || '').trim();
                  const lname = String(fd.get('lname') || '').trim();
                  const phone = String(fd.get('phone') || '').trim();
                  const email = fd.get('email');
                  const course = fd.get('course') || 'General enquiry';
                  const msg = String(fd.get('msg') || '').trim();

                  const required = [
                    ['fname', fname, 'first name'],
                    ['lname', lname, 'last name'],
                    ['phone', phone, 'phone number'],
                    ['msg', msg, 'message'],
                  ];
                  const missing = required.find(([, value]) => !value);
                  if (missing) {
                    showToast(`Please enter your ${missing[2]}.`, 'warning');
                    e.currentTarget.elements[missing[0]]?.focus();
                    return;
                  }
                  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
                    showToast('Please enter a valid email address.', 'warning');
                    e.currentTarget.elements.email?.focus();
                    return;
                  }
                  if (!/^(\+?254|0)[17]\d{8}$/.test(phone.replace(/\s/g, ''))) {
                    showToast('Please enter a valid phone number, for example 0712345678.', 'warning');
                    e.currentTarget.elements.phone?.focus();
                    return;
                  }

                  const waText = `Hello Kinoo VTC, I have an enquiry.\n\n*Name:* ${fname} ${lname}\n*Phone:* ${phone}\n*Email:* ${email || 'N/A'}\n*Course:* ${course}\n*Message:* ${msg || 'N/A'}`;
                  window.open(`https://wa.me/254113582008?text=${encodeURIComponent(waText)}`, '_blank');
                  try {
                    const response = await fetch('/api/contact', { method: 'POST', body: fd });
                    const result = await response.json();
                    if (!response.ok || !result.success) {
                      throw new Error(result.message || 'The enquiry could not be sent.');
                    }
                    setSubmitted(true);
                    e.target.reset();
                  } catch (error) {
                    console.error(error);
                    showToast(error.message || 'The enquiry could not be sent. Please try again.', 'error');
                  }
                }}>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="form-2col">
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px' }}>First Name <span style={{ color: '#c00' }}>*</span></label>
                      <input type="text" name="fname" placeholder="e.g. John" required style={focusStyle('fname')} onFocus={() => setFocused('fname')} onBlur={() => setFocused(null)} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px' }}>Last Name <span style={{ color: '#c00' }}>*</span></label>
                      <input type="text" name="lname" placeholder="e.g. Kamau" required style={focusStyle('lname')} onFocus={() => setFocused('lname')} onBlur={() => setFocused(null)} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="form-2col">
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px' }}>Phone Number <span style={{ color: '#c00' }}>*</span></label>
                      <input type="tel" name="phone" placeholder="0712 345 678" required style={focusStyle('phone')} onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px' }}>Email <span style={{ fontSize: '12px', color: '#aaa', fontWeight: 400 }}>(Optional)</span></label>
                      <input type="email" name="email" placeholder="john@example.com" style={focusStyle('email')} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px' }}>Course of Interest <span style={{ fontSize: '12px', color: '#aaa', fontWeight: 400 }}>(Optional)</span></label>
                    <select name="course" style={focusStyle('course')} onFocus={() => setFocused('course')} onBlur={() => setFocused(null)} defaultValue="">
                      <option value="">General enquiry / not course-specific</option>
                      {[
                        'Food & Beverage Production', 'Hair Dressing & Beauty Therapy', 'Electrical & Electronics',
                        'Plumbing', 'Masonry', 'Fashion Design & Dressmaking', 'Motor Vehicle Mechanics',
                        'Welding & Fabrication', 'Computer Operator', 'Solar PV Installation',
                        'Barista', 'Baking & Pastry', 'CNA – Care Givers', 'Driving Classes',
                        'Computer Packages',
                      ].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div style={{ marginBottom: '28px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px' }}>How can we help? <span style={{ color: '#c00' }}>*</span></label>
                    <textarea name="msg" required placeholder="Ask about admissions, fees, reporting dates, courses, facilities, or anything else..." rows={4} style={{ ...focusStyle('msg'), resize: 'vertical', minHeight: '120px' }} onFocus={() => setFocused('msg')} onBlur={() => setFocused(null)} />
                  </div>

                  <button type="submit" style={{
                    width: '100%', padding: '17px',
                    background: '#0F6E56', color: '#fff', border: 'none',
                    borderRadius: '12px', fontFamily: 'var(--sans)', fontSize: '16px',
                    fontWeight: 700, cursor: 'pointer', transition: 'all 0.25s',
                    boxShadow: '0 8px 28px rgba(15,110,86,0.25)',
                    letterSpacing: '0.3px',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#0a523f'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(15,110,86,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#0F6E56'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(15,110,86,0.25)'; }}
                    onMouseDown={e => e.currentTarget.style.transform = 'translateY(1px)'}>
                    Send Enquiry
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '13px', color: '#bbb', marginTop: '16px' }}>
                    Your details are private and used only to respond to this enquiry.
                  </p>
                </form>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .contact-grid > div:first-child { order: 2 !important; }
          .contact-grid > div:last-child { order: 1 !important; }
          .form-2col { grid-template-columns: 1fr !important; }
          .contact-main { padding: 44px 18px 72px !important; }
          .contact-form-card { padding: 28px 20px !important; border-radius: 18px !important; }
        }
      `}</style>
    </>
  );
}
