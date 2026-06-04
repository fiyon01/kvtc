"use client";

import { useState, useEffect } from 'react';

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => setFaqs(data.faqs || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ background: '#f8f7f4', paddingTop: '120px' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 5% 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px', display: 'inline-block' }}>Help Center</span>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#1a1a1a', marginBottom: '16px' }}>Frequently Asked Questions</h1>
          <p style={{ color: '#888', fontSize: '1.1rem' }}>Everything you need to know about admissions, fees, and campus life at Kinoo VTC.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>Loading FAQs...</p>}
          {faqs.map(faq => (
            <div key={faq.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', overflow: 'hidden', transition: 'box-shadow 0.3s' }}>
              <button 
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                style={{ width: '100%', padding: '24px', background: 'transparent', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ fontSize: '16px', fontWeight: 600, color: openId === faq.id ? '#0F6E56' : '#1a1a1a' }}>{faq.question}</span>
                <span style={{ fontSize: '24px', color: openId === faq.id ? '#0F6E56' : '#888', transform: openId === faq.id ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' }}>+</span>
              </button>
              <div style={{ 
                maxHeight: openId === faq.id ? '500px' : '0', 
                opacity: openId === faq.id ? 1 : 0, 
                overflow: 'hidden', 
                transition: 'all 0.3s ease-in-out',
                padding: openId === faq.id ? '0 24px 24px' : '0 24px 0'
              }}>
                <p style={{ color: '#555', lineHeight: 1.6, fontSize: '15px' }}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
