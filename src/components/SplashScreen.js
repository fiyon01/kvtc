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
      background: 'radial-gradient(circle at 50% 30%, #edf6fc 0%, #ffffff 46%, #f7fbf9 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '16px',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.5s ease',
    }}>
      {/* Logos Row */}
      <div className="splash-brand-lockup" style={{
        display: 'flex', alignItems: 'center', gap: '22px',
        padding: '18px 26px', borderRadius: '24px',
        border: '1px solid rgba(47,121,183,0.14)',
        background: 'rgba(255,255,255,0.72)',
        boxShadow: '0 18px 50px rgba(37,86,115,0.1)',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ width: '104px', height: '104px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/kvtc_logo.png" alt="Kinoo Vocational Training Centre" className="kvtc-logo-crop" style={{ height: '104px', width: '104px', animation: 'splash-bounce 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} />
        </div>

        <div aria-hidden="true" style={{ width: '1px', height: '68px', background: 'linear-gradient(180deg, transparent, #2F79B7, #0F6E56, transparent)', opacity: 0.55, animation: 'splash-bounce 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} />

        <div style={{ width: '104px', height: '104px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/cgok-logo.png" alt="County Government of Kiambu" style={{ width: '94px', height: '94px', objectFit: 'contain', animation: 'splash-bounce 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '2rem', color: '#1a1a1a',
          letterSpacing: '1px', margin: 0,
          animation: 'splash-up 0.6s 0.2s both',
        }}>
          <span style={{ color: '#0F6E56' }}>Kinoo</span> <span style={{ color: '#2F79B7' }}>VTC</span>
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
        width: '120px', height: '3px', background: '#DDECF6',
        borderRadius: '99px', overflow: 'hidden',
        marginTop: '8px',
        animation: 'splash-up 0.6s 0.5s both',
      }}>
        <div style={{
          height: '100%', background: 'linear-gradient(90deg, #0F6E56, #2F79B7)',
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
        @media (max-width: 480px) {
          .splash-brand-lockup {
            gap: 14px !important;
            padding: 14px 18px !important;
            transform: scale(0.88);
          }
        }
      `}</style>
    </div>
  );
}
