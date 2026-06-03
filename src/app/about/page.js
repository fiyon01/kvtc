import Image from 'next/image';

export const metadata = {
  title: "About Us | Kinoo VTC",
  description: "Learn about Kinoo Vocational Training Centre, our history, mission, and our commitment to providing quality skills for life in Kiambu County.",
};

export default function About() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="animate-fade-up">About Kinoo VTC</h1>
          <p className="page-subtitle animate-fade-up animate-delay-1">Shaping Tomorrow's Skilled Workforce</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-content animate-fade-up">
              <span className="tag">Our Story</span>
              <h2>A Legacy of Excellence in Technical Training</h2>
              <p className="text-muted" style={{ marginBottom: '20px' }}>
                Kinoo Vocational Training Centre (Kinoo VTC) is a public institution under the <strong>County Government of Kiambu</strong>, Department of Education, Gender, Culture & Social Services. Located in Kikuyu along the Nairobi-Nakuru highway, we are committed to equipping our trainees with practical skills that open doors in Kenya's rapidly growing economy.
              </p>
              <p className="text-muted" style={{ marginBottom: '30px' }}>
                We work closely with parents, students, staff, and management as partners to promote excellence and innovativeness. We prepare trainees for the real world of work, instilling strong values of discipline, good conduct, and character.
              </p>
              
              <ul className="feature-list">
                <li>
                  <span className="check">✓</span>
                  <span>Practical, hands-on training in fully equipped workshops.</span>
                </li>
                <li>
                  <span className="check">✓</span>
                  <span>Nationally recognised certificates: KNEC Artisan & NITA Grade 3.</span>
                </li>
                <li>
                  <span className="check">✓</span>
                  <span>Highly subsidised government fees for all.</span>
                </li>
                <li>
                  <span className="check">✓</span>
                  <span>Short-term courses (1–3 months) for quick skills acquisition.</span>
                </li>
              </ul>
            </div>
            
            <div className="about-image-wrapper animate-fade-up animate-delay-2">
              <div className="about-img glass">
                <div style={{ width: '100%', height: '400px', backgroundImage: 'url(https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '16px' }}></div>
              </div>
              <div className="floating-card glass">
                <strong className="text-gold" style={{ fontSize: '2rem', display: 'block' }}>2026</strong>
                <span className="text-muted" style={{ fontSize: '0.9rem', textTransform: 'uppercase' }}>Intake Open</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          padding: 160px 0 80px;
          background: linear-gradient(135deg, rgba(15,110,86,0.1) 0%, rgba(10,10,10,1) 100%);
          border-bottom: 1px solid var(--border);
          text-align: center;
        }
        .page-header h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin-bottom: 16px;
        }
        .page-subtitle {
          color: var(--gold);
          font-size: 1.2rem;
          font-family: 'Playfair Display', serif;
          font-style: italic;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
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
        .about-content h2 {
          font-size: clamp(2rem, 3vw, 2.5rem);
          margin-bottom: 24px;
        }
        
        .feature-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .feature-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: var(--text-main);
        }
        .check {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: rgba(15, 110, 86, 0.2);
          color: var(--green-light);
          border-radius: 50%;
          font-size: 0.8rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .about-image-wrapper {
          position: relative;
        }
        .about-img {
          padding: 16px;
          border-radius: 24px;
        }
        .floating-card {
          position: absolute;
          bottom: -20px;
          right: -20px;
          padding: 24px 32px;
          border-radius: 16px;
          text-align: center;
          animation: float 4s ease-in-out infinite;
        }

        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>
    </>
  );
}
