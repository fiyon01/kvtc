"use client";

import React from 'react';
import { MessageCircle, User, ArrowRight } from 'lucide-react';

export default function WhatsAppHandoffCard({ data, onAction }) {
  const whatsappUrl = "https://wa.me/254113582008?text=Hello%20Admissions%21%20I%20was%20speaking%20with%20ARIA%20on%20the%20website%20and%20would%20like%20to%20speak%20to%20an%20officer.";

  return (
    <div className="wa-card">
      <div className="wa-header">
        <div className="wa-icon"><User size={20} color="#0F6E56" /></div>
        <div>
          <h4 className="wa-title">Speak to Admissions</h4>
          <p className="wa-sub">Connect with a human officer instantly</p>
        </div>
      </div>

      <div className="wa-body">
        <p>Our admissions team is available to answer any complex questions you might have.</p>
        <button 
          className="wa-btn"
          onClick={() => window.open(whatsappUrl, '_blank')}
        >
          <MessageCircle size={18} />
          Continue on WhatsApp
          <ArrowRight size={16} />
        </button>
      </div>

      <style jsx>{`
        .wa-card {
          background: #fff;
          border: 1.5px solid rgba(15,110,86,0.15);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(15,110,86,0.08);
          max-width: 420px;
          animation: slideIn 0.35s cubic-bezier(0.22,1,0.36,1) both;
          font-family: var(--font-inter, system-ui, sans-serif);
          margin-top: 10px;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .wa-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, #f4fcf8 0%, #eaf5f0 100%);
          border-bottom: 1px solid rgba(15,110,86,0.1);
        }
        .wa-icon {
          width: 40px;
          height: 40px;
          background: #E1F5EE;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wa-title { margin: 0 0 2px; font-size: 15px; font-weight: 700; color: #1a1a1a; }
        .wa-sub { margin: 0; font-size: 11px; color: #888; font-weight: 500; }
        .wa-body { padding: 16px; }
        .wa-body p { margin: 0 0 16px; font-size: 13px; color: #444; line-height: 1.5; }
        .wa-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px;
          background: #25D366;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .wa-btn:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}
