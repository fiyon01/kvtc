"use client";

import React from 'react';
import { CheckCircle2, Clock, Award, BookOpen, Briefcase, ChevronRight } from 'lucide-react';

export default function CourseRequirementsCard({ data, onAction }) {
  const { course } = data;
  if (!course) return null;

  const requirements = course.requirements || [
    'KCPE Certificate or equivalent',
    'National ID or Birth Certificate',
    'Passport photo (2 copies)',
    'Medical Certificate',
  ];

  return (
    <div className="crq-card">
      {/* Header */}
      <div className="crq-header">
        <div className="crq-icon">📋</div>
        <div>
          <h4 className="crq-title">{course.name}</h4>
          <p className="crq-sub">Entry Requirements & Course Info</p>
        </div>
      </div>

      {/* Meta row */}
      <div className="crq-meta">
        {course.dur && (
          <div className="crq-meta-item">
            <Clock size={13} color="#0F6E56" />
            <span>{course.dur}</span>
          </div>
        )}
        {course.cert && (
          <div className="crq-meta-item">
            <Award size={13} color="#0F6E56" />
            <span>{course.cert}</span>
          </div>
        )}
        {course.fees && (
          <div className="crq-meta-item">
            <Briefcase size={13} color="#0F6E56" />
            <span>{course.fees}</span>
          </div>
        )}
      </div>

      {/* Requirements list */}
      <div className="crq-section">
        <div className="crq-section-title">
          <BookOpen size={13} />
          <span>What you need to join</span>
        </div>
        <div className="crq-reqs">
          {requirements.map((req, i) => (
            <div key={i} className="crq-req-item">
              <CheckCircle2 size={14} color="#0F6E56" strokeWidth={2.5} />
              <span>{req}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fee note */}
      <div className="crq-fee-note">
        <span>💳 Application fee: <strong>KSh 500</strong> (paid online via M-PESA)</span>
      </div>

      {/* CTA */}
      <button
        className="crq-apply-btn"
        onClick={() => onAction && onAction('send_message', `I want to apply for ${course.name}`)}
      >
        Apply for {course.name} Now <ChevronRight size={16} />
      </button>

      <style jsx>{`
        .crq-card {
          background: #fff;
          border: 1.5px solid rgba(15,110,86,0.15);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(15,110,86,0.08);
          max-width: 420px;
          animation: crqIn 0.35s cubic-bezier(0.22,1,0.36,1) both;
          font-family: var(--font-inter, system-ui, sans-serif);
        }
        @keyframes crqIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .crq-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, #f4fcf8 0%, #eaf5f0 100%);
          border-bottom: 1px solid rgba(15,110,86,0.1);
        }
        .crq-icon {
          width: 40px;
          height: 40px;
          background: #E1F5EE;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .crq-title {
          margin: 0 0 2px;
          font-size: 15px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .crq-sub {
          margin: 0;
          font-size: 11px;
          color: #888;
          font-weight: 500;
        }

        .crq-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .crq-meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #444;
          background: #f8f9fa;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 100px;
          padding: 4px 10px;
          font-weight: 500;
        }

        .crq-section {
          padding: 14px 16px;
        }
        .crq-section-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #0F6E56;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 10px;
        }
        .crq-reqs {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .crq-req-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: #333;
          line-height: 1.4;
        }
        .crq-req-item svg { flex-shrink: 0; margin-top: 2px; }

        .crq-fee-note {
          margin: 0 16px 14px;
          padding: 10px 14px;
          background: #FFF8E8;
          border: 1px solid rgba(212,160,23,0.25);
          border-radius: 8px;
          font-size: 12px;
          color: #7a5500;
        }

        .crq-apply-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #0F6E56, #1D9E75);
          color: white;
          border: none;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s;
          letter-spacing: 0.3px;
        }
        .crq-apply-btn:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}
