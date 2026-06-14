"use client";

import React, { useState, useEffect } from 'react';
import { Check, Search, BookOpen, CreditCard, Compass, Cpu, Book } from 'lucide-react';

const LOADING_STEPS = [
  { text: "Reading your message...", icon: Book },
  { text: "Searching the course catalog...", icon: Search },
  { text: "Checking admission requirements...", icon: BookOpen },
  { text: "Reviewing fees and payment options...", icon: CreditCard },
  { text: "Mapping career opportunities...", icon: Compass },
  { text: "Preparing your personalized answer...", icon: Cpu }
];

export default function LoadingRail() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200); // slightly faster

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-rail">
      <div className="rail-container">
        <div className="vertical-line"></div>
        {LOADING_STEPS.map((stepObj, idx) => {
          const isCompleted = idx < step;
          const isActive = idx === step;
          const isUpcoming = idx > step;

          if (isUpcoming && idx > step + 1) return null; // Only show one upcoming step

          const Icon = stepObj.icon;

          return (
            <div key={idx} className={`rail-step ${isCompleted ? 'completed' : isActive ? 'active' : 'upcoming'}`}>
              <div className="rail-node">
                {isCompleted ? (
                   <Check size={14} color="white" strokeWidth={3} />
                ) : isActive ? (
                   <div className="pulse-icon"><Icon size={14} color="#0F6E56" /></div>
                ) : (
                   <Icon size={14} color="#ccc" />
                )}
              </div>
              <div className="rail-content">
                <p>{stepObj.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .loading-rail {
          padding: 10px;
          max-width: 400px;
        }

        .rail-container {
          position: relative;
          padding-left: 24px;
        }

        .vertical-line {
          position: absolute;
          left: 11px;
          top: 10px;
          bottom: 10px;
          width: 2px;
          background: #e0e0e0;
          z-index: 1;
        }

        .rail-step {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
        }

        .rail-step:last-child {
          margin-bottom: 0;
        }

        .rail-node {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          left: -24px;
          border: 2px solid #fff;
        }

        .completed .rail-node {
          background: #4ade80;
        }

        .active .rail-node {
          background: #E1F5EE;
          border-color: #0F6E56;
        }

        .upcoming .rail-node {
          background: #f8f7f4;
          border-color: #e0e0e0;
        }

        .pulse-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 1.5s infinite;
        }

        .rail-content p {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.3s;
        }

        .completed .rail-content p {
          color: #999;
        }

        .active .rail-content p {
          color: #0F6E56;
          animation: text-pulse 1.5s infinite;
        }

        .upcoming .rail-content p {
          color: #bbb;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(15, 110, 86, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(15, 110, 86, 0); }
          100% { box-shadow: 0 0 0 0 rgba(15, 110, 86, 0); }
        }

        @keyframes text-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
