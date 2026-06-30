"use client";

import React from 'react';
import { Banknote, Building2, CheckCircle2, Info } from 'lucide-react';

export default function FeeAdvisorCard() {
  return (
    <div className="fee-card">
      <div className="fee-heading">
        <div className="fee-icon"><Banknote size={20} /></div>
        <div>
          <h3>Current Fee Reference</h3>
          <p>Use these figures when planning your admission payments.</p>
        </div>
      </div>

      <div className="fee-grid">
        <div className="fee-item">
          <span>Application</span>
          <strong>KSh 500</strong>
        </div>
        <div className="fee-item">
          <span>Admission charges</span>
          <strong>KSh 3,450</strong>
        </div>
        <div className="fee-item">
          <span>Tuition per term</span>
          <strong>KSh 9,000</strong>
        </div>
      </div>

      <div className="fee-note">
        <Info size={15} />
        <span>ARIA can explain the published fees but cannot approve a payment arrangement.</span>
      </div>

      <div className="fee-footer">
        <CheckCircle2 size={14} />
        <span>Confirm bursaries or special arrangements with Admissions.</span>
        <Building2 size={14} />
      </div>

      <style jsx>{`
        .fee-card {
          max-width: 450px;
          margin-top: 10px;
          padding: 18px;
          border: 1px solid #dce8e4;
          border-radius: 16px;
          background: linear-gradient(145deg, #ffffff, #f5faf8);
          box-shadow: 0 8px 24px rgba(20, 56, 48, 0.08);
          font-family: var(--font-inter, system-ui, sans-serif);
        }
        .fee-heading { display: flex; align-items: center; gap: 11px; }
        .fee-icon {
          display: grid;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          place-items: center;
          border-radius: 11px;
          background: #e1f3ec;
          color: #0f6e56;
        }
        h3 { margin: 0 0 3px; color: #182c27; font-size: 15px; }
        .fee-heading p { margin: 0; color: #687973; font-size: 11px; }
        .fee-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          margin: 16px 0 12px;
        }
        .fee-item {
          padding: 11px 8px;
          border: 1px solid #e2ebe8;
          border-radius: 10px;
          background: #fff;
          text-align: center;
        }
        .fee-item span { display: block; color: #71817b; font-size: 9px; }
        .fee-item strong { display: block; margin-top: 4px; color: #173e34; font-size: 13px; }
        .fee-note {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          padding: 10px;
          border-radius: 9px;
          background: #edf4fa;
          color: #38556d;
          font-size: 11px;
          line-height: 1.45;
        }
        .fee-note :global(svg) { flex-shrink: 0; margin-top: 1px; }
        .fee-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 11px;
          color: #60716b;
          font-size: 10px;
          text-align: center;
        }
        @media (max-width: 480px) {
          .fee-grid { grid-template-columns: 1fr; }
          .fee-item { display: flex; align-items: center; justify-content: space-between; text-align: left; }
          .fee-item strong { margin-top: 0; }
        }
      `}</style>
    </div>
  );
}
