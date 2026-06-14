"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, CheckCircle2, User, Phone, CreditCard, Users, PhoneCall, BookOpen } from 'lucide-react';

const STEPS = [
  { id: 1, field: 'name',    label: 'Your full name',                            placeholder: 'e.g. John Kamau',   icon: User,      type: 'text' },
  { id: 2, field: 'phone',   label: 'Your phone number',                         placeholder: 'e.g. 0712345678',   icon: Phone,     type: 'tel' },
  { id: 3, field: 'idNo',    label: 'National ID or Birth Certificate number',   placeholder: 'e.g. 12345678',     icon: CreditCard, type: 'text' },
  { id: 4, field: 'kinName', label: 'Next of Kin full name (Parent/Guardian)',   placeholder: 'e.g. Jane Kamau',   icon: Users,     type: 'text' },
  { id: 5, field: 'kinTel',  label: "Next of Kin's phone number",               placeholder: 'e.g. 0722000000',   icon: PhoneCall, type: 'tel' },
  { id: 6, field: 'course',  label: 'Course you want to apply for',             placeholder: 'e.g. Electrical',   icon: BookOpen,  type: 'text' },
];

export default function ApplicationWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '', idNo: '', kinName: '', kinTel: '', course: '' });
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  // Focus the input whenever the step changes
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [step]);

  const currentStep = STEPS[step - 1];
  const progress = Math.round(((step - 1) / STEPS.length) * 100);

  const advance = () => {
    const val = formData[currentStep.field]?.trim();
    if (!val) return;
    if (step < STEPS.length) {
      setStep(s => s + 1);
    } else {
      setDone(true);
      setTimeout(() => onComplete(formData), 1400);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); advance(); }
  };

  return (
    <div className="awiz-card">

      {/* Header */}
      <div className="awiz-header">
        <div className="awiz-title-row">
          <div className="awiz-badge">📋 Online Application</div>
          <span className="awiz-step-label">{done ? 'Done' : `${step} / ${STEPS.length}`}</span>
        </div>

        {/* Progress bar */}
        <div className="awiz-progress-track">
          <div className="awiz-progress-fill" style={{ width: done ? '100%' : `${progress}%` }} />
        </div>

        {/* Step dots */}
        <div className="awiz-dots">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const completed = s.id < step || done;
            const active = s.id === step && !done;
            return (
              <div key={s.id} className={`awiz-dot ${completed ? 'completed' : active ? 'active' : 'future'}`}>
                {completed ? <CheckCircle2 size={13} strokeWidth={2.5} /> : <Icon size={12} strokeWidth={2} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="awiz-body">
        {!done ? (
          <div className="awiz-step-wrap" key={step}>
            <div className="awiz-step-icon">
              {React.createElement(currentStep.icon, { size: 20, color: '#0F6E56' })}
            </div>
            <label className="awiz-label">{currentStep.label}</label>
            <input
              ref={inputRef}
              type={currentStep.type}
              className="awiz-input"
              placeholder={currentStep.placeholder}
              value={formData[currentStep.field]}
              onChange={e => setFormData(f => ({ ...f, [currentStep.field]: e.target.value }))}
              onKeyDown={handleKey}
            />

            {/* Review row – show completed answers above */}
            {step > 1 && (
              <div className="awiz-review">
                {STEPS.slice(0, step - 1).map(s => (
                  <div key={s.id} className="awiz-review-item">
                    {React.createElement(s.icon, { size: 11, color: '#0F6E56' })}
                    <span>{formData[s.field]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="awiz-success">
            <CheckCircle2 size={32} color="#0F6E56" />
            <div>
              <p className="awiz-success-title">All done, {formData.name.split(' ')[0]}! 🎉</p>
              <p className="awiz-success-sub">Opening your admission form with everything filled in…</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {!done && (
        <button
          className="awiz-btn"
          onClick={advance}
          disabled={!formData[currentStep.field]?.trim()}
        >
          {step === STEPS.length ? 'Continue to Payment →' : 'Next'} <ChevronRight size={16} />
        </button>
      )}

      <style jsx>{`
        .awiz-card {
          background: #fff;
          border: 1.5px solid rgba(15,110,86,0.18);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 6px 28px rgba(15,110,86,0.08);
          margin-top: 12px;
          font-family: var(--font-inter, system-ui, sans-serif);
          animation: awizIn 0.3s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes awizIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Header ── */
        .awiz-header {
          padding: 14px 16px 10px;
          background: linear-gradient(135deg, #f4fcf8 0%, #eaf5f0 100%);
          border-bottom: 1px solid rgba(15,110,86,0.1);
        }
        .awiz-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .awiz-badge {
          font-size: 12px;
          font-weight: 700;
          color: #0F6E56;
          letter-spacing: 0.3px;
        }
        .awiz-step-label {
          font-size: 11px;
          color: #888;
          font-weight: 600;
          background: rgba(15,110,86,0.08);
          padding: 2px 8px;
          border-radius: 100px;
        }

        /* Progress bar */
        .awiz-progress-track {
          height: 4px;
          background: rgba(15,110,86,0.1);
          border-radius: 100px;
          margin-bottom: 10px;
          overflow: hidden;
        }
        .awiz-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0F6E56, #1D9E75);
          border-radius: 100px;
          transition: width 0.4s cubic-bezier(0.22,1,0.36,1);
        }

        /* Dot nav */
        .awiz-dots {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .awiz-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          border: 1.5px solid transparent;
        }
        .awiz-dot.completed {
          background: #0F6E56;
          color: white;
        }
        .awiz-dot.active {
          background: #E1F5EE;
          border-color: #0F6E56;
          color: #0F6E56;
        }
        .awiz-dot.future {
          background: #f5f5f5;
          color: #bbb;
        }

        /* ── Body ── */
        .awiz-body {
          padding: 18px 16px;
        }
        .awiz-step-wrap {
          animation: stepIn 0.3s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes stepIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .awiz-step-icon {
          width: 38px;
          height: 38px;
          background: #E1F5EE;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        }
        .awiz-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .awiz-input {
          width: 100%;
          padding: 11px 13px;
          border: 1.5px solid rgba(15,110,86,0.25);
          border-radius: 9px;
          font-size: 14px;
          outline: none;
          background: #fff;
          color: #1a1a1a;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .awiz-input:focus {
          border-color: #0F6E56;
          box-shadow: 0 0 0 3px rgba(15,110,86,0.1);
        }

        /* Review chips */
        .awiz-review {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 12px;
        }
        .awiz-review-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #555;
          background: #f4fcf8;
          border: 1px solid rgba(15,110,86,0.12);
          border-radius: 100px;
          padding: 4px 10px;
        }
        .awiz-review-item span {
          max-width: 120px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Success */
        .awiz-success {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 4px;
          animation: stepIn 0.3s ease both;
        }
        .awiz-success-title {
          font-size: 14px;
          font-weight: 700;
          color: #0F6E56;
          margin: 0 0 4px;
        }
        .awiz-success-sub {
          font-size: 12px;
          color: #888;
          margin: 0;
        }

        /* ── Button ── */
        .awiz-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #0F6E56, #1D9E75);
          color: white;
          border: none;
          font-weight: 700;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          letter-spacing: 0.3px;
        }
        .awiz-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .awiz-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </div>
  );
}
