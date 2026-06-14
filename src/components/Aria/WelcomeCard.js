"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function WelcomeCard() {
  return (
    <div className="welcome-card">
      <div className="avatar-wrapper">
        <div className="avatar">A</div>
        <div className="sparkle"><Sparkles size={16} color="#EF9F27" fill="#EF9F27" /></div>
      </div>
      <h3>Hello and welcome to Kinoo VTC!</h3>
      <p>I'm <strong>ARIA</strong>, your personal admissions and career guidance assistant.</p>
      
      <style jsx>{`
        .welcome-card {
          background: linear-gradient(135deg, rgba(15,110,86,0.05), rgba(15,110,86,0.02));
          border: 1px solid rgba(15,110,86,0.1);
          border-radius: 20px;
          padding: 24px;
          text-align: center;
          margin-bottom: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.02);
        }

        .avatar-wrapper {
          position: relative;
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
        }

        .avatar {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0F6E56, #1D9E75);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--serif);
          font-size: 28px;
          font-weight: bold;
          box-shadow: 0 8px 20px rgba(15,110,86,0.3);
        }

        .sparkle {
          position: absolute;
          top: -4px;
          right: -4px;
          font-size: 16px;
          animation: float 3s ease-in-out infinite;
        }

        h3 {
          font-size: 18px;
          color: #1a1a1a;
          margin: 0 0 8px 0;
          font-family: var(--serif);
        }

        p {
          font-size: 14px;
          color: #555;
          margin: 0;
          line-height: 1.5;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
