import Link from 'next/link';
import db from '@/data/db.json';

export const metadata = {
  title: 'Fee Structure | Kinoo VTC',
  description: 'View and download the official Kinoo Vocational Training Centre fee structure.',
};

const money = (value) => `KSh ${Number(value || 0).toLocaleString()}`;

export default function FeeStructurePage() {
  const { courses = [], feeStructure = {} } = db;
  const termFees = feeStructure.termBreakdown || [];
  const fullCourses = courses.filter((course) => {
    const duration = course.dur.toLowerCase();
    return duration.includes('year') || (duration.includes('month') && parseInt(duration, 10) > 6);
  });
  const shortCourses = courses.filter((course) => {
    const duration = course.dur.toLowerCase();
    return duration.includes('month') && parseInt(duration, 10) <= 6;
  });

  return (
    <main className="fee-page">
      <style>{`
        .fee-page {
          min-height: 100vh;
          background: #eef2f4;
          padding: 24px 16px 56px;
          color: #263b47;
        }
        .fee-shell { max-width: 900px; margin: 0 auto; }
        .fee-actions {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 0 16px;
          background: rgba(238,242,244,.96);
          backdrop-filter: blur(10px);
        }
        .fee-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
        }
        .fee-back {
          background: #fff;
          color: #263b47;
          border: 1px solid rgba(47,121,183,.2);
          box-shadow: 0 8px 24px rgba(31,63,82,.12);
        }
        .fee-download {
          background: #0F6E56;
          color: #fff;
          box-shadow: 0 8px 28px rgba(15,110,86,.25);
        }
        .fee-document {
          background: #fff;
          border: 1px solid rgba(47,121,183,.14);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 16px 50px rgba(31,63,82,.12);
        }
        .fee-letterhead {
          display: flex;
          align-items: center;
          padding: 12px 18px 10px;
          border-bottom: 4px solid #2f79b7;
          background: #fff;
        }
        .fee-logo { width: 84px; height: 84px; object-fit: contain; flex-shrink: 0; }
        .fee-kvtc-logo { object-fit: cover; object-position: 50% 18%; }
        .fee-letterhead-copy {
          flex: 1;
          min-width: 0;
          padding: 0 14px;
          text-align: center;
          font-family: "Times New Roman", serif;
        }
        .fee-county { color: #b59b69; font-weight: 700; letter-spacing: 1.2px; font-size: 13px; }
        .fee-department { color: #1f2f4d; font-weight: 700; font-size: 14px; margin-top: 3px; }
        .fee-name { color: #4c9daa; font-weight: 800; letter-spacing: 1px; font-size: 17px; margin-top: 4px; }
        .fee-contact { color: #30364b; font-size: 12px; margin-top: 4px; }
        .fee-body { padding: 34px 42px 46px; }
        .fee-title {
          margin: 0;
          text-align: center;
          color: #17352c;
          font-family: var(--serif);
          font-size: clamp(1.7rem, 4vw, 2.35rem);
        }
        .fee-subtitle { margin: 8px 0 32px; text-align: center; color: #71808a; font-size: 13px; }
        .fee-section { margin-top: 30px; }
        .fee-section-title {
          margin: 0 0 14px;
          padding: 11px 14px;
          border-radius: 10px;
          background: linear-gradient(90deg, #e7f5f0, #edf6fc);
          color: #0F6E56;
          font-size: 16px;
        }
        .fee-table-wrap {
          width: 100%;
          overflow-x: auto;
          border: 1px solid #dce5e9;
          border-radius: 12px;
          -webkit-overflow-scrolling: touch;
        }
        .fee-table { width: 100%; border-collapse: collapse; min-width: 650px; }
        .fee-table.compact { min-width: 520px; }
        .fee-table th {
          padding: 12px;
          background: #f3f6f8;
          color: #405460;
          font-size: 12px;
          text-align: left;
          border-bottom: 1px solid #dce5e9;
        }
        .fee-table td {
          padding: 11px 12px;
          color: #354b57;
          font-size: 13px;
          border-bottom: 1px solid #e8edef;
        }
        .fee-table tbody tr:last-child td { border-bottom: 0; }
        .fee-table tbody tr:nth-child(even) { background: #fbfcfc; }
        .fee-total td { background: #edf8f4; color: #0F6E56; font-weight: 800; }
        .fee-payment {
          margin-top: 14px;
          padding: 16px 18px;
          border: 1px solid #bcd9ea;
          border-left: 4px solid #2f79b7;
          border-radius: 10px;
          background: #edf6fc;
        }
        .fee-payment-label {
          margin: 0 0 5px;
          color: #245a87;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .7px;
        }
        .fee-payment-value { margin: 0; color: #172b3a; font-size: 14px; font-weight: 700; }
        .fee-notes {
          margin-top: 28px;
          padding: 20px;
          border: 1px solid #dce5e9;
          border-radius: 12px;
          background: #fafbfb;
        }
        .fee-notes h3 { margin: 0 0 12px; color: #263b47; font-size: 15px; }
        .fee-notes p { margin: 7px 0; color: #5e6f79; font-size: 13px; line-height: 1.6; }
        .fee-footer {
          padding: 18px 24px;
          border-top: 1px solid #e2e9ec;
          background: #f7f9fa;
          color: #78868e;
          text-align: center;
          font-size: 11px;
        }
        @media (max-width: 700px) {
          .fee-page { padding: 0 0 32px; }
          .fee-actions { padding: 10px 12px; border-bottom: 1px solid rgba(47,121,183,.14); }
          .fee-action { padding: 10px 12px; font-size: 12px; box-shadow: none; }
          .fee-document { border: 0; border-radius: 0; box-shadow: none; }
          .fee-letterhead { padding: 9px 7px 8px; }
          .fee-logo { width: 52px; height: 52px; }
          .fee-letterhead-copy { padding: 0 5px; }
          .fee-county { font-size: 8px; letter-spacing: .45px; }
          .fee-department { font-size: 8px; line-height: 1.2; margin-top: 2px; }
          .fee-name { font-size: 10px; letter-spacing: .35px; margin-top: 3px; }
          .fee-contact { font-size: 7px; line-height: 1.3; margin-top: 3px; }
          .fee-body { padding: 26px 14px 34px; }
          .fee-subtitle { margin-bottom: 24px; }
          .fee-section { margin-top: 24px; }
          .fee-section-title { font-size: 14px; }
          .fee-table th, .fee-table td { padding: 10px; font-size: 12px; }
          .fee-payment { padding: 14px; }
          .fee-notes { padding: 16px; }
        }
      `}</style>

      <div className="fee-shell">
        <div className="fee-actions">
          <Link href="/" className="fee-action fee-back">
            <span aria-hidden="true">←</span> Back to website
          </Link>
          <a href="/api/fee-structure-pdf?download=1" className="fee-action fee-download">
            Download PDF
          </a>
        </div>

        <article className="fee-document">
          <header className="fee-letterhead">
            <img src="/kvtc_logo.png" alt="Kinoo VTC" className="fee-logo fee-kvtc-logo" />
            <div className="fee-letterhead-copy">
              <div className="fee-county">COUNTY GOVERNMENT OF KIAMBU</div>
              <div className="fee-department">Department Of Education, Gender, Culture &amp; Social Services</div>
              <div className="fee-name">KINOO VOCATIONAL TRAINING CENTRE</div>
              <div className="fee-contact">P.O BOX 351-00902, Kikuyu. &nbsp; Tel: 0113582008</div>
              <div className="fee-contact">Email: kinoovtc@gmail.com &nbsp; www.kinoovtc.ac.ke</div>
            </div>
            <img src="/cgok-logo.png" alt="County Government of Kiambu" className="fee-logo" />
          </header>

          <div className="fee-body">
            <h1 className="fee-title">Official Fee Structure</h1>
            <p className="fee-subtitle">{feeStructure.year || '2026'} intake · Review online or download the official PDF</p>

            <section className="fee-section">
              <h2 className="fee-section-title">Full-Time Artisan &amp; Craft Courses</h2>
              <div className="fee-table-wrap">
                <table className="fee-table">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Duration</th>
                      {termFees.map((term) => <th key={term.label}>{term.label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {fullCourses.map((course) => (
                      <tr key={course.slug || course.name}>
                        <td><strong>{course.name}</strong></td>
                        <td>{course.dur}</td>
                        {termFees.map((term) => <td key={term.label}>{money(term.amount)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="fee-section">
              <h2 className="fee-section-title">One-Time Admission Requirements</h2>
              <div className="fee-table-wrap">
                <table className="fee-table compact">
                  <thead><tr><th>Requirement</th><th>Amount</th></tr></thead>
                  <tbody>
                    {(feeStructure.admissionFees || []).map((fee) => (
                      <tr key={fee.item}><td>{fee.item}</td><td>{money(fee.amount)}</td></tr>
                    ))}
                    <tr className="fee-total"><td>Total Admission Fees</td><td>{money(feeStructure.admissionTotal)}</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="fee-payment">
                <p className="fee-payment-label">REGISTRATION &amp; ADMISSION PAYMENT METHOD</p>
                <p className="fee-payment-value">Co-operative Bank Kangemi · A/C 01141151624400</p>
              </div>
            </section>

            <section className="fee-section">
              <h2 className="fee-section-title">Short Courses &amp; Part-Time</h2>
              <div className="fee-table-wrap">
                <table className="fee-table compact">
                  <thead><tr><th>Course Name</th><th>Duration</th><th>Total Fees</th></tr></thead>
                  <tbody>
                    {shortCourses.map((course) => (
                      <tr key={course.slug || course.name}>
                        <td><strong>{course.name}</strong></td>
                        <td>{course.dur}</td>
                        <td>{course.fees}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <aside className="fee-notes">
              <h3>Important Payment Information</h3>
              <p>1. The KSh 500 admission application fee is non-refundable.</p>
              <p>2. NITA and KNEC examination fees are not included and vary by course.</p>
              <p>3. All payments must be made to the respective bank accounts. No cash is accepted.</p>
              <p><strong>Tuition:</strong> KCB Kikuyu Branch · A/C 1104169527</p>
              <p><strong>Registration &amp; Admission:</strong> Co-operative Bank Kangemi · A/C 01141151624400</p>
            </aside>
          </div>

          <footer className="fee-footer">
            This fee structure is valid for the {feeStructure.year || '2026'} academic year. Kinoo VTC reserves the right to revise fees.
          </footer>
        </article>
      </div>
    </main>
  );
}
