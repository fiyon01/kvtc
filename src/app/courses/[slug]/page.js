import db from '@/data/db.json';
const { courses } = db;
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) return {};
  return {
    title: `${course.name} | Kinoo VTC`,
    description: course.description,
  };
}

export default async function CourseDetail({ params }) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  const related = courses.filter((c) => c.slug !== slug && c.tag === course.tag).slice(0, 3);

  const certColor = course.type === 'knec' ? '#378ADD' : course.type === 'nita' ? '#0F6E56' : '#888';

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ paddingTop: '120px', padding: '120px 8% 0', background: '#f8f7f4' }}>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>
          <Link href="/" style={{ color: '#0F6E56', textDecoration: 'none' }}>Home</Link>
          {' › '}
          <Link href="/courses" style={{ color: '#0F6E56', textDecoration: 'none' }}>Courses</Link>
          {' › '}
          {course.name}
        </p>
      </div>

      {/* Hero Section */}
      <div style={{ background: '#f8f7f4', padding: '32px 8% 0' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px',
          alignItems: 'center', maxWidth: '1200px', margin: '0 auto',
          paddingBottom: '64px',
        }} className="course-detail-grid">
          {/* Info */}
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase',
                color: '#0F6E56', background: '#E1F5EE', padding: '5px 12px', borderRadius: '100px',
              }}>{course.tag}</span>
              <span style={{
                fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
                color: '#fff', background: certColor, padding: '5px 12px', borderRadius: '100px',
              }}>{course.cert} Certified</span>
            </div>
            <h1 style={{
              fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#1a1a1a', lineHeight: 1.2, marginBottom: '20px',
            }}>{course.name}</h1>
            <p style={{ color: '#555', fontSize: '16px', lineHeight: 1.8, marginBottom: '28px' }}>
              {course.description}
            </p>

            {/* Key Info Cards */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
              {[
                { icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Duration', val: course.dur },
                { icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Fees', val: course.fees },
                { icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, label: 'Intake', val: course.intake },
              ].map(({ icon, label, val }) => (
                <div key={label} style={{
                  background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '12px', padding: '14px 18px', flex: '1', minWidth: '120px',
                }}>
                  <div style={{ color: '#0F6E56', marginBottom: '6px', display: 'flex', alignItems: 'center' }}>{icon}</div>
                  <div style={{ fontSize: '11px', color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', marginTop: '2px' }}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href={`/apply?course=${encodeURIComponent(course.name)}&skipPre=true`} style={{
                background: '#0F6E56', color: '#fff', padding: '14px 28px',
                borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none',
              }}>Apply for This Course</Link>
              <a href="tel:+254113582008" style={{
                color: '#0F6E56', padding: '14px 28px', borderRadius: '10px',
                fontWeight: 600, fontSize: '14px', textDecoration: 'none',
                border: '1.5px solid #0F6E56', display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Call Us
              </a>
              <a href="/api/prospectus-pdf" download="Kinoo_VTC_Prospectus.pdf" style={{
                color: '#555', padding: '14px 28px', borderRadius: '10px',
                fontWeight: 600, fontSize: '14px', textDecoration: 'none',
                border: '1.5px solid rgba(0,0,0,0.12)', display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Prospectus
              </a>
              <a href="/api/fee-structure-pdf" download="Kinoo_VTC_Fee_Structure.pdf" style={{
                color: '#555', padding: '14px 28px', borderRadius: '10px',
                fontWeight: 600, fontSize: '14px', textDecoration: 'none',
                border: '1.5px solid rgba(0,0,0,0.12)', display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Fee Structure
              </a>
            </div>
          </div>

          {/* Image */}
          <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '4/3' }}>
            <img
              src={course.img}
              alt={course.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* Outcomes & Careers */}
      <section style={{ padding: '80px 8%', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }} className="course-detail-grid">
          {/* Outcomes */}
          <div style={{ background: '#f8f7f4', borderRadius: '16px', padding: '36px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: '#1a1a1a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="24" height="24" fill="none" stroke="#0F6E56" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              What You Will Learn
            </h2>
            {course.outcomes.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                  <svg width="12" height="12" fill="none" stroke="#0F6E56" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                </div>
                <span style={{ fontSize: '15px', color: '#444', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Careers */}
          <div style={{ background: 'linear-gradient(135deg, #0F6E56, #085041)', borderRadius: '16px', padding: '36px' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="24" height="24" fill="none" stroke="#EF9F27" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Career Opportunities
            </h2>
            {course.careers.map((c, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '10px', padding: '12px 16px', marginBottom: '10px', color: '#fff', fontSize: '15px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>→</span> {c}
              </div>
            ))}
            <div style={{ marginTop: '28px' }}>
              <Link href={`/apply?course=${encodeURIComponent(course.name)}&skipPre=true`} style={{ background: '#EF9F27', color: '#1a1a1a', padding: '14px 24px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>Apply for This Course</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Department-Specific Requirements */}
      {course.requirements && course.requirements.length > 0 && (
        <section style={{ padding: '0 8% 80px', background: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ background: '#FFF8E8', border: '2px solid #EF9F27', borderRadius: '20px', padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '44px', height: '44px', background: '#EF9F27', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: '#1a1a1a', margin: 0 }}>What You Need to Bring</h2>
                  <p style={{ fontSize: '14px', color: '#888', margin: '4px 0 0' }}>Department-specific tools, equipment & uniform for {course.name}</p>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#BA7517', fontWeight: 600, marginBottom: '24px', marginTop: '8px' }}>
                ⚠ Please procure all items on this list before your first day of training.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                {course.requirements.map((req, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#fff', border: '1px solid rgba(239,159,39,0.2)', padding: '12px 14px', borderRadius: '10px', fontSize: '14px', color: '#444' }}>
                    <span style={{ background: '#EF9F27', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                    {req}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '28px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href={`/apply?course=${encodeURIComponent(course.name)}&skipPre=true`} style={{ background: '#0F6E56', color: '#fff', padding: '14px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>Apply Now – {course.name}</Link>
                <a href="tel:+254113582008" style={{ color: '#0F6E56', padding: '14px 24px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none', border: '1.5px solid #0F6E56' }}>📞 Call for Guidance</a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Courses */}
      {related.length > 0 && (
        <section style={{ padding: '64px 8% 96px', background: '#f8f7f4' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', color: '#1a1a1a', marginBottom: '32px' }}>
              Related Courses
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '24px' }}>
              {related.map((r) => (
                <Link key={r.slug} href={`/courses/${r.slug}`} style={{ textDecoration: 'none' }} className="related-card-link">
                  <div className="related-card" style={{
                    background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '16px', overflow: 'hidden',
                    transition: 'transform 0.25s, box-shadow 0.25s',
                  }}>
                    <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                      <img src={r.img} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '20px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#0F6E56', background: '#E1F5EE', padding: '4px 10px', borderRadius: '100px' }}>{r.tag}</span>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginTop: '10px', lineHeight: 1.4 }}>{r.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        @media(max-width: 900px) {
          .course-detail-grid { grid-template-columns: 1fr !important; }
        }
        .related-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  );
}
