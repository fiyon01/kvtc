'use client';

import Link from 'next/link';
import { useState } from 'react';
import db from '@/data/db.json';

const departments = db.departments || [];

function DeptCard({ dept, index }) {
  const [hovering, setHovering] = useState(false);
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#EF9F27'];
  const color = colors[index % colors.length];

  return (
    <Link href={`/departments/${dept.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div
        style={{
          background: '#fff',
          borderRadius: '32px',
          overflow: 'hidden',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: hovering 
            ? '0 40px 120px rgba(0, 0, 0, 0.18)' 
            : '0 16px 48px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          cursor: 'pointer',
          transform: hovering ? 'translateY(-20px) scale(1.02)' : 'translateY(0) scale(1)',
          position: 'relative'
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Glow Effect on Hover */}
        {hovering && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${color}15, transparent)`,
            pointerEvents: 'none',
            zIndex: 1
          }} />
        )}

        {/* Premium Image Section */}
        <div style={{
          position: 'relative',
          height: '280px',
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${color}20, ${color}08)`
        }}>
          {/* Decorative Top Accent Bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: `linear-gradient(90deg, ${color}, #0F6E56)`,
            zIndex: 2
          }} />

          <img
            src={dept.image}
            alt={dept.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.5s ease',
              transform: hovering ? 'scale(1.15) rotate(1deg)' : 'scale(1) rotate(0deg)',
              filter: hovering ? 'brightness(1.1) saturate(1.2)' : 'brightness(0.95) saturate(1)'
            }}
          />

          {/* Gradient Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to top, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.7) 50%, rgba(15, 23, 42, 0.3) 100%)`,
            transition: 'all 0.5s ease'
          }} />

          {/* Premium Badge with Icon */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: `linear-gradient(135deg, ${color}, ${color}dd)`,
            backdropFilter: 'blur(16px)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            boxShadow: `0 12px 40px ${color}40`,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.4s ease',
            transform: hovering ? 'translateY(-4px)' : 'translateY(0)'
          }}>
            🎓 Featured
          </div>

          {/* Content Overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '40px 28px 32px',
            zIndex: 2
          }}>
            <h2 style={{
              fontFamily: 'var(--serif)',
              color: '#fff',
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
              marginBottom: '12px',
              lineHeight: 1.2,
              fontWeight: 900,
              letterSpacing: '-0.01em',
              textShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
            }}>
              {dept.name}
            </h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.2px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}>
              <span style={{ fontSize: '16px' }}>👤</span>
              <span><strong>Led by</strong> {dept.hod}</span>
            </div>
          </div>
        </div>

        {/* Premium Content Section */}
        <div style={{
          padding: '36px 32px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Description */}
          <p style={{
            color: '#64748b',
            fontSize: '15px',
            lineHeight: 1.8,
            flexGrow: 1,
            margin: 0,
            fontWeight: 500
          }}>
            {dept.description.length > 140 ? dept.description.substring(0, 140) + '...' : dept.description}
          </p>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            padding: '20px 0',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{
              padding: '12px',
              background: `${color}08`,
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 900,
                color: color,
                marginBottom: '4px'
              }}>
                {dept.courses?.length || '5'}+
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}>
                Courses
              </div>
            </div>
            <div style={{
              padding: '12px',
              background: `${color}08`,
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: 900,
                color: color,
                marginBottom: '4px'
              }}>
                {dept.students || '500'}+
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}>
                Trainees
              </div>
            </div>
          </div>

          {/* Premium CTA Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 0',
            color: color,
            fontWeight: 800,
            fontSize: '15px',
            letterSpacing: '0.3px',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            textTransform: 'uppercase'
          }}>
            <span>Explore Courses</span>
            <span style={{
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: hovering ? 'translateX(12px) scale(1.3)' : 'translateX(0) scale(1)',
              display: 'inline-flex'
            }}>
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DepartmentsIndex() {
  return (
    <>
      {/* PREMIUM HERO SECTION */}
      <section style={{
        padding: '160px 24px 120px',
        background: '#ffffff',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Mesh */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          background: 'radial-gradient(ellipse at 20% 30%, rgba(15, 110, 86, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(239, 159, 39, 0.06) 0%, transparent 50%)',
          animation: 'mesh-shift 15s ease-in-out infinite'
        }} />

        {/* Floating Orbs */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          right: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(15,110,86,0.25), rgba(29,158,117,0.15))',
          filter: 'blur(120px)',
          zIndex: 0,
          animation: 'float-orb-1 16s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-80px',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(239,159,39,0.2), rgba(217,138,26,0.1))',
          filter: 'blur(120px)',
          zIndex: 0,
          animation: 'float-orb-2 18s ease-in-out infinite'
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '950px',
          margin: '0 auto'
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            color: '#0F6E56',
            background: 'rgba(15, 110, 86, 0.08)',
            border: '1.5px solid rgba(15, 110, 86, 0.2)',
            padding: '14px 28px',
            borderRadius: '100px',
            marginBottom: '40px',
            boxShadow: '0 8px 24px rgba(15, 110, 86, 0.1)'
          }}>
            <span style={{ fontSize: '16px' }}>🏫</span>
            <span>Academic Excellence</span>
          </div>

          {/* Main Heading */}
          <h1 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(3rem, 7vw, 5.2rem)',
            fontWeight: 900,
            color: '#0f172a',
            marginBottom: '28px',
            lineHeight: 1.1,
            letterSpacing: '-0.02em'
          }}>
            Five Pathways to <br style={{ display: 'none' }} />
            <span style={{
              background: 'linear-gradient(135deg, #0F6E56 0%, #EF9F27 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Professional Excellence
            </span>
          </h1>

          {/* Subheading */}
          <p style={{
            color: '#64748b',
            fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
            lineHeight: 1.8,
            maxWidth: '720px',
            margin: '0 auto 48px',
            fontWeight: 500,
            letterSpacing: '0.2px'
          }}>
            Each department represents our commitment to industry-aligned training, expert mentorship, and transforming ambitious trainees into skilled professionals ready to shape Kenya's future.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a href="#departments" style={{
              background: 'linear-gradient(135deg, #0F6E56, #085041)',
              color: '#fff',
              padding: '16px 40px',
              borderRadius: '100px',
              fontWeight: 800,
              fontSize: '15px',
              textDecoration: 'none',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 12px 40px rgba(15, 110, 86, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              letterSpacing: '0.3px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 20px 60px rgba(15, 110, 86, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 12px 40px rgba(15, 110, 86, 0.25)';
            }}>
              Explore Departments
              <span style={{ transition: 'transform 0.3s ease' }}>↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* DEPARTMENTS GRID */}
      <section id="departments" style={{
        padding: '140px 24px',
        background: 'linear-gradient(to bottom, #ffffff, #f9f8f6)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ marginBottom: '80px', textAlign: 'center' }}>
            <h2 style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
              fontWeight: 900,
              color: '#0f172a',
              marginBottom: '16px',
              letterSpacing: '-0.01em'
            }}>
              Our Departments
            </h2>
            <div style={{
              height: '4px',
              width: '60px',
              background: 'linear-gradient(90deg, #0F6E56, #EF9F27)',
              margin: '0 auto',
              borderRadius: '2px'
            }} />
          </div>

          {/* Premium Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '40px',
            alignItems: 'stretch'
          }}>
            {departments.map((dept, idx) => (
              <DeptCard key={dept.id} dept={dept} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{
        padding: '120px 24px',
        background: '#ffffff',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Decoration */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(15, 110, 86, 0.04) 0%, transparent 70%)',
          zIndex: 0
        }} />

        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            color: '#0f172a',
            marginBottom: '24px',
            lineHeight: 1.2,
            letterSpacing: '-0.01em'
          }}>
            Ready to Transform Your Future?
          </h2>
          <p style={{
            color: '#64748b',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            marginBottom: '48px',
            fontWeight: 500
          }}>
            Join thousands of skilled professionals who started their journey at Kinoo VTC. Our admissions team is ready to guide you to your perfect department.
          </p>
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link href="/admissions" style={{
              background: 'linear-gradient(135deg, #0F6E56, #085041)',
              color: '#fff',
              padding: '18px 42px',
              borderRadius: '100px',
              fontWeight: 800,
              fontSize: '15px',
              textDecoration: 'none',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 12px 40px rgba(15, 110, 86, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              letterSpacing: '0.3px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 20px 60px rgba(15, 110, 86, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 12px 40px rgba(15, 110, 86, 0.25)';
            }}>
              Apply Now
              <span>→</span>
            </Link>
            <Link href="/contact" style={{
              background: 'transparent',
              color: '#0F6E56',
              padding: '18px 42px',
              borderRadius: '100px',
              fontWeight: 800,
              fontSize: '15px',
              textDecoration: 'none',
              border: '2px solid #0F6E56',
              transition: 'all 0.4s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              letterSpacing: '0.3px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(15, 110, 86, 0.08)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.transform = 'translateY(0)';
            }}>
              Ask a Question
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes mesh-shift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(12px, 12px) scale(1.02); }
        }
        @keyframes float-orb-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.1); }
        }
        @keyframes float-orb-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.08); }
        }
      `}</style>
    </>
  );
}
