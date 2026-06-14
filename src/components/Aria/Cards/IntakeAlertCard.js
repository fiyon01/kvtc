"use client";

import React, { useState } from 'react';
import { Bell, Calendar, CheckCircle } from 'lucide-react';

export default function IntakeAlertCard({ data, onAction }) {
  const [phone, setPhone] = useState('');
  const [intake, setIntake] = useState('September');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (phone.length >= 10) {
      setSubscribed(true);
      // Optional: onAction('save_alert', { phone, intake })
    }
  };

  if (subscribed) {
    return (
      <div className="alert-card success">
        <CheckCircle size={32} color="#0F6E56" />
        <h4>Subscribed successfully!</h4>
        <p>We'll notify you via SMS when the {intake} intake opens.</p>
        <style jsx>{`
          .alert-card.success {
            background: #f4fcf8;
            border: 1.5px solid #0F6E56;
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            max-width: 420px;
            animation: slideIn 0.35s ease-out;
            margin-top: 10px;
          }
          .alert-card.success h4 { color: #0F6E56; margin: 12px 0 4px; font-size: 16px; }
          .alert-card.success p { color: #555; margin: 0; font-size: 13px; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="alert-card">
      <div className="alert-header">
        <div className="alert-icon"><Bell size={20} color="#0F6E56" /></div>
        <div>
          <h4 className="alert-title">Intake Alerts</h4>
          <p className="alert-sub">Be the first to know when admissions open</p>
        </div>
      </div>

      <div className="alert-body">
        <div className="form-group">
          <label>Phone Number</label>
          <input 
            type="tel" 
            placeholder="0712 345 678" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Preferred Intake</label>
          <div className="select-wrapper">
            <Calendar size={14} className="sel-icon" />
            <select value={intake} onChange={(e) => setIntake(e.target.value)}>
              <option value="January">January Intake</option>
              <option value="May">May Intake</option>
              <option value="September">September Intake</option>
            </select>
          </div>
        </div>

        <button 
          className="alert-btn"
          onClick={handleSubscribe}
          disabled={phone.length < 9}
        >
          Subscribe for Alerts
        </button>
      </div>

      <style jsx>{`
        .alert-card {
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
        .alert-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, #f4fcf8 0%, #eaf5f0 100%);
          border-bottom: 1px solid rgba(15,110,86,0.1);
        }
        .alert-icon {
          width: 40px;
          height: 40px;
          background: #E1F5EE;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .alert-title { margin: 0 0 2px; font-size: 15px; font-weight: 700; color: #1a1a1a; }
        .alert-sub { margin: 0; font-size: 11px; color: #888; font-weight: 500; }
        
        .alert-body { padding: 16px; }
        
        .form-group { margin-bottom: 16px; }
        .form-group label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #555;
          margin-bottom: 6px;
        }
        .form-group input, .form-group select {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
          background: #fafafa;
        }
        .form-group input:focus, .form-group select:focus {
          outline: none;
          border-color: #0F6E56;
          background: #fff;
        }
        
        .select-wrapper { position: relative; }
        .sel-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }
        .form-group select { padding-left: 36px; }
        
        .alert-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #0F6E56, #1D9E75);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .alert-btn:disabled { background: #ccc; cursor: not-allowed; }
        .alert-btn:not(:disabled):hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}
