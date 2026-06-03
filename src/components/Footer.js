import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 style={{ marginBottom: '16px', color: '#fff' }}>Kinoo VTC</h3>
            <p className="text-muted" style={{ marginBottom: '24px', maxWidth: '300px' }}>
              Kiambu County's premier public vocational training centre offering NITA & KNEC-certified courses.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="TikTok">TT</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/courses">Programmes</Link></li>
              <li><Link href="/admissions">Admissions</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Programmes</h4>
            <ul>
              <li><Link href="/courses">Artisan Courses</Link></li>
              <li><Link href="/courses">NITA Grade 3</Link></li>
              <li><Link href="/courses">Short Courses</Link></li>
              <li><Link href="/courses">Computer Packages</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <ul className="contact-list">
              <li>📍 P.O. Box 351-00902, Kikuyu</li>
              <li>📞 0113 582 008 / 0748 455 116</li>
              <li>✉️ kinoovtc@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Kinoo Vocational Training Centre. All rights reserved.</p>
          <p>County Government of Kiambu</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: #050606;
          padding: 80px 0 40px;
          border-top: 1px solid var(--border);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 40px;
          margin-bottom: 60px;
        }
        .footer-col h4 {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: #fff;
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .footer-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-col a, .contact-list li {
          color: var(--text-muted);
          font-size: 0.95rem;
          transition: color 0.2s ease;
        }
        .footer-col a:hover {
          color: var(--gold);
        }
        .social-links {
          display: flex;
          gap: 16px;
        }
        .social-links a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--surface-alt);
          color: var(--gold);
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s ease;
          border: 1px solid var(--border);
        }
        .social-links a:hover {
          background: var(--gold);
          color: #000;
          transform: translateY(-3px);
        }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 32px;
          border-top: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
