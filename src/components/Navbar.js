"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BANNER_HEIGHT = 46; // must match TopBanner.js

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMenuMounted, setMobileMenuMounted] = useState(false);
  const [mobileDepartmentsOpen, setMobileDepartmentsOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const mobileCloseTimer = useRef(null);
  const pathname = usePathname();

  const openMobileMenu = () => {
    if (mobileCloseTimer.current) clearTimeout(mobileCloseTimer.current);
    setMobileMenuMounted(true);
    setMobileOpen(true);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    if (mobileCloseTimer.current) clearTimeout(mobileCloseTimer.current);
    mobileCloseTimer.current = setTimeout(() => {
      setMobileMenuMounted(false);
      setMobileDepartmentsOpen(false);
    }, 400);
  };

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

  useEffect(() => {
    if (!mobileMenuMounted) return;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const currentPaddingRight = parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [mobileMenuMounted]);

  useEffect(() => {
    setMobileOpen(false);
    setMobileMenuMounted(false);
    setMobileDepartmentsOpen(false);
  }, [pathname]);

  useEffect(() => () => {
    if (mobileCloseTimer.current) clearTimeout(mobileCloseTimer.current);
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
              {l.isSearch ? (
                <Link href={l.href} className="nav-primary-search" aria-label="Search courses">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                  <span>Search</span>
                </Link>
              ) : l.isDropdown ? (
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
          .nav-primary-search {
            height: 38px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            padding: 0 10px;
            border: 1px solid rgba(47,121,183,.2);
            border-radius: 9px;
            background: #f4f8fb;
            color: #245A87;
            text-decoration: none;
            font-size: 12px;
            font-weight: 700;
            transition: .2s ease;
          }
          .nav-primary-search:hover {
            border-color: #2F79B7;
            background: #eaf4fb;
            transform: translateY(-1px);
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

        <Link href="/courses?focus=search" className="mobile-header-search" aria-label="Search courses">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </Link>

        {/* Hamburger */}
        <button onClick={mobileOpen ? closeMobileMenu : openMobileMenu} style={{
          display: 'none', flexDirection: 'column', gap: '5px', cursor: 'pointer',
          background: 'none', border: 'none', padding: '4px',
        }} className="hamburger-btn" aria-label="Toggle menu">
          <span style={{ width: '24px', height: '2px', background: '#1a1a1a', display: 'block', borderRadius: '2px', transition: '0.3s', transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none' }}></span>
          <span style={{ width: '24px', height: '2px', background: '#1a1a1a', display: 'block', borderRadius: '2px', opacity: mobileOpen ? 0 : 1, transition: '0.3s' }}></span>
          <span style={{ width: '24px', height: '2px', background: '#1a1a1a', display: 'block', borderRadius: '2px', transition: '0.3s', transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }}></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuMounted && (
        <div className={`mobile-nav-layer ${mobileOpen ? 'is-open' : 'is-closing'}`}>
          <button className="mobile-nav-backdrop" onClick={closeMobileMenu} aria-label="Close navigation" />
          <aside className="mobile-nav-drawer" aria-label="Mobile navigation">
            <div className="mobile-nav-header">
              <Link href="/" className="mobile-nav-brand" onClick={closeMobileMenu}>
                <span className="mobile-logo-box">
                  <img src="/kvtc_logo.png" alt="Kinoo VTC" className="kvtc-logo-crop" />
                </span>
                <span className="mobile-brand-divider" aria-hidden="true" />
                <span className="mobile-logo-box mobile-county-logo">
                  <img src="/cgok-logo.png" alt="County Government of Kiambu" />
                </span>
                <span className="mobile-brand-copy">
                  <strong>Kinoo VTC</strong>
                  <small>Technology for Empowerment</small>
                </span>
              </Link>
              <button className="mobile-nav-close" onClick={closeMobileMenu} aria-label="Close menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="mobile-nav-scroll">
              <p className="mobile-nav-eyebrow">Explore Kinoo VTC</p>
              <nav className="mobile-primary-links">
                {links.filter(link => !['Blog', 'FAQs'].includes(link.name)).map(link => (
                  link.isDropdown ? (
                    <div className={`mobile-departments ${mobileDepartmentsOpen ? 'is-open' : ''}`} key={link.name}>
                      <button
                        type="button"
                        className="mobile-nav-row mobile-accordion-trigger"
                        onClick={() => setMobileDepartmentsOpen(open => !open)}
                        aria-expanded={mobileDepartmentsOpen}
                      >
                        <span>
                          <strong>Departments</strong>
                          <small>Explore our training areas</small>
                        </span>
                        <svg className="mobile-accordion-chevron" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                      </button>
                      <div className="mobile-department-panel">
                        <Link href="/departments" className="mobile-all-departments" onClick={closeMobileMenu}>
                          View all departments <span>→</span>
                        </Link>
                        <div className="mobile-department-grid">
                          {link.sublinks.map((item, index) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={closeMobileMenu}
                              className={`mobile-department-card ${pathname === item.href ? 'is-active' : ''}`}
                            >
                              <span className="mobile-department-number">0{index + 1}</span>
                              <strong>{item.name}</strong>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`mobile-nav-row ${pathname === link.href ? 'is-active' : ''}`}
                    >
                      <span><strong>{link.name}</strong></span>
                      <span className="mobile-row-arrow" aria-hidden="true">→</span>
                    </Link>
                  )
                ))}
              </nav>

              <section className="mobile-resource-section">
                <p className="mobile-nav-eyebrow">Resources</p>
                <div className="mobile-resource-grid">
                  <Link href="/prospectus" onClick={closeMobileMenu}>
                    <strong>Prospectus</strong><small>Courses &amp; guide</small>
                  </Link>
                  <Link href="/fee-structure" onClick={closeMobileMenu}>
                    <strong>Fee Structure</strong><small>View all charges</small>
                  </Link>
                  <Link href="/blog" onClick={closeMobileMenu}>
                    <strong>News &amp; Blog</strong><small>Campus updates</small>
                  </Link>
                  <Link href="/faqs" onClick={closeMobileMenu}>
                    <strong>FAQs</strong><small>Quick answers</small>
                  </Link>
                </div>
              </section>

              <a href={`tel:${phoneNumber}`} className="mobile-call-card">
                <span>
                  <small>Admissions helpline</small>
                  <strong>0113 582 008</strong>
                </span>
                <span aria-hidden="true">Call now</span>
              </a>
            </div>

            <div className="mobile-nav-footer">
              <Link href="/apply" onClick={closeMobileMenu}>
                <span>Start Your Application</span>
                <span aria-hidden="true">→</span>
              </Link>
              <small>2026 intake is currently open</small>
            </div>
          </aside>
        </div>
      )}

      <style>{`
        @media (max-width: 1050px) {
          .nav-desktop-ul { display: none !important; }
          .nav-cta-btn { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .mobile-header-search { display: grid !important; }
        }
        @media (min-width: 1051px) {
          .hamburger-btn { display: none !important; }
          .mobile-header-search { display: none !important; }
        }
        .mobile-header-search {
          width: 40px;
          height: 40px;
          display: none;
          place-items: center;
          flex-shrink: 0;
          margin-left: auto;
          margin-right: 10px;
          border: 1px solid rgba(47,121,183,.2);
          border-radius: 11px;
          background: linear-gradient(135deg, #edf6fc, #eef8f4);
          color: #245A87;
          text-decoration: none;
          box-shadow: 0 5px 15px rgba(36,90,135,.08);
        }
        .mobile-nav-layer {
          position: fixed;
          inset: 0;
          z-index: 1001;
        }
        .mobile-nav-layer.is-closing { pointer-events: none; }
        .mobile-nav-backdrop {
          position: absolute;
          inset: 0;
          width: 100%;
          border: 0;
          background: rgba(12,29,38,.52);
          backdrop-filter: blur(5px);
          animation: mobile-backdrop-in .22s ease both;
        }
        .mobile-nav-layer.is-closing .mobile-nav-backdrop {
          animation: mobile-backdrop-out .32s ease both;
        }
        .mobile-nav-drawer {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(430px, 94vw);
          display: flex;
          flex-direction: column;
          background: #f8fafb;
          box-shadow: -24px 0 70px rgba(13,35,47,.22);
          animation: mobile-drawer-in .3s cubic-bezier(.22,.8,.28,1) both;
          will-change: transform;
        }
        .mobile-nav-layer.is-closing .mobile-nav-drawer {
          animation: mobile-drawer-out .36s cubic-bezier(.4,0,.7,.2) both;
        }
        .mobile-nav-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 18px;
          background: #fff;
          border-bottom: 1px solid rgba(47,121,183,.13);
        }
        .mobile-nav-brand {
          display: flex;
          align-items: center;
          min-width: 0;
          color: #203743;
          text-decoration: none;
        }
        .mobile-logo-box {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .mobile-logo-box img { width: 40px; height: 40px; object-fit: contain; }
        .mobile-logo-box:first-child img { transform: scale(1.08) translateY(-1px); }
        .mobile-brand-divider {
          width: 1px;
          height: 28px;
          margin: 0 8px;
          background: linear-gradient(180deg, transparent, #2F79B7, #0F6E56, transparent);
        }
        .mobile-county-logo { width: 38px; }
        .mobile-county-logo img { width: 35px; height: 35px; }
        .mobile-brand-copy { display: flex; flex-direction: column; margin-left: 10px; min-width: 0; }
        .mobile-brand-copy strong { font-family: var(--serif); font-size: 16px; line-height: 1.2; }
        .mobile-brand-copy small { color: #7a8a92; font-size: 9px; line-height: 1.3; letter-spacing: .35px; text-transform: uppercase; }
        .mobile-nav-close {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 1px solid rgba(32,55,67,.09);
          border-radius: 12px;
          background: #f3f6f7;
          color: #29434f;
          cursor: pointer;
        }
        .mobile-nav-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 20px 18px 126px;
          overscroll-behavior: contain;
        }
        .mobile-nav-eyebrow {
          margin: 0 0 10px;
          color: #77909d;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }
        .mobile-primary-links {
          overflow: hidden;
          border: 1px solid rgba(47,121,183,.12);
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 8px 28px rgba(32,70,91,.06);
        }
        .mobile-nav-row {
          min-height: 54px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 12px 15px;
          border: 0;
          border-bottom: 1px solid #edf1f3;
          background: #fff;
          color: #29404c;
          text-align: left;
          text-decoration: none;
          cursor: pointer;
        }
        .mobile-primary-links > :last-child,
        .mobile-primary-links > :last-child .mobile-nav-row { border-bottom: 0; }
        .mobile-nav-row strong { font-size: 15px; font-weight: 650; }
        .mobile-nav-row small { display: block; margin-top: 2px; color: #8a989f; font-size: 10px; }
        .mobile-nav-row.is-active {
          color: #0F6E56;
          background: linear-gradient(90deg, #eef8f4, #fff);
          box-shadow: inset 3px 0 #0F6E56;
        }
        .mobile-row-arrow { color: #9aacb5; font-size: 15px; }
        .mobile-accordion-chevron { color: #6f8793; transition: transform .22s ease; }
        .mobile-departments.is-open .mobile-accordion-chevron { transform: rotate(180deg); }
        .mobile-department-panel {
          max-height: 0;
          overflow: hidden;
          background: linear-gradient(145deg, #f3f9f7, #f2f7fb);
          transition: max-height .32s ease;
        }
        .mobile-departments.is-open .mobile-department-panel {
          max-height: 520px;
          padding-bottom: 13px;
          border-bottom: 1px solid #edf1f3;
        }
        .mobile-all-departments {
          display: flex;
          justify-content: space-between;
          padding: 12px 14px 8px;
          color: #0F6E56;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: .5px;
        }
        .mobile-department-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 0 12px;
        }
        .mobile-department-card {
          min-height: 68px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 10px;
          border: 1px solid rgba(47,121,183,.11);
          border-radius: 11px;
          background: rgba(255,255,255,.9);
          color: #334c58;
          text-decoration: none;
        }
        .mobile-department-card.is-active { border-color: #0F6E56; background: #eaf7f2; color: #0F6E56; }
        .mobile-department-number { color: #2F79B7; font-size: 9px; font-weight: 800; letter-spacing: .8px; }
        .mobile-department-card strong { font-size: 12px; line-height: 1.25; }
        .mobile-resource-section { margin-top: 22px; }
        .mobile-resource-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }
        .mobile-resource-grid a {
          min-height: 72px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 12px 13px;
          border: 1px solid rgba(47,121,183,.12);
          border-radius: 13px;
          background: #fff;
          color: #304752;
          text-decoration: none;
          box-shadow: 0 5px 18px rgba(32,70,91,.045);
        }
        .mobile-resource-grid strong { font-size: 12px; }
        .mobile-resource-grid small { margin-top: 3px; color: #89979e; font-size: 10px; }
        .mobile-call-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 14px;
          padding: 14px 16px;
          border-radius: 14px;
          background: linear-gradient(135deg, #203b49, #2F6077);
          color: #fff;
          text-decoration: none;
          box-shadow: 0 10px 28px rgba(26,61,78,.17);
        }
        .mobile-call-card span:first-child { display: flex; flex-direction: column; }
        .mobile-call-card small { color: rgba(255,255,255,.66); font-size: 10px; text-transform: uppercase; letter-spacing: .7px; }
        .mobile-call-card strong { margin-top: 2px; font-size: 15px; }
        .mobile-call-card > span:last-child { font-size: 11px; font-weight: 700; }
        .mobile-nav-footer {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 14px 18px max(14px, env(safe-area-inset-bottom));
          background: rgba(255,255,255,.97);
          border-top: 1px solid rgba(47,121,183,.13);
          box-shadow: 0 -10px 30px rgba(28,60,77,.08);
          backdrop-filter: blur(12px);
        }
        .mobile-nav-footer a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 17px;
          border-radius: 12px;
          background: linear-gradient(135deg, #0F6E56, #198665);
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 750;
          box-shadow: 0 9px 24px rgba(15,110,86,.24);
        }
        .mobile-nav-footer small {
          display: block;
          margin-top: 7px;
          color: #829199;
          font-size: 9px;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: .8px;
        }
        @keyframes mobile-backdrop-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mobile-backdrop-out { from { opacity: 1; } to { opacity: 0; } }
        @keyframes mobile-drawer-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes mobile-drawer-out { from { transform: translateX(0); } to { transform: translateX(100%); } }
        @media (max-width: 380px) {
          nav { padding-left: 10px !important; padding-right: 10px !important; }
          .nav-brand-lockup { padding-left: 4px !important; padding-right: 5px !important; gap: 5px !important; }
          .nav-brand-lockup > span:first-child { width: 42px !important; }
          .nav-brand-lockup > span:nth-child(3) { width: 38px !important; }
          .mobile-header-search { width: 38px; height: 38px; margin-right: 7px; }
          .mobile-brand-copy { display: none; }
          .mobile-nav-scroll { padding-left: 13px; padding-right: 13px; }
          .mobile-department-grid, .mobile-resource-grid { gap: 7px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mobile-nav-backdrop, .mobile-nav-drawer { animation: none; }
          .mobile-department-panel, .mobile-accordion-chevron { transition: none; }
        }
      `}</style>
    </>
  );
}
