import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-badge animate-fade-up">
            <span className="dot"></span> Intake Ongoing – 2026
          </div>
          <h1 className="animate-fade-up animate-delay-1">
            Build Skills.<br />
            Build <span className="text-gold">Your Future.</span>
          </h1>
          <p className="hero-subtitle animate-fade-up animate-delay-2">
            Kiambu County's premier public vocational training centre offering NITA & KNEC-certified courses in 13+ technical disciplines. Affordable. Practical. Life-changing.
          </p>
          <div className="hero-actions animate-fade-up animate-delay-3">
            <Link href="/courses" className="btn-gold">Explore Courses</Link>
            <Link href="/contact" className="btn-outline">Apply Now →</Link>
          </div>
          
          <div className="hero-stats animate-fade-up animate-delay-3">
            <div className="stat-item">
              <strong>13+</strong>
              <span>Courses Offered</span>
            </div>
            <div className="stat-separator"></div>
            <div className="stat-item">
              <strong>KSh 27K</strong>
              <span>Annual Fees</span>
            </div>
            <div className="stat-separator"></div>
            <div className="stat-item">
              <strong>NITA & KNEC</strong>
              <span>Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US SECTION */}
      <section className="section why-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="tag">Why Kinoo VTC</span>
            <h2>The Kinoo Advantage</h2>
            <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
              We combine government backing, experienced instructors, and hands-on training to deliver outcomes that matter in the real world.
            </p>
          </div>

          <div className="features-grid">
            <div className="card feature-card glass">
              <div className="feature-icon">🎖️</div>
              <h3>Nationally Accredited</h3>
              <p className="text-muted">All programmes are certified by NITA and KNEC, ensuring your qualification is recognised nationally across Kenya.</p>
            </div>
            <div className="card feature-card glass">
              <div className="feature-icon">💰</div>
              <h3>Highly Subsidised</h3>
              <p className="text-muted">As a public institution, we keep fees affordable. Full-year training costs just KSh 27,000.</p>
            </div>
            <div className="card feature-card glass">
              <div className="feature-icon">🔧</div>
              <h3>Practical Training</h3>
              <p className="text-muted">Learn by doing in fully equipped workshops that simulate real-world professional environments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED COURSES SECTION */}
      <section className="section courses-section">
        <div className="container">
          <div className="section-header flex-between">
            <div>
              <span className="tag">Programmes</span>
              <h2>Discover Our Courses</h2>
            </div>
            <Link href="/courses" className="btn-outline">View All Courses</Link>
          </div>

          <div className="courses-grid">
            <div className="card course-card">
              <div className="course-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80)' }}></div>
              <div className="course-body">
                <span className="course-tag">Engineering</span>
                <h3>Electrical and Electronics</h3>
                <p className="text-muted">Grade 3 NITA Certification. Learn domestic and industrial wiring, fault finding, and equipment repair.</p>
                <div className="course-meta">
                  <span>⏱️ 1 Year</span>
                  <span>🎓 NITA</span>
                </div>
              </div>
            </div>

            <div className="card course-card">
              <div className="course-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556910103-1c02745a872f?w=800&q=80)' }}></div>
              <div className="course-body">
                <span className="course-tag">Hospitality</span>
                <h3>Food & Beverage Production</h3>
                <p className="text-muted">Grade 3 KNEC Artisan. Master culinary arts, baking, pastry, and professional service.</p>
                <div className="course-meta">
                  <span>⏱️ 1 Year</span>
                  <span>🎓 KNEC</span>
                </div>
              </div>
            </div>

            <div className="card course-card">
              <div className="course-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80)' }}></div>
              <div className="course-body">
                <span className="course-tag">Beauty</span>
                <h3>Hair Dressing & Beauty Therapy</h3>
                <p className="text-muted">Grade 3 NITA. Comprehensive training in cosmetology, salon management, and advanced styling.</p>
                <div className="course-meta">
                  <span>⏱️ 1 Year</span>
                  <span>🎓 NITA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box glass">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join hundreds of successful graduates who started their careers at Kinoo VTC. Intake for 2026 is currently ongoing.</p>
            <div className="cta-actions">
              <Link href="/contact" className="btn-primary">Apply Now</Link>
              <Link href="/admissions" className="btn-outline">View Fee Structure</Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 80px;
          background: url('https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=1600&q=80') center/cover no-repeat fixed;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(10,10,10,0.9) 0%, rgba(15,110,86,0.7) 100%);
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 32px;
          backdrop-filter: blur(8px);
        }
        .hero-badge .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 10px #4ade80;
        }
        .hero h1 {
          font-size: clamp(3rem, 6vw, 5rem);
          margin-bottom: 24px;
        }
        .hero-subtitle {
          font-size: 1.15rem;
          color: rgba(255,255,255,0.8);
          margin-bottom: 40px;
          max-width: 600px;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 60px;
        }
        .hero-stats {
          display: flex;
          gap: 32px;
          align-items: center;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 32px;
        }
        .stat-item strong {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: var(--gold);
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-item span {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.6);
        }
        .stat-separator {
          width: 1px;
          height: 40px;
          background: rgba(255,255,255,0.1);
        }

        .section-header {
          margin-bottom: 60px;
        }
        .text-center {
          text-align: center;
        }
        .flex-between {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 24px;
        }
        .tag {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--green-light);
          margin-bottom: 16px;
        }
        .section-header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin-bottom: 16px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }
        .feature-card {
          padding: 40px;
          text-align: center;
        }
        .feature-icon {
          font-size: 3rem;
          margin-bottom: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: rgba(15, 110, 86, 0.1);
          border-radius: 20px;
        }
        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 16px;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
        }
        .course-img {
          height: 240px;
          background-size: cover;
          background-position: center;
          transition: transform 0.5s ease;
        }
        .course-card:hover .course-img {
          transform: scale(1.05);
        }
        .course-body {
          padding: 30px;
          background: var(--surface);
          position: relative;
          z-index: 2;
        }
        .course-tag {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--gold);
          margin-bottom: 12px;
          display: inline-block;
        }
        .course-body h3 {
          font-size: 1.25rem;
          margin-bottom: 12px;
        }
        .course-meta {
          display: flex;
          gap: 20px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-main);
        }

        .cta-section {
          padding-top: 40px;
        }
        .cta-box {
          padding: 80px 40px;
          text-align: center;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(15,110,86,0.2) 0%, rgba(212,175,55,0.1) 100%);
        }
        .cta-box h2 {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }
        .cta-box p {
          color: var(--text-muted);
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto 40px;
        }
        .cta-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .hero-actions {
            flex-direction: column;
          }
          .hero-stats {
            flex-wrap: wrap;
            gap: 20px;
          }
          .stat-separator {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
