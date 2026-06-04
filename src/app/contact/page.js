"use client";

import { useRef, useState, useEffect } from 'react';

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

const inputStyle = {
  width: '100%', padding: '12px 14px',
  borderWidth: '1.5px', borderStyle: 'solid', borderColor: 'rgba(0,0,0,0.1)',
  borderRadius: '10px',
  fontFamily: 'var(--sans)', fontSize: '14px', color: '#1a1a1a',
  background: '#f8f7f4', outline: 'none', transition: 'border-color 0.2s, background 0.2s',
};

export default function Contact() {
  const [focused, setFocused] = useState(null);

  const focusStyle = (name) => focused === name
    ? { ...inputStyle, borderColor: '#0F6E56', background: '#fff' }
    : inputStyle;

  return (
    <>
      {/* Header */}
      <div style={{ padding: '140px 8% 70px', background: 'linear-gradient(135deg, rgba(15,110,86,0.07) 0%, #fff 100%)', borderBottom: '1px solid rgba(0,0,0,0.07)', textAlign: 'center' }}>
        <FadeIn>
          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px' }}>Get in Touch</span>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#1a1a1a', marginBottom: '16px' }}>We'd Love to Hear From You</h1>
          <p style={{ color: '#888', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto' }}>Questions about courses, admission, or fees? Reach us using any of the channels below.</p>
        </FadeIn>
      </div>

      <section style={{ padding: '80px 8%', background: '#f8f7f4' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '64px', alignItems: 'start', maxWidth: '1200px', margin: '0 auto' }} className="contact-r">

          {/* Contact Info */}
          <FadeIn>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', color: '#1a1a1a', marginBottom: '12px' }}>Contact Information</h3>
            <p style={{ color: '#888', fontSize: '15px', marginBottom: '32px' }}>Visit us Monday to Friday, 8am – 5pm. We respond promptly to all enquiries.</p>

            {[
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                label: 'Physical Address', value: 'P.O. Box 351-00902, Kikuyu, along Nairobi-Nakuru Highway, Kiambu County'
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.64 16.92z"/></svg>,
                label: 'Phone', value: '0113 582 008  |  0748 455 116', href: 'tel:+254113582008'
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
                label: 'Email', value: 'kinoovtc@gmail.com', href: 'mailto:kinoovtc@gmail.com'
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
                label: 'Website', value: 'www.kinoovtc.ac.ke', href: 'https://www.kinoovtc.ac.ke'
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                label: 'Office Hours', value: 'Monday – Friday: 8:00am – 5:00pm'
              },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <strong style={{ display: 'block', fontSize: '12px', color: '#888', fontWeight: 400, marginBottom: '2px' }}>{item.label}</strong>
                  {item.href
                    ? <a href={item.href} style={{ fontSize: '15px', fontWeight: 500, color: '#0F6E56', textDecoration: 'none' }}>{item.value}</a>
                    : <span style={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a' }}>{item.value}</span>
                  }
                </div>
              </div>
            ))}

            {/* Social */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
              {[
                { label: 'Facebook', icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                { label: 'Instagram', icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
                { label: 'TikTok', icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
              ].map(s => (
                <a key={s.label} href="#" aria-label={s.label} style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.1)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0F6E56'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0F6E56'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </FadeIn>

          {/* Form */}
          <FadeIn delay={0.15}>
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '36px', boxShadow: '0 4px 32px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '24px' }}>Send an Enquiry / Apply</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const fname = fd.get('fname');
                const lname = fd.get('lname');
                const phone = fd.get('phone');
                const course = fd.get('course');
                const msg = fd.get('msg');

                // 1. WhatsApp Redirect
                const waText = `Hello Kinoo VTC, I am interested in ${course}.\n\n*Name:* ${fname} ${lname}\n*Phone:* ${phone}\n*Message:* ${msg || 'N/A'}`;
                window.open(`https://wa.me/254113582008?text=${encodeURIComponent(waText)}`, '_blank');

                // 2. Web3Forms Submission (Background)
                fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd }).catch(console.error);

                alert('Thank you! Redirecting you to WhatsApp to complete your message...');
                e.target.reset();
              }}>
                {/* Web3Forms required access key */}
                <input type="hidden" name="access_key" value="2ceb1091-7d6f-4428-8b86-a78b375cae34" />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-r">
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1a1a1a', marginBottom: '6px' }}>First Name</label>
                    <input type="text" name="fname" placeholder="John" required style={focusStyle('fname')} onFocus={() => setFocused('fname')} onBlur={() => setFocused(null)} />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1a1a1a', marginBottom: '6px' }}>Last Name</label>
                    <input type="text" name="lname" placeholder="Doe" required style={focusStyle('lname')} onFocus={() => setFocused('lname')} onBlur={() => setFocused(null)} />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1a1a1a', marginBottom: '6px' }}>Phone Number</label>
                  <input type="tel" name="phone" placeholder="0712 345 678" required style={focusStyle('phone')} onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1a1a1a', marginBottom: '6px' }}>Interested Course</label>
                  <select name="course" required style={focusStyle('course')} onFocus={() => setFocused('course')} onBlur={() => setFocused(null)} defaultValue="">
                    <option value="" disabled>Select a course...</option>
                    {['Food & Beverage Production', 'Hair Dressing & Beauty Therapy', 'Electrical & Electronics', 'Plumbing', 'Masonry', 'Fashion Design & Dressmaking', 'Motor Vehicle Mechanics', 'Welding & Fabrication', 'Computer Operator', 'Solar PV Installation', 'Barista', 'Baking & Pastry', 'CNA – Care Givers', 'Driving Classes', 'Computer Packages', 'General Inquiry'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1a1a1a', marginBottom: '6px' }}>Message (Optional)</label>
                  <textarea name="msg" placeholder="Tell us about your background or any questions..." rows={4} style={{ ...focusStyle('msg'), resize: 'vertical', minHeight: '100px' }} onFocus={() => setFocused('msg')} onBlur={() => setFocused(null)} />
                </div>

                <button type="submit" style={{ width: '100%', padding: '15px', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: '10px', fontFamily: 'var(--sans)', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s, transform 0.15s' }}
                  onMouseEnter={e => { e.target.style.background = '#1D9E75'; e.target.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.target.style.background = '#0F6E56'; e.target.style.transform = 'translateY(0)'; }}>
                  Submit Application →
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
        <style>{`@media(max-width:900px){.contact-r{display:flex !important; flex-direction:column-reverse !important; gap: 48px !important;} .form-r{grid-template-columns:1fr !important;}}`}</style>
      </section>
    </>
  );
}
