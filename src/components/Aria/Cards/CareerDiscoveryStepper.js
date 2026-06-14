"use client";

import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';

export default function CareerDiscoveryStepper({ data, onAction }) {
  const [selectedOption, setSelectedOption] = useState(null);

  if (!data || !data.question) return null;

  const handleSelect = (option) => {
    setSelectedOption(option.label);
    // Send response back to AI
    onAction('send_message', option.label);
  };

  return (
    <div className="discovery-container">
      <div className="discovery-progress">
        {data.steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className={`step-dot ${step.status}`}></div>
            {idx < data.steps.length - 1 && <div className={`step-line ${step.status}`}></div>}
          </React.Fragment>
        ))}
      </div>
      <div className="step-labels">
         {data.steps.map((step, idx) => (
           <span key={idx} className={`step-label ${step.status}`}>{step.name}</span>
         ))}
      </div>

      <div className="question-card">
        <h3>{data.question}</h3>
        
        <div className="options-grid">
          {data.options.map((opt, idx) => {
            const IconComponent = opt.icon ? (LucideIcons[opt.icon] || LucideIcons.HelpCircle) : null;
            return (
            <button 
              key={idx} 
              className={`option-chip ${selectedOption === opt.label ? 'selected' : ''}`}
              onClick={() => handleSelect(opt)}
              disabled={selectedOption !== null}
            >
              {IconComponent && <span className="opt-icon"><IconComponent size={16} /></span>}
              <span className="opt-label">{opt.label}</span>
            </button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .discovery-container {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          max-width: 500px;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .discovery-progress {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .step-dot {
          width: 12px; height: 12px;
          border-radius: 50%;
          background: #e0e0e0;
        }

        .step-dot.completed { background: #4ade80; }
        .step-dot.active { 
          background: #0F6E56; 
          box-shadow: 0 0 0 4px rgba(15,110,86,0.2);
        }

        .step-line {
          flex: 1;
          height: 2px;
          background: #e0e0e0;
          margin: 0 8px;
        }

        .step-line.completed { background: #4ade80; }

        .step-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .step-label {
          font-size: 10px;
          font-weight: 600;
          color: #aaa;
          text-transform: uppercase;
        }

        .step-label.active { color: #0F6E56; }
        .step-label.completed { color: #666; }

        .question-card h3 {
          font-family: var(--serif);
          font-size: 18px;
          color: #1a1a1a;
          margin: 0 0 20px 0;
          line-height: 1.4;
        }

        .options-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .option-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #fdfdfc;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .option-chip:hover:not(:disabled) {
          background: #f0f0f0;
          border-color: #ccc;
          transform: translateY(-1px);
        }

        .option-chip.selected {
          background: #E1F5EE;
          border-color: #0F6E56;
          color: #0F6E56;
          font-weight: 600;
        }

        .option-chip:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .opt-icon {
          font-size: 14px;
        }

        .opt-label {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
