"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Trash2 } from 'lucide-react';

export default function AriaHeader({ onClearChat, hasMessages }) {
  const [lang, setLang] = useState('EN');

  return (
    <div className="aria-header">
      <Link href="/" className="back-btn" title="Back to Homepage">
         <ChevronLeft size={20} />
      </Link>
      
      <div className="header-info">
        <div className="logo-area">
          <img src="/kvtc_logo.png" alt="KVTC Logo" className="logo" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
          <div className="logo-fallback">K</div>
        </div>
        <div className="text-info">
          <h2>Kinoo VTC</h2>
          <p>ARIA Admissions Assistant</p>
        </div>
      </div>
      
      <div className="header-actions">
        <div className="header-actions-top-row">
          {hasMessages && (
            <button 
              className="clear-icon-btn" 
              onClick={onClearChat}
              title="Clear conversation"
            >
              <Trash2 size={16} />
            </button>
          )}
          <div className="status-badge">
            <span className="dot"></span>
            Available 24/7
          </div>
        </div>
        <button 
          className="lang-toggle" 
          onClick={() => setLang(l => l === 'EN' ? 'SW' : 'EN')}
        >
          {lang}
        </button>
      </div>

      <style jsx>{`
        .aria-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: #fff;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .back-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f8f7f4;
          color: #1a1a1a;
          margin-right: 12px;
          transition: background 0.2s;
        }

        .back-btn:hover {
          background: #eae8e1;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .logo-area {
          width: 40px;
          height: 40px;
          position: relative;
        }

        .logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .logo-fallback {
          display: none;
          width: 100%;
          height: 100%;
          background: #0F6E56;
          color: white;
          border-radius: 8px;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-family: var(--serif);
          font-size: 1.2rem;
        }

        .text-info h2 {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 2px 0;
        }

        .text-info p {
          font-size: 12px;
          color: #666;
          margin: 0;
        }

        .header-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
        }

        .header-actions-top-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #0F6E56;
          background: #E1F5EE;
          padding: 4px 10px;
          border-radius: 100px;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .lang-toggle {
          background: none;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          color: #555;
          padding: 2px 6px;
          cursor: pointer;
        }

        .clear-icon-btn {
          background: rgba(229, 62, 62, 0.05);
          border: 1px solid rgba(229, 62, 62, 0.1);
          color: #e53e3e;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-icon-btn:hover {
          background: #e53e3e;
          color: white;
        }

        .lang-toggle:hover {
          background: #f0f0f0;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(74, 222, 128, 0); }
          100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
        }

        @media (max-width: 768px) {
          .header-actions {
            flex-direction: row;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
