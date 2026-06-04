"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function IntakeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div style={{
      background: 'linear-gradient(90deg, #0F6E56, #1D9E75)',
      color: '#fff',
      padding: '10px 5%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
      position: 'relative',
      zIndex: 101,
      fontSize: '14px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          display: 'inline-block', width: '8px', height: '8px',
          borderRadius: '50%', background: '#4ade80',
          boxShadow: '0 0 8px #4ade80',
          animation: 'pulse-dot 1.5s infinite',
          flexShrink: 0,
        }}></span>
        <span><strong>🎓 Intake Ongoing – 2026!</strong> Applications for the 2026 academic year are now open. Limited slots available.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link href="/admissions" style={{
          color: '#fbbf24', fontWeight: 600,
          textDecoration: 'underline', textUnderlineOffset: '4px',
          fontSize: '13px',
        }}>View Admissions →</Link>
        <button onClick={() => setIsVisible(false)} style={{
          background: 'transparent', border: 'none',
          color: 'rgba(255,255,255,0.7)', fontSize: '20px',
          cursor: 'pointer', lineHeight: 1, padding: '0 4px',
        }} aria-label="Close banner">&times;</button>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
