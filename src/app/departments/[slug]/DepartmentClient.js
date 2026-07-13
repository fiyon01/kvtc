"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Award, Briefcase, ChevronRight, CheckCircle2, User, BookOpen, Star, Sparkles } from 'lucide-react';

export default function DepartmentClient({ dept, courses, jsonLd }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="dp-layout">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      {/* ── CINEMATIC DARK HERO ── */}
      <section className="dp-hero-dark">
        <div className="dp-hero-bg-image">
          <img src={dept.image} alt={dept.name} />
          <div className="dp-hero-dark-overlay" />
        </div>
        
        <div className="dp-container">
          <div className="dp-hero-content-dark">
            <div className="dp-pill-badge-dark">
              <Sparkles size={14} className="text-gold" />
              <span>Academic Department</span>
            </div>
            <h1>{dept.name}</h1>
            <p>{dept.description}</p>
            
            <div className="dp-hero-actions">
              {/* If no courses exist, just link to apply general. If they do, link to the first course or apply general */}
              <Link href={courses.length > 0 ? `/apply?course=${courses[0].slug}` : '/apply'} className="btn-primary-glow-dark">
                Apply for 2026 Intake <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="dp-glass-stats-dark">
            <div className="dp-glass-stat">
              <strong>{courses.length}+</strong>
              <span>Courses</span>
            </div>
            <div className="dp-glass-divider-dark" />
            <div className="dp-glass-stat">
              <strong>NITA / KNEC</strong>
              <span>Certified</span>
            </div>
            <div className="dp-glass-divider-dark" />
            <div className="dp-glass-stat">
              <strong>100%</strong>
              <span>Practical</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY NAVIGATION BAR ── */}
      <div className={`dp-sticky-bar ${scrolled ? 'visible' : ''}`}>
        <div className="dp-sticky-inner">
          <span className="dp-sticky-title">{dept.name}</span>
          <Link href={courses.length > 0 ? `/apply?course=${courses[0].slug}` : '/apply'} className="dp-sticky-btn">Apply Now</Link>
        </div>
      </div>

      {/* ── COURSES GRID ── */}
      <section className="dp-section dp-courses-bg">
        <div className="dp-container">
          <div className="dp-section-header">
            <h2>Programmes Offered</h2>
            <p>Industry-aligned curriculum designed to make you highly employable from day one.</p>
          </div>

          {courses.length === 0 ? (
            <div className="dp-empty-state">
              <p>Course listings are being updated. <Link href="/apply">Contact admissions</Link> for details.</p>
            </div>
          ) : (
            <div className="dp-grid">
              {courses.map((course, i) => (
                <div key={i} className="dp-card">
                  <div className="dp-card-img">
                    <img src={course.img} alt={course.name} />
                    <div className="dp-card-tag">{course.cert}</div>
                  </div>
                  
                  <div className="dp-card-content">
                    <h3>{course.name}</h3>
                    <p className="dp-card-desc">{course.description}</p>
                    
                    <div className="dp-metrics">
                      <div className="dp-metric">
                        <Clock size={14} /> <span>{course.dur}</span>
                      </div>
                      <div className="dp-metric">
                        <Briefcase size={14} /> <span>{course.fees}</span>
                      </div>
                    </div>

                    <div className="dp-divider" />

                    {course.outcomes && course.outcomes.length > 0 && (
                      <ul className="dp-check-list">
                        {course.outcomes.slice(0, 3).map((o, j) => (
                          <li key={j}>
                            <CheckCircle2 size={16} className="text-green" />
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* ROUTING FIX: Now points to /apply?course=slug so requirements modal shows */}
                    <Link href={`/apply?course=${course.slug}`} className="dp-action-btn-liquid">
                      <span>Apply for this course</span> <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HOD BENTO SECTION ── */}
      <section className="dp-section dp-hod-bg">
        <div className="dp-container">
          <div className="dp-bento-grid">
            <div className="dp-bento-card dp-hod-card">
              <div className="dp-hod-avatar">
                <User size={40} />
              </div>
              <div className="dp-hod-info">
                <span className="dp-hod-label">Head of Department</span>
                <h3>{dept.hod}</h3>
                <p>Leading the {dept.name} department with a commitment to producing world-class, job-ready graduates through intensive practical training.</p>
              </div>
            </div>
            
            <div className="dp-bento-card dp-cta-card">
              <h3>Take the Next Step</h3>
              <p>Join hundreds of successful graduates who started their journey here. Intake is ongoing.</p>
              <div className="dp-cta-buttons">
                <Link href={courses.length > 0 ? `/apply?course=${courses[0].slug}` : '/apply'} className="btn-solid-dark">Start Application</Link>
                <Link href="/courses" className="btn-outline">Browse All</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .dp-layout {
          background: #ffffff;
          min-height: 100vh;
          font-family: var(--sans);
          color: #0f172a;
        }
        .dp-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .text-gold { color: #EF9F27; }
        .text-green { color: #0F6E56; }

        /* ── DARK CINEMATIC HERO ── */
        .dp-hero-dark {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding: 120px 0 160px;
          overflow: hidden;
          background: #06090e;
        }
        .dp-hero-bg-image {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .dp-hero-bg-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
          filter: grayscale(20%);
        }
        .dp-hero-dark-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(6, 9, 14, 0.97) 0%,
            rgba(6, 9, 14, 0.82) 40%,
            rgba(6, 9, 14, 0.97) 100%
          ), radial-gradient(
            circle at 50% 50%,
            rgba(15, 110, 86, 0.25) 0%,
            transparent 60%
          );
        }

        
        .dp-hero-content-dark {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 800px;
          margin: 0 auto 64px;
        }
        
        .dp-pill-badge-dark {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #e2e8f0;
          margin-bottom: 24px;
        }
        .dp-hero-content-dark h1 {
          font-family: var(--serif);
          font-size: clamp(3rem, 6vw, 5.5rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: #ffffff;
          margin: 0 0 24px;
          text-shadow: 0 4px 24px rgba(0,0,0,0.5);
        }
        .dp-hero-content-dark p {
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          color: #94a3b8;
          line-height: 1.6;
          margin: 0 auto 40px;
          max-width: 650px;
        }
        .dp-hero-actions {
          display: flex;
          justify-content: center;
        }
        
        .btn-primary-glow-dark {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #EF9F27, #d98a1a);
          color: #1a1a1a !important;
          padding: 18px 36px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 16px;
          text-decoration: none;
          box-shadow: 0 0 0 0 rgba(239, 159, 39, 0.7), 0 10px 30px rgba(239, 159, 39, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: pulse-glow 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }
        .btn-primary-glow-dark:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 0 4px rgba(239, 159, 39, 0.3), 0 15px 40px rgba(239, 159, 39, 0.5);
          animation: none;
        }
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(239, 159, 39, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239, 159, 39, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 159, 39, 0); }
        }

        .dp-glass-stats-dark {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 24px 56px;
          border-radius: 100px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          white-space: nowrap;
          z-index: 2;
        }
        .dp-glass-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .dp-glass-stat strong {
          font-family: var(--serif);
          font-size: 1.8rem;
          color: #EF9F27;
          line-height: 1.2;
        }
        .dp-glass-stat span {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #94a3b8;
        }
        .dp-glass-divider-dark {
          width: 1px;
          height: 32px;
          background: rgba(255,255,255,0.1);
          margin: 0 48px;
        }

        /* ── STICKY BAR ── */
        .dp-sticky-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid #e2e8f0;
          padding: 16px 0;
          z-index: 100;
          transform: translateY(-100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dp-sticky-bar.visible {
          transform: translateY(0);
        }
        .dp-sticky-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dp-sticky-title {
          font-weight: 700;
          font-size: 16px;
          color: #0f172a;
        }
        .dp-sticky-btn {
          background: #0F6E56;
          color: white !important;
          padding: 10px 20px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
        }

        /* ── COURSES SECTION ── */
        .dp-section { padding: 120px 0; }
        .dp-courses-bg { background: #fafafa; }
        
        .dp-section-header {
          text-align: center;
          margin-bottom: 80px;
        }
        .dp-section-header h2 {
          font-family: var(--serif);
          font-size: clamp(2.2rem, 4vw, 3rem);
          color: #0f172a;
          margin: 0 0 16px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .dp-section-header p {
          color: #64748b;
          font-size: 1.15rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .dp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 32px;
        }
        .dp-card {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 10px 15px -3px rgba(0, 0, 0, 0.02);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .dp-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 24px 48px -12px rgba(0, 0, 0, 0.06);
        }
        .dp-card-img {
          position: relative;
          height: 200px;
          background: #f1f5f9;
        }
        .dp-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .dp-card-tag {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(4px);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        
        .dp-card-content {
          padding: 32px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .dp-card-content h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 12px;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        .dp-card-desc {
          color: #64748b;
          font-size: 1rem;
          line-height: 1.6;
          margin: 0 0 24px;
        }
        
        .dp-metrics {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }
        .dp-metric {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          background: #f1f5f9;
          padding: 6px 12px;
          border-radius: 8px;
        }
        
        .dp-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 0 0 24px;
        }
        
        .dp-check-list {
          list-style: none;
          padding: 0;
          margin: 0 0 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .dp-check-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          color: #334155;
          line-height: 1.4;
        }
        .dp-check-list li svg { flex-shrink: 0; margin-top: 2px; }

        .dp-action-btn-liquid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          border: 1px solid rgba(0,0,0,0.1);
          color: #ffffff !important;
          font-weight: 600;
          font-size: 14px;
          border-radius: 12px;
          text-decoration: none;
          margin-top: auto;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
          position: relative;
          overflow: hidden;
        }
        .dp-action-btn-liquid::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        .dp-action-btn-liquid:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.2);
          background: linear-gradient(135deg, #0F6E56, #0A4A3A);
          border-color: #0F6E56;
        }
        .dp-action-btn-liquid:hover::after {
          transform: translateX(100%);
        }
        .dp-action-btn-liquid svg {
          transition: transform 0.3s ease;
        }
        .dp-action-btn-liquid:hover svg {
          transform: translateX(4px);
        }

        /* ── HOD BENTO SECTION ── */
        .dp-hod-bg {
          background: #ffffff;
          padding-top: 60px;
          padding-bottom: 120px;
        }
        .dp-bento-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .dp-bento-card {
          background: #f8fafc;
          border-radius: 32px;
          padding: 48px;
          border: 1px solid rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .dp-hod-card {
          flex-direction: row;
          align-items: center;
          gap: 32px;
          background: #ffffff;
          box-shadow: 0 20px 40px rgba(0,0,0,0.03);
        }
        .dp-hod-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #64748b;
        }
        .dp-hod-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #94a3b8;
          margin-bottom: 8px;
          display: block;
        }
        .dp-hod-info h3 {
          font-family: var(--serif);
          font-size: 1.8rem;
          color: #0f172a;
          margin: 0 0 12px;
        }
        .dp-hod-info p {
          color: #64748b;
          font-size: 1.05rem;
          line-height: 1.6;
          margin: 0;
        }

        .dp-cta-card {
          background: linear-gradient(135deg, #0f172a, #1e293b);
          color: white;
          text-align: center;
          align-items: center;
        }
        .dp-cta-card h3 {
          font-family: var(--serif);
          font-size: 2.2rem;
          margin: 0 0 16px;
        }
        .dp-cta-card p {
          color: #94a3b8;
          font-size: 1.1rem;
          margin: 0 0 32px;
          max-width: 400px;
        }
        .dp-cta-buttons {
          display: flex;
          gap: 16px;
        }
        .btn-solid-dark {
          background: #ffffff;
          color: #0f172a !important;
          padding: 14px 28px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          transition: transform 0.2s;
        }
        .btn-solid-dark:hover { transform: translateY(-2px); }
        .btn-outline {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: #ffffff !important;
          padding: 14px 28px;
          border-radius: 100px;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .btn-outline:hover { background: rgba(255,255,255,0.1); }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .dp-glass-stats-dark {
            bottom: -60px;
            padding: 16px 24px;
            width: 90%;
          }
          .dp-glass-divider-dark { margin: 0 20px; }
          .dp-bento-grid { grid-template-columns: 1fr; }
          .dp-hod-card { flex-direction: column; text-align: center; padding: 40px 24px; }
          .dp-hero-dark { padding: 100px 0 120px; }
        }
      `}</style>
    </div>
  );
}
