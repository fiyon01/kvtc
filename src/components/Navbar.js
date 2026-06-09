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
  const desktopLinks = [
    { name: 'About', href: '/about' },
    links.find(link => link.name === 'Departments'),
    { name: 'Courses', href: '/courses' },
    { name: 'Admissions', href: '/admissions' },
    { name: 'Contact', href: '/contact' },
    {
      name: 'More',
      href: '#',
      isDropdown: true,
      sublinks: [
        { name: 'Blog', href: '/blog' },
        { name: 'FAQs', href: '/faqs' },
        { name: 'Prospectus', href: '/prospectus' },
      ],
    },
  ];

  const phoneNumber = '+254113582008';

  return (
    <>
      <nav style={{
        position: 'fixed', top: navTop, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '2px solid rgba(47,121,183,0.16)',
        padding: '0 clamp(24px, 4vw, 64px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '70px',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.1)' : 'none',
        transition: 'box-shadow 0.3s, top 0.3s',
      }}>
        <Link href="/" aria-label="Kinoo Vocational Training Centre home" className="nav-brand-lockup" style={{
          display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none',
          height: '54px', padding: '4px 10px 4px 7px', borderRadius: '14px',
          border: '1px solid rgba(47,121,183,0.13)',
          background: 'linear-gradient(135deg, rgba(47,121,183,0.06), rgba(15,110,86,0.035))',
        }}>
          <span style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <img
              src="/kvtc_logo.png"
              alt="KVTC"
              className="kvtc-logo-crop"
              style={{ height: '47px', width: '47px', transform: 'translateY(-2px) scale(1.08)' }}
            />
          </span>
          <span aria-hidden="true" style={{
            width: '1px', height: '32px', flexShrink: 0,
            background: 'linear-gradient(180deg, transparent, rgba(47,121,183,0.42), rgba(15,110,86,0.42), transparent)',
          }} />
          <span style={{ width: '45px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <img src="/cgok-logo.png" alt="County Government of Kiambu" style={{ height: '43px', width: '43px', objectFit: 'contain' }} />
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul style={{ display: 'flex', gap: 'clamp(16px, 1.7vw, 26px)', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }} className="nav-desktop-ul">
          {desktopLinks.map(l => (
            <li key={l.name} style={{ position: 'relative', display: 'flex', alignItems: 'center' }} className={l.isDropdown ? 'nav-dropdown-wrapper' : ''}>
              {l.isDropdown ? (
                <div className="nav-item nav-dropdown-trigger" style={{
                  cursor: 'pointer',
                  color: '#555',
                  fontSize: '14px', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '4px',
                  transition: 'color 0.2s',
                }}>
                  {l.name}
                  <svg className="nav-dropdown-chevron" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                </div>
              ) : (
                <Link href={l.href} className="nav-item" style={{
                  textDecoration: 'none',
                  color: pathname === l.href ? '#0F6E56' : '#555',
                  fontSize: '14px', fontWeight: 500,
                  borderBottom: pathname === l.href ? '2px solid #0F6E56' : '2px solid transparent',
                  transition: 'color 0.2s',
                }}>{l.name}</Link>
              )}

              {l.isDropdown && (
                <div className="nav-dropdown-menu" style={{
                  position: 'absolute', top: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%) translateY(-4px)',
                  background: 'rgba(255,255,255,0.99)', border: '1px solid rgba(47,121,183,0.16)', borderRadius: '16px',
                  boxShadow: '0 18px 48px rgba(31,63,82,0.15)', minWidth: l.name === 'Departments' ? '246px' : '210px',
                  padding: '9px', opacity: 0, visibility: 'hidden', transition: 'all 0.2s ease', zIndex: 10,
                  overflow: 'hidden',
                }}>
                  <div aria-hidden="true" style={{ height: '3px', margin: '-9px -9px 7px', background: 'linear-gradient(90deg, #0F6E56, #2F79B7)' }} />
                  {l.sublinks.map(s => (
                    <Link key={s.href} href={s.href} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px',
                      padding: '11px 13px', color: '#263b47',
                      textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                      borderRadius: '10px', transition: 'background 0.2s, color 0.2s, transform 0.2s',
                    }} className="dropdown-link">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span aria-hidden="true" className="dropdown-dot" />
                        {s.name}
                      </span>
                      <span aria-hidden="true" className="dropdown-arrow">→</span>
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <style>{`
          .nav-item {
            height: 36px;
            padding: 0 2px;
            box-sizing: border-box;
            display: inline-flex;
            align-items: center;
            line-height: 1;
          }
          .nav-item:hover {
            color: #0F6E56 !important;
          }
          .nav-dropdown-wrapper:hover .nav-dropdown-menu {
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateX(-50%) translateY(0) !important;
          }
          .nav-dropdown-wrapper:hover .nav-dropdown-chevron {
            transform: rotate(180deg);
          }
          .nav-dropdown-chevron {
            transition: transform 0.2s ease;
          }
          .dropdown-link:hover {
            background: linear-gradient(90deg, #edf8f4, #eef6fb);
            color: #0F6E56 !important;
            transform: translateX(2px);
          }
          .dropdown-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #2F79B7;
            box-shadow: 0 0 0 3px rgba(47,121,183,0.1);
            flex-shrink: 0;
          }
          .dropdown-arrow {
            color: #7b96a5;
            font-size: 14px;
            transition: transform 0.2s ease, color 0.2s ease;
          }
          .dropdown-link:hover .dropdown-arrow {
            color: #0F6E56;
            transform: translateX(2px);
          }
          .nav-brand-lockup {
            transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          }
          .nav-brand-lockup:hover {
            border-color: rgba(47,121,183,0.28) !important;
            box-shadow: 0 6px 18px rgba(32,82,112,0.09);
            background: linear-gradient(135deg, rgba(47,121,183,0.09), rgba(15,110,86,0.055)) !important;
          }
        `}</style>

        <div className="nav-cta-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/fee-structure" style={{
            color: '#555', fontWeight: 500, fontSize: '13px', textDecoration: 'none',
            border: '1.5px solid rgba(0,0,0,0.12)', padding: '8px 14px', borderRadius: '8px',
            whiteSpace: 'nowrap',
          }}>Fee Structure</Link>
          <Link href="/apply" style={{
            background: '#0F6E56', color: '#fff',
            padding: '10px 22px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
            textDecoration: 'none', whiteSpace: 'nowrap',
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
          }}>View Prospectus</Link>
          <Link href="/fee-structure" onClick={() => setMobileOpen(false)} style={{
            color: '#0F6E56', fontSize: '18px', textDecoration: 'none', fontWeight: 500,
            borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '16px',
          }}>View Fee Structure</Link>
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
