"use client";

export default function FacultyGrid({ faculty }) {
  return (
    <>
      <style>{`
        .faculty-card {
          background: #f8f7f4;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.06);
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: default;
        }
        .faculty-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.10);
        }
      `}</style>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
        {faculty.map((f, i) => (
          <div key={i} className="faculty-card">
            <div style={{ height: '180px', overflow: 'hidden', background: '#e0e0e0', position: 'relative' }}>
              <img src={f.img} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,110,86,0.5), transparent)' }} />
            </div>
            <div style={{ padding: '20px 16px 24px' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', color: '#1a1a1a', marginBottom: '4px' }}>{f.name}</h3>
              <p style={{ color: '#0F6E56', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>{f.dept}</p>
              <p style={{ color: '#888', fontSize: '12px', lineHeight: 1.5 }}>{f.courses}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
