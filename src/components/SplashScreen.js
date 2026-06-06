"use client";

import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2200);
    const removeTimer = setTimeout(() => setVisible(false), 2700);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '16px',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.5s ease',
    }}>
      {/* Logos Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <img src="/logo.png" alt="KVTC" style={{ height: '90px', objectFit: 'contain', animation: 'splash-bounce 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} onError={e => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }} />
        <div style={{
          width: '90px', height: '90px', borderRadius: '24px',
          background: 'linear-gradient(135deg, #0F6E56, #1D9E75)',
          display: 'none', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 20px 60px rgba(15,110,86,0.35)',
          animation: 'splash-bounce 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: 700, color: '#fff' }}>KV</span>
        </div>

        {/* Separator */}
        <div style={{ width: '1px', height: '50px', background: 'rgba(0,0,0,0.1)', animation: 'splash-bounce 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} />

        <img src="/cgok-logo.png" alt="CGOK" style={{ height: '90px', animation: 'splash-bounce 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '2rem', color: '#1a1a1a',
          letterSpacing: '1px', margin: 0,
          animation: 'splash-up 0.6s 0.2s both',
        }}>
          <span style={{ color: '#0F6E56' }}>Kinoo</span> VTC
        </h1>
        <p style={{
          color: '#888', fontSize: '11px',
          letterSpacing: '2px', textTransform: 'uppercase',
          marginTop: '6px',
          animation: 'splash-up 0.6s 0.4s both',
        }}>Technology for Empowerment</p>
      </div>

      {/* Loading bar */}
      <div style={{
        width: '120px', height: '3px', background: '#E1F5EE',
        borderRadius: '99px', overflow: 'hidden',
        marginTop: '8px',
        animation: 'splash-up 0.6s 0.5s both',
      }}>
        <div style={{
          height: '100%', background: '#0F6E56',
          borderRadius: '99px',
          animation: 'load-bar 2s ease forwards',
        }}></div>
      </div>

      <style>{`
        @keyframes splash-bounce {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes splash-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes load-bar {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
