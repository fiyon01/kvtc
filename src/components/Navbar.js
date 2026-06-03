"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Admissions & Fees', path: '/admissions' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <Link href="/" className="nav-brand" onClick={closeMenu}>
            <Image src="/logo.png" alt="KVTC Logo" width={40} height={40} className="brand-logo" />
            <div className="brand-text">
              <strong>Kinoo VTC</strong>
              <span>Kiambu County</span>
            </div>
          </Link>

          <div className="nav-desktop">
            <ul className="nav-links">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    href={link.path} 
                    className={pathname === link.path ? 'active' : ''}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn-primary nav-cta">Apply Now</Link>
          </div>

          <button 
            className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path} 
              className={pathname === link.path ? 'active' : ''}
              onClick={closeMenu}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/contact" className="btn-gold mobile-cta" onClick={closeMenu}>
            Apply Now
          </Link>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
          padding: 24px 0;
          background: transparent;
        }
        .navbar.scrolled {
          background: rgba(10, 10, 10, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 16px 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          border-bottom: 1px solid var(--border);
        }
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .brand-logo {
          border-radius: 8px;
        }
        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .brand-text strong {
          color: #fff;
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
        }
        .brand-text span {
          color: var(--gold);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .nav-desktop {
          display: flex;
          align-items: center;
          gap: 40px;
        }
        .nav-links {
          display: flex;
          list-style: none;
          gap: 32px;
        }
        .nav-links a {
          color: var(--text-muted);
          font-size: 0.95rem;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .nav-links a:hover, .nav-links a.active {
          color: var(--gold);
        }
        .nav-cta {
          padding: 12px 24px;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 1001;
        }
        .hamburger span {
          display: block;
          width: 28px;
          height: 2px;
          background: #fff;
          transition: all 0.3s ease;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

        .mobile-menu {
          position: fixed;
          inset: 0;
          background: rgba(10, 10, 10, 0.98);
          backdrop-filter: blur(20px);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .mobile-menu.open {
          opacity: 1;
          pointer-events: all;
        }
        .mobile-menu-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          text-align: center;
        }
        .mobile-menu-inner a {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: var(--text-muted);
          transition: color 0.2s;
        }
        .mobile-menu-inner a.active, .mobile-menu-inner a:hover {
          color: var(--gold);
        }
        .mobile-cta {
          margin-top: 20px;
          font-family: 'Inter', sans-serif !important;
          font-size: 1.1rem !important;
        }

        @media (max-width: 900px) {
          .nav-desktop { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>
    </>
  );
}
