"use client";

import React from 'react';

export default function WelcomeCard() {
  return (
    <div className="welcome-card">
      <div className="avatar-wrapper">
        <img
          className="avatar"
          src="/aria-avatar.png"
          alt="ARIA virtual admissions assistant"
        />
      </div>
      <h3>Hello and welcome to Kinoo VTC!</h3>
      <p>I&apos;m <strong>ARIA</strong>, Kinoo VTC&apos;s virtual admissions and career guidance assistant.</p>
      
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
          width: 74px;
          height: 74px;
          margin: 0 auto 16px;
          border-radius: 50%;
          padding: 4px;
          background: #fff;
          border: 1px solid rgba(15,110,86,0.14);
          box-shadow: 0 14px 32px rgba(15,110,86,0.18);
          overflow: hidden;
        }

        .avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          object-position: center;
          transform: scale(1.22);
          display: block;
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

      `}</style>
    </div>
  );
}
