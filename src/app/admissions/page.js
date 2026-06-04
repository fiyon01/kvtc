import db from '@/data/db.json';
import Link from 'next/link';

export const metadata = {
  title: 'Admissions & Fees | Kinoo VTC',
  description: 'View the subsidised fee structure and admission requirements for Kinoo Vocational Training Centre.',
};

export default function Admissions() {
  const { feeStructure } = db;
  const { year, annualTuition, termBreakdown, termVoteHeads, admissionFees, admissionTotal, otherCharges, bankKCB, bankCoop } = feeStructure;

  return (
    <div style={{ background: '#f8f7f4' }}>
      {/* HEADER HERO */}
      <div style={{
        padding: '160px 8% 80px',
        background: 'linear-gradient(135deg, rgba(15,110,86,0.08) 0%, rgba(239,159,39,0.05) 100%)',
        textAlign: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        <span style={{
          display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
          color: '#0F6E56', background: '#E1F5EE', padding: '6px 16px', borderRadius: '100px', marginBottom: '16px'
        }}>Admission & Fees</span>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#1a1a1a', marginBottom: '20px', lineHeight: 1.1 }}>
          Quality Education,<br />Fully Subsidised.
        </h1>
        <p style={{ color: '#555', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Kinoo Vocational Training Centre is proudly supported by the County Government of Kiambu to offer world-class skills training at a fraction of the cost.
        </p>
      </div>

      <section style={{ padding: '80px 8%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '64px', alignItems: 'start' }} className="admissions-grid">
          
          {/* LEFT: FEE STRUCTURES */}
          <div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: '#1a1a1a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#0F6E56', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </span>
              Subsidised Training Fees – {year}
            </h2>
            
            {/* Main Tuition Card */}
            <div style={{ background: '#fff', borderRadius: '24px', padding: '36px', boxShadow: '0 12px 48px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', marginBottom: '6px' }}>Annual Tuition (Day Scholars)</h3>
                  <p style={{ color: '#888', fontSize: '14px' }}>For all NITA and KNEC full-year programmes.</p>
                </div>
                <div style={{ background: '#E1F5EE', padding: '12px 20px', borderRadius: '16px', color: '#0F6E56' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Total</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '24px', fontWeight: 700 }}>KSh {annualTuition.toLocaleString()}</div>
                </div>
              </div>

              {/* Terms Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
                {termBreakdown.map((t, i) => (
                  <div key={i} style={{ background: '#f8f7f4', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', color: '#555', fontWeight: 600, marginBottom: '4px' }}>{t.label}</div>
                    <div style={{ fontSize: '16px', color: '#1a1a1a', fontWeight: 700 }}>KSh {t.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>

              {/* Vote Heads */}
              <details style={{ background: '#f8f7f4', borderRadius: '12px', overflow: 'hidden' }} className="vote-heads">
                <summary style={{ padding: '16px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#1a1a1a', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  View detailed tuition breakdown (Vote Heads)
                  <span className="icon">↓</span>
                </summary>
                <div style={{ padding: '0 20px 20px' }}>
                  <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.1)', color: '#888' }}>
                        <th style={{ textAlign: 'left', padding: '8px 0', fontWeight: 500 }}>Vote Head</th>
                        <th style={{ textAlign: 'right', padding: '8px 0', fontWeight: 500 }}>Per Term</th>
                        <th style={{ textAlign: 'right', padding: '8px 0', fontWeight: 500 }}>Annual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {termVoteHeads.map((vh, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <td style={{ padding: '10px 0', color: '#1a1a1a', fontWeight: 500 }}>{vh.head}</td>
                          <td style={{ padding: '10px 0', textAlign: 'right', color: '#555' }}>KSh {vh.perTerm.toLocaleString()}</td>
                          <td style={{ padding: '10px 0', textAlign: 'right', color: '#555' }}>KSh {vh.annual.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>

            {/* Admission Fees */}
            <div style={{ background: '#FFF8E8', borderRadius: '24px', padding: '36px', border: '1px solid rgba(239, 159, 39, 0.3)', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#BA7517', marginBottom: '20px' }}>One-Time Admission Charges</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {admissionFees.map((af, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#fff', borderRadius: '12px', fontSize: '14px', fontWeight: 500 }}>
                    <span style={{ color: '#555' }}>{af.item}</span>
                    <span style={{ color: '#1a1a1a', fontWeight: 700 }}>KSh {af.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#EF9F27', borderRadius: '12px', color: '#fff', fontSize: '16px', fontWeight: 700, marginTop: '8px' }}>
                  <span>Total Admission Pay</span>
                  <span>KSh {admissionTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Other Charges */}
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px', paddingLeft: '8px' }}>Other Courses / Classes</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {otherCharges.map((oc, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '14px', color: '#555', fontWeight: 600, marginBottom: '8px' }}>{oc.item}</div>
                  <div style={{ fontSize: '20px', color: '#0F6E56', fontWeight: 700 }}>KSh {oc.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT: REQUIREMENTS & BANK */}
          <div style={{ position: 'sticky', top: '100px' }}>
            
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: '#1a1a1a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </span>
              Admission Requirements
            </h2>

            <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 12px 32px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '32px' }}>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>Please prepare the following documents and items for your admission day:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Two (2) passport photos',
                  'Copy of National ID or Birth Certificate',
                  'Team of photocopies',
                  'Three (3) foolscap papers',
                  'Copy of previous result slip (if any)',
                  'Medical certificate',
                  'Two (2) quire counter books',
                  'Four (4) A4 exercise books'
                ].map((req, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 16px', background: '#f8f7f4', borderRadius: '12px', fontSize: '14px', color: '#444' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#0F6E56', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    {req}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '13px', color: '#BA7517', fontWeight: 600, marginTop: '20px', padding: '12px', background: '#FFF8E8', borderRadius: '10px' }}>
                * NOTE: Each department has specific tool and uniform requirements. Please check your specific course page for the full list.
              </p>
            </div>

            {/* Bank Accounts */}
            <div style={{ background: '#1a1a1a', borderRadius: '24px', padding: '32px', color: '#fff' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="22" height="22" fill="none" stroke="#EF9F27" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                Bank Payment Details
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '24px' }}>All tuition fees should be paid directly to the institution's bank accounts. Do not pay cash.</p>
              
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#EF9F27', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Primary Account</div>
                <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{bankKCB.bankName}</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>A/C Name: {bankKCB.accountName}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '1px', fontFamily: 'monospace' }}>{bankKCB.accountNumber}</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }}>
                <div style={{ fontSize: '12px', color: '#EF9F27', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Alternative Account</div>
                <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{bankCoop.bankName}</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>A/C Name: {bankCoop.accountName}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '1px', fontFamily: 'monospace' }}>{bankCoop.accountNumber}</div>
              </div>

              <div style={{ marginTop: '32px' }}>
                <Link href="/apply" style={{ display: 'block', textAlign: 'center', background: '#EF9F27', color: '#1a1a1a', padding: '16px', borderRadius: '12px', fontWeight: 700, fontSize: '16px', textDecoration: 'none' }}>
                  Apply For Admission Now →
                </Link>
              </div>
            </div>

          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .admissions-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          }
          .vote-heads summary::marker { display: none; content: ''; }
          .vote-heads summary::-webkit-details-marker { display: none; }
          .vote-heads[open] summary .icon { transform: rotate(180deg); }
          .vote-heads summary .icon { transition: transform 0.2s; }
        `}</style>
      </section>
    </div>
  );
}
