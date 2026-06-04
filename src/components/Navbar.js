"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BANNER_HEIGHT = 46; // must match TopBanner.js

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Restore dismissed state from session
    if (sessionStorage.getItem('topBannerDismissed')) {
      setBannerVisible(false);
    }
    const onDismiss = () => setBannerVisible(false);
    window.addEventListener('topBannerDismissed', onDismiss);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('topBannerDismissed', onDismiss);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navTop = bannerVisible ? `${BANNER_HEIGHT}px` : '0px';

  const links = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Departments', href: '#', isDropdown: true, sublinks: [
      { name: 'Hospitality', href: '/departments/hospitality' },
      { name: 'Cosmetology', href: '/departments/cosmetology' },
      { name: 'Engineering', href: '/departments/engineering' },
      { name: 'Fashion', href: '/departments/fashion' },
      { name: 'Short Courses', href: '/departments/short-course' }
    ]},
    { name: 'Courses', href: '/courses' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Admissions', href: '/admissions' },
    { name: 'Contact', href: '/contact' },
  ];

  const phoneNumber = '+254113582008';

  return (
    <>
      <nav style={{
        position: 'fixed', top: navTop, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        padding: '0 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '70px',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.1)' : 'none',
        transition: 'box-shadow 0.3s, top 0.3s',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '10px',
            background: '#0F6E56',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700,
          }}>KV</div>
          <div style={{ lineHeight: 1.2 }}>
            <strong style={{ display: 'block', fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }}>Kinoo VTC</strong>
            <span style={{ fontSize: '11px', color: '#888', letterSpacing: '0.5px' }}>Kiambu County</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <ul style={{ display: 'flex', gap: '28px', listStyle: 'none', margin: 0, padding: 0 }} className="nav-desktop-ul">
          {links.map(l => (
            <li key={l.name} style={{ position: 'relative' }} className={l.isDropdown ? 'nav-dropdown-wrapper' : ''}>
              {l.isDropdown ? (
                <div style={{
                  cursor: 'pointer',
                  color: '#555',
                  fontSize: '14px', fontWeight: 500,
                  paddingBottom: '4px',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  transition: 'color 0.2s',
                }}>
                  {l.name}
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              ) : (
                <Link href={l.href} style={{
                  textDecoration: 'none',
                  color: pathname === l.href ? '#0F6E56' : '#555',
                  fontSize: '14px', fontWeight: 500,
                  borderBottom: pathname === l.href ? '2px solid #0F6E56' : '2px solid transparent',
                  paddingBottom: '4px',
                  transition: 'color 0.2s',
                }}>{l.name}</Link>
              )}

              {l.isDropdown && (
                <div className="nav-dropdown-menu" style={{
                  position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                  background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)', minWidth: '220px',
                  padding: '12px', opacity: 0, visibility: 'hidden', transition: 'all 0.2s ease', zIndex: 10
                }}>
                  <div style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '12px', height: '12px', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.08)', borderLeft: '1px solid rgba(0,0,0,0.08)' }} />
                  {l.sublinks.map(s => (
                    <Link key={s.href} href={s.href} style={{
                      display: 'block', padding: '10px 16px', color: '#1a1a1a',
                      textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                      borderRadius: '8px', transition: 'background 0.2s',
                    }} className="dropdown-link">
                      {s.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <style>{`
          .nav-dropdown-wrapper:hover .nav-dropdown-menu {
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateX(-50%) translateY(8px) !important;
          }
          .dropdown-link:hover {
            background: #E1F5EE;
            color: #0F6E56 !important;
          }
        `}</style>

        <div className="nav-cta-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a href={`tel:${phoneNumber}`} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: '#0F6E56', fontWeight: 600, fontSize: '13px', textDecoration: 'none',
            border: '1.5px solid #0F6E56', padding: '8px 14px', borderRadius: '8px',
          }}>Call Us</a>
          <Link href="/prospectus" style={{
            color: '#555', fontWeight: 500, fontSize: '13px', textDecoration: 'none',
            border: '1.5px solid rgba(0,0,0,0.12)', padding: '8px 14px', borderRadius: '8px',
          }}>Prospectus</Link>
          <Link href="/apply" style={{
            background: '#0F6E56', color: '#fff',
            padding: '10px 22px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
            textDecoration: 'none',
          }}>Apply Now</Link>
        </div>

        {/* Hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{
          display: 'none', flexDirection: 'column', gap: '5px', cursor: 'pointer',
          background: 'none', border: 'none', padding: '4px',
        }} className="hamburger-btn" aria-label="Toggle menu">
          <span style={{ width: '24px', height: '2px', background: '#1a1a1a', display: 'block', borderRadius: '2px', transition: '0.3s', transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none' }}></span>
          <span style={{ width: '24px', height: '2px', background: '#1a1a1a', display: 'block', borderRadius: '2px', opacity: mobileOpen ? 0 : 1, transition: '0.3s' }}></span>
          <span style={{ width: '24px', height: '2px', background: '#1a1a1a', display: 'block', borderRadius: '2px', transition: '0.3s', transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }}></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1001,
          background: '#fff',
          display: 'flex', flexDirection: 'column',
          padding: `${BANNER_HEIGHT + 90}px 32px 32px`,
          gap: '24px',
          overflowY: 'auto',
        }}>
          <button onClick={() => setMobileOpen(false)} style={{
            position: 'absolute', top: `${BANNER_HEIGHT + 20}px`, right: '24px',
            background: 'rgba(0,0,0,0.05)', borderRadius: '50%', border: 'none', width: '44px', height: '44px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          {links.map(l => (
            <div key={l.name || l.href} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {l.isDropdown ? (
                <>
                  <Link href="/departments" onClick={() => setMobileOpen(false)} style={{
                    fontSize: '18px', textDecoration: 'none', fontWeight: 500, color: '#1a1a1a',
                  }}>{l.name}</Link>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '16px', borderLeft: '2px solid rgba(0,0,0,0.06)' }}>
                    {l.sublinks.map(s => (
                      <Link key={s.href} href={s.href} onClick={() => setMobileOpen(false)} style={{
                        fontSize: '15px', textDecoration: 'none', fontWeight: 500, color: pathname === s.href ? '#0F6E56' : '#555',
                      }}>{s.name}</Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link href={l.href} onClick={() => setMobileOpen(false)} style={{
                  fontSize: '18px', textDecoration: 'none', fontWeight: 500,
                  color: pathname === l.href ? '#0F6E56' : '#1a1a1a',
                }}>{l.name}</Link>
              )}
            </div>
          ))}
          <Link href="/prospectus" onClick={() => setMobileOpen(false)} style={{
            color: '#0F6E56', fontSize: '18px', textDecoration: 'none', fontWeight: 500,
            borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '16px',
          }}>Download Prospectus</Link>
          <a href={`tel:${phoneNumber}`} style={{
            color: '#1a1a1a', fontSize: '18px', textDecoration: 'none', fontWeight: 500,
            borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '16px',
          }}>Call 0113 582 008</a>
          <Link href="/apply" onClick={() => setMobileOpen(false)} style={{
            background: '#0F6E56', color: '#fff', textAlign: 'center',
            padding: '16px', borderRadius: '10px', textDecoration: 'none', fontWeight: 600,
          }}>Apply Now</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 1050px) {
          .nav-desktop-ul { display: none !important; }
          .nav-cta-btn { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (min-width: 1051px) {
          .hamburger-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
