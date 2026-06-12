"use client";

import { Suspense, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import db from '@/data/db.json';
const allCourses = db.courses;

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s ease`, ...style }}>
      {children}
    </div>
  );
}

const tabs = [
  { id: 'all', label: 'All Courses' },
  { id: 'nita', label: 'NITA Certified' },
  { id: 'knec', label: 'KNEC Certified' },
  { id: 'short', label: 'Short Courses' },
];

function CoursesCatalogue() {
  const searchRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get('category');
  const activeTab = tabs.some(tab => tab.id === requestedCategory) ? requestedCategory : 'all';
  const query = searchParams.get('q') || '';
  const budget = searchParams.get('budget') || '';
  const shouldFocusSearch = searchParams.get('focus') === 'search';
  const [searchOpen, setSearchOpen] = useState(shouldFocusSearch);
  const [draftQuery, setDraftQuery] = useState(query);
  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (!shouldFocusSearch) return;
    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 180);
    return () => window.clearTimeout(timer);
  }, [shouldFocusSearch]);

  useEffect(() => {
    const closeSearch = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setSearchOpen(false);
    };
    const closeOnEscape = event => {
      if (event.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('pointerdown', closeSearch);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeSearch);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const updateUrl = (category, searchQuery, budgetRange = budget) => {
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (budgetRange) params.set('budget', budgetRange);
    const nextUrl = params.size ? `${pathname}?${params}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  const selectTab = (category) => {
    updateUrl(category, draftQuery);
  };

  const showResults = () => {
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const submitSearch = (event) => {
    event?.preventDefault();
    updateUrl(activeTab, draftQuery);
    setSearchOpen(false);
    searchInputRef.current?.blur();
    showResults();
  };

  const chooseShortcut = ({ category = activeTab, searchQuery = '', budgetRange = '' }) => {
    setDraftQuery(searchQuery);
    updateUrl(category, searchQuery, budgetRange);
    setSearchOpen(false);
    showResults();
  };

  const normalizedQuery = draftQuery.trim().toLowerCase();
  const budgetLabels = {
    'under-15000': 'Under KSh 15,000',
    '15000-30000': 'KSh 15,000 - 30,000',
    '30000-50000': 'KSh 30,000 - 50,000',
  };
  const filtered = allCourses.filter(course => {
    const matchesCategory = activeTab === 'all' || course.type === activeTab;
    const fee = Number(String(course.fees || '').replace(/[^\d]/g, '')) || 0;
    const matchesBudget = !budget
      || (budget === 'under-15000' && fee < 15000)
      || (budget === '15000-30000' && fee >= 15000 && fee <= 30000)
      || (budget === '30000-50000' && fee > 30000 && fee <= 50000);
    const searchableText = [
      course.name,
      course.tag,
      course.cert,
      course.dur,
      course.type,
      course.description,
      course.fees,
    ].filter(Boolean).join(' ').toLowerCase();
    return matchesCategory && matchesBudget && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });

  return (
    <>
      {/* Header */}
      <div className="courses-hero" style={{ padding: '140px 8% 70px', background: 'linear-gradient(135deg, rgba(15,110,86,0.07) 0%, #fff 100%)', borderBottom: '1px solid rgba(0,0,0,0.07)', textAlign: 'center' }}>
        <FadeIn>
          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px' }}>Our Programmes</span>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#1a1a1a', marginBottom: '16px' }}>Choose Your Path</h1>
          <p style={{ color: '#888', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto 24px' }}>17+ accredited courses across 8 departments. Full programmes run 1–2 years; short courses from 1–3 months.</p>
          <div className="course-search-wrap" ref={searchRef}>
            <form className="course-search-shell" onSubmit={submitSearch}>
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={searchInputRef}
                type="search"
                value={draftQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={event => setDraftQuery(event.target.value)}
                placeholder="Search courses, certificates or skills..."
                aria-label="Search courses"
              />
              {(draftQuery || budget) && (
                <button type="button" onClick={() => { setDraftQuery(''); updateUrl(activeTab, '', ''); }} aria-label="Clear course search">
                  Clear
                </button>
              )}
              <button className="course-search-submit" type="submit">
                <span>Search</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
            </form>
            {searchOpen && <button className="course-search-backdrop" type="button" onClick={() => setSearchOpen(false)} aria-label="Close course search" />}
            {searchOpen && (
              <div className="course-search-menu" role="dialog" aria-label="Course search suggestions">
                <div className="course-search-menu-head">
                  <div>
                    <strong>Find your programme</strong>
                    <span>Search by qualification, duration or budget</span>
                  </div>
                  <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close course search">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="course-search-menu-section">
                  <span>Quick filters</span>
                  <div className="course-search-chips">
                    <button className={activeTab === 'short' ? 'is-active' : ''} type="button" onClick={() => chooseShortcut({ category: 'short' })}>Short Courses</button>
                    <button className={activeTab === 'nita' ? 'is-active' : ''} type="button" onClick={() => chooseShortcut({ category: 'nita' })}>NITA Courses</button>
                    <button className={activeTab === 'knec' ? 'is-active' : ''} type="button" onClick={() => chooseShortcut({ category: 'knec' })}>KNEC Courses</button>
                    <button type="button" onClick={() => chooseShortcut({ category: 'all', searchQuery: 'Month' })}>6 Months or Less</button>
                  </div>
                </div>
                <div className="course-search-menu-section">
                  <span>Search by fee</span>
                  <div className="course-search-chips">
                    {Object.entries(budgetLabels).map(([value, label]) => (
                      <button
                        className={budget === value ? 'is-active' : ''}
                        type="button"
                        key={value}
                        onClick={() => chooseShortcut({ category: 'all', budgetRange: value })}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="course-search-menu-section">
                  <span>Popular searches</span>
                  <div className="course-popular-links">
                    {['Electrical', 'Computer', 'Driving', 'Barista'].map(item => (
                      <button type="button" key={item} onClick={() => chooseShortcut({ category: 'all', searchQuery: item })}>
                        <span>{item}</span><span aria-hidden="true">→</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="course-search-menu-foot">
                  <span>{filtered.length} programme{filtered.length === 1 ? '' : 's'} currently match</span>
                  {(draftQuery || budget || activeTab !== 'all') && (
                    <button type="button" onClick={() => chooseShortcut({ category: 'all' })}>Reset all</button>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Prospectus download link */}
          <Link href="/prospectus" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#0F6E56', color: '#fff', padding: '12px 24px',
            borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none',
          }}>
            View Course Prospectus
          </Link>
        </FadeIn>
      </div>

      <section ref={resultsRef} className="courses-results" style={{ padding: '64px 8%', background: '#fff', scrollMarginTop: '100px' }}>
        <div className="course-results-summary" aria-live="polite">
          <span><strong>{filtered.length}</strong> programme{filtered.length === 1 ? '' : 's'} found</span>
          <div>
            {activeTab !== 'all' && <button onClick={() => selectTab('all')}>{tabs.find(tab => tab.id === activeTab)?.label}<span>×</span></button>}
            {budget && <button onClick={() => updateUrl(activeTab, draftQuery, '')}>{budgetLabels[budget]}<span>×</span></button>}
            {draftQuery && <button onClick={() => { setDraftQuery(''); updateUrl(activeTab, '', budget); }}>“{draftQuery}”<span>×</span></button>}
          </div>
        </div>
        {/* Tabs */}
        <FadeIn style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => selectTab(tab.id)} style={{
              padding: '10px 22px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === tab.id ? '#0F6E56' : '#fff',
              color: activeTab === tab.id ? '#fff' : '#555',
              border: `1.5px solid ${activeTab === tab.id ? '#0F6E56' : 'rgba(0,0,0,0.1)'}`,
            }}>
              {tab.label}
            </button>
          ))}
        </FadeIn>

        {/* Course Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {filtered.map((c, i) => (
            <FadeIn key={`${activeTab}-${i}`} delay={i * 0.04}>
              <Link href={`/courses/${c.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.25s, box-shadow 0.25s', height: '100%', display: 'flex', flexDirection: 'column' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 64px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#E1F5EE', position: 'relative', flexShrink: 0 }}>
                    <img src={c.img} alt={c.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                    <div style={{
                      position: 'absolute', bottom: '10px', right: '10px',
                      background: 'rgba(15,110,86,0.92)', color: '#fff',
                      fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px',
                    }}>View Details →</div>
                  </div>
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '4px 10px', borderRadius: '100px', alignSelf: 'flex-start', marginBottom: '10px' }}>{c.tag}</span>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', marginBottom: '16px', lineHeight: 1.4, flexGrow: 1 }}>{c.name}</h3>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.07)', marginBottom: '16px' }}>
                      {c.cert.toUpperCase() === 'NITA' && <img src="/nita.png" alt="NITA Certified" style={{ height: '18px', objectFit: 'contain', opacity: 0.9 }} title="NITA Certified" />}
                      {c.cert.toUpperCase() === 'KNEC' && <img src="/knec.png" alt="KNEC Certified" style={{ height: '18px', objectFit: 'contain', opacity: 0.9 }} title="KNEC Certified" />}
                      {!['NITA', 'KNEC'].includes(c.cert.toUpperCase()) && <span style={{ fontSize: '12px', color: '#555', fontWeight: 600 }}>🏅 {c.cert}</span>}
                      <span style={{ fontSize: '12px', color: '#555', fontWeight: 600, borderLeft: '1px solid rgba(0,0,0,0.1)', paddingLeft: '16px' }}>{c.dur}</span>
                    </div>
                    {/* Apply Now Button */}
                    <div
                      onClick={(e) => { e.preventDefault(); window.location.href = `/apply?course=${encodeURIComponent(c.name)}`; }}
                      style={{ 
                        textAlign: 'center', background: '#0F6E56', color: '#fff', padding: '10px', 
                        borderRadius: '8px', fontSize: '13px', fontWeight: 600, transition: 'background 0.2s', marginTop: 'auto'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#0a523f'}
                      onMouseLeave={e => e.currentTarget.style.background = '#0F6E56'}
                    >
                      Apply Now →
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="course-empty-state">
            <div className="course-empty-icon" aria-hidden="true">?</div>
            <h2>No matching courses found</h2>
            <p>Try another course name or view the complete programme list.</p>
            <button type="button" onClick={() => chooseShortcut({ category: 'all' })}>
              View All Courses
            </button>
          </div>
        )}

        <FadeIn style={{ textAlign: 'center', marginTop: '60px', padding: '48px', background: '#f8f7f4', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', color: '#1a1a1a', marginBottom: '12px' }}>Ready to Enroll?</h3>
          <p style={{ color: '#888', marginBottom: '24px' }}>View fees, requirements, and payment details on our admissions page.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/admissions" style={{ background: '#0F6E56', color: '#fff', padding: '14px 32px', borderRadius: '10px', fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>View Fees & Admissions</Link>
            <Link href="/prospectus" style={{ color: '#0F6E56', padding: '14px 32px', borderRadius: '10px', fontWeight: 600, fontSize: '15px', textDecoration: 'none', border: '1.5px solid #0F6E56', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>View Prospectus</Link>
            <a href="tel:+254113582008" style={{ color: '#555', padding: '14px 32px', borderRadius: '10px', fontWeight: 600, fontSize: '15px', textDecoration: 'none', border: '1.5px solid rgba(0,0,0,0.12)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>📞 Call Us</a>
          </div>
        </FadeIn>
      </section>
      <style>{`
        .courses-hero {
          position: relative;
          z-index: 50;
          overflow: visible;
        }
        .courses-results {
          position: relative;
          z-index: 1;
        }
        .course-search-wrap {
          position: relative;
          width: min(620px, 100%);
          margin: 0 auto 18px;
          z-index: 100;
        }
        .course-search-backdrop { display: none; }
        .course-search-shell {
          width: min(620px, 100%);
          min-height: 54px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
          padding: 0 16px;
          border: 1px solid rgba(47, 121, 183, 0.22);
          border-radius: 14px;
          background: #fff;
          color: #6f8793;
          box-shadow: 0 12px 38px rgba(32, 70, 91, 0.09);
          transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
        }
        .course-search-shell:focus-within {
          border-color: #2F79B7;
          box-shadow: 0 14px 42px rgba(47, 121, 183, 0.15);
          transform: translateY(-1px);
        }
        .course-search-shell input {
          min-width: 0;
          flex: 1;
          border: 0;
          outline: 0;
          background: transparent;
          color: #203743;
          font: inherit;
          font-size: 15px;
        }
        .course-search-shell input::placeholder { color: #91a0a8; }
        .course-search-shell button {
          border: 0;
          background: transparent;
          color: #0F6E56;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .course-search-shell .course-search-submit {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 0 14px;
          border-radius: 9px;
          background: #245A87;
          color: #fff;
        }
        .course-search-menu {
          position: absolute;
          top: calc(100% + 9px);
          left: 0;
          right: 0;
          padding: 18px;
          border: 1px solid rgba(47,121,183,.18);
          border-radius: 16px;
          background: rgba(255,255,255,.99);
          box-shadow: 0 22px 60px rgba(30,64,83,.18);
          text-align: left;
          overflow: hidden;
          animation: course-menu-in .2s cubic-bezier(.22,.8,.28,1) both;
          z-index: 110;
        }
        .course-search-menu::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 3px;
          background: linear-gradient(90deg, #0F6E56, #2F79B7);
        }
        .course-search-menu-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin: -2px -2px 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid #e8eef1;
        }
        .course-search-menu-head > div { display: flex; flex-direction: column; gap: 3px; }
        .course-search-menu-head strong { color: #203743; font-size: 15px; }
        .course-search-menu-head span { color: #82939c; font-size: 10px; }
        .course-search-menu-head > button {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 1px solid #e0e7ea;
          border-radius: 10px;
          background: #f7f9fa;
          color: #5b707b;
          cursor: pointer;
        }
        .course-search-menu-section + .course-search-menu-section {
          margin-top: 16px;
          padding-top: 15px;
          border-top: 1px solid #e9eef1;
        }
        .course-search-menu-section > span {
          display: block;
          margin-bottom: 9px;
          color: #78909c;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.1px;
          text-transform: uppercase;
        }
        .course-search-chips { display: flex; flex-wrap: wrap; gap: 7px; }
        .course-search-chips button {
          padding: 8px 11px;
          border: 1px solid #dce7ec;
          border-radius: 999px;
          background: #f8fafb;
          color: #36515f;
          font-size: 11px;
          font-weight: 650;
          cursor: pointer;
          transition: .18s ease;
        }
        .course-search-chips button:hover {
          border-color: #2F79B7;
          background: #edf6fc;
          color: #245A87;
        }
        .course-search-chips button.is-active {
          border-color: #0F6E56;
          background: #e8f6f1;
          color: #0F6E56;
          box-shadow: inset 0 0 0 1px rgba(15,110,86,.08);
        }
        .course-popular-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }
        .course-popular-links button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 11px;
          border: 0;
          border-radius: 9px;
          background: #f5f8fa;
          color: #304b58;
          font-size: 12px;
          cursor: pointer;
        }
        .course-popular-links button span:last-child { color: #2F79B7; }
        .course-popular-links button:hover {
          background: linear-gradient(90deg, #eef8f4, #eef6fb);
          color: #0F6E56;
        }
        .course-search-menu-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin: 17px -18px -18px;
          padding: 12px 18px;
          border-top: 1px solid #e7edf0;
          background: #f7f9fa;
        }
        .course-search-menu-foot span { color: #70828c; font-size: 10px; }
        .course-search-menu-foot button {
          border: 0;
          background: transparent;
          color: #0F6E56;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
        }
        .course-results-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
          color: #71828b;
          font-size: 12px;
        }
        .course-results-summary > span strong { color: #203743; font-size: 15px; }
        .course-results-summary > div { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 6px; }
        .course-results-summary button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 9px;
          border: 1px solid #d9e6eb;
          border-radius: 999px;
          background: #f5f9fb;
          color: #36515f;
          font-size: 10px;
          font-weight: 650;
          cursor: pointer;
        }
        .course-results-summary button span { color: #2F79B7; font-size: 14px; line-height: .8; }
        @keyframes course-menu-in {
          from { opacity: 0; transform: translateY(-7px) scale(.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .course-empty-state {
          margin: 18px auto 0;
          padding: 48px 24px;
          border: 1px dashed rgba(47, 121, 183, 0.3);
          border-radius: 18px;
          background: linear-gradient(145deg, #f6fafc, #f5faf8);
          text-align: center;
        }
        .course-empty-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          margin: 0 auto 14px;
          border-radius: 50%;
          background: #e9f3f9;
          color: #2F79B7;
          font-weight: 800;
        }
        .course-empty-state h2 { margin: 0 0 8px; color: #203743; font-size: 20px; }
        .course-empty-state p { margin: 0 0 20px; color: #71838c; }
        .course-empty-state button {
          padding: 11px 20px;
          border: 0;
          border-radius: 9px;
          background: #0F6E56;
          color: #fff;
          font-weight: 700;
          cursor: pointer;
        }
        @media (max-width: 720px) {
          .course-search-wrap { z-index: 20; }
          .course-search-backdrop,
          .course-search-menu { display: none !important; }
          .course-results-summary { align-items: flex-start; flex-direction: column; }
          .course-results-summary > div { justify-content: flex-start; }
        }
        @media (max-width: 560px) {
          .course-search-shell { min-height: 50px; border-radius: 12px; }
          .course-search-shell input { font-size: 14px; }
          .course-search-shell .course-search-submit { min-height: 38px; padding: 0 11px; }
          .course-popular-links { grid-template-columns: 1fr; }
        }
        @media (max-width: 380px) {
          .course-search-shell { gap: 8px; padding: 0 12px; }
          .course-search-shell input { font-size: 13px; }
          .course-search-shell .course-search-submit span { display: none; }
          .course-search-menu { padding-left: 14px; padding-right: 14px; }
          .course-search-chips { gap: 6px; }
          .course-search-chips button { font-size: 10px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .course-search-menu, .course-search-backdrop { animation: none; }
          .course-search-shell { transition: none; }
        }
      `}</style>
    </>
  );
}

export default function Courses() {
  return (
    <Suspense fallback={null}>
      <CoursesCatalogue />
    </Suspense>
  );
}
