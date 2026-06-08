"use client";

import { useRef, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdmissionForm from '@/components/AdmissionForm';

/* ─────────────────────────────────────────
   Fade-in animation helper
───────────────────────────────────────── */
function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease`,
      ...style
    }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   Success screen shown after submission
───────────────────────────────────────── */
function SuccessScreen({ applicantName, email }) {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
      <div style={{
        width: 88, height: 88, borderRadius: '50%',
        background: 'linear-gradient(135deg, #0F6E56, #1D9E75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 28px',
        boxShadow: '0 12px 40px rgba(15,110,86,0.3)',
        animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
      }}>
        <svg width="44" height="44" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: '#1a1a1a', marginBottom: 12 }}>
        Application Submitted! 🎉
      </h2>
      <p style={{ fontFamily: 'var(--sans)', color: '#555', fontSize: '16px', lineHeight: 1.7, maxWidth: 520, marginBottom: 8 }}>
        Thank you, <strong>{applicantName}</strong>! Your admission application and M-PESA payment have been received.
      </p>
      <p style={{ fontFamily: 'var(--sans)', color: '#888', fontSize: '14px', marginBottom: 32, lineHeight: 1.6 }}>
        Your official <strong>Admission Letter</strong> and payment receipt have been sent to <strong>{email}</strong>. Please print it out and bring it on your admission day. Our admissions team will also contact you within <strong>24–48 hours</strong> to confirm your reporting details.
      </p>
      <div style={{ background: '#E1F5EE', border: '1px solid #a5d6c5', borderRadius: 12, padding: '18px 28px', marginBottom: 32, display: 'inline-block' }}>
        <p style={{ fontFamily: 'var(--sans)', color: '#0F6E56', fontSize: '14px', margin: 0 }}>
          📞 Questions? Call us at <strong>0113 582 008</strong> or email <strong>kinoovtc@gmail.com</strong>
        </p>
      </div>
      <a href="/"
        style={{
          display: 'inline-block', padding: '14px 36px',
          background: '#0F6E56', color: '#fff', borderRadius: 10,
          fontFamily: 'var(--sans)', fontSize: '15px', fontWeight: 700,
          textDecoration: 'none', transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
      >
        ← Back to Home
      </a>
      <style>{`@keyframes popIn { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────
   Pre-application: Requirements + Fees
───────────────────────────────────────── */
function PreApplicationScreen({ course, dbData, onProceed }) {
  const { feeStructure } = dbData || {};
  const { admissionFees, annualTuition, termBreakdown } = feeStructure || {};
  const appFee = admissionFees?.[0]?.amount || 500;

  const generalRequirements = [
    'Two (2) passport-size photos',
    'Copy of National ID or Birth Certificate',
    'Photocopies (set)',
    'Three (3) foolscap papers',
    'Copy of previous academic result slip (if any)',
    'Medical certificate',
    'Two (2) quire counter books',
    'Four (4) A4 exercise books',
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px 64px' }}>

      {/* ── Course Banner ── */}
      {course && (
        <FadeIn>
          <div style={{
            background: 'linear-gradient(135deg, #0F6E56 0%, #1a6e2e 100%)',
            color: '#fff', borderRadius: 16, padding: '28px 36px',
            marginBottom: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
            boxShadow: '0 8px 32px rgba(15,110,86,0.25)',
          }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.75, display: 'block', marginBottom: 6, fontFamily: 'var(--sans)' }}>
                Applying For
              </span>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.4rem,3vw,2rem)', margin: 0 }}>{course.name}</h2>
              <div style={{ display: 'flex', gap: 20, marginTop: 10, fontSize: 13, opacity: 0.9, fontFamily: 'var(--sans)', flexWrap: 'wrap' }}>
                {course.cert && <span>🏅 {course.cert} Certified</span>}
                {course.dur && <span>⏱ {course.dur}</span>}
                {course.fees && <span>💰 {course.fees}</span>}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '14px 20px', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, opacity: 0.8, marginBottom: 4 }}>Application Fee</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 900, letterSpacing: 1 }}>KSh {appFee.toLocaleString()}</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, opacity: 0.7 }}>paid via M-PESA</div>
            </div>
          </div>
        </FadeIn>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="pre-app-grid">

        {/* ── Admission Fees ── */}
        <FadeIn delay={0.1}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFF8E8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 18 }}>💰</span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Admission Fees</h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#888', margin: 0 }}>One-time fees on joining</p>
              </div>
            </div>

            {admissionFees?.map((af, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < admissionFees.length - 1 ? '1px solid #f0f0f0' : 'none', fontFamily: 'var(--sans)', fontSize: 14 }}>
                <span style={{ color: '#555' }}>{af.item}</span>
                <span style={{ fontWeight: 600, color: '#1a1a1a' }}>KSh {af.amount.toLocaleString()}</span>
              </div>
            ))}

            <div style={{ marginTop: 16, background: '#E1F5EE', borderRadius: 10, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, color: '#0F6E56', fontSize: 14 }}>Total One-Time</span>
              <span style={{ fontFamily: 'var(--sans)', fontWeight: 800, color: '#0F6E56', fontSize: 16 }}>KSh {feeStructure?.admissionTotal?.toLocaleString()}</span>
            </div>

            <div style={{ marginTop: 14, background: '#FFF8E8', borderRadius: 10, padding: '12px 16px', border: '1px solid #f5dea0' }}>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#7a5a00', margin: 0, lineHeight: 1.5 }}>
                ⚡ <strong>KSh {appFee}</strong> application fee is paid online via M-PESA today. The remaining fees are paid on your first day.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ── Annual Tuition ── */}
        <FadeIn delay={0.2}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 18 }}>📅</span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Annual Tuition</h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#888', margin: 0 }}>Subsidised by Kiambu County Govt</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
              {termBreakdown?.map((t, i) => (
                <div key={i} style={{ background: '#f8f7f4', borderRadius: 10, padding: '12px 8px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#888', marginBottom: 4 }}>{t.label}</div>
                  <div style={{ fontFamily: 'var(--sans)', fontWeight: 700, color: '#1a1a1a', fontSize: 13 }}>KSh {t.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#E1F5EE', borderRadius: 10, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontFamily: 'var(--sans)', fontWeight: 700, color: '#0F6E56', fontSize: 14 }}>Total / Year</span>
              <span style={{ fontFamily: 'var(--sans)', fontWeight: 800, color: '#0F6E56', fontSize: 16 }}>KSh {annualTuition?.toLocaleString()}</span>
            </div>

            <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#888', margin: 0, lineHeight: 1.6 }}>
              📍 <strong>Tuition Fees</strong> are paid at KCB Kikuyu, while <strong>Registration/Admission fees</strong> are paid at Co-op Bank Kangemi. See full payment instructions after admission.
            </p>
          </div>
        </FadeIn>

        {/* ── Course-specific requirements ── */}
        {course?.requirements?.length > 0 && (
          <FadeIn delay={0.3}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '28px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#FFF0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 18 }}>🛠️</span>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Department Tools & Uniform</h3>
                  <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#888', margin: 0 }}>Bring on your first day</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {course.requirements.map((req, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 12px', background: '#f8f7f4', borderRadius: 8 }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#EF9F27', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--sans)' }}>{i + 1}</span>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#444', lineHeight: 1.5 }}>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* ── General Requirements ── */}
        <FadeIn delay={0.4}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 18 }}>📋</span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>General Requirements</h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#888', margin: 0 }}>Documents to bring on admission day</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {generalRequirements.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 12px', background: '#f8f7f4', borderRadius: 8 }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#0F6E56', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--sans)' }}>{i + 1}</span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: '#444', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ── CTA ── */}
      <FadeIn delay={0.5} style={{ textAlign: 'center', marginTop: 48 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '36px 40px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: '#1a1a1a', marginBottom: 10 }}>
            Ready to Apply?
          </h3>
          <p style={{ fontFamily: 'var(--sans)', color: '#666', fontSize: 14, lineHeight: 1.7, marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>
            You will fill out the official <strong>Kinoo VTC Admission Form</strong>. Once complete, you will be prompted to pay the <strong>KSh {appFee} application fee</strong> securely via M-PESA. Your form will be automatically sent to our admissions team as a PDF.
          </p>
          <button
            onClick={onProceed}
            style={{
              padding: '16px 48px', background: 'linear-gradient(135deg, #0F6E56, #1D9E75)',
              color: '#fff', border: 'none', borderRadius: 12,
              fontFamily: 'var(--sans)', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(15,110,86,0.35)', transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,110,86,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(15,110,86,0.35)'; }}
          >
            Proceed to Application Form
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: '#aaa', marginTop: 16 }}>🔒 Secure M-PESA payment · No hidden charges</p>
        </div>
      </FadeIn>
      {/* Styles */}
      <style>{`
        .step-circle { width: 36px; height: 36px; font-size: 14px; }
        .step-label { font-size: 11px; white-space: nowrap; }
        .step-line { width: 48px; height: 2px; margin: 0 8px; margin-bottom: 22px; }

        @media (max-width: 650px) {
          .pre-app-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 580px) {
          .step-circle { width: 28px !important; height: 28px !important; font-size: 12px !important; }
          .step-line { width: 20px !important; margin: 0 6px !important; margin-bottom: 26px !important; }
          .step-label { font-size: 10px !important; white-space: normal !important; text-align: center; max-width: 70px; line-height: 1.2; }
        }
        @media (max-width: 380px) {
          .step-circle { width: 24px !important; height: 24px !important; font-size: 11px !important; }
          .step-line { width: 12px !important; margin: 0 4px !important; margin-bottom: 28px !important; }
          .step-label { font-size: 9px !important; max-width: 54px; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────
   Inner component that reads search params
───────────────────────────────────────── */
function ApplyInner({ dbData }) {
  const searchParams = useSearchParams();
  const courseSlug = searchParams.get('course') || '';
  const skipPre = searchParams.get('skipPre') === 'true';
  const courseList = dbData?.courses || [];
  const preselectedCourse = courseList.find(c => c.name === courseSlug) || null;

  const [step, setStep] = useState(skipPre ? 'form' : 'pre'); // 'pre' | 'form' | 'success'
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');

  const handleSuccess = (name, email) => {
    setApplicantName(name);
    setApplicantEmail(email);
    setStep('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ── Page Header ── */}
      <div style={{
        padding: '130px 8% 56px',
        background: 'linear-gradient(135deg, rgba(15,110,86,0.06) 0%, #fff 60%)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        textAlign: 'center',
      }}>
        <FadeIn>
          {/* Step Indicator */}
          {step !== 'success' && (
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0, marginBottom: 28 }}>
              {[
                { label: 'Review Requirements', num: 1 },
                { label: 'Fill Application Form', num: 2 },
                { label: 'Pay & Submit', num: 3 },
              ].map((s, i) => {
                const isActive = (step === 'pre' && i === 0) || (step === 'form' && i >= 1);
                const isDone = (step === 'form' && i === 0);
                return (
                  <div key={s.num} style={{ display: 'flex', alignItems: 'center' }} className="step-item">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div className="step-circle" style={{
                        borderRadius: '50%',
                        background: isDone ? '#0F6E56' : isActive ? '#0F6E56' : 'rgba(0,0,0,0.1)',
                        color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--sans)', fontWeight: 700,
                        transition: 'background 0.4s',
                        boxShadow: isActive ? '0 4px 16px rgba(15,110,86,0.35)' : 'none',
                      }}>
                        {isDone ? '✓' : s.num}
                      </div>
                      <span style={{ fontFamily: 'var(--sans)', color: isActive ? '#0F6E56' : '#aaa', marginTop: 6, fontWeight: isActive ? 700 : 400, transition: 'color 0.4s' }} className="step-label">
                        {s.label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div style={{ background: isDone ? '#0F6E56' : 'rgba(0,0,0,0.1)', transition: 'background 0.4s' }} className="step-line" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 600,
            letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56',
            background: '#E1F5EE', padding: '6px 16px', borderRadius: '100px', marginBottom: 16,
            fontFamily: 'var(--sans)',
          }}>Online Admission</span>

          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem,5vw,3.4rem)', color: '#1a1a1a', marginBottom: 14, lineHeight: 1.15 }}>
            {step === 'success' ? 'Application Complete' : 'Apply to Kinoo VTC'}
          </h1>
          <p style={{ fontFamily: 'var(--sans)', color: '#888', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto' }}>
            {step === 'pre' && 'Review course requirements and fees before filling the official admission form.'}
            {step === 'form' && 'Fill in the official Kinoo VTC Admission Form. Click "Sign" to add your signature.'}
            {step === 'success' && 'Your application has been received successfully.'}
          </p>
        </FadeIn>
      </div>

      {/* ── Content Area ── */}
      <section style={{ padding: '52px 8% 64px', background: '#f8f7f4', minHeight: '60vh' }}>
        {step === 'pre' && (
          <PreApplicationScreen
            course={preselectedCourse}
            dbData={dbData}
            onProceed={() => { setStep('form'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        )}

        {step === 'form' && (
          <FadeIn>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              {/* Back button */}
              <button
                onClick={() => { setStep('pre'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', color: '#0F6E56',
                  fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', padding: '0 0 20px', transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                ← Back to Requirements
              </button>

              <AdmissionForm
                dbData={dbData}
                selectedCoursePre={preselectedCourse?.name || courseSlug}
                onApplicationSuccess={(name, email) => handleSuccess(name, email)}
              />
            </div>
          </FadeIn>
        )}

        {step === 'success' && (
          <SuccessScreen applicantName={applicantName} email={applicantEmail} />
        )}
      </section>
    </>
  );
}

/* ─────────────────────────────────────────
   Default export (Suspense wrapper required
   because of useSearchParams)
───────────────────────────────────────── */
export default function ApplyClientPage({ dbData }) {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid rgba(15,110,86,0.2)', borderTopColor: '#0F6E56', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ fontFamily: 'var(--sans)', color: '#888' }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <ApplyInner dbData={dbData} />
    </Suspense>
  );
}
