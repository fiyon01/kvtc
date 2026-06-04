"use client";

import { useRef, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s ease`, ...style }}>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 14px',
  borderWidth: '1.5px', borderStyle: 'solid', borderColor: 'rgba(0,0,0,0.1)', borderRadius: '10px',
  fontFamily: 'var(--sans)', fontSize: '14px', color: '#1a1a1a',
  background: '#f8f7f4', outline: 'none', transition: 'border-color 0.2s, background 0.2s',
  boxSizing: 'border-box',
};

function ApplyForm({ dbData }) {
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [waLink, setWaLink] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const pre = searchParams.get('course') || '';
    setSelectedCourse(pre);
  }, [searchParams]);

  const focusStyle = (name) => focused === name
    ? { ...inputStyle, borderColor: '#0F6E56', background: '#fff' }
    : inputStyle;

  // Dynamically extract courses and requirements from dbData
  const courseList = dbData?.courses || [];
  const selectedCourseData = courseList.find(c => c.name === selectedCourse);
  const deptReqs = selectedCourseData?.requirements || [];

  // Extract application fee amount from first item in admission fees
  const appFee = dbData?.feeStructure?.admissionFees?.[0]?.amount || 500;

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const fname = fd.get('fname');
    const lname = fd.get('lname');
    const phone = fd.get('phone');
    const course = fd.get('course');

    const waText = `*New Online Application – Kinoo VTC*\n\n*Name:* ${fname} ${lname}\n*Phone:* ${phone}\n*Course:* ${course}`;
    const waUrl = `https://wa.me/254113582008?text=${encodeURIComponent(waText)}`;
    fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd }).catch(console.error);
    setWaLink(waUrl);
    setSubmitted(true);
    window.open(waUrl, '_blank');
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#E1F5EE', color: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'popIn 0.4s ease' }}>
          <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: '#1a1a1a', marginBottom: '12px' }}>Application Received!</h3>
        <p style={{ color: '#555', fontSize: '15px', marginBottom: '8px', lineHeight: 1.6 }}>
          Your application has been submitted. A WhatsApp window should have opened — if not, tap the button below to send your details to our admissions team.
        </p>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '24px' }}>Our team will get back to you within 24 hours to confirm your spot.</p>
        <a href={waLink} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '15px', background: '#25D366', color: '#fff', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Continue on WhatsApp →
        </a>
        <style>{`@keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="access_key" value="2ceb1091-7d6f-4428-8b86-a78b375cae34" />
      <input type="hidden" name="subject" value="New Online Application – Kinoo VTC" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }} className="form-r">
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>First Name *</label>
          <input type="text" name="fname" placeholder="John" required style={focusStyle('fname')} onFocus={() => setFocused('fname')} onBlur={() => setFocused(null)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>Last Name *</label>
          <input type="text" name="lname" placeholder="Doe" required style={focusStyle('lname')} onFocus={() => setFocused('lname')} onBlur={() => setFocused(null)} />
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>Phone Number *</label>
        <input type="tel" name="phone" placeholder="0712 345 678" required style={focusStyle('phone')} onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '6px' }}>Course Applying For *</label>
        <select name="course" required value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}
          style={focusStyle('course')} onFocus={() => setFocused('course')} onBlur={() => setFocused(null)}>
          <option value="" disabled>Select a course...</option>
          {courseList.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {/* Dynamic dept requirements */}
      {deptReqs.length > 0 && (
        <div style={{ background: '#FFF8E8', border: '1.5px solid #EF9F27', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <svg width="18" height="18" fill="none" stroke="#BA7517" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            <strong style={{ fontSize: '13px', color: '#BA7517' }}>Department Tools & Uniform to Bring</strong>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {deptReqs.map((req, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#555' }}>
                <span style={{ color: '#BA7517', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>
      )}



      <button type="submit"
        style={{ width: '100%', padding: '15px', background: '#0F6E56', color: '#fff', border: 'none', borderRadius: '10px', fontFamily: 'var(--sans)', fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s, transform 0.15s' }}
        onMouseEnter={e => { e.target.style.background = '#1D9E75'; e.target.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.target.style.background = '#0F6E56'; e.target.style.transform = 'translateY(0)'; }}>
        Submit Application →
      </button>
    </form>
  );
}

export default function ApplyClientPage({ dbData }) {
  const { feeStructure, contact } = dbData || {};
  const { admissionFees, admissionTotal, annualTuition, termBreakdown, bankKCB, bankCoop } = feeStructure || {};

  return (
    <>
      {/* Header */}
      <div style={{ padding: '140px 8% 60px', background: 'linear-gradient(135deg, rgba(15,110,86,0.07) 0%, #fff 100%)', borderBottom: '1px solid rgba(0,0,0,0.07)', textAlign: 'center' }}>
        <FadeIn>
          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px' }}>Online Admission</span>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#1a1a1a', marginBottom: '16px' }}>Apply to Kinoo VTC</h1>
          <p style={{ color: '#888', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto' }}>Complete your application online in just a few minutes. Our admissions team will contact you to confirm your spot.</p>
        </FadeIn>
      </div>

      <section style={{ padding: '64px 8%', background: '#f8f7f4' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '56px', alignItems: 'start', maxWidth: '1200px', margin: '0 auto' }} className="apply-r">

          {/* LEFT COLUMN */}
          <FadeIn>


            {/* Fee Breakdown */}
            {admissionFees && (
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#EF9F27', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>1</span>
                  Admission Fee Breakdown
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <tbody>
                    {admissionFees.map((af, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <td style={{ padding: '10px 4px', color: '#555' }}>{af.item}</td>
                        <td style={{ padding: '10px 4px', textAlign: 'right', fontWeight: 500, color: '#1a1a1a' }}>KSh {af.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr style={{ background: '#E1F5EE' }}>
                      <td style={{ padding: '12px 4px', fontWeight: 700, color: '#0F6E56', borderRadius: '4px 0 0 4px' }}>Total One-Time Admission</td>
                      <td style={{ padding: '12px 4px', textAlign: 'right', fontWeight: 700, color: '#0F6E56', borderRadius: '0 4px 4px 0' }}>KSh {admissionTotal?.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Annual Fee / Term Breakdown */}
            {termBreakdown && (
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>Annual Tuition – Day Scholar</h3>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>Subsidised by the County Government of Kiambu</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', textAlign: 'center', marginBottom: '16px' }}>
                  {termBreakdown.map((t, i) => (
                    <div key={i} style={{ background: '#f8f7f4', borderRadius: '10px', padding: '12px 6px' }}>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{t.label}</div>
                      <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '13px' }}>KSh {t.amount.toLocaleString()}</div>
                    </div>
                  ))}
                  <div style={{ background: '#E1F5EE', borderRadius: '10px', padding: '12px 6px' }}>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Total</div>
                    <div style={{ fontWeight: 700, color: '#0F6E56', fontSize: '13px' }}>KSh {annualTuition?.toLocaleString()}</div>
                  </div>
                </div>
                {bankKCB && bankCoop && (
                  <div style={{ fontSize: '13px', color: '#555', background: '#f8f7f4', borderRadius: '8px', padding: '12px 14px', lineHeight: 1.7 }}>
                    <strong style={{ color: '#1a1a1a' }}>Pay via {bankKCB.bankName}</strong><br/>
                    A/C Name: {bankKCB.accountName} &nbsp;|&nbsp; A/C No: <strong>{bankKCB.accountNumber}</strong><br/>
                    <strong style={{ color: '#1a1a1a' }}>Or {bankCoop.bankName}</strong><br/>
                    A/C No: <strong>{bankCoop.accountNumber}</strong>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: General Requirements */}
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#0F6E56', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>3</span>
                General Admission Requirements
              </h3>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '14px' }}>Bring these documents on your first day of admission:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Two (2) passport-size photos',
                  'Copy of National ID or Birth Certificate',
                  'Photocopies (set)',
                  'Three (3) foolscap papers',
                  'Copy of previous academic result slip (if any)',
                  'Medical certificate',
                  'Two (2) quire counter books',
                  'Four (4) A4 exercise books',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#f8f7f4', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', color: '#555' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#0F6E56', color: '#fff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* RIGHT COLUMN: Form */}
          <FadeIn delay={0.15}>
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 32px rgba(0,0,0,0.06)', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '6px' }}>Online Application Form</h3>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>Select your course to see department-specific requirements.</p>
              <Suspense fallback={<p>Loading form...</p>}>
                <ApplyForm dbData={dbData} />
              </Suspense>
            </div>
          </FadeIn>

        </div>
        <style>{`
          @media(max-width:900px){ .apply-r{grid-template-columns:1fr !important; gap: 32px !important;} }
          @media(max-width:600px){ .form-r{grid-template-columns:1fr !important;} }
        `}</style>
      </section>
    </>
  );
}
