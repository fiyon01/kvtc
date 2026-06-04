"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Set the intake deadline here
const DEADLINE = new Date('2026-08-31T00:00:00');

function pad(n) { return String(n).padStart(2, '0'); }

export default function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    function calc() {
      const diff = DEADLINE - Date.now();
      if (diff <= 0) return setTimeLeft(null);
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ days, hours, mins, secs });
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  if (!timeLeft) return null;

  const units = [
    { label: 'Days', val: timeLeft.days },
    { label: 'Hrs', val: pad(timeLeft.hours) },
    { label: 'Min', val: pad(timeLeft.mins) },
    { label: 'Sec', val: pad(timeLeft.secs) },
  ];

  return (
    <div style={{
      background: '#1a1a1a',
      color: '#fff',
      padding: '10px 5%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '20px',
      flexWrap: 'wrap',
      fontSize: '13px',
      position: 'relative',
      zIndex: 100,
    }}>
      <span style={{ fontWeight: 600, color: '#fbbf24' }}>⏳ Intake Closes:</span>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {units.map(({ label, val }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{
              background: '#0F6E56', color: '#fff', fontWeight: 700,
              fontSize: '16px', padding: '4px 10px', borderRadius: '6px',
              minWidth: '38px', textAlign: 'center', fontVariantNumeric: 'tabular-nums',
            }}>{val}</span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{label}</span>
          </div>
        ))}
      </div>
      <Link href="/admissions" style={{
        background: '#EF9F27', color: '#1a1a1a',
        padding: '6px 18px', borderRadius: '6px',
        fontWeight: 700, fontSize: '12px', textDecoration: 'none',
      }}>Apply Now →</Link>
    </div>
  );
}
