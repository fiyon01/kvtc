import Link from 'next/link';
import db from '@/data/db.json';
import { notFound } from 'next/navigation';

const allCourses = db.courses || [];
const departments = db.departments || [];

export async function generateStaticParams() {
  return departments.map(d => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const dept = departments.find(d => d.slug === slug);
  if (!dept) return {};
  return {
    title: `${dept.name} | Kinoo VTC`,
    description: dept.description,
  };
}

export default async function DepartmentPage({ params }) {
  const { slug } = await params;
  const dept = departments.find(d => d.slug === slug);
  if (!dept) notFound();

  // Find courses belonging to this department
  const departmentCourses = allCourses.filter(c => 
    c.tag.toLowerCase().includes(slug.replace('-', ' ')) || 
    slug.includes(c.tag.toLowerCase())
  );

  return (
    <>
      {/* ── HERO SECTION ── */}
      <section style={{
        minHeight: '60vh',
        background: `linear-gradient(135deg, rgba(15,110,86,0.92) 0%, rgba(15,110,86,0.7) 100%), url('${dept.image}') center/cover no-repeat`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '140px 8% 80px', position: 'relative'
      }}>
        <div style={{ maxWidth: '800px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', padding: '6px 16px', borderRadius: '100px', marginBottom: '24px', textTransform: 'uppercase' }}>
            Academic Department
          </span>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', color: '#fff', lineHeight: 1.1, marginBottom: '24px' }}>
            {dept.name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '32px' }}>
            {dept.description}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#EF9F27', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a1a', fontWeight: 700, fontSize: '20px' }}>
              {dept.hod.split(' ').map(n => n[0]).join('').substring(0,2)}
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Head of Department</div>
              <div style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>{dept.hod}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COURSES SECTION ── */}
      <section style={{ padding: '96px 8%', background: '#f8f7f4', minHeight: '50vh' }}>
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 3vw, 2.5rem)', color: '#1a1a1a', marginBottom: '12px' }}>Available Programmes</h2>
          <p style={{ color: '#888', fontSize: '1.05rem' }}>Browse all NITA and KNEC accredited courses under the {dept.name} department.</p>
        </div>

        {departmentCourses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '56px', marginBottom: '20px' }}>📚</div>
            <h3 style={{ fontSize: '22px', color: '#1a1a1a', marginBottom: '10px' }}>No courses available yet</h3>
            <p style={{ color: '#888', fontSize: '15px' }}>We are currently updating our syllabus for this department. Please check back later.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {departmentCourses.map((c, i) => (
              <Link key={i} href={`/courses/${c.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '20px', overflow: 'hidden', transition: 'all 0.3s', height: '100%', display: 'flex', flexDirection: 'column' }}
                  className="course-card-hover">
                  <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#E1F5EE', position: 'relative', flexShrink: 0 }}>
                    <img src={c.img} alt={c.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                      className="course-img-hover" />
                    <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)', color: '#1a1a1a', fontSize: '12px', fontWeight: 700, padding: '6px 14px', borderRadius: '100px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      {c.dur}
                    </div>
                  </div>
                  <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#0F6E56', marginBottom: '12px', display: 'block' }}>{c.tag}</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', marginBottom: '16px', lineHeight: 1.4, flexGrow: 1 }}>{c.name}</h3>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)', marginBottom: '24px' }}>
                      {c.cert.toUpperCase() === 'NITA' && <img src="/nita.png" alt="NITA Certified" style={{ height: '22px', objectFit: 'contain' }} />}
                      {c.cert.toUpperCase() === 'KNEC' && <img src="/knec.png" alt="KNEC Certified" style={{ height: '22px', objectFit: 'contain' }} />}
                      {!['NITA', 'KNEC'].includes(c.cert.toUpperCase()) && <span style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>🏅 {c.cert}</span>}
                    </div>
                    {/* Apply Now Button */}
                    <div style={{ textAlign: 'center', background: '#f8f7f4', color: '#0F6E56', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, marginTop: 'auto', transition: 'all 0.2s', border: '1px solid transparent' }} className="apply-btn-hover">
                      View Course Details →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .course-card-hover:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(0,0,0,0.08); border-color: rgba(15,110,86,0.2) !important; }
        .course-card-hover:hover .course-img-hover { transform: scale(1.08); }
        .course-card-hover:hover .apply-btn-hover { background: #0F6E56; color: #fff; box-shadow: 0 8px 24px rgba(15,110,86,0.2); }
      `}</style>
    </>
  );
}
