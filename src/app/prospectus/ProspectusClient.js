"use client";

import Link from 'next/link';

function SectionTitle({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', color: '#1a1a1a', margin: 0, whiteSpace: 'nowrap' }}>{children}</h2>
      <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.12)' }} />
    </div>
  );
}

const bodyText = { fontSize: '13px', color: '#444', lineHeight: 1.8, marginBottom: '14px' };
const th = { padding: '10px 12px', textAlign: 'left', fontWeight: 600, fontSize: '12px', letterSpacing: '0.5px' };
const td = { padding: '9px 12px', borderBottom: '1px solid rgba(0,0,0,0.06)', color: '#333', verticalAlign: 'top', fontSize: '12px' };

export default function ProspectusClient({ dbData }) {
  const { courses, feeStructure, contact, intake } = dbData || {};
  
  // Separate courses into Full (>= 6 months) and Short (< 6 months)
  const fullCourses = [];
  const shortCourses = [];
  
  (courses || []).forEach(c => {
    if (c.dur.toLowerCase().includes('year') || c.dur.toLowerCase().includes('6 month')) {
      fullCourses.push(c);
    } else {
      shortCourses.push(c);
    }
  });

  return (
    <>
      <style>{`
        /* ── SCREEN STYLES ── */
        @media screen {
          .print-page {
            max-width: 880px;
            margin: 120px auto 80px;
            background: #fff;
            box-shadow: 0 8px 64px rgba(0,0,0,0.10);
            border-radius: 20px;
            overflow: hidden;
          }
        }
        @media screen and (max-width: 700px) {
          .print-page { margin: 100px 12px 60px !important; border-radius: 12px !important; }
          .prosp-cover { padding: 36px 20px !important; }
          .prosp-body  { padding: 28px 16px !important; }
          .two-col     { flex-direction: column !important; }
          .prosp-title { font-size: 2rem !important; }
        }
        .two-col {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .two-col > * {
          flex: 1 1 calc(50% - 8px);
          min-width: 220px;
          box-sizing: border-box;
        }
        .pdf-page-break {
          page-break-before: always;
          break-before: page;
          display: block;
          height: 0;
          font-size: 0;
          line-height: 0;
        }

        /* ── PRINT / SAVE AS PDF STYLES ── */
        @media print {
          /* Hide every sibling of the prospectus — navbar, footer, etc. */
          body * { visibility: hidden; }
          #prospectus-content,
          #prospectus-content * { visibility: visible; }

          /* Position prospectus flush to top-left corner of the page */
          #prospectus-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            overflow: visible !important;
          }

          /* Remove any trailing margin that causes a blank last page */
          #prospectus-content > *:last-child { margin-bottom: 0 !important; }
          .prosp-body { padding-bottom: 0 !important; }

          /* A4 page setup */
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          /* Never show floating button in print */
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Floating Download Button — plain anchor = works on all devices */}
      <div className="no-print" style={{
        position: 'fixed', bottom: '32px', right: '32px', zIndex: 200,
      }}>
        <a
          href="/api/prospectus-pdf"
          download={`Kinoo_VTC_Prospectus_${feeStructure?.year || '2026'}.pdf`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#0F6E56', color: '#fff',
            padding: '14px 28px', borderRadius: '12px',
            fontWeight: 700, fontSize: '15px', textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(15,110,86,0.35)',
          }}
        >
          ⬇ Download PDF
        </a>
      </div>

      {/* Prospectus Content — this element is cloned for PDF export */}
      <div id="prospectus-content" className="print-page">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 18px 10px',
          borderBottom: '4px solid #2f79b7',
          background: '#fff',
        }}>
          <img src="/kvtc_logo.png" alt="KVTC" className="kvtc-logo-crop" style={{ width: 84, height: 84, flexShrink: 0 }} />
          <div style={{ flex: 1, textAlign: 'center', padding: '0 14px', fontFamily: "'Times New Roman', serif" }}>
            <div style={{ color: '#b59b69', fontWeight: 700, letterSpacing: 1.2, fontSize: 13 }}>COUNTY GOVERNMENT OF KIAMBU</div>
            <div style={{ color: '#1f2f4d', fontWeight: 700, fontSize: 14, marginTop: 3 }}>Department Of Education, Gender, Culture &amp; Social Services</div>
            <div style={{ color: '#4c9daa', fontWeight: 800, letterSpacing: 1, fontSize: 17, marginTop: 4 }}>KINOO VOCATIONAL TRAINING CENTRE</div>
            <div style={{ color: '#30364b', fontSize: 12, marginTop: 5 }}>P.O BOX 351-00902, Kikuyu. &nbsp;&nbsp; Tel: 0113582008</div>
            <div style={{ color: '#30364b', fontSize: 12 }}>Email: kinoovtc@gmail.com &nbsp;&nbsp; www.kinoovtc.ac.ke</div>
          </div>
          <img src="/cgok-logo.png" alt="County Government of Kiambu" style={{ width: 84, height: 84, objectFit: 'contain', flexShrink: 0 }} />
        </div>

        {/* PAGE 1 — Cover */}
        <div className="prosp-cover" style={{
          background: 'linear-gradient(135deg, #0F6E56 0%, #085041 100%)',
          padding: '60px 52px', color: '#fff', position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

          {/* Logo Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
            <img src="/kvtc_logo.png" alt="KVTC" className="kvtc-logo-crop" style={{ width: '60px', height: '60px', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '17px' }}>Kinoo Vocational Training Centre</div>
              <div style={{ fontSize: '12px', opacity: 0.75 }}>County Government of Kiambu · Department of Education</div>
            </div>
          </div>

          <div style={{
            display: 'inline-block', background: '#EF9F27', color: '#1a1a1a',
            padding: '5px 14px', borderRadius: '100px', fontSize: '11px',
            fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '18px',
          }}>{intake?.yearText || feeStructure?.year} Intake Open</div>

          <h1 className="prosp-title" style={{ fontFamily: 'var(--serif)', fontSize: '3.2rem', lineHeight: 1.1, marginBottom: '18px', maxWidth: '500px' }}>
            Student Prospectus & Course Guide
          </h1>
          <p style={{ fontSize: '15px', opacity: 0.85, maxWidth: '460px', lineHeight: 1.7 }}>
            Your complete guide to programmes, fees, admissions, and campus life at Kinoo VTC — Kikuyu, Kiambu County.
          </p>

          {/* Stats Row */}
          <div style={{ display: 'flex', gap: '28px', marginTop: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
            {[{ val: courses?.length + '+', label: 'Courses' }, { val: `KSh ${(feeStructure?.annualTuition/1000).toFixed(0)}K`, label: 'From/Year' }, { val: 'NITA/KNEC', label: 'Certified' }, { val: feeStructure?.year || '2026', label: 'Intake Open' }].map(({ val, label }) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1.9rem', fontWeight: 700, lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: '10px', opacity: 0.7, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '14px', marginLeft: 'auto', alignItems: 'center' }}>
              <img src="/nita.png" alt="NITA" style={{ height: '42px', background: '#fff', padding: '5px', borderRadius: '6px', objectFit: 'contain' }} />
              <img src="/knec.png" alt="KNEC" style={{ height: '42px', background: '#fff', padding: '5px', borderRadius: '6px', objectFit: 'contain' }} />
            </div>
          </div>
        </div>

        <div className="prosp-body" style={{ padding: '44px 52px' }}>
          
          <section style={{ marginBottom: '36px' }}>
            <SectionTitle>About Kinoo VTC</SectionTitle>
            <p style={bodyText}>
              Kinoo Vocational Training Centre is a public institution under the <strong>County Government of Kiambu</strong>, Department of Education, Gender, Culture &amp; Social Services. Located in Kikuyu along the Nairobi–Nakuru Highway, we equip Kenya's youth with practical, market-relevant skills.
            </p>
            <p style={{ ...bodyText, marginBottom: 0 }}>
              All programmes are accredited by <strong>NITA</strong> (National Industrial Training Authority) and <strong>KNEC</strong> (Kenya National Examinations Council) — nationally recognised qualifications that open doors across Kenya and beyond.
            </p>
          </section>

          {/* Courses Table */}
          <section style={{ marginBottom: '36px' }}>
            <SectionTitle>Full Programmes ({feeStructure?.year})</SectionTitle>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '24px' }}>
              <thead>
                <tr style={{ background: '#0F6E56', color: '#fff' }}>
                  <th style={th}>Course Name</th>
                  <th style={th}>Duration</th>
                  <th style={th}>Certificate</th>
                  <th style={th}>Fees</th>
                </tr>
              </thead>
              <tbody>
                {fullCourses.map((c, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8f7f4' }}>
                    <td style={td}>{c.name}</td>
                    <td style={td}>{c.dur}</td>
                    <td style={td}>{c.cert}</td>
                    <td style={td}>{c.fees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <SectionTitle>Short Courses & Part-Time</SectionTitle>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#0F6E56', color: '#fff' }}>
                  <th style={th}>Course Name</th>
                  <th style={th}>Duration</th>
                  <th style={th}>Certificate</th>
                  <th style={th}>Fees</th>
                </tr>
              </thead>
              <tbody>
                {shortCourses.map((c, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8f7f4' }}>
                    <td style={td}>{c.name}</td>
                    <td style={td}>{c.dur}</td>
                    <td style={td}>{c.cert}</td>
                    <td style={td}>{c.fees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          
        </div>

        {/* Force page 2 start */}
        <div className="pdf-page-break"></div>

        <div className="prosp-body" style={{ padding: '44px 52px' }}>

          {/* Admission Requirements & Fee Structure */}
          <section style={{ marginBottom: '36px' }}>
            <SectionTitle>Admission Requirements & Subsidised Fee Structure</SectionTitle>
            <div className="two-col" style={{ alignItems: 'flex-start' }}>
              
              {/* Requirements Column */}
              <div style={{ background: '#f8f7f4', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0F6E56', marginBottom: '14px' }}>General Compulsory Requirements</h3>
                <ol style={{ paddingLeft: '16px', margin: 0, fontSize: '12px', color: '#444', lineHeight: 1.6 }}>
                  <li style={{ marginBottom: '6px' }}>Two (2) passport-size photos</li>
                  <li style={{ marginBottom: '6px' }}>Copy of National ID or Birth Certificate</li>
                  <li style={{ marginBottom: '6px' }}>Photocopies (set)</li>
                  <li style={{ marginBottom: '6px' }}>Three (3) foolscap papers</li>
                  <li style={{ marginBottom: '6px' }}>Copy of previous academic result slip (if any)</li>
                  <li style={{ marginBottom: '6px' }}>Medical certificate</li>
                  <li style={{ marginBottom: '6px' }}>Two (2) quire counter books</li>
                  <li style={{ marginBottom: '6px' }}>Four (4) A4 exercise books</li>
                </ol>
              </div>

              {/* Fee Breakdown Column */}
              <div style={{ background: '#E1F5EE', borderRadius: '12px', padding: '20px', border: '1px solid rgba(15,110,86,0.2)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0F6E56', marginBottom: '14px' }}>Annual Subsidised Tuition</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', marginBottom: '16px' }}>
                  {feeStructure?.termBreakdown?.map((t, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '4px' }}>
                      <span style={{ color: '#555' }}>{t.label}</span>
                      <span style={{ fontWeight: 700, color: '#1a1a1a' }}>KSh {t.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '4px', gridColumn: 'span 2' }}>
                    <span style={{ color: '#0F6E56', fontWeight: 700 }}>Total Annual</span>
                    <span style={{ fontWeight: 700, color: '#0F6E56' }}>KSh {feeStructure?.annualTuition?.toLocaleString()}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#BA7517', marginBottom: '10px' }}>One-Time Admission Fees</h3>
                <div style={{ fontSize: '12px', marginBottom: '12px' }}>
                  {feeStructure?.admissionFees?.map(af => (
                    <div key={af.item} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#555' }}>{af.item}</span>
                      <span style={{ fontWeight: 700 }}>KSh {af.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(186,117,23,0.3)' }}>
                    <span style={{ color: '#BA7517', fontWeight: 700 }}>Total</span>
                    <span style={{ fontWeight: 700, color: '#BA7517' }}>KSh {feeStructure?.admissionTotal?.toLocaleString()}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>Bank Accounts (No Cash Allowed)</h3>
                <div style={{ fontSize: '11px', color: '#555', lineHeight: 1.6 }}>
                  <span style={{ color: '#0F6E56', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase' }}>Tuition Fees Account</span><br/>
                  <strong>{feeStructure?.bankKCB?.bankName}:</strong> {feeStructure?.bankKCB?.accountNumber}<br/>
                  <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', display: 'inline-block', marginTop: '4px' }}>Registration & Admission Account</span><br/>
                  <strong>{feeStructure?.bankCoop?.bankName}:</strong> {feeStructure?.bankCoop?.accountNumber}
                </div>
              </div>

            </div>
          </section>

          {/* Department Specific Requirements */}
          <section style={{ marginBottom: '36px' }}>
            <SectionTitle>Department-Specific Tools & Uniform Requirements</SectionTitle>
            <div style={{ columns: '2', columnGap: '24px' }}>
              {courses?.filter(c => c.requirements?.length > 0).map(c => (
                <div key={c.id} style={{ breakInside: 'avoid', marginBottom: '20px', background: '#f8f7f4', borderRadius: '10px', padding: '16px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0F6E56', marginBottom: '8px', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '6px' }}>{c.name}</h3>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#444', lineHeight: 1.5 }}>
                    {c.requirements.map((req, i) => (
                      <li key={i} style={{ marginBottom: '3px' }}>{req}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Contact CTA */}
          <section style={{ background: 'linear-gradient(135deg, #0F6E56, #085041)', borderRadius: '14px', padding: '36px', color: '#fff', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', marginBottom: '10px' }}>Ready to Enroll?</h2>
            <p style={{ opacity: 0.85, marginBottom: '20px', fontSize: '14px' }}>
              Contact us today or visit us in Kikuyu, Kiambu County. {intake?.yearText || feeStructure?.year} Intake is ongoing.
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
              {[
                contact?.address,
                `${contact?.phone1} / ${contact?.phone2}`,
                contact?.email,
                contact?.hours,
              ].filter(Boolean).map((text) => (
                <div key={text} style={{ fontSize: '12px', opacity: 0.9 }}>{text}</div>
              ))}
            </div>
            <div className="no-print" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Link href="/apply" style={{ background: '#EF9F27', color: '#1a1a1a', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>Apply Online</Link>
              <a href={`tel:${contact?.phone1?.replace(/\s/g, '')}`} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '12px 28px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>📞 Call Us</a>
            </div>
          </section>

          <p style={{ textAlign: 'center', fontSize: '10px', color: '#bbb', marginTop: '28px', marginBottom: 0 }}>
            © {feeStructure?.year || new Date().getFullYear()} Kinoo Vocational Training Centre · County Government of Kiambu · Department of Education
          </p>
        </div>
      </div>
    </>
  );
}
