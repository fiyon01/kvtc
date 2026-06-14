"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import db from '@/data/db.json';
import { 
  FileText, CreditCard, CheckCircle2, ChevronRight, 
  Clock, ArrowRight, ShieldCheck, Banknote 
} from 'lucide-react';

export default function Admissions() {
  const [activeTab, setActiveTab] = useState('application');
  const { feeStructure } = db;
  const { 
    year, annualTuition, termBreakdown, termVoteHeads, 
    admissionFees, admissionTotal, otherCharges, bankKCB, bankCoop 
  } = feeStructure;

  return (
    <div style={{ background: '#f8f7f4', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* HEADER HERO */}
      <div className="adm-hero">
        <span className="adm-badge">Admissions & Fees</span>
        <h1 className="adm-title">
          Join Kinoo VTC.<br />Build Your Future.
        </h1>
        <p className="adm-subtitle">
          Quality, government-subsidized skills training. Apply online in minutes and start your journey today.
        </p>
      </div>

      <div className="adm-container">
        
        {/* TABS NAVIGATION */}
        <div className="adm-tabs-nav">
          <button 
            className={`adm-tab-btn ${activeTab === 'application' ? 'active' : ''}`}
            onClick={() => setActiveTab('application')}
          >
            <FileText size={18} />
            <span>New Application</span>
          </button>
          <button 
            className={`adm-tab-btn ${activeTab === 'fees' ? 'active' : ''}`}
            onClick={() => setActiveTab('fees')}
          >
            <CreditCard size={18} />
            <span>Fee Structure & Payment</span>
          </button>
        </div>

        {/* TAB 1: NEW APPLICATION */}
        {activeTab === 'application' && (
          <div className="adm-tab-content fade-in">
            
            <div className="adm-grid">
              {/* LEFT: Steps & Requirements */}
              <div className="adm-col">
                
                {/* Steps */}
                <div className="adm-card">
                  <h2 className="adm-card-title">
                    <span className="icon-box green"><Clock size={20} /></span>
                    How to Apply
                  </h2>
                  <p className="adm-card-desc">There are <strong>3 easy ways</strong> to start your application — choose what works best for you.</p>

                  {/* 3 Entry Points */}
                  <div className="adm-entry-points">
                    <div className="entry-option">
                      <div className="entry-icon">💬</div>
                      <div>
                        <div className="entry-title">Chat with ARIA</div>
                        <div className="entry-desc">ARIA collects your details in conversation and opens a pre-filled form for you.</div>
                      </div>
                    </div>
                    <div className="entry-option">
                      <div className="entry-icon">📚</div>
                      <div>
                        <div className="entry-title">From the Courses Page</div>
                        <div className="entry-desc">Browse our catalogue, pick your course, then click the Apply button on the course card.</div>
                      </div>
                    </div>
                    <div className="entry-option">
                      <div className="entry-icon">🏫</div>
                      <div>
                        <div className="entry-title">Visit Us Physically</div>
                        <div className="entry-desc">Come to our campus in Kikuyu, Kiambu. Our admissions team will guide you in person.</div>
                      </div>
                    </div>
                  </div>

                  <div className="adm-divider">
                    <span>Then follow these steps</span>
                  </div>

                  <div className="adm-steps">
                    <div className="adm-step">
                      <div className="step-num">1</div>
                      <div className="step-text">
                        <h4>Fill in Your Details</h4>
                        <p>Provide your name, ID/Birth Certificate number, phone, and chosen course.</p>
                      </div>
                    </div>
                    <div className="adm-step">
                      <div className="step-num">2</div>
                      <div className="step-text">
                        <h4>Upload Documents</h4>
                        <p>Attach a photo of your ID and previous result slip (if any). No strict grades required.</p>
                      </div>
                    </div>
                    <div className="adm-step">
                      <div className="step-num">3</div>
                      <div className="step-text">
                        <h4>Pay Application Fee</h4>
                        <p>Pay KSh 500 via M-PESA (online) or at Co-op Bank Kangemi (in person).</p>
                      </div>
                    </div>
                    <div className="adm-step">
                      <div className="step-num">4</div>
                      <div className="step-text">
                        <h4>Receive Your Admission Letter</h4>
                        <p>Get your official admission letter via email or collect it at the admissions office.</p>
                      </div>
                    </div>
                  </div>

                  <Link href="/apply?skipPre=true" className="adm-apply-btn">
                    Apply Online Now <ArrowRight size={18} />
                  </Link>
                </div>


              </div>

              {/* RIGHT: Requirements & Admission Fees */}
              <div className="adm-col">
                
                {/* Requirements */}
                <div className="adm-card">
                  <h2 className="adm-card-title">
                    <span className="icon-box dark"><ShieldCheck size={20} /></span>
                    Admission Requirements
                  </h2>
                  <p className="adm-card-desc">What you need to bring on reporting day. No strict grades required — all are welcome!</p>
                  
                  <ul className="adm-req-list">
                    {[
                      { text: 'Two (2) passport-size photos', highlight: false },
                      { text: 'Copy of National ID or Birth Certificate', highlight: false },
                      { text: 'Photocopies (set)', highlight: false },
                      { text: 'Three (3) foolscap papers', highlight: false },
                      { text: 'Copy of previous academic result slip (if any) — no strict grades required', highlight: true },
                      { text: 'Medical certificate (from any clinic)', highlight: false },
                      { text: 'Two (2) quire counter books', highlight: false },
                      { text: 'Four (4) A4 exercise books', highlight: false },
                    ].map((req, i) => (
                      <li key={i} className={req.highlight ? 'req-highlight' : ''}>
                        <CheckCircle2 size={18} color="#0F6E56" />
                        <span>{req.highlight ? <strong>{req.text}</strong> : req.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="adm-note">
                    💡 <strong>Note:</strong> Minimum age is 16 years (18+ for Driving classes). Each department also has specific tool/uniform requirements — check your course page.
                  </div>
                </div>


                {/* Admission Fees */}
                <div className="adm-card yellow-tint">
                  <h2 className="adm-card-title text-yellow">
                    <span className="icon-box yellow"><Banknote size={20} /></span>
                    One-Time Admission Fees
                  </h2>
                  <p className="adm-card-desc">Paid once when you first join the institution.</p>
                  
                  <div className="adm-fee-list">
                    {admissionFees.map((af, i) => (
                      <div key={i} className="fee-row">
                        <span>{af.item}</span>
                        <strong>KSh {af.amount.toLocaleString()}</strong>
                      </div>
                    ))}
                    <div className="fee-total">
                      <span>Total Admission Pay</span>
                      <span>KSh {admissionTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="small-note">* Paid to the Co-operative Bank Registration Account (See Fee Payment tab).</p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: FEE PAYMENT */}
        {activeTab === 'fees' && (
          <div className="adm-tab-content fade-in">
            
            <div className="adm-grid">
              {/* LEFT: Fee Structure */}
              <div className="adm-col">
                
                <div className="adm-card">
                  <h2 className="adm-card-title">
                    <span className="icon-box green"><CreditCard size={20} /></span>
                    Subsidised Tuition Fees ({year})
                  </h2>
                  <p className="adm-card-desc">For all NITA and KNEC full-year programmes (Day Scholars).</p>
                  
                  <div className="adm-tuition-highlight">
                    <span>Annual Total</span>
                    <h2>KSh {annualTuition.toLocaleString()}</h2>
                  </div>

                  <div className="adm-terms-grid">
                    {termBreakdown.map((t, i) => (
                      <div key={i} className="term-box">
                        <div className="term-label">{t.label}</div>
                        <div className="term-amount">KSh {t.amount.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>

                  <details className="adm-vote-heads">
                    <summary>View detailed Vote Heads breakdown <ChevronRight size={16} className="icon" /></summary>
                    <div className="details-content">
                      <table className="adm-table">
                        <thead>
                          <tr>
                            <th>Vote Head</th>
                            <th className="right">Per Term</th>
                            <th className="right">Annual</th>
                          </tr>
                        </thead>
                        <tbody>
                          {termVoteHeads.map((vh, i) => (
                            <tr key={i}>
                              <td>{vh.head}</td>
                              <td className="right">KSh {vh.perTerm.toLocaleString()}</td>
                              <td className="right">KSh {vh.annual.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </div>

                {/* Short Courses */}
                <div className="adm-card">
                  <h2 className="adm-card-title">Short Courses & Other Classes</h2>
                  <div className="adm-short-courses">
                    {otherCharges.map((oc, i) => (
                      <div key={i} className="short-course-box">
                        <div className="sc-name">{oc.item}</div>
                        <div className="sc-price">KSh {oc.amount.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT: Payment Methods */}
              <div className="adm-col">
                
                <div className="adm-card dark-card">
                  <h2 className="adm-card-title text-white">
                    <span className="icon-box dark-accent"><Banknote size={20} color="#EF9F27" /></span>
                    Payment Methods
                  </h2>
                  <p className="adm-card-desc text-gray">All fees must be paid to the designated bank accounts. <strong>Cash is not accepted.</strong> Always bring your bank slip.</p>
                  
                  {/* KCB */}
                  <div className="adm-bank-card kcb">
                    <div className="bank-header">
                      <span className="bank-tag green-tag">Tuition Fees Account</span>
                      <img src="/kcb-logo.png" alt="KCB" />
                    </div>
                    <div className="bank-name">{bankKCB.bankName}</div>
                    <div className="bank-ac-name">A/C Name: {bankKCB.accountName}</div>
                    <div className="bank-ac-number">{bankKCB.accountNumber}</div>
                    <div className="bank-note">Use this for Term 1, Term 2, and Term 3 payments.</div>
                  </div>

                  {/* Coop */}
                  <div className="adm-bank-card coop">
                    <div className="bank-header">
                      <span className="bank-tag blue-tag">Registration Account</span>
                      <img src="/coop-logo.png" alt="Co-op Bank" />
                    </div>
                    <div className="bank-name">{bankCoop.bankName}</div>
                    <div className="bank-ac-name">A/C Name: {bankCoop.accountName}</div>
                    <div className="bank-ac-number">{bankCoop.accountNumber}</div>
                    <div className="bank-note">Use this for the one-time admission/registration fees.</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>

      {/* STYLES */}
      <style jsx>{`
        .adm-hero {
          padding: 140px 8% 60px;
          background: linear-gradient(135deg, rgba(15,110,86,0.08) 0%, rgba(239,159,39,0.05) 100%);
          text-align: center;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .adm-badge {
          display: inline-block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #0F6E56;
          background: #E1F5EE;
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 20px;
        }
        .adm-title {
          font-family: var(--font-inter, system-ui, sans-serif);
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 20px;
          line-height: 1.1;
          letter-spacing: -1px;
        }
        .adm-subtitle {
          color: #475569;
          font-size: 1.15rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .adm-container {
          max-width: 1200px;
          margin: -30px auto 0;
          padding: 0 5%;
          position: relative;
          z-index: 10;
        }

        /* Tabs Nav */
        .adm-tabs-nav {
          display: flex;
          background: #ffffff;
          padding: 8px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.05);
          margin-bottom: 40px;
          gap: 8px;
          flex-wrap: wrap;
        }
        .adm-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          border-radius: 14px;
          border: none;
          background: transparent;
          font-size: 15px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 200px;
        }
        .adm-tab-btn:hover {
          background: #f8fafc;
          color: #0f172a;
        }
        .adm-tab-btn.active {
          background: #0F6E56;
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(15, 110, 86, 0.2);
        }

        /* Layout */
        .adm-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 32px;
          align-items: start;
        }
        .adm-col {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        @media (max-width: 900px) {
          .adm-grid { grid-template-columns: 1fr; }
        }

        /* Cards */
        .adm-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 36px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.04);
        }
        .adm-card.yellow-tint {
          background: #FFFbf2;
          border: 1px solid rgba(239, 159, 39, 0.2);
        }
        .adm-card.dark-card {
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.05);
          color: #ffffff;
        }
        .adm-card-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          letter-spacing: -0.5px;
        }
        .adm-card-title.text-yellow { color: #BA7517; }
        .adm-card-title.text-white { color: #ffffff; }
        
        .icon-box {
          width: 40px; height: 40px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .icon-box.green { background: #E1F5EE; color: #0F6E56; }
        .icon-box.dark { background: #f1f5f9; color: #334155; }
        .icon-box.yellow { background: #fef08a; color: #a16207; }
        .icon-box.dark-accent { background: rgba(239, 159, 39, 0.15); }

        .adm-card-desc {
          color: #64748b;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .text-gray { color: #94a3b8; }

        /* Steps */
        /* Entry Points */
        .adm-entry-points {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
        }
        .entry-option {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px 18px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          transition: all 0.25s ease;
        }
        .entry-option:hover {
          background: #f0fdf4;
          border-color: rgba(15, 110, 86, 0.25);
          transform: translateX(4px);
        }
        .entry-icon {
          font-size: 22px;
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          background: #ffffff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .entry-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .entry-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
        }

        /* Divider */
        .adm-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0 24px;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .adm-divider::before,
        .adm-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .adm-steps {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 32px;
          position: relative;
        }
        .adm-steps::before {
          content: '';
          position: absolute;
          left: 20px; top: 10px; bottom: 10px;
          width: 2px;
          background: #e2e8f0;
          z-index: 1;
        }
        .adm-step {
          display: flex;
          gap: 20px;
          position: relative;
          z-index: 2;
        }
        .step-num {
          width: 42px; height: 42px;
          background: #ffffff;
          border: 2px solid #0F6E56;
          color: #0F6E56;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 16px;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(15,110,86,0.1);
        }
        .step-text h4 {
          font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 4px;
        }
        .step-text p {
          font-size: 14px; color: #64748b; margin: 0; line-height: 1.5;
        }

        .adm-apply-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 18px;
          background: linear-gradient(135deg, #0F6E56, #1D9E75);
          color: #fff; font-size: 16px; font-weight: 700;
          border-radius: 16px; text-decoration: none;
          transition: all 0.3s; box-shadow: 0 8px 20px rgba(15,110,86,0.25);
        }
        .adm-apply-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(15,110,86,0.3);
        }

        /* Requirements List */
        .adm-req-list {
          list-style: none; padding: 0; margin: 0 0 24px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .adm-req-list li {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px; background: #f8fafc;
          border-radius: 14px; font-size: 14px; color: #334155;
          font-weight: 500; line-height: 1.5; border: 1px solid #e2e8f0;
        }
        .adm-req-list li svg { flex-shrink: 0; margin-top: 2px; }
        .adm-req-list li.req-highlight {
          background: #f0fdf4;
          border-color: rgba(15, 110, 86, 0.2);
        }
        .adm-note {
          background: rgba(239, 159, 39, 0.1); padding: 16px;
          border-radius: 12px; font-size: 13px; color: #9a600e; line-height: 1.5;
        }

        /* Admission Fees List */
        .adm-fee-list {
          display: flex; flex-direction: column; gap: 12px;
        }
        .fee-row {
          display: flex; justify-content: space-between;
          padding: 16px; background: #ffffff; border-radius: 12px;
          font-size: 15px; color: #475569; border: 1px solid rgba(0,0,0,0.05);
        }
        .fee-row strong { color: #0f172a; }
        .fee-total {
          display: flex; justify-content: space-between;
          padding: 18px; background: #EF9F27; color: #fff;
          border-radius: 14px; font-size: 16px; font-weight: 800;
          margin-top: 8px; box-shadow: 0 8px 20px rgba(239, 159, 39, 0.2);
        }
        .small-note {
          font-size: 12px; color: #8c5810; margin-top: 16px; opacity: 0.8;
        }

        /* Tuition Fees */
        .adm-tuition-highlight {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px; background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 16px; margin-bottom: 24px; color: #0F6E56;
          flex-wrap: wrap; gap: 10px;
        }
        .adm-tuition-highlight span { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .adm-tuition-highlight h2 { font-size: 28px; font-weight: 800; margin: 0; }

        .adm-terms-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;
        }
        .term-box {
          background: #f8fafc; border-radius: 14px; padding: 20px 16px;
          text-align: center; border: 1px solid #e2e8f0;
        }
        .term-label { font-size: 13px; color: #64748b; font-weight: 700; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .term-amount { font-size: 16px; color: #0f172a; font-weight: 800; }

        /* Vote Heads Details */
        .adm-vote-heads summary {
          padding: 20px; background: #f8fafc; border-radius: 14px; cursor: pointer;
          font-size: 15px; font-weight: 700; color: #334155; list-style: none;
          display: flex; justify-content: space-between; align-items: center;
          border: 1px solid #e2e8f0; transition: background 0.2s;
        }
        .adm-vote-heads summary:hover { background: #f1f5f9; }
        .adm-vote-heads summary::marker, .adm-vote-heads summary::-webkit-details-marker { display: none; }
        .adm-vote-heads[open] summary .icon { transform: rotate(90deg); }
        .details-content { padding: 20px 4px 0; overflow-x: auto; }
        
        .adm-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .adm-table th { text-align: left; padding: 12px 8px; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
        .adm-table th.right, .adm-table td.right { text-align: right; }
        .adm-table td { padding: 14px 8px; color: #334155; border-bottom: 1px solid #f1f5f9; font-weight: 500; white-space: nowrap; }

        /* Short Courses */
        .adm-short-courses { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .short-course-box {
          background: #f8fafc; padding: 20px; border-radius: 14px; border: 1px solid #e2e8f0;
        }
        .sc-name { font-size: 14px; color: #64748b; font-weight: 600; margin-bottom: 8px; }
        .sc-price { font-size: 18px; color: #0F6E56; font-weight: 800; }

        @media (max-width: 600px) {
          .adm-short-courses { grid-template-columns: 1fr; }
          .adm-terms-grid { grid-template-columns: 1fr; }
        }

        /* Bank Cards */
        .adm-bank-card {
          border-radius: 16px; padding: 24px; margin-bottom: 20px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
        }
        .bank-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .bank-tag { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 6px 12px; border-radius: 100px; }
        .green-tag { background: rgba(74, 222, 128, 0.1); color: #4ade80; }
        .blue-tag { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
        .bank-header img { height: 24px; opacity: 0.9; }
        
        .bank-name { font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 6px; }
        .bank-ac-name { font-size: 14px; color: rgba(255,255,255,0.6); margin-bottom: 16px; }
        .bank-ac-number { font-size: 26px; font-weight: 800; letter-spacing: 2px; font-family: monospace; color: #EF9F27; margin-bottom: 16px; }
        .bank-note { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.5; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); }

        /* Animations */
        .fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
