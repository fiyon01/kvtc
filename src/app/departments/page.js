'use client';

import Link from 'next/link';
import { useState } from 'react';
import db from '@/data/db.json';

const departments = db.departments || [];

function DeptCard({ dept }) {
  const [hovering, setHovering] = useState(false);

  return (
    <Link href={`/departments/${dept.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background: '#fff',
          borderRadius: '28px',
          overflow: 'hidden',
          border: '1px solid rgba(15, 110, 86, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          cursor: 'pointer',
          transform: hovering ? 'translateY(-12px)' : 'translateY(0)',
          boxShadow: hovering 
            ? '0 24px 64px rgba(15, 110, 86, 0.12)' 
            : '0 8px 32px rgba(0, 0, 0, 0.04)'
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Image Section with Overlay */}
        <div style={{
          position: 'relative',
          aspectRatio: '16/10',
          overflow: 'hidden',
          background: '#f0f0f0'
        }}>
          <img
            src={dept.image}
            alt={dept.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: hovering ? 'scale(1.12)' : 'scale(1)'
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 40%, transparent 100%)'
          }} />
          
          {/* Badge */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(239, 159, 39, 0.95)',
            backdropFilter: 'blur(8px)',
            color: '#1a1a1a',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            Featured
          </div>
          
          {/* Text Overlay */}
          <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
            <h2 style={{
              fontFamily: 'var(--serif)',
              color: '#fff',
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              marginBottom: '8px',
              lineHeight: 1.2,
              fontWeight: 800
            }}>
              {dept.name}
            </h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '13px',
              fontWeight: 600
            }}>
              <span>👤</span>
              <span>Led by {dept.hod}</span>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div style={{ padding: '32px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <p style={{
            color: '#64748b',
            fontSize: '15px',
            lineHeight: 1.7,
            marginBottom: '28px',
            flexGrow: 1
          }}>
            {dept.description.substring(0, 130)}...
          </p>
          
          {/* Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#0F6E56',
            fontWeight: 700,
            fontSize: '14px',
            borderTop: '1px solid rgba(15, 110, 86, 0.1)',
            paddingTop: '20px',
            transition: 'all 0.3s ease'
          }}>
            <span>Explore Department</span>
            <span style={{ transition: 'transform 0.3s ease', transform: hovering ? 'translateX(6px)' : 'translateX(0)' }}>→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DepartmentsIndex() {
  return (
    <>
      {/* ── PREMIUM HERO SECTION ── */}
      <section style={{ padding: '140px 24px 100px', background: '#ffffff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Animated Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'radial-gradient(ellipse at 20% 30%, rgba(15, 110, 86, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(239, 159, 39, 0.06) 0%, transparent 50%)', animation: 'mesh-shift 15s ease-in-out infinite' }} />
        
        <div style={{ position: 'absolute', top: '-150px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(15,110,86,0.3), rgba(29,158,117,0.2))', filter: 'blur(100px)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-50px', width: '350px', height: '350px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(239,159,39,0.25), rgba(217,138,26,0.15))', filter: 'blur(100px)', zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#0F6E56', background: 'rgba(15, 110, 86, 0.08)', border: '1px solid rgba(15, 110, 86, 0.2)', padding: '12px 24px', borderRadius: '100px', marginBottom: '32px' }}>
            <span>🎓</span>
            <span>Our Academic Divisions</span>
          </div>
          
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 900, color: '#0f172a', marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Five Pathways to <span style={{ background: 'linear-gradient(135deg, #0F6E56, #EF9F27)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Professional Success</span>
          </h1>
          
          <p style={{ color: '#64748b', fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', lineHeight: 1.8, maxWidth: '680px', margin: '0 auto', fontWeight: 400 }}>
            Discover our industry-aligned departments, each equipped with state-of-the-art training facilities and expert instructors committed to your career advancement.
          </p>
        </div>
      </section>

      {/* ── PREMIUM DEPARTMENTS GRID ── */}
      <section style={{ padding: '120px 24px', background: '#f9f8f6' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {departments.map((dept) => (
              <DeptCard key={dept.id} dept={dept} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section style={{ padding: '100px 24px', background: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: '20px',
            lineHeight: 1.2
          }}>
            Ready to Choose Your Path?
          </h2>
          <p style={{
            color: '#64748b',
            fontSize: '1.1rem',
            lineHeight: 1.7,
            marginBottom: '40px'
          }}>
            Our admissions team is ready to guide you through the application process and answer any questions about our departments and programs.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/admissions" style={{
              background: 'linear-gradient(135deg, #0F6E56, #085041)',
              color: '#fff',
              padding: '16px 36px',
              borderRadius: '100px',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              Apply Now <span>→</span>
            </Link>
            <Link href="/courses" style={{
              background: 'transparent',
              color: '#0F6E56',
              padding: '16px 36px',
              borderRadius: '100px',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
              border: '2px solid #0F6E56',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes mesh-shift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(8px, 8px) scale(1.02); }
        }
      `}</style>
    </>
  );
}
