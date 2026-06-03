"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <Image src="/logo.png" alt="KVTC Logo" width={120} height={120} className="splash-logo" />
        <h1 style={{ fontSize: '2rem', marginTop: '20px', letterSpacing: '1px' }}>
          <span style={{ color: 'var(--green-light)' }}>Kinoo</span> VTC
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Skills for Life
        </p>
      </div>
    </div>
  );
}
