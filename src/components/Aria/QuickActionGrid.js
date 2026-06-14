"use client";

import React from 'react';
import { GraduationCap, Wallet, Calendar, FileText, ClipboardList, MapPin } from 'lucide-react';

const ACTIONS = [
  { id: 'choose', icon: <GraduationCap size={24} />, label: 'Help me choose a course', message: 'I need help choosing a course.' },
  { id: 'fees', icon: <Wallet size={24} />, label: 'Check course fees', message: 'What are the course fees?' },
  { id: 'dates', icon: <Calendar size={24} />, label: 'View intake dates', message: 'When is the next intake?' },
  { id: 'apply', icon: <FileText size={24} />, label: 'Apply for admission', message: 'I want to apply for admission.' },
  { id: 'reqs', icon: <ClipboardList size={24} />, label: 'Admission requirements', message: 'What are the admission requirements?' },
  { id: 'location', icon: <MapPin size={24} />, label: 'Campus location', message: 'Where is the campus located?' }
];

export default function QuickActionGrid({ onAction }) {
  return (
    <div className="quick-action-grid">
      {ACTIONS.map(action => (
        <button 
          key={action.id} 
          className="action-card"
          onClick={() => onAction('send_message', action.message)}
        >
          <span className="action-icon">{action.icon}</span>
          <span className="action-label">{action.label}</span>
        </button>
      ))}

      <style jsx>{`
        .quick-action-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .action-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 12px;
          padding: 14px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }

        .action-card:hover {
          transform: translateY(-2px);
          border-color: #0F6E56;
          box-shadow: 0 8px 24px rgba(15,110,86,0.1);
        }

        .action-icon {
          font-size: 24px;
          background: #f8f7f4;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-card:hover .action-icon {
          background: #E1F5EE;
        }

        .action-label {
          font-size: 12px;
          font-weight: 600;
          color: #444;
          line-height: 1.3;
        }

        @media (max-width: 768px) {
          .quick-action-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }
          
          .action-card {
            padding: 10px 6px;
          }
          
          .action-icon {
            font-size: 20px;
            width: 36px;
            height: 36px;
          }
          
          .action-label {
            font-size: 10px;
          }
        }
        
        @media (max-width: 400px) {
           .quick-action-grid {
              grid-template-columns: 1fr 1fr;
           }
        }
      `}</style>
    </div>
  );
}
