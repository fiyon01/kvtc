"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

function pad(n) { return String(n).padStart(2, '0'); }

export const BANNER_HEIGHT = 46; // px — exported so Navbar can read it

export default function TopBanner() {
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [yearText, setYearText] = useState('2026');

  useEffect(() => {
    if (sessionStorage.getItem('topBannerDismissed')) return;
    
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (!data?.intake?.isOngoing) return;
        setYearText(data.intake.yearText || '2026');
        setVisible(true);

        const end = new Date(data.intake.endDate || '2026-12-31').getTime();
        
        function calc() {
          const diff = end - Date.now();
          if (diff <= 0) { 
            setTimeLeft(null); 
            setVisible(false); 
            return; 
          }
          setTimeLeft({
            days: Math.floor(diff / 86400000),
            hours: pad(Math.floor((diff % 86400000) / 3600000)),
            mins: pad(Math.floor((diff % 3600000) / 60000)),
            secs: pad(Math.floor((diff % 60000) / 1000)),
          });
        }
        
        calc();
        const id = setInterval(calc, 1000);
        return () => clearInterval(id);
      })
      .catch(console.error);
  }, []);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem('topBannerDismissed', '1');
    window.dispatchEvent(new Event('topBannerDismissed'));
  }

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 102,
      height: `${BANNER_HEIGHT}px`,
      background: 'linear-gradient(90deg, #085041 0%, #0F6E56 60%, #1a6648 100%)',
      display: 'flex', alignItems: 'center',
      padding: '0 4%', gap: '12px',
      fontSize: '12px', color: '#fff',
    }}>
      {/* Pulse dot + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}>
        <span style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#4ade80', boxShadow: '0 0 6px #4ade80',
          flexShrink: 0, animation: 'pulse-b 1.5s infinite',
        }} />
        <strong className="hide-mobile" style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>🎓 {yearText} Intake Open!</strong>
      </div>

      {/* Divider */}
      <span className="hide-mobile" style={{ opacity: 0.3, flexShrink: 0 }}>|</span>

      {/* Countdown */}
      {timeLeft && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <span className="hide-mobile" style={{ opacity: 0.8, marginRight: '4px', whiteSpace: 'nowrap' }}>Closes in:</span>
          {[
            { val: timeLeft.days, label: 'd' },
            { val: timeLeft.hours, label: 'h' },
            { val: timeLeft.mins, label: 'm' },
            { val: timeLeft.secs, label: 's' },
          ].map(({ val, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: '1px' }}>
              <span style={{
                background: 'rgba(255,255,255,0.18)', borderRadius: '4px',
                padding: '1px 6px', fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                fontSize: '13px',
              }}>{val}</span>
              <span style={{ opacity: 0.65, fontSize: '10px' }}>{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Apply link */}
      <Link href="/apply" style={{
        background: '#EF9F27', color: '#1a1a1a',
        padding: '5px 14px', borderRadius: '6px',
        fontWeight: 700, fontSize: '12px', textDecoration: 'none',
        flexShrink: 0, whiteSpace: 'nowrap',
      }}>Apply Now →</Link>

      {/* Dismiss */}
      <button onClick={dismiss} aria-label="Close banner" style={{
        background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)',
        fontSize: '18px', cursor: 'pointer', lineHeight: 1, padding: '0 2px', flexShrink: 0,
      }}>×</button>

      <style>{`
        @keyframes pulse-b {
          0%, 100% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.25); opacity: 1; }
        }
        @media (max-width: 600px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
