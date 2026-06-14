"use client";

import React from 'react';
import { FileText, Phone, CheckCircle } from 'lucide-react';

export default function ApplicationGuideCard({ onAction }) {
  return (
    <div className="application-guide-container">
      <h3 className="rail-main-title">How to Apply</h3>
      <p className="rail-intro">Follow these simple steps to complete your application.</p>
      
      <div className="guide-card">
         <div className="guide-steps">
            <div className="mini-rail-item">
              <span className="mini-icon"><FileText size={16} color="#0F6E56" /></span>
              <div className="mini-content">
                <span className="mini-title">Step 1</span>
                <span className="mini-text">Fill in your personal and educational details.</span>
              </div>
            </div>

            <div className="mini-rail-item">
              <span className="mini-icon"><Phone size={16} color="#0F6E56" /></span>
              <div className="mini-content">
                <span className="mini-title">Step 2</span>
                <span className="mini-text">Pay the application fee of KSh 500 via M-PESA.</span>
              </div>
            </div>

            <div className="mini-rail-item">
              <span className="mini-icon"><CheckCircle size={16} color="#0F6E56" /></span>
              <div className="mini-content">
                <span className="mini-title">Step 3</span>
                <span className="mini-text">Get your Admission Letter instantly.</span>
              </div>
            </div>
         </div>
         
         <div className="guide-actions">
            <button 
              className="smart-btn primary"
              onClick={() => onAction('send_message', 'I am ready to apply')}
            >
              Start Application Now
            </button>
         </div>
      </div>

      <style jsx>{`
        .application-guide-container {
          background: #fff;
          border-radius: 16px;
          padding: 20px 0;
          max-width: 600px;
        }

        .rail-main-title {
          font-size: 18px;
          font-family: var(--serif);
          color: #1a1a1a;
          margin: 0 0 8px 24px;
        }

        .rail-intro {
          font-size: 14px;
          color: #555;
          margin: 0 0 20px 24px;
          line-height: 1.5;
        }

        .guide-card {
          background: #fdfdfc;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          position: relative;
          overflow: hidden;
          margin: 0 24px;
        }
        
        .guide-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, #0F6E56, #4ade80);
        }

        .guide-steps {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
        }

        .mini-rail-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .mini-icon {
          font-size: 16px;
          background: #E1F5EE;
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .mini-content {
          font-size: 14px;
          line-height: 1.4;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mini-title {
          font-weight: 600;
          color: #333;
        }

        .mini-text {
          color: #555;
        }

        .guide-actions {
          display: flex;
          gap: 10px;
          border-top: 1px solid rgba(0,0,0,0.05);
          padding-top: 16px;
        }

        .smart-btn {
          padding: 10px 20px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 1.5px solid transparent;
          width: 100%;
        }

        .primary {
          background: #0F6E56;
          color: white;
        }

        .primary:hover {
          background: #0c5a46;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
