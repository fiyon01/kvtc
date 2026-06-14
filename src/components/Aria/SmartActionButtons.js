"use client";

import React from 'react';

export default function SmartActionButtons({ actions, onAction }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="smart-actions">
      {actions.map((btn, idx) => (
        <button 
          key={idx} 
          className={`smart-btn ${btn.type || 'secondary'}`}
          onClick={() => onAction(btn.action, btn.payload || btn.label)}
        >
          {btn.label}
        </button>
      ))}

      <style jsx>{`
        .smart-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 16px;
          margin-left: 24px;
        }

        .smart-btn {
          padding: 10px 20px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 1.5px solid transparent;
        }

        .primary {
          background: #0F6E56;
          color: white;
          box-shadow: 0 4px 12px rgba(15,110,86,0.2);
        }

        .primary:hover {
          background: #0c5a46;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(15,110,86,0.3);
        }

        .secondary {
          background: transparent;
          color: #0F6E56;
          border-color: #0F6E56;
        }

        .secondary:hover {
          background: #E1F5EE;
          transform: translateY(-2px);
        }

        .tertiary {
          background: #f0f0f0;
          color: #555;
        }

        .tertiary:hover {
          background: #e0e0e0;
        }
        
        @media (max-width: 480px) {
           .smart-actions { margin-left: 12px; }
        }
      `}</style>
    </div>
  );
}
