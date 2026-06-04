import Link from 'next/link';
import db from '@/data/db.json';

const departments = db.departments || [];

export const metadata = {
  title: 'Academic Departments | Kinoo VTC',
  description: 'Explore the diverse academic departments at Kinoo Vocational Training Center.',
};

export default function DepartmentsIndex() {
  return (
    <>
      {/* ── HERO SECTION ── */}
      <section style={{ padding: '160px 8% 80px', background: 'linear-gradient(135deg, #0F6E56 0%, #085041 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', background: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: '100px', marginBottom: '24px', backdropFilter: 'blur(4px)' }}>
            Academics
          </span>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#fff', marginBottom: '24px', lineHeight: 1.1 }}>
            Our Departments
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.15rem', lineHeight: 1.7 }}>
            Discover our industry-aligned faculties. Each department at Kinoo VTC is equipped with modern training facilities and expert instructors dedicated to your success.
          </p>
        </div>
      </section>

      {/* ── DEPARTMENTS GRID ── */}
      <section style={{ padding: '96px 8%', background: '#f8f7f4', minHeight: '50vh' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {departments.map((dept, i) => (
            <Link key={dept.id} href={`/departments/${dept.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', height: '100%' }}
                className="dept-card-hover">
                <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
                  <img src={dept.image} alt={dept.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="dept-img-hover" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }} />
                  <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                    <h2 style={{ fontFamily: 'var(--serif)', color: '#fff', fontSize: '24px', marginBottom: '8px', lineHeight: 1.2 }}>{dept.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 600 }}>
                      <span>HOD: {dept.hod}</span>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '28px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px', flexGrow: 1 }}>
                    {dept.description.substring(0, 120)}...
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#0F6E56', fontWeight: 700, fontSize: '14px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '20px' }}>
                    <span>Explore Department</span>
                    <span className="arrow-hover" style={{ transition: 'transform 0.2s' }}>→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <style>{`
        .dept-card-hover:hover { transform: translateY(-8px); box-shadow: 0 24px 64px rgba(0,0,0,0.08); border-color: rgba(15,110,86,0.2); }
        .dept-card-hover:hover .dept-img-hover { transform: scale(1.08); }
        .dept-card-hover:hover .arrow-hover { transform: translateX(6px); }
      `}</style>
    </>
  );
}
