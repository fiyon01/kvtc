"use client";

import Link from 'next/link';
import { FadeIn } from './FadeIn';
import FacultyGrid from './FacultyGrid';
import { Target, Eye, Gem, ArrowRight, ShieldCheck, Wrench, Laptop, Utensils, Scissors, Lightbulb, Users, Shield, Heart, Sparkles } from 'lucide-react';

const leadership = [
  {
    name: 'Mr. James Kamau',
    title: 'Principal',
    img: '/principal.png',
    bio: 'A seasoned educator with over 20 years in technical and vocational training. Leads Kinoo VTC with a vision of excellence and community empowerment.',
    badge: '20+ Yrs Experience',
  },
  {
    name: 'Mrs. Grace Wanjiru',
    title: 'Deputy Principal',
    img: '/deputy.png',
    bio: 'Passionate about student welfare and academic quality. Oversees curriculum delivery and ensures every trainee receives the support they need to succeed.',
    badge: 'Curriculum Lead',
  },
];

const faculty = [
  { name: 'Mr. Peter Mwangi', dept: 'Head of Engineering', img: '/faculty1.png', courses: 'Electrical, Plumbing, Welding' },
  { name: 'Ms. Fatuma Otieno', dept: 'Head of Cosmetology', img: '/faculty2.png', courses: 'Hair Dressing, Beauty Therapy' },
  { name: 'Mr. Samuel Njoroge', dept: 'Head of ICT', img: '/faculty1.png', courses: 'Computer Operator, Packages, Security' },
  { name: 'Mrs. Alice Kariuki', dept: 'Head of Hospitality', img: '/faculty2.png', courses: 'Food & Beverage, Baking, Barista' },
];

const departments = [
  { slug: 'engineering', name: 'Engineering & Construction', icon: <Wrench size={24} />, desc: 'Electrical Wireman, Plumbing, Welding & Fabrication, Motor Vehicle Mechanics.', color: '#3b82f6' },
  { slug: 'short-course', name: 'ICT & Short Courses', icon: <Laptop size={24} />, desc: 'Computer Packages, Computer Operator, CCTV & Security Systems.', color: '#8b5cf6' },
  { slug: 'hospitality', name: 'Hospitality & Tourism', icon: <Utensils size={24} />, desc: 'Food & Beverage Production, Baking & Pastry, Barista, Caregiver/CNA.', color: '#ec4899' },
  { slug: 'cosmetology', name: 'Cosmetology', icon: <Scissors size={24} />, desc: 'Hair Dressing, Beauty Therapy, Nail Care & Salon Management.', color: '#10b981' },
  { slug: 'fashion', name: 'Fashion Design & Clothing', icon: <Gem size={24} />, desc: 'Garment Making, Pattern Drafting, Fashion Design & Boutique Management.', color: '#EF9F27' },
];

