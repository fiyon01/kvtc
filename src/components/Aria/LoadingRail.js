"use client";

import React, { useEffect, useState } from 'react';
import { Sparkles, Search, ShieldCheck, GraduationCap } from 'lucide-react';

const THINKING_STEPS = [
  { text: 'Reading your request', icon: Search },
  { text: 'Checking verified KVTC records', icon: ShieldCheck },
  { text: 'Preparing a helpful answer', icon: GraduationCap },
];

export default function LoadingRail() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(current => (current + 1) % THINKING_STEPS.length);
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = THINKING_STEPS[step].icon;

  return (
    <div className="thinking-card" role="status" aria-live="polite">
      <div className="orb-wrap" aria-hidden="true">
        <div className="orb-ring" />
        <div className="orb-core">
          <Sparkles size={18} />
        </div>
      </div>

      <div className="thinking-copy">
        <div className="thinking-eyebrow">ARIA is thinking</div>
        <div className="thinking-line">
          <ActiveIcon size={15} />
          <span>{THINKING_STEPS[step].text}</span>
        </div>
        <div className="thinking-meter">
          <span />
          <span />
          <span />
        </div>
      </div>

      <style jsx>{`
        .thinking-card {
          width: min(420px, calc(100% - 12px));
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 12px 0 6px;
          padding: 15px 16px;
          border-radius: 18px;
          background:
            radial-gradient(circle at 18% 10%, rgba(36, 90, 135, 0.15), transparent 34%),
            linear-gradient(135deg, #ffffff 0%, #f6fbff 52%, #f4fff9 100%);
          border: 1px solid rgba(36, 90, 135, 0.16);
          box-shadow: 0 16px 40px rgba(15, 42, 70, 0.1);
          font-family: var(--font-inter, system-ui, sans-serif);
          animation: cardIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .orb-wrap {
          position: relative;
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          display: grid;
          place-items: center;
        }

        .orb-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(from 0deg, #245a87, #0f6e56, #ef9f27, #245a87);
          animation: spin 1.9s linear infinite;
          opacity: 0.95;
        }

        .orb-ring::after {
          content: '';
          position: absolute;
          inset: 4px;
          border-radius: inherit;
          background: #fff;
        }

        .orb-core {
          position: relative;
          z-index: 1;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #245a87;
          background: linear-gradient(135deg, #eaf4ff, #f4fff9);
          box-shadow: inset 0 0 0 1px rgba(36, 90, 135, 0.12);
        }

        .thinking-copy {
          flex: 1;
          min-width: 0;
        }

        .thinking-eyebrow {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #245a87;
          font-weight: 800;
          margin-bottom: 5px;
        }

        .thinking-line {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #223744;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.3;
        }

        .thinking-line :global(svg) {
          color: #0f6e56;
          flex-shrink: 0;
        }

        .thinking-meter {
          display: flex;
          gap: 5px;
          margin-top: 11px;
        }

        .thinking-meter span {
          width: 24px;
          height: 4px;
          border-radius: 999px;
          background: #d9e7ef;
          animation: meter 1.2s ease-in-out infinite;
        }

        .thinking-meter span:nth-child(2) { animation-delay: 0.16s; }
        .thinking-meter span:nth-child(3) { animation-delay: 0.32s; }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes meter {
          0%, 100% { background: #d9e7ef; transform: scaleX(0.75); }
          50% { background: #0f6e56; transform: scaleX(1.08); }
        }

        @media (max-width: 520px) {
          .thinking-card {
            width: 100%;
            padding: 13px 14px;
            border-radius: 16px;
          }

          .orb-wrap {
            width: 42px;
            height: 42px;
            flex-basis: 42px;
          }

          .orb-core {
            width: 30px;
            height: 30px;
          }

          .thinking-line {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}
