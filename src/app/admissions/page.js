"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import db from '@/data/db.json';
import { 
  FileText, CreditCard, CheckCircle2, ChevronRight, 
  Clock, ArrowRight, ShieldCheck, Banknote, MapPin, MousePointerClick, MessageSquare
} from 'lucide-react';

export default function Admissions() {
  const [activeSection, setActiveSection] = useState('how-to-apply');
  const { feeStructure } = db;
  const { 
    year, annualTuition, termBreakdown, termVoteHeads, 
    admissionFees, admissionTotal, otherCharges, bankKCB, bankCoop 
  } = feeStructure;

  // Intersection Observer to update active section in sidebar
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    const sections = document.querySelectorAll('.adm-section');
    sections.forEach(s => observer.observe(s));
    return () => sections.forEach(s => observer.unobserve(s));
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px', fontFamily: 'var(--sans)' }}>
      
      {/* HEADER HERO */}
      <div className="adm-hero">
        <div className="adm-hero-content">
          <span className="adm-badge">Admissions & Fees</span>
          <h1 className="adm-title">
            Join Kinoo VTC.<br />Build Your Future.
          </h1>
          <p className="adm-subtitle">
            Quality, government-subsidized skills training. Apply online in minutes and start your journey today.
          </p>
          <div className="adm-hero-actions">
            <Link href="/apply?skipPre=true" className="adm-btn-primary">
              Start Application Now <ArrowRight size={18} />
            </Link>
            <button onClick={() => scrollToSection('how-to-apply')} className="adm-btn-secondary">
              Learn How to Apply
            </button>
          </div>
        </div>
      </div>

      <div className="adm-container">
        
        {/* STICKY SIDEBAR */}
        <aside className="adm-sidebar">
          <nav className="adm-nav">
            <div className="adm-nav-header">Table of Contents</div>
            <button className={`adm-nav-link ${activeSection === 'how-to-apply' ? 'active' : ''}`} onClick={() => scrollToSection('how-to-apply')}>How to Apply</button>
            <button className={`adm-nav-link ${activeSection === 'requirements' ? 'active' : ''}`} onClick={() => scrollToSection('requirements')}>Admission Requirements</button>
            <button className={`adm-nav-link ${activeSection === 'tuition' ? 'active' : ''}`} onClick={() => scrollToSection('tuition')}>Tuition Fees ({year})</button>
            <button className={`adm-nav-link ${activeSection === 'admission-fees' ? 'active' : ''}`} onClick={() => scrollToSection('admission-fees')}>One-Time Admission Fees</button>
            <button className={`adm-nav-link ${activeSection === 'short-courses' ? 'active' : ''}`} onClick={() => scrollToSection('short-courses')}>Short Courses</button>
            <button className={`adm-nav-link ${activeSection === 'payment' ? 'active' : ''}`} onClick={() => scrollToSection('payment')}>Bank Details & Payment</button>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="adm-content">

          {/* 1. HOW TO APPLY */}
          <section id="how-to-apply" className="adm-section">
            <div className="adm-section-header">
              <span className="icon-box green"><Clock size={20} /></span>
              <h2>How to Apply</h2>
            </div>
            <p className="adm-section-desc">We offer three convenient ways to start your application journey.</p>
            
            <div className="adm-entry-points">
              {/* Premium ARIA Card */}
              <div className="entry-option premium-entry">
                <div className="entry-icon pulse-icon"><MessageSquare size={24} color="#0F6E56" /></div>
                <div>
                  <div className="entry-title">Chat with ARIA (Fastest)</div>
                  <div className="entry-desc">ARIA collects your details in conversation and opens a pre-filled application form for you instantly.</div>
                </div>
              </div>
              <div className="entry-option">
                <div className="entry-icon"><MousePointerClick size={22} color="#64748b" /></div>
                <div>
                  <div className="entry-title">From the Courses Page</div>
                  <div className="entry-desc">Browse our catalogue, pick your course, then click the Apply button directly on the course card.</div>
                </div>
              </div>
              <div className="entry-option">
                <div className="entry-icon"><MapPin size={22} color="#64748b" /></div>
                <div>
                  <div className="entry-title">Visit Us Physically</div>
                  <div className="entry-desc">Come to our campus in Kikuyu, Kiambu. Our friendly admissions team will guide you in person.</div>
                </div>
              </div>
            </div>

            <div className="adm-steps-container">
              <h3>The 4-Step Process</h3>
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
                    <p>Attach a photo of your ID and previous result slip (if any).</p>
                  </div>
                </div>
                <div className="adm-step">
                  <div className="step-num">3</div>
                  <div className="step-text">
                    <h4>Pay Application Fee</h4>
                    <p>Pay KSh 500 securely via M-PESA or at the bank.</p>
                  </div>
                </div>
                <div className="adm-step">
                  <div className="step-num">4</div>
                  <div className="step-text">
                    <h4>Receive Admission Letter</h4>
                    <p>Get your official admission letter instantly to print or save.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* LIFESTYLE IMAGE DIVIDER */}
          <div className="adm-image-divider">
             <img src="/admissions_hero.png" alt="Students walking on campus" />
          </div>

          {/* 2. REQUIREMENTS */}
          <section id="requirements" className="adm-section">
            <div className="adm-section-header">
              <span className="icon-box dark"><ShieldCheck size={20} /></span>
              <h2>Admission Requirements</h2>
            </div>
            <p className="adm-section-desc">What you need to bring on reporting day. No strict grades required — all are welcome to learn a skill!</p>
            
            <div className="adm-card">
              <ul className="adm-req-list">
                {[
                  { text: 'Two (2) passport-size photos', highlight: false },
                  { text: 'Copy of National ID or Birth Certificate', highlight: false },
                  { text: 'Photocopies (set)', highlight: false },
                  { text: 'Three (3) foolscap papers', highlight: false },
                  { text: 'Copy of previous academic result slip (if any) — no strict grades required', highlight: true },
                  { text: 'Medical certificate (from any registered clinic)', highlight: false },
                  { text: 'Two (2) quire counter books', highlight: false },
                  { text: 'Four (4) A4 exercise books', highlight: false },
                ].map((req, i) => (
                  <li key={i} className={req.highlight ? 'req-highlight' : ''}>
                    <CheckCircle2 size={20} color={req.highlight ? "#0F6E56" : "#94a3b8"} />
                    <span>{req.highlight ? <strong>{req.text}</strong> : req.text}</span>
                  </li>
                ))}
              </ul>
              <div className="adm-note">
                💡 <strong>Note:</strong> Minimum age is 16 years (18+ for Driving classes). Each department also has specific tool/uniform requirements which you will receive upon admission.
              </div>
            </div>
          </section>

          {/* 3. TUITION FEES */}
          <section id="tuition" className="adm-section">
            <div className="adm-section-header">
              <span className="icon-box green"><CreditCard size={20} /></span>
              <h2>Subsidised Tuition Fees ({year})</h2>
            </div>
            <p className="adm-section-desc">For all NITA and KNEC full-year programmes (Day Scholars). Government subsidized.</p>
            
            <div className="adm-card">
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
                <summary>View detailed Vote Heads breakdown <ChevronRight size={18} className="icon" /></summary>
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
          </section>

          {/* 4. ADMISSION FEES */}
          <section id="admission-fees" className="adm-section">
            <div className="adm-section-header">
              <span className="icon-box yellow"><Banknote size={20} /></span>
              <h2>One-Time Admission Fees</h2>
            </div>
            <p className="adm-section-desc">These are one-off administrative fees paid only once when you first join the institution.</p>
            
            <div className="adm-card yellow-tint">
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
              <p className="small-note">* Paid exclusively to the Co-operative Bank Registration Account.</p>
            </div>
          </section>

          {/* 5. SHORT COURSES */}
          <section id="short-courses" className="adm-section">
            <div className="adm-section-header">
              <span className="icon-box dark"><FileText size={20} /></span>
              <h2>Short Courses & Other Classes</h2>
            </div>
            
            <div className="adm-short-courses">
              {otherCharges.map((oc, i) => (
                <div key={i} className="short-course-box">
                  <div className="sc-name">{oc.item}</div>
                  <div className="sc-price">KSh {oc.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. PAYMENT METHODS (GLASSMORPHISM) */}
          <section id="payment" className="adm-section">
            <div className="adm-section-header">
              <span className="icon-box dark-accent"><Banknote size={20} color="#EF9F27" /></span>
              <h2>Bank Details & Payment</h2>
            </div>
            <p className="adm-section-desc">All fees must be paid directly to the designated bank accounts below. <strong>Cash is strictly not accepted.</strong> Keep your deposit slips safe.</p>
            
            <div className="adm-bank-container">
              {/* KCB */}
              <div className="adm-bank-card kcb-glass">
                <div className="bank-header">
                  <span className="bank-tag green-tag">Tuition Fees Account</span>
                  <img src="/kcb-logo.png" alt="KCB" className="bank-logo-img" />
                </div>
                <div className="bank-name">{bankKCB.bankName}</div>
                <div className="bank-ac-name">A/C Name: {bankKCB.accountName}</div>
                <div className="bank-ac-number">{bankKCB.accountNumber}</div>
                <div className="bank-note">Use this for Term 1, Term 2, and Term 3 Tuition payments.</div>
              </div>

              {/* Coop */}
              <div className="adm-bank-card coop-glass">
                <div className="bank-header">
                  <span className="bank-tag blue-tag">Registration Account</span>
                  <img src="/coop-logo.png" alt="Co-op Bank" className="bank-logo-img" />
                </div>
                <div className="bank-name">{bankCoop.bankName}</div>
                <div className="bank-ac-name">A/C Name: {bankCoop.accountName}</div>
                <div className="bank-ac-number">{bankCoop.accountNumber}</div>
                <div className="bank-note">Use this for the one-time admission/registration fees.</div>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* STYLES */}
      <style jsx>{`
        /* Hero */
        .adm-hero {
          padding: 160px 5% 100px;
          background: linear-gradient(135deg, #0f172a 0%, #0F6E56 100%);
          text-align: center;
          position: relative;
          color: white;
          overflow: hidden;
        }
        .adm-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .adm-hero-content {
          position: relative; z-index: 2;
          max-width: 800px; margin: 0 auto;
        }
        .adm-badge {
          display: inline-block; font-size: 13px; font-weight: 800; letter-spacing: 2px;
          text-transform: uppercase; color: #4ade80; background: rgba(74, 222, 128, 0.1);
          padding: 6px 16px; border-radius: 100px; margin-bottom: 24px; border: 1px solid rgba(74, 222, 128, 0.2);
        }
        .adm-title {
          font-family: var(--serif); font-size: clamp(3rem, 6vw, 4.5rem);
          font-weight: 800; margin-bottom: 20px; line-height: 1.1; letter-spacing: -0.02em;
        }
        .adm-subtitle {
          color: rgba(255,255,255,0.8); font-size: 1.15rem; max-width: 600px; margin: 0 auto 40px; line-height: 1.6;
        }
        .adm-hero-actions {
          display: flex; gap: 16px; justify-content: center; align-items: center; flex-wrap: wrap;
        }
        .adm-btn-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          background: #0F6E56; color: #ffffff !important; height: 56px; padding: 0 32px;
          border-radius: 12px; font-weight: 700; font-size: 16px; text-decoration: none;
          transition: all 0.2s ease; box-shadow: 0 10px 25px rgba(15,110,86,0.3); border: none;
        }
        .adm-btn-primary:hover {
          transform: translateY(-2px); box-shadow: 0 15px 30px rgba(15,110,86,0.4);
        }
        .adm-btn-secondary {
          display: inline-flex; align-items: center; justify-content: center; height: 56px;
          background: rgba(255,255,255,0.1); color: #fff !important; border: 1px solid rgba(255,255,255,0.2);
          padding: 0 32px; border-radius: 12px; font-weight: 600; font-size: 16px; text-decoration: none;
          cursor: pointer; transition: all 0.2s ease; backdrop-filter: blur(10px);
        }
        .adm-btn-secondary:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); }

        /* Container & Layout */
        .adm-container {
          max-width: 1200px; margin: -40px auto 0; padding: 0 24px;
          position: relative; z-index: 10; display: grid; grid-template-columns: 280px 1fr; gap: 48px; align-items: start;
        }
        @media (max-width: 900px) {
          .adm-container { grid-template-columns: 1fr; gap: 32px; }
        }

        /* Sidebar Nav */
        .adm-sidebar {
          position: sticky; top: 120px;
          background: #fff; padding: 24px; border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.04);
        }
        .adm-nav-header { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-bottom: 16px; }
        .adm-nav { display: flex; flex-direction: column; gap: 8px; }
        .adm-nav-link {
          text-align: left; background: transparent; border: none; padding: 12px 16px;
          border-radius: 10px; font-size: 14px; font-weight: 600; color: #64748b;
          cursor: pointer; transition: all 0.2s ease;
        }
        .adm-nav-link:hover { background: #f8fafc; color: #0f172a; }
        .adm-nav-link.active { background: #E1F5EE; color: #0F6E56; }
        
        @media (max-width: 900px) {
          .adm-sidebar { display: none; /* Hide sticky sidebar on mobile, let them scroll naturally */ }
        }

        /* Sections */
        .adm-content { display: flex; flex-direction: column; gap: 60px; }
        .adm-section { scroll-margin-top: 120px; }
        
        .adm-section-header { display: flex; align-items: center; gap: 16px; margin-top: 64px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
        .adm-section-header h2 { font-family: var(--serif); font-size: 2.25rem; color: #0f172a; margin: 0; font-weight: 800; letter-spacing: -0.02em; }
        .adm-section-desc { font-size: 1.1rem; color: #64748b; line-height: 1.6; margin-bottom: 32px; }

        .icon-box {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .icon-box.green { background: #E1F5EE; color: #0F6E56; }
        .icon-box.dark { background: #f1f5f9; color: #334155; }
        .icon-box.yellow { background: #fef08a; color: #a16207; }
        .icon-box.dark-accent { background: rgba(239, 159, 39, 0.15); color: #EF9F27; }

        /* General Card */
        .adm-card {
          background: #ffffff; border-radius: 24px; padding: 40px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.04);
        }
        .adm-card.yellow-tint { background: #fffcf5; border: 1px solid rgba(239, 159, 39, 0.15); }

        @media (max-width: 600px) {
          .adm-card { padding: 24px; }
          .adm-section-header h2 { font-size: 1.5rem; }
        }

        /* Entry Points (How to apply) */
        .adm-entry-points { display: flex; flex-direction: column; gap: 16px; margin-bottom: 48px; }
        .entry-option {
          display: flex; align-items: flex-start; gap: 20px; padding: 24px;
          background: #fff; border: 1px solid #e2e8f0; border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: all 0.3s ease;
        }
        .entry-option:hover { transform: translateX(4px); box-shadow: 0 10px 25px rgba(0,0,0,0.04); }
        .premium-entry { background: linear-gradient(to right, #f4fdf8, #fff); border-color: #bbf7d0; }
        .premium-entry:hover { border-color: #86efac; }
        
        .entry-icon {
          width: 54px; height: 54px; border-radius: 14px; background: #f1f5f9;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .premium-entry .entry-icon { background: #dcfce7; }
        .pulse-icon { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); } 70% { box-shadow: 0 0 0 15px rgba(74,222,128,0); } 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); } }

        .entry-title { font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
        .entry-desc { font-size: 14px; color: #64748b; line-height: 1.6; }

        /* Steps */
        .adm-steps-container h3 { font-size: 1.25rem; color: #0f172a; margin-bottom: 24px; font-family: var(--serif); }
        .adm-steps { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 600px) { .adm-steps { grid-template-columns: 1fr; } }
        .adm-step { display: flex; gap: 16px; background: #fff; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; }
        .step-num { width: 36px; height: 36px; background: #f1f5f9; color: #64748b; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
        .step-text h4 { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
        .step-text p { font-size: 14px; color: #64748b; margin: 0; line-height: 1.5; }

        /* Image Divider */
        .adm-image-divider { width: 100%; border-radius: 24px; overflow: hidden; height: 300px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        .adm-image-divider img { width: 100%; height: 100%; object-fit: cover; }

        /* Requirements List */
        .adm-req-list { list-style: none; padding: 0; margin: 0 0 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 768px) { .adm-req-list { grid-template-columns: 1fr; } }
        .adm-req-list li { display: flex; align-items: flex-start; gap: 14px; padding: 20px; background: #f8fafc; border-radius: 16px; font-size: 15px; color: #334155; line-height: 1.5; border: 1px solid #e2e8f0; }
        .adm-req-list li svg { flex-shrink: 0; margin-top: 2px; }
        .adm-req-list li.req-highlight { background: #f0fdf4; border-color: #bbf7d0; }
        .adm-note { background: rgba(239, 159, 39, 0.1); padding: 20px; border-radius: 16px; font-size: 14px; color: #9a600e; line-height: 1.6; }

        /* Tuition Fees */
        .adm-tuition-highlight { display: flex; align-items: center; justify-content: space-between; padding: 32px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 20px; margin-bottom: 32px; color: #0F6E56; flex-wrap: wrap; gap: 16px; }
        .adm-tuition-highlight span { font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .adm-tuition-highlight h2 { font-size: 40px; font-weight: 800; margin: 0; letter-spacing: -1px; }

        .adm-terms-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
        @media (max-width: 700px) { .adm-terms-grid { grid-template-columns: 1fr; } }
        .term-box { background: #f8fafc; border-radius: 16px; padding: 24px; text-align: center; border: 1px solid #e2e8f0; }
        .term-label { font-size: 13px; color: #64748b; font-weight: 800; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .term-amount { font-size: 22px; color: #0f172a; font-weight: 800; }

        .adm-vote-heads summary { padding: 24px; background: #f8fafc; border-radius: 16px; cursor: pointer; font-size: 16px; font-weight: 700; color: #334155; list-style: none; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; transition: background 0.2s; }
        .adm-vote-heads summary:hover { background: #f1f5f9; }
        .adm-vote-heads summary::marker, .adm-vote-heads summary::-webkit-details-marker { display: none; }
        .adm-vote-heads[open] summary .icon { transform: rotate(90deg); }
        .details-content { padding: 24px 0 0; overflow-x: auto; }
        
        .adm-table { width: 100%; border-collapse: collapse; font-size: 15px; }
        .adm-table th { text-align: left; padding: 16px; color: #64748b; font-weight: 700; border-bottom: 2px solid #e2e8f0; }
        .adm-table th.right, .adm-table td.right { text-align: right; }
        .adm-table td { padding: 16px; color: #334155; border-bottom: 1px solid #f1f5f9; font-weight: 500; }

        /* Admission Fees List */
        .adm-fee-list { display: flex; flex-direction: column; gap: 12px; }
        .fee-row { display: flex; justify-content: space-between; padding: 20px; background: #ffffff; border-radius: 14px; font-size: 16px; color: #475569; border: 1px solid rgba(0,0,0,0.05); }
        .fee-row strong { color: #0f172a; }
        .fee-total { display: flex; justify-content: space-between; padding: 24px; background: #EF9F27; color: #fff; border-radius: 16px; font-size: 18px; font-weight: 800; margin-top: 12px; box-shadow: 0 10px 25px rgba(239, 159, 39, 0.25); }
        .small-note { font-size: 13px; color: #8c5810; margin-top: 20px; opacity: 0.9; font-weight: 500; }

        /* Short Courses */
        .adm-short-courses { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 600px) { .adm-short-courses { grid-template-columns: 1fr; } }
        .short-course-box { background: #fff; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .sc-name { font-size: 16px; color: #64748b; font-weight: 600; margin-bottom: 12px; }
        .sc-price { font-size: 22px; color: #0F6E56; font-weight: 800; }

        /* Bank Cards (Glassmorphism) */
        .adm-bank-container { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 768px) { .adm-bank-container { grid-template-columns: 1fr; } }
        .adm-bank-card { border-radius: 24px; padding: 32px; color: white; position: relative; overflow: hidden; }
        
        .kcb-glass {
          background: linear-gradient(135deg, rgba(34,197,94,0.9), rgba(21,128,61,0.95));
          box-shadow: 0 20px 40px rgba(21,128,61,0.2);
        }
        .coop-glass {
          background: linear-gradient(135deg, rgba(56,189,248,0.9), rgba(3,105,161,0.95));
          box-shadow: 0 20px 40px rgba(3,105,161,0.2);
        }

        .adm-bank-card::before {
          content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
          transform: rotate(30deg); pointer-events: none;
        }

        .bank-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; position: relative; z-index: 2; }
        .bank-tag { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 8px 16px; border-radius: 100px; background: rgba(255,255,255,0.2); backdrop-filter: blur(5px); }
        .bank-logo-img { height: 32px; filter: brightness(0) invert(1); opacity: 0.9; }
        
        .bank-name { font-size: 20px; font-weight: 700; margin-bottom: 8px; position: relative; z-index: 2; }
        .bank-ac-name { font-size: 15px; color: rgba(255,255,255,0.8); margin-bottom: 24px; position: relative; z-index: 2; }
        .bank-ac-number { font-size: 32px; font-weight: 800; letter-spacing: 3px; font-family: monospace; margin-bottom: 24px; text-shadow: 0 2px 10px rgba(0,0,0,0.2); position: relative; z-index: 2; }
        @media (max-width: 400px) { .bank-ac-number { font-size: 24px; } }
        .bank-note { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.6; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.2); position: relative; z-index: 2; }
      `}</style>
    </div>
  );
}