export default function About() {
  return (
    <div className="about-page">
      
      {/* 1. CINEMATIC DARK-MODE HERO */}
      <section className="abt-hero-dark">
        <div className="abt-hero-orbs">
          <div className="orb orb-green"></div>
          <div className="orb orb-gold"></div>
        </div>
        
        <div className="abt-hero-glass-container">
          <FadeIn>
            <div className="abt-pill-badge-dark">
              <Sparkles size={14} className="text-gold" />
              <span>Who We Are</span>
            </div>
            <h1 className="abt-title-dark">Empowering Kenya's Youth Through Skills.</h1>
            <p className="abt-subtitle-dark">
              We are a premier public institution committed to equipping trainees with practical, marketable skills that transform lives and build communities.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. THE STORY */}
      <section className="abt-story-section">
        <div className="abt-container abt-story-grid">
          <div className="abt-story-text">
            <FadeIn>
              <h2>Shaping Tomorrow's <br/><span className="text-green">Skilled Workforce</span></h2>
              <p>
                Founded in Kikuyu along the Nairobi-Nakuru highway, Kinoo Vocational Training Centre (Kinoo VTC) is a proud public institution operating under the <strong>County Government of Kiambu</strong>, Department of Education.
              </p>
              <p>
                We believe that every student deserves access to quality, hands-on education regardless of their background. We work closely with parents, industry partners, and our community to promote excellence, innovation, and character development.
              </p>
              <div className="abt-story-tags">
                <span className="tag tag-nita"><ShieldCheck size={16} /> NITA Registered</span>
                <span className="tag tag-knec"><ShieldCheck size={16} /> KNEC Exam Centre</span>
                <span className="tag tag-county"><ShieldCheck size={16} /> Kiambu County Gov.</span>
              </div>
            </FadeIn>
          </div>
          <div className="abt-story-visual">
            <FadeIn delay={0.2}>
              <div className="visual-img">
                <img src="/admissions_hero.png" alt="Students learning" />
              </div>
              <div className="visual-card">
                <div className="visual-stat">
                  <h3>17+</h3>
                  <span>Accredited Courses</span>
                </div>
                <div className="visual-divider" />
                <div className="visual-stat secondary">
                  <h3>100%</h3>
                  <span>Practical Training</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. PURPOSE & VALUES (DARK CINEMATIC BENTO) */}
      <section className="abt-purpose-section-dark">
        <div className="abt-container">
          
          {/* Mission & Vision Split */}
          <div className="purpose-split-dark">
            <FadeIn delay={0.1} className="purpose-card-dark mission-dark">
              <div className="purpose-glow-border"></div>
              <div className="purpose-content-dark">
                <div className="purpose-icon-dark"><Target size={32} /></div>
                <div>
                  <h3>Our Mission</h3>
                  <p>To equip trainees with practical, market-relevant skills that promote self-reliance, employment, and entrepreneurship in Kenya.</p>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2} className="purpose-card-dark vision-dark">
              <div className="purpose-glow-border gold"></div>
              <div className="purpose-content-dark">
                <div className="purpose-icon-dark gold"><Eye size={32} /></div>
                <div>
                  <h3>Our Vision</h3>
                  <p>To be a premier centre of excellence in vocational and technical training, producing highly skilled and globally competitive graduates.</p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Core Values Grid */}
          <div className="values-header-dark">
            <FadeIn>
              <h2>Our Core Values</h2>
              <p>The defining principles that guide our institution and shape our students' character.</p>
            </FadeIn>
          </div>

          <div className="values-grid-dark">
            {[
              { icon: <Gem />, title: 'Excellence', text: 'We strive for the highest standards in all our training modules.' },
              { icon: <Shield />, title: 'Integrity', text: 'Honesty and strong moral principles guide our actions and conduct.' },
              { icon: <Lightbulb />, title: 'Innovation', text: 'We embrace new technologies and creative problem-solving techniques.' },
              { icon: <Users />, title: 'Discipline', text: 'Building character is just as important as building practical skills.' },
              { icon: <Heart />, title: 'Inclusivity', text: 'Providing quality education that is accessible to all backgrounds.' },
            ].map((val, i) => (
              <FadeIn key={i} delay={i * 0.1} className="value-card-dark">
                <div className="value-icon-dark">{val.icon}</div>
                <h4>{val.title}</h4>
                <p>{val.text}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DEPARTMENTS - DARK CINEMATIC BENTO */}
      <section className="abt-depts-section-dark">
        <div className="abt-depts-orb abt-depts-orb-green"></div>
        <div className="abt-depts-orb abt-depts-orb-gold"></div>
        <div className="abt-container">
          <div className="section-header" style={{ marginBottom: '64px' }}>
            <FadeIn>
              <div className="abt-pill-badge-dark" style={{ margin: '0 auto 16px' }}>
                <span style={{ color: '#94a3b8' }}>Academics</span>
              </div>
              <h2 style={{ color: '#ffffff' }}>Our Departments</h2>
              <p className="header-desc" style={{ margin: '0 auto', color: '#94a3b8' }}>Specialized training faculties designed to meet the demands of Kenya's growing industries.</p>
            </FadeIn>
          </div>
          
          <div className="depts-grid-dark">
            {departments.map((dept, i) => (
              <Link href={`/departments/${dept.slug}`} key={i} className="dept-link-dark">
                <FadeIn delay={i * 0.1}>
                  <div className="dept-card-dark">
                    <div className="dept-card-glow" style={{ background: `linear-gradient(135deg, ${dept.color}99, transparent 60%)` }}></div>
                    <div className="dept-card-inner">
                      <div className="dept-icon-dark" style={{ color: dept.color, background: `${dept.color}20`, border: `1px solid ${dept.color}50` }}>
                        {dept.icon}
                      </div>
                      <h3>{dept.name}</h3>
                      <p>{dept.desc}</p>
                      <div className="dept-arrow-dark">
                        <span>View Courses</span> <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LEADERSHIP & FACULTY */}
      <section className="abt-team-section">
        <div className="abt-container">
          <div className="section-header center">
            <FadeIn>
              <h2>Our Management Team</h2>
              <p className="header-desc center" style={{ margin: '0 auto' }}>Experienced educators dedicated to your success and the growth of Kinoo VTC.</p>
            </FadeIn>
          </div>
          
          <div className="team-grid">
            {leadership.map((person, i) => (
              <FadeIn key={i} delay={i * 0.1} className="team-profile">
                <div className="profile-img-wrapper">
                  <img src={person.img} alt={person.name} />
                </div>
                <div className="profile-info">
                  <span className="profile-badge">{person.badge}</span>
                  <h3>{person.name}</h3>
                  <span className="profile-title">{person.title}</span>
                  <p>{person.bio}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="faculty-divider">
            <FadeIn>
              <h3>Department Heads</h3>
              <p>Industry-experienced trainers who bring real-world knowledge into every classroom.</p>
            </FadeIn>
          </div>
          <FacultyGrid faculty={faculty} />
        </div>
      </section>

      {/* 6. CTA / IMPACT */}
      <section className="abt-cta-section">
        <div className="abt-container abt-cta-content">
          <FadeIn>
            <h2>Ready to Join Our Community?</h2>
            <p>Applications are currently open. Secure your spot today and start building a career you can be proud of.</p>
            <div className="abt-cta-actions">
              <Link href="/admissions" className="btn-solid-gold">Apply Now <ArrowRight size={18} /></Link>
              <Link href="/courses" className="btn-outline-light">Browse Courses</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <style jsx>{`
        .about-page {
          font-family: var(--sans);
          background: #ffffff;
          color: #0f172a;
        }

        /* Generic Section Classes */
        .abt-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .section-header { margin-bottom: 64px; text-align: center; }
        .section-header h2 {
          font-family: var(--serif);
          font-size: clamp(2.2rem, 4vw, 3rem);
          color: #0f172a;
          margin: 0 0 16px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .header-desc {
          color: #64748b;
          font-size: 1.15rem;
          line-height: 1.6;
          max-width: 600px;
        }
        .text-gold { color: #EF9F27; }
        .text-green { color: #0F6E56; font-style: italic; }

        /* ── 1. CINEMATIC DARK-MODE HERO ── */
        .abt-hero-dark {
          position: relative;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 160px 24px 80px;
          overflow: hidden;
          background: #06090e; /* Deep rich dark background */
        }
        
        .abt-hero-orbs {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 0;
        }
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.4;
          animation: float 10s infinite ease-in-out alternate;
        }
        .orb-green {
          background: #0F6E56;
          width: 50vw;
          height: 50vw;
          top: -10%;
          left: -10%;
        }
        .orb-gold {
          background: #EF9F27;
          width: 40vw;
          height: 40vw;
          bottom: -10%;
          right: -10%;
          animation-delay: -5s;
        }
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(10%, 10%) scale(1.1); }
        }

        .abt-hero-glass-container {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 900px;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 80px 40px;
          border-radius: 40px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        
        .abt-pill-badge-dark {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #e2e8f0;
          margin-bottom: 24px;
        }
        .abt-title-dark {
          font-family: var(--serif);
          font-size: clamp(2.5rem, 6vw, 4.8rem);
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 24px;
          letter-spacing: -0.04em;
          color: #ffffff;
          text-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .abt-subtitle-dark {
          font-size: clamp(1.1rem, 2vw, 1.25rem);
          color: #94a3b8;
          line-height: 1.7;
          max-width: 650px;
          margin: 0 auto;
        }

        /* ── 2. THE STORY ── */
        .abt-story-section {
          padding: 120px 0;
          background: #ffffff;
        }
        .abt-story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .abt-story-text h2 {
          font-family: var(--serif);
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          color: #0f172a;
          line-height: 1.1;
          margin-bottom: 32px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .abt-story-text p {
          color: #475569;
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 24px;
        }
        .abt-story-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 40px;
        }
        .tag {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #0f172a;
        }
        .tag-nita { border-color: #bbf7d0; background: #f0fdf4; color: #166534; }
        .tag-knec { border-color: #fef08a; background: #fefce8; color: #854d0e; }
        .tag-county { border-color: #bfdbfe; background: #eff6ff; color: #1e40af; }
        
        .abt-story-visual {
          position: relative;
        }
        .visual-card {
          position: absolute;
          bottom: -40px;
          left: -40px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.6);
          padding: 24px 40px;
          border-radius: 100px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          z-index: 2;
        }
        .visual-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .visual-stat h3 {
          font-family: var(--serif);
          font-size: 2.2rem;
          color: #0F6E56;
          margin: 0 0 4px;
          line-height: 1;
        }
        .visual-stat span {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 1px;
        }
        .visual-divider { width: 1px; height: 32px; background: #e2e8f0; margin: 0 32px; }
        .visual-stat.secondary h3 { color: #EF9F27; }
        
        .visual-img {
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0,0,0,0.05);
          aspect-ratio: 4/5;
        }
        .visual-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ── 3. PURPOSE & VALUES (DARK CINEMATIC) ── */
        .abt-purpose-section-dark {
          padding: 120px 0;
          background: #06090e;
          position: relative;
          color: white;
        }
        
        .purpose-split-dark {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 100px;
          position: relative;
        }
        
        .purpose-card-dark {
          position: relative;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 32px;
          padding: 2px; /* for glow border */
          box-shadow: 0 24px 48px rgba(0,0,0,0.4);
          overflow: hidden;
        }
        
        .purpose-glow-border {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(15,110,86,1), rgba(15,110,86,0.1) 40%, transparent 60%);
          z-index: 0;
          opacity: 0.8;
          border-radius: 32px;
        }
        .purpose-glow-border.gold {
          background: linear-gradient(135deg, rgba(239,159,39,1), rgba(239,159,39,0.1) 40%, transparent 60%);
        }

        .purpose-content-dark {
          position: relative;
          background: #0f172a;
          border-radius: 30px;
          padding: 48px;
          display: flex;
          gap: 24px;
          align-items: flex-start;
          height: 100%;
          z-index: 1;
        }

        .purpose-icon-dark {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: rgba(15,110,86,0.15);
          border: 1px solid rgba(15,110,86,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0F6E56;
          flex-shrink: 0;
        }
        .purpose-icon-dark.gold {
          background: rgba(239,159,39,0.15);
          border-color: rgba(239,159,39,0.3);
          color: #EF9F27;
        }
        
        .purpose-content-dark h3 {
          font-family: var(--serif);
          font-size: 1.8rem;
          color: #ffffff;
          margin: 0 0 12px;
        }
        .purpose-content-dark p {
          color: #94a3b8;
          font-size: 1.1rem;
          line-height: 1.7;
          margin: 0;
        }

        .values-header-dark {
          text-align: center;
          margin-bottom: 48px;
          position: relative;
          z-index: 1;
        }
        .values-header-dark h2 {
          font-family: var(--serif);
          font-size: clamp(2.2rem, 4vw, 3rem);
          color: #ffffff;
          margin: 0 0 16px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .values-header-dark p {
          color: #94a3b8;
          font-size: 1.15rem;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .values-grid-dark {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          position: relative;
          z-index: 1;
        }
        .value-card-dark {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(12px);
          padding: 32px;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.05);
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .value-card-dark:hover {
          transform: translateY(-4px);
          border-color: rgba(239,159,39,0.3);
          background: rgba(15, 23, 42, 0.7);
        }
        .value-icon-dark {
          color: #EF9F27;
          margin-bottom: 20px;
        }
        .value-card-dark h4 {
          font-size: 1.2rem;
          color: #ffffff;
          margin: 0 0 12px;
        }
        .value-card-dark p {
          color: #94a3b8;
          font-size: 1rem;
          line-height: 1.6;
          margin: 0;
        }

        /* ── Generic Styles for the rest (unchanged) ── */
        .abt-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 24px;
        }

        /* 4. Dark Departments Bento */
        .abt-depts-section-dark {
          padding: 120px 0;
          background: #06090e;
          position: relative;
          overflow: hidden;
        }
        .abt-depts-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.2;
          pointer-events: none;
        }
        .abt-depts-orb-green {
          background: #0F6E56;
          width: 40vw;
          height: 40vw;
          top: -5%;
          right: -5%;
        }
        .abt-depts-orb-gold {
          background: #EF9F27;
          width: 30vw;
          height: 30vw;
          bottom: -5%;
          left: 5%;
        }
        .depts-grid-dark {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          position: relative;
          z-index: 1;
        }
        .dept-link-dark { text-decoration: none; }
        .dept-card-dark {
          position: relative;
          padding: 1.5px;
          border-radius: 24px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        .dept-card-dark:hover { transform: translateY(-6px); }
        .dept-card-glow {
          position: absolute;
          inset: 0;
          opacity: 0.8;
          z-index: 0;
        }
        .dept-card-inner {
          position: relative;
          background: #0d1117;
          border-radius: 23px;
          padding: 36px;
          z-index: 1;
          display: flex;
          flex-direction: column;
          min-height: 220px;
        }
        .dept-icon-dark {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          flex-shrink: 0;
        }
        .dept-card-inner h3 {
          font-size: 1.1rem;
          color: #ffffff;
          margin: 0 0 10px;
          font-weight: 700;
        }
        .dept-card-inner p {
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 24px;
          flex-grow: 1;
        }
        .dept-arrow-dark {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #EF9F27;
          font-size: 13px;
          font-weight: 700;
        }


        .abt-team-section { padding: 120px 0; background: #fafafa; }
        .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 40px; margin-bottom: 100px; }
        .team-profile { background: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 24px 48px -12px rgba(0, 0, 0, 0.04); border: 1px solid rgba(0,0,0,0.04); display: flex; flex-direction: column; }
        .profile-img-wrapper { height: 320px; background: #f1f5f9; }
        .profile-img-wrapper img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
        .profile-info { padding: 40px; }
        .profile-badge { display: inline-block; background: #E1F5EE; color: #0F6E56; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px; }
        .profile-info h3 { font-family: var(--serif); font-size: 1.8rem; color: #0f172a; margin: 0 0 8px; }
        .profile-title { display: block; color: #64748b; font-weight: 600; font-size: 14px; margin-bottom: 20px; }
        .profile-info p { color: #475569; font-size: 1.05rem; line-height: 1.7; margin: 0; }

        .faculty-divider { text-align: center; margin-bottom: 48px; padding-top: 40px; }
        .faculty-divider h3 { font-family: var(--serif); font-size: 2rem; color: #0f172a; margin: 0 0 12px; font-weight: 800; }
        .faculty-divider p { color: #64748b; font-size: 1.1rem; }

        .abt-cta-section { background: linear-gradient(135deg, #0f172a, #1e293b); padding: 140px 24px; text-align: center; color: #fff; }
        .abt-cta-content { max-width: 800px; margin: 0 auto; }
        .abt-cta-content h2 { font-family: var(--serif); font-size: clamp(2.5rem, 5vw, 4rem); margin: 0 0 24px; font-weight: 800; line-height: 1.1; color: #fff; letter-spacing: -0.03em; }
        .abt-cta-content p { font-size: 1.2rem; color: rgba(255,255,255,0.7); margin: 0 auto 48px; max-width: 600px; line-height: 1.6; }
        .abt-cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .btn-solid-gold { display: inline-flex; align-items: center; gap: 10px; background: #EF9F27; color: #1a1a1a !important; padding: 16px 32px; border-radius: 100px; font-weight: 700; font-size: 16px; box-shadow: 0 10px 30px rgba(239, 159, 39, 0.3); text-decoration: none; transition: all 0.2s ease; }
        .btn-solid-gold:hover { transform: translateY(-2px); box-shadow: 0 15px 40px rgba(239, 159, 39, 0.4); }
        .btn-outline-light { display: inline-flex; align-items: center; background: transparent; color: #fff !important; border: 1px solid rgba(255,255,255,0.2); padding: 16px 32px; border-radius: 100px; font-weight: 600; font-size: 16px; text-decoration: none; transition: background 0.2s ease; }
        .btn-outline-light:hover { background: rgba(255,255,255,0.1); }

        /* Mobile Adjustments */
        @media (max-width: 900px) {
          .abt-hero-glass-container { padding: 40px 24px; margin: 0 16px; }
          .abt-hero-dark { padding: 120px 0 60px; }
          .abt-story-grid { grid-template-columns: 1fr; gap: 64px; }
          .purpose-split-dark { grid-template-columns: 1fr; }
          .purpose-content-dark { padding: 32px 24px; flex-direction: column; }
          .visual-card { bottom: -30px; left: 50%; transform: translateX(-50%); width: 90%; padding: 20px 32px; }
          .visual-stat h3 { font-size: 1.8rem; }
        }
      `}</style>
    </div>
  );
}
