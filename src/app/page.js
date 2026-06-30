"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import TrendingCoursesWidget from '@/components/TrendingCoursesWidget';

// --- Custom Premium Icons ---
const IconCap = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const IconBanknote = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>;
const IconWrench = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const IconUsers = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconClock = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

const IconBuildingSmall = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M16 10h.01M8 10h.01M8 14h.01M12 14h.01M16 14h.01"/></svg>;
const IconClockSmall = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconCheckSmall = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconBed = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>;

// --- Animated Counter Hook ---
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const isNum = !isNaN(parseInt(target));
    const numTarget = parseInt(target);
    if (!isNum) { setCount(target); return; }
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numTarget));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(numTarget);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// --- Fade In on Scroll ---
function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s ease`,
      ...style,
    }}>{children}</div>
  );
}

// --- Typewriter Hook ---
function useTypewriter(words, speed = 100, pause = 2000) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1));
        if (text.length === 1) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }, speed / 2);
    } else {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1));
        if (text.length === currentWord.length) {
          timer = setTimeout(() => setIsDeleting(true), pause);
        }
      }, speed);
    }
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, speed, pause]);

  return text;
}

// --- Stat Item with Counter ---
function StatItem({ value, suffix = '', label }) {
  const [started, setStarted] = useState(false);
  const ref = useRef();
  const count = useCounter(value, 1800, started);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="hero-stat-card">
      <strong style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: '2.2rem', lineHeight: 1 }}>
        {count}{suffix}
      </strong>
      <span style={{ fontSize: '12px', opacity: 0.75, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

// --- Animated Gallery Carousel ---
function GalleryCarousel({ images }) {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? scrollRef.current.clientWidth * 0.6 : scrollRef.current.clientWidth * 0.9;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const scrollAmount = window.innerWidth > 768 ? clientWidth * 0.6 : clientWidth * 0.9;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3500);
    return () => clearInterval(timer);
  }, [isHovered]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!modalOpen) return;
      if (e.key === 'ArrowRight') setActiveIdx(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setActiveIdx(i => (i - 1 + images.length) % images.length);
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [modalOpen, images.length]);

  return (
    <>
      <div
        style={{ position: 'relative', margin: '0 -8%', padding: '0 8%' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          ref={scrollRef}
          style={{ display: 'flex', gap: '16px', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '24px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          className="hide-scrollbar"
        >
          {images.map((item, i) => (
            <div key={i} onClick={() => { setActiveIdx(i); setModalOpen(true); }} className="gallery-card" style={{
              flex: '0 0 auto',
              borderRadius: '16px', overflow: 'hidden', position: 'relative', scrollSnapAlign: 'start',
              boxShadow: '0 12px 24px rgba(0,0,0,0.06)', cursor: 'pointer'
            }}>
              <img src={item.src} alt={item.label || 'Gallery Image'} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,110,86,0.85), transparent 60%)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', alignItems: 'flex-end', padding: '24px' }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                  {item.label && <span style={{ color: '#fff', fontWeight: 600, fontSize: '16px', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>{item.label}</span>}
                  <span style={{ color: '#fff', fontSize: '12px', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '100px', backdropFilter: 'blur(4px)' }}>🔍 View</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button aria-label="Scroll left" onClick={() => scroll('left')} style={{
          position: 'absolute', left: '4%', top: 'calc(50% - 12px)', transform: 'translateY(-50%)',
          width: '48px', height: '48px', borderRadius: '50%', background: '#fff', border: 'none',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, transition: 'all 0.2s'
        }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button aria-label="Scroll right" onClick={() => scroll('right')} style={{
          position: 'absolute', right: '4%', top: 'calc(50% - 12px)', transform: 'translateY(-50%)',
          width: '48px', height: '48px', borderRadius: '50%', background: '#fff', border: 'none',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, transition: 'all 0.2s'
        }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .gallery-card { width: clamp(280px, 40vw, 400px); height: 320px; }
          @media (max-width: 768px) {
            .gallery-card { width: 85vw !important; height: 260px !important; }
          }
        `}</style>
      </div>

      {/* View All Button */}
      <div style={{ textAlign: 'center', marginTop: '36px' }}>
        <button onClick={() => { setActiveIdx(0); setModalOpen(true); }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#1a1a1a', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#0F6E56'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.transform = 'translateY(0)'; }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          View All Photos ({images.length})
        </button>
      </div>

      {/* ── FULLSCREEN GALLERY MODAL ── */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.96)', display: 'flex', flexDirection: 'column' }}
          onClick={() => setModalOpen(false)}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
            <div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>Life at Kinoo VTC</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginLeft: '12px' }}>{activeIdx + 1} / {images.length}</span>
            </div>
            <button onClick={() => setModalOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          {/* Main Image */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 80px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveIdx(i => (i - 1 + images.length) % images.length)}
              style={{ position: 'absolute', left: '20px', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', width: '52px', height: '52px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', zIndex: 2, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
            </button>

            <div style={{ maxWidth: '900px', maxHeight: '70vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <img
                key={activeIdx}
                src={images[activeIdx]?.src}
                alt={images[activeIdx]?.label || 'Gallery'}
                style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 32px 80px rgba(0,0,0,0.6)', animation: 'fadeImg 0.3s ease' }}
              />
              {images[activeIdx]?.label && (
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '16px', textAlign: 'center', padding: '8px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', backdropFilter: 'blur(8px)' }}>{images[activeIdx].label}</span>
              )}
            </div>

            <button onClick={() => setActiveIdx(i => (i + 1) % images.length)}
              style={{ position: 'absolute', right: '20px', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', width: '52px', height: '52px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', zIndex: 2, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div style={{ flexShrink: 0, padding: '16px 32px 24px', display: 'flex', gap: '10px', overflowX: 'auto', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
            {images.map((img, i) => (
              <div key={i} onClick={() => setActiveIdx(i)}
                style={{ width: '72px', height: '52px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: `2.5px solid ${i === activeIdx ? '#EF9F27' : 'transparent'}`, transition: 'border-color 0.2s, transform 0.2s', transform: i === activeIdx ? 'scale(1.08)' : 'scale(1)', opacity: i === activeIdx ? 1 : 0.55 }}>
                <img src={img.src} alt={img.label || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>

          <style>{`@keyframes fadeImg { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }`}</style>
        </div>
      )}
    </>
  );
}
// --- Testimonials Carousel ---
function TestimonialsCarousel({ testimonials }) {
  const scrollRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollTo = (idx) => {
    setActiveIdx(idx);
    if (scrollRef.current) {
      const card = scrollRef.current.children[idx];
      if (card) {
        // Calculate offset to center the card in the container
        const containerCenter = scrollRef.current.clientWidth / 2;
        const cardCenter = card.offsetLeft + (card.clientWidth / 2);
        scrollRef.current.scrollTo({ left: cardCenter - containerCenter, behavior: 'smooth' });
      }
    }
  };

  const prev = () => scrollTo(Math.max(0, activeIdx - 1));
  const next = () => scrollTo(Math.min(testimonials.length - 1, activeIdx + 1));

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(i => {
        const nextIdx = (i + 1) % testimonials.length;
        if (scrollRef.current) {
          const card = scrollRef.current.children[nextIdx];
          if (card) {
            const containerCenter = scrollRef.current.clientWidth / 2;
            const cardCenter = card.offsetLeft + (card.clientWidth / 2);
            scrollRef.current.scrollTo({ left: cardCenter - containerCenter, behavior: 'smooth' });
          }
        }
        return nextIdx;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section style={{ padding: '96px 0', background: '#fff', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '0 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '48px' }}>
        <div>
          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px' }}>Student Stories</span>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1a1a1a', marginBottom: '12px' }}>Lives Transformed at Kinoo VTC</h2>
          <p style={{ color: '#888', fontSize: '1.05rem', maxWidth: '500px' }}>Hear from graduates who&apos;ve turned their skills into thriving careers.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/submit-testimonial" style={{ color: '#0F6E56', fontWeight: 600, fontSize: '14px', textDecoration: 'none', border: '1.5px solid #0F6E56', padding: '12px 24px', borderRadius: '10px', whiteSpace: 'nowrap' }}>Share Your Story →</Link>
          {/* Chevron Buttons */}
          <button onClick={prev} disabled={activeIdx === 0} aria-label="Previous testimonial"
            style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff', cursor: activeIdx === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: activeIdx === 0 ? 0.4 : 1, transition: 'all 0.2s', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            onMouseEnter={e => { if (activeIdx > 0) e.currentTarget.style.background = '#0F6E56'; e.currentTarget.style.borderColor = '#0F6E56'; e.currentTarget.querySelector('svg').style.stroke = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; const s = e.currentTarget.querySelector('svg'); if(s) s.style.stroke = '#1a1a1a'; }}>
            <svg width="20" height="20" fill="none" stroke="#1a1a1a" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={next} disabled={activeIdx === testimonials.length - 1} aria-label="Next testimonial"
            style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1.5px solid rgba(0,0,0,0.12)', background: '#fff', cursor: activeIdx === testimonials.length - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: activeIdx === testimonials.length - 1 ? 0.4 : 1, transition: 'all 0.2s', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            onMouseEnter={e => { if (activeIdx < testimonials.length - 1) e.currentTarget.style.background = '#0F6E56'; e.currentTarget.style.borderColor = '#0F6E56'; e.currentTarget.querySelector('svg').style.stroke = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; const s = e.currentTarget.querySelector('svg'); if(s) s.style.stroke = '#1a1a1a'; }}>
            <svg width="20" height="20" fill="none" stroke="#1a1a1a" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      {/* Scrollable Cards */}
      <div ref={scrollRef} style={{ display: 'flex', gap: '24px', overflowX: 'auto', scrollSnapType: 'x mandatory', padding: '8px 8% 24px', scrollbarWidth: 'none' }}
        className="hide-scrollbar">
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial-card" onClick={() => setActiveIdx(i)} style={{ flexShrink: 0, scrollSnapAlign: 'start', background: i === activeIdx ? 'linear-gradient(135deg, #0F6E56, #1D9E75)' : '#f8f7f4', border: `1px solid ${i === activeIdx ? 'transparent' : 'rgba(0,0,0,0.07)'}`, borderRadius: '20px', padding: '32px', position: 'relative', transition: 'all 0.35s', cursor: 'pointer', boxShadow: i === activeIdx ? '0 20px 60px rgba(15,110,86,0.25)' : '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '4rem', color: i === activeIdx ? 'rgba(255,255,255,0.2)' : '#E1F5EE', position: 'absolute', top: '12px', left: '22px', lineHeight: 1, pointerEvents: 'none' }}>&ldquo;</div>
            <div style={{ color: '#EF9F27', fontSize: '14px', marginBottom: '14px', letterSpacing: '2px' }}>★★★★★</div>
            <p style={{ fontSize: '15px', color: i === activeIdx ? 'rgba(255,255,255,0.92)' : '#555', lineHeight: 1.75, marginBottom: '28px', position: 'relative', zIndex: 1 }}>{t.text}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: i === activeIdx ? 'rgba(255,255,255,0.2)' : '#0F6E56', border: i === activeIdx ? '2px solid rgba(255,255,255,0.4)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>{t.initials}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: i === activeIdx ? '#fff' : '#1a1a1a' }}>{t.name}</div>
                <div style={{ fontSize: '12px', color: i === activeIdx ? 'rgba(255,255,255,0.7)' : '#888', marginTop: '2px' }}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
        {testimonials.map((_, i) => (
          <button key={i} onClick={() => scrollTo(i)} aria-label={`Go to testimonial ${i + 1}`}
            style={{ width: i === activeIdx ? '24px' : '8px', height: '8px', borderRadius: '100px', background: i === activeIdx ? '#0F6E56' : '#D1D5DB', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
        ))}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .testimonial-card { width: clamp(280px, 36vw, 420px); }
        @media (max-width: 768px) {
          .testimonial-card { width: 85vw !important; }
        }
      `}</style>
    </section>
  );
}

export default function Home() {
  const [db, setDb] = useState(null);
  const [homeCourseSearch, setHomeCourseSearch] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setDb(data);
        if (data?.intake?.isOngoing) {
          const end = new Date(data.intake.endDate || '2026-12-31').getTime();
          setIsActive(Date.now() <= end);
        } else {
          setIsActive(false);
        }
      })
      .catch(err => console.error("Failed to load db", err));
  }, []);

  const galleryImages = db?.gallery || [
    { src: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80', label: 'Electronics Workshop', span: true },
    { src: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?q=80&w=600&auto=format&fit=crop', label: 'Food & Beverage Lab' },
    { src: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600&auto=format&fit=crop', label: 'Hair & Beauty Studio' },
    { src: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=600&auto=format&fit=crop', label: 'Fashion & Design' },
    { src: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600&auto=format&fit=crop', label: 'Motor Vehicle Workshop' },
  ];

  const intake = db?.intake || { isOngoing: true, yearText: "2026" };

  const events = db?.events || [];
  const submitCourseSearch = (event) => {
    event.preventDefault();
    const query = homeCourseSearch.trim();
    window.location.href = query
      ? `/courses?q=${encodeURIComponent(query)}`
      : '/courses?focus=search';
  };

  const testimonials = db?.testimonials || [
    { initials: 'WK', name: 'Wanjiku Kamau', role: 'Hair & Beauty Graduate, 2024 · Salon Owner', text: 'The Hair Dressing course at Kinoo VTC was a turning point for me. Within 3 months of graduating, I opened my own salon in Kikuyu town. The practical training was exceptional.' },
    { initials: 'JM', name: 'James Mwangi', role: 'Electrical & Solar Graduate, 2023 · Employed', text: "I enrolled in Electrical & Electronics and now work with a solar installation company. The NITA certificate opened many doors that a degree alone couldn't have." },
    { initials: 'GW', name: 'Grace Wambui', role: 'Parent of Food & Beverage Graduate', text: 'As a mother, the affordable fees were everything. KSh 27,000 for a full year of professional training – the best investment. My daughter now works as a Barista in Nairobi.' },
    { initials: 'PM', name: 'Peter Muthoni', role: 'Motor Vehicle Mechanics Graduate, 2024', text: 'My passion for cars became my profession. After graduating I got an attachment at a reputable garage in Westlands. Kinoo VTC changed my trajectory completely.' },
    { initials: 'AN', name: 'Aisha Njeri', role: 'Fashion Design Graduate, 2023 · Business Owner', text: 'I used to think fashion was just a hobby. After Kinoo VTC, I now run my own clothing line and employ two staff. The teachers here are truly world class.' },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, rgba(15,110,86,0.88) 0%, rgba(15,110,86,0.65) 50%, rgba(186,117,23,0.55) 100%),
          url('/hero-students.jpg') center/cover no-repeat`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '130px 8% 80px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Wave bottom */}
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: '80px', background: '#fff', clipPath: 'ellipse(55% 100% at 50% 100%)' }} />

        {/* Badge */}
        {isActive && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: '12px', fontWeight: 500, letterSpacing: '1px', padding: '8px 18px', borderRadius: '100px', marginBottom: '28px', textTransform: 'uppercase', width: 'fit-content', animation: 'heroFadeUp 0.8s 0.1s both' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', flexShrink: 0, animation: 'pulse-dot 1.5s infinite' }} />
            Intake Ongoing – {intake.yearText}
          </div>
        )}

        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: '#fff', lineHeight: 1.1, maxWidth: '720px', marginBottom: '24px', animation: 'heroFadeUp 0.8s 0.2s both' }}>
          Build Skills.<br />Build <em style={{ fontStyle: 'normal', color: '#fbbf24', position: 'relative' }}>
            {useTypewriter(['Your Future.', 'Your Career.', 'Your Legacy.', 'Your Empire.'])}
            <span style={{ position: 'absolute', right: '-12px', top: '10%', bottom: '10%', width: '4px', background: '#fbbf24', animation: 'blink 1s step-end infinite' }} />
          </em>
        </h1>

        <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1.1rem', maxWidth: '520px', marginBottom: '40px', animation: 'heroFadeUp 0.8s 0.35s both' }}>
          Kiambu County&apos;s premier public vocational training centre — NITA & KNEC-certified courses in 13+ disciplines. Affordable. Practical. Life-changing.
        </p>

        <form className="home-course-search" onSubmit={submitCourseSearch}>
          <div>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={homeCourseSearch}
              onChange={event => setHomeCourseSearch(event.target.value)}
              placeholder="What would you like to study?"
              aria-label="Search courses"
            />
            <button type="submit">Find Courses</button>
          </div>
          <nav aria-label="Popular course searches">
            <span>Quick search:</span>
            <Link href="/courses?category=short">Short courses</Link>
            <Link href="/courses?category=nita">NITA</Link>
            <Link href="/courses?category=knec">KNEC</Link>
            <Link href="/courses?budget=under-15000">Under KSh 15,000</Link>
          </nav>
        </form>

        <div className="hero-actions-container" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '60px', animation: 'heroFadeUp 0.8s 0.5s both' }}>
          <Link href="/aria" className="hero-btn" style={{ background: 'linear-gradient(135deg, #0F6E56, #1D9E75)', color: '#fff', padding: '16px 36px', borderRadius: '10px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', border: '1.5px solid #0F6E56', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 8px 24px rgba(15,110,86,0.3)' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <span className="hero-aria-icon" aria-hidden="true">
              <img src="/aria-avatar.png" alt="" />
            </span>
            Ask ARIA
          </Link>
          <Link href="/apply" className="hero-btn" style={{ background: '#EF9F27', color: '#1a1a1a', padding: '16px 36px', borderRadius: '10px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(239,159,39,0.25)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            Apply Now
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <Link href="/contact" className="hero-btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '16px 36px', borderRadius: '10px', fontWeight: 600, fontSize: '16px', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
            Enquire Now
          </Link>
        </div>

        {/* Animated Stats */}
        <div className="hero-stats-grid">
          <StatItem value={13} suffix="+" label="Courses Offered" />
          <StatItem value={27} suffix="K" label="Annual Fees (KSh)" />
          <StatItem value={100} suffix="%" label="Practical Training" />
          <StatItem value={2} suffix=" Yrs" label="Full Programme" />
        </div>

        <style>{`
          @keyframes heroFadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse-dot {
            0%, 100% { transform: scale(0.9); opacity: 0.8; }
            50% { transform: scale(1.2); opacity: 1; }
          }
          @keyframes blink {
            50% { opacity: 0; }
          }
          .home-course-search {
            width: min(680px, 100%);
            margin: -14px 0 30px;
            animation: heroFadeUp .8s .43s both;
          }
          .home-course-search > div {
            min-height: 58px;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 6px 7px 6px 17px;
            border: 1px solid rgba(255,255,255,.35);
            border-radius: 15px;
            background: rgba(255,255,255,.96);
            color: #607985;
            box-shadow: 0 18px 45px rgba(8,38,31,.22);
          }
          .home-course-search input {
            min-width: 0;
            flex: 1;
            border: 0;
            outline: 0;
            background: transparent;
            color: #203743;
            font: inherit;
            font-size: 15px;
          }
          .home-course-search button {
            align-self: stretch;
            padding: 0 20px;
            border: 0;
            border-radius: 10px;
            background: linear-gradient(135deg, #245A87, #2F79B7);
            color: #fff;
            font-size: 13px;
            font-weight: 750;
            cursor: pointer;
          }
          .home-course-search nav {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 7px;
            margin-top: 9px;
          }
          .home-course-search nav span { color: rgba(255,255,255,.68); font-size: 10px; font-weight: 700; }
          .home-course-search nav a {
            padding: 5px 9px;
            border: 1px solid rgba(255,255,255,.22);
            border-radius: 999px;
            background: rgba(255,255,255,.1);
            color: #fff;
            font-size: 10px;
            font-weight: 650;
            text-decoration: none;
            backdrop-filter: blur(7px);
          }
          .hero-stats-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, max-content));
            gap: 40px;
            animation: heroFadeUp 0.8s 0.65s both;
          }
          .hero-stat-card {
            color: #fff;
          }
          .hero-aria-icon {
            width: 32px;
            height: 32px;
            display: inline-grid;
            place-items: center;
            flex-shrink: 0;
            border-radius: 999px;
            background: #fff;
            border: 1px solid rgba(255,255,255,.45);
            box-shadow: 0 5px 14px rgba(5,45,35,.22);
            overflow: hidden;
            padding: 2px;
          }
          .hero-aria-icon img {
            width: 100%;
            height: 100%;
            border-radius: 999px;
            object-fit: cover;
            object-position: center;
            transform: scale(1.2);
            display: block;
          }
          @media(max-width:560px) {
            .home-course-search { margin-top: -18px; }
            .home-course-search > div { min-height: 52px; padding-left: 13px; }
            .home-course-search input { font-size: 14px; }
            .home-course-search button { padding: 0 13px; font-size: 11px; }
            .home-course-search nav { gap: 5px; }
            .hero-actions-container { flex-direction: column !important; width: 100%; align-items: stretch; }
            .hero-actions-container .hero-btn { width: 100% !important; justify-content: center !important; }
            .hero-stats-grid {
              width: 100%;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 10px;
            }
            .hero-stat-card {
              min-height: 92px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              padding: 15px 13px;
              border: 1px solid rgba(255,255,255,.2);
              border-radius: 15px;
              background: linear-gradient(145deg, rgba(255,255,255,.15), rgba(255,255,255,.07));
              box-shadow: inset 0 1px 0 rgba(255,255,255,.12), 0 12px 26px rgba(8,38,31,.12);
              backdrop-filter: blur(10px);
            }
            .hero-stat-card strong {
              font-size: 1.75rem !important;
              margin-bottom: 7px;
            }
            .hero-stat-card span {
              font-size: 9px !important;
              line-height: 1.35;
              letter-spacing: .65px !important;
            }
          }
          @media(max-width:380px) {
            .home-course-search button { width: 48px; padding: 0; font-size: 0; }
            .home-course-search button::after { content: "Go"; font-size: 12px; }
          }
        `}</style>
      </section>

      {/* ── TRENDING COURSES WIDGET ── */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 20px', background: '#f8f7f4' }}>
        <TrendingCoursesWidget />
      </div>

      {/* ── TRUST BAR MARQUEE ── */}
      <div style={{ background: '#f8f7f4', padding: '20px 0', overflow: 'hidden', borderBottom: '1px solid rgba(0,0,0,0.07)', whiteSpace: 'nowrap', display: 'flex' }}>
        <div className="marquee-content" style={{ display: 'flex', alignItems: 'center', gap: '50px', paddingLeft: '50px' }}>
          
          {/* Item 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#E1F5EE', color: '#0F6E56', padding: '8px 18px', borderRadius: '100px', border: '1.5px solid #0F6E56', boxShadow: '0 4px 14px rgba(15,110,86,0.12)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Certified &amp; Accredited</span>
          </div>

          {/* Item 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: '#444' }}>
            <img src="/gok-logo.png" alt="Government of Kenya" style={{ height: '40px', objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} />
          </div>
          
          {/* Item 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <img src="/tveta-logo.png" alt="TVETA" style={{ height: '32px', objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} />
            <span>TVETA Approved</span>
          </div>

          {/* Item 4 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <img src="/nita.png" alt="NITA" style={{ height: '28px', objectFit: 'contain' }} />
            <span>NITA Certified</span>
          </div>
          
          {/* Item 5 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <img src="/knec.png" alt="KNEC" style={{ height: '32px', objectFit: 'contain' }} />
            <span>KNEC Exams</span>
          </div>
          
          {/* Item 6 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/cgok-logo.png" alt="County Government of Kiambu" style={{ height: '40px', objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
              <span style={{ fontSize: '9px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>County Government of</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F6E56', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Kiambu</span>
            </div>
          </div>
          
          {/* Item 7 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <IconClockSmall />
            Part-Time Classes Available
          </div>

        </div>

        {/* Duplicate content for seamless scrolling */}
        <div className="marquee-content" style={{ display: 'flex', alignItems: 'center', gap: '50px', paddingLeft: '50px' }}>
          
          {/* Item 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#E1F5EE', color: '#0F6E56', padding: '8px 18px', borderRadius: '100px', border: '1.5px solid #0F6E56', boxShadow: '0 4px 14px rgba(15,110,86,0.12)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Certified &amp; Accredited</span>
          </div>

          {/* Item 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: '#444' }}>
            <img src="/gok-logo.png" alt="Government of Kenya" style={{ height: '40px', objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} />
          </div>
          
          {/* Item 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <img src="/tveta-logo.png" alt="TVETA" style={{ height: '32px', objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} />
            <span>TVETA Approved</span>
          </div>

          {/* Item 4 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <img src="/nita.png" alt="NITA" style={{ height: '28px', objectFit: 'contain' }} />
            <span>NITA Certified</span>
          </div>
          
          {/* Item 5 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <img src="/knec.png" alt="KNEC" style={{ height: '32px', objectFit: 'contain' }} />
            <span>KNEC Exams</span>
          </div>
          
          {/* Item 6 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/cgok-logo.png" alt="County Government of Kiambu" style={{ height: '40px', objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
              <span style={{ fontSize: '9px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>County Government of</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F6E56', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Kiambu</span>
            </div>
          </div>
          
          {/* Item 7 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <IconClockSmall />
            Part-Time Classes Available
          </div>

        </div>

        <style>{`
          .marquee-content {
            animation: marquee 30s linear infinite;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </div>

      {/* ── ABOUT SNIPPET ── */}
      <section className="home-about-section" style={{ padding: '96px 8%', background: '#f8f7f4' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }} className="about-grid-resp">
          <FadeIn style={{ position: 'relative' }}>
            <div className="about-image-frame" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.15)', aspectRatio: '4/3' }}>
              <img src="/kinoo_vtc_realistic.png" alt="Exterior of Kinoo VTC" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {isActive && (
              <div className="about-intake-card" style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: '#fff', borderRadius: '14px', padding: '20px 24px', boxShadow: '0 16px 64px rgba(0,0,0,0.12)', textAlign: 'center' }}>
                <strong style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: '2.2rem', color: '#0F6E56', lineHeight: 1 }}>{intake.yearText}</strong>
                <span style={{ fontSize: '12px', color: '#888' }}>Intake Open</span>
              </div>
            )}
          </FadeIn>

          <FadeIn delay={0.2} style={{ minWidth: 0 }}>
            <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px' }}>About Us</span>
            <h2 className="about-home-title" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#1a1a1a', lineHeight: 1.2, marginBottom: '20px' }}>Shaping Tomorrow's <em style={{ fontStyle: 'italic', color: '#0F6E56' }}>Skilled Workforce</em></h2>
            <p className="about-home-intro" style={{ color: '#888', fontSize: '15px', marginBottom: '12px' }}>
              Kinoo VTC is a public institution under the <strong style={{ color: '#1a1a1a' }}>County Government of Kiambu</strong>, located in Kikuyu along the Nairobi-Nakuru highway. We equip trainees with practical skills that open real doors in Kenya's economy.
            </p>
            {[
              'Hands-on training in fully equipped workshops across all departments',
              'Nationally recognised KNEC Artisan, NITA Grade 3 certificates',
              'Subsidised government fees — just KSh 27,000/year',
              'Short-term courses from 1–3 months for quick employment',
            ].map((item, i) => (
              <div key={i} className="about-home-point" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ marginTop: '2px', flexShrink: 0 }}>
                  <IconCheckSmall />
                </div>
                <span style={{ fontSize: '15px', color: '#555' }}>{item}</span>
              </div>
            ))}
            <div className="about-home-badges" style={{ display: 'flex', gap: '10px', marginTop: '28px', flexWrap: 'wrap' }}>
              {['NITA Registered', 'KNEC Exam Centre', 'County Government'].map((b, i) => (
                <span key={i} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: ['#0F6E56', '#EF9F27', '#378ADD'][i] }} />
                  {b}
                </span>
              ))}
            </div>
            <div className="about-home-action-wrap" style={{ marginTop: '32px' }}>
              <Link className="about-home-action" href="/about" style={{ background: '#0F6E56', color: '#fff', padding: '14px 28px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>Learn More About Us</Link>
            </div>
          </FadeIn>
        </div>

        {/* Short Courses Banner */}
        <FadeIn delay={0.3} style={{ marginTop: '64px' }}>
          <div className="fast-track-card" style={{ background: 'linear-gradient(to right, #1a1a1a, #2a2a2a)', borderRadius: '20px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', maxWidth: '1200px', margin: '0 auto', boxShadow: '0 24px 48px rgba(0,0,0,0.1)' }}>
            <div className="fast-track-copy">
              <div className="fast-track-meta" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ background: '#EF9F27', color: '#1a1a1a', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Part-Time & Short Courses</span>
                <span style={{ color: '#4ade80', fontSize: '14px', fontWeight: 600 }}>Duration: 1–3 Months</span>
              </div>
              <h3 className="fast-track-title" style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', color: '#fff', marginBottom: '8px' }}>Fast-Track Your Career</h3>
              <p style={{ color: '#aaa', fontSize: '15px', maxWidth: '500px' }}>Can't commit to a full year? We offer intensive, highly practical short courses tailored for working adults and those looking for quick skills.</p>
            </div>
            <Link className="fast-track-action" href="/courses?category=short" style={{ background: '#0F6E56', color: '#fff', padding: '16px 32px', borderRadius: '10px', fontWeight: 600, fontSize: '15px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
              Explore Short Courses →
            </Link>
          </div>
        </FadeIn>

        <style>{`
          .about-grid-resp { }
          @media(max-width:900px) {
            .about-grid-resp { grid-template-columns:1fr !important; }
          }
          @media(max-width:560px) {
            .home-about-section {
              padding: 70px 8% !important;
              overflow: hidden;
            }
            .about-grid-resp {
              gap: 42px !important;
            }
            .about-image-frame {
              border-radius: 18px !important;
              box-shadow: 0 18px 42px rgba(23,44,52,.16) !important;
            }
            .about-intake-card {
              right: 12px !important;
              bottom: 12px !important;
              padding: 11px 15px !important;
              border-radius: 12px !important;
              box-shadow: 0 10px 28px rgba(20,42,50,.18) !important;
              text-align: left !important;
            }
            .about-intake-card strong {
              font-size: 1.45rem !important;
            }
            .about-home-title {
              max-width: 300px;
              font-size: 2rem !important;
              line-height: 1.08 !important;
              margin-bottom: 18px !important;
            }
            .about-home-intro {
              font-size: 14px !important;
              line-height: 1.75;
              margin-bottom: 20px !important;
            }
            .about-home-point {
              gap: 10px !important;
              margin-bottom: 10px !important;
              padding: 11px 12px;
              border: 1px solid rgba(15,110,86,.09);
              border-radius: 12px;
              background: rgba(255,255,255,.7);
            }
            .about-home-point > span {
              font-size: 13px !important;
              line-height: 1.5;
            }
            .about-home-badges {
              display: grid !important;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 8px !important;
              margin-top: 20px !important;
            }
            .about-home-badges > span {
              min-width: 0;
              padding: 8px 10px !important;
              font-size: 10px !important;
              line-height: 1.3;
            }
            .about-home-badges > span:last-child {
              grid-column: 1 / -1;
            }
            .about-home-action-wrap {
              margin-top: 24px !important;
            }
            .about-home-action {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 14px 18px !important;
            }
            .fast-track-card {
              padding: 25px 22px !important;
              gap: 22px !important;
              border-radius: 18px !important;
              background:
                radial-gradient(circle at 100% 0%, rgba(47,121,183,.22), transparent 42%),
                linear-gradient(145deg, #17242b, #11191d) !important;
              box-shadow: 0 20px 42px rgba(18,34,40,.18) !important;
            }
            .fast-track-copy { width: 100%; }
            .fast-track-meta {
              align-items: flex-start !important;
              flex-direction: column;
              gap: 9px !important;
              margin-bottom: 18px !important;
            }
            .fast-track-meta > span:first-child {
              max-width: 100%;
              font-size: 10px !important;
              letter-spacing: .8px !important;
              line-height: 1.35;
            }
            .fast-track-meta > span:last-child {
              font-size: 12px !important;
            }
            .fast-track-title {
              max-width: 260px;
              font-size: 1.85rem !important;
              line-height: 1.08;
              margin-bottom: 12px !important;
            }
            .fast-track-copy p {
              font-size: 14px !important;
              line-height: 1.65;
            }
            .fast-track-action {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 15px 20px !important;
              border-radius: 12px !important;
              background: linear-gradient(135deg, #0F6E56, #1D8B6D) !important;
              box-shadow: 0 10px 24px rgba(15,110,86,.24);
            }
          }
        `}</style>
      </section>

      {/* ── WHY KINOO ── */}
      <section style={{ padding: '96px 8%', background: 'linear-gradient(135deg, #0F6E56 0%, #245A87 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <FadeIn>
          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px' }}>Why Choose Us</span>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: '12px' }}>The Kinoo VTC Advantage</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', maxWidth: '560px', marginBottom: '56px' }}>Government backing, experienced instructors, and hands-on training to deliver outcomes that matter.</p>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px', position: 'relative', zIndex: 1 }}>
          {[
            { icon: <IconCap />, title: 'Nationally Accredited', desc: 'All programmes certified by NITA and KNEC – Kenya\'s premier technical and examination bodies.' },
            { icon: <IconBanknote />, title: 'Highly Subsidised Fees', desc: 'Full-year training costs just KSh 27,000. Quality vocational education accessible to all Kenyans.' },
            { icon: <IconWrench />, title: 'Hands-On Training', desc: 'Industry-standard workshops. You learn by doing in environments that simulate professional settings.' },
            { icon: <IconUsers />, title: 'Experienced Instructors', desc: 'Staff with academic qualifications and real-world industry experience mentoring every student.' },
            { icon: <IconClock />, title: 'Flexible Part-Time Classes', desc: 'Short courses from 1–3 months. Upskill without disrupting your work or family life.' },
            { icon: <IconBed />, title: 'Secure Accommodation', desc: 'Safe and affordable student housing available for both male and female students.' },
          ].map((card, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '28px', transition: 'background 0.25s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                <div style={{ marginBottom: '16px' }}>{card.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{card.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── FEATURED COURSES ── */}
      <section style={{ padding: '96px 8%', background: '#fff' }}>
        <FadeIn style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '56px' }}>
          <div>
            <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px' }}>Our Programmes</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1a1a1a', marginBottom: '12px' }}>Popular Courses</h2>
            <p style={{ color: '#888', fontSize: '1.05rem' }}>13+ accredited courses across 8 departments.</p>
          </div>
          <Link href="/courses" style={{ color: '#0F6E56', fontWeight: 600, fontSize: '14px', textDecoration: 'none', border: '1.5px solid #0F6E56', padding: '12px 24px', borderRadius: '10px' }}>View All Courses →</Link>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { tag: 'Hospitality', name: 'Food & Beverage Production', img: '/food.png', cert: 'KNEC', dur: '2 Years', slug: 'food-and-beverage-production' },
            { tag: 'Cosmetology', name: 'Hair Dressing & Beauty Therapy', img: '/hair.png', cert: 'NITA', dur: '2 Years', slug: 'hair-dressing-and-beauty-therapy' },
            { tag: 'Engineering', name: 'Electrical & Electronics', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop', cert: 'NITA', dur: '2 Years', slug: 'electrical-and-electronics' },
            { tag: 'Fashion', name: 'Fashion Design & Dressmaking', img: '/fashion.png', cert: 'NITA', dur: '2 Years', slug: 'fashion-design-and-dressmaking' },
            { tag: 'Engineering', name: 'Motor Vehicle Mechanics', img: '/mechanic.png', cert: 'NITA', dur: '2 Years', slug: 'motor-vehicle-mechanics' },
            { tag: 'Short Course', name: 'Barista & Baking', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop', cert: 'INTERNAL', dur: '3 Months', slug: 'barista' },
          ].map((c, i) => (
            <FadeIn key={i} delay={i * 0.07}>
              <Link href={`/courses/${c.slug}`} style={{ textDecoration: 'none', display: 'block', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.25s, box-shadow 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 64px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#E1F5EE' }}>
                  <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', display: 'block' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                </div>
                <div style={{ padding: '20px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '4px 10px', borderRadius: '100px', display: 'inline-block', marginBottom: '10px' }}>{c.tag}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', marginBottom: '12px' }}>{c.name}</h3>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                    {c.cert.toUpperCase() === 'NITA' && <img src="/nita.png" alt="NITA Certified" style={{ height: '18px', objectFit: 'contain', opacity: 0.9 }} title="NITA Certified" />}
                    {c.cert.toUpperCase() === 'KNEC' && <img src="/knec.png" alt="KNEC Certified" style={{ height: '18px', objectFit: 'contain', opacity: 0.9 }} title="KNEC Certified" />}
                    {!['NITA', 'KNEC'].includes(c.cert.toUpperCase()) && <span style={{ fontSize: '12px', color: '#555', fontWeight: 600 }}>🏅 {c.cert}</span>}
                    <span style={{ fontSize: '12px', color: '#555', fontWeight: 600, borderLeft: '1px solid rgba(0,0,0,0.1)', paddingLeft: '16px' }}>{c.dur}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0F6E56', fontSize: '13px', fontWeight: 600 }}>
                    View Course Details <span style={{ fontSize: '16px' }}>→</span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section style={{ padding: '96px 8%', background: '#f8f7f4' }}>
        <FadeIn style={{ marginBottom: '48px' }}>
          <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px' }}>Campus Life</span>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1a1a1a', marginBottom: '12px' }}>Life at Kinoo VTC</h2>
          <p style={{ color: '#888', fontSize: '1.05rem', maxWidth: '560px' }}>A vibrant campus community where skills are built, friendships are formed, and futures are shaped.</p>
        </FadeIn>

        <GalleryCarousel images={galleryImages} />
      </section>

      {/* ── EVENTS ── */}
      {events.filter(ev => {
        if (!ev.date) return true;
        const evDate = new Date(ev.date);
        evDate.setHours(23,59,59,999);
        return evDate.getTime() >= Date.now();
      }).length > 0 && (
        <section style={{ padding: '96px 8%', background: '#f8f7f4' }}>
          <FadeIn style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '56px' }}>
            <div>
              <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#BA7517', background: '#FFF8E8', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px' }}>📅 School Calendar</span>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1a1a1a', marginBottom: '12px' }}>Upcoming Events</h2>
              <p style={{ color: '#888', fontSize: '1.05rem', maxWidth: '500px' }}>Mark your calendar — from open days to graduations, there's always something exciting happening at Kinoo VTC.</p>
            </div>
          </FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
            {events.filter(ev => {
              if (!ev.date) return true;
              const evDate = new Date(ev.date);
              evDate.setHours(23,59,59,999);
              return evDate.getTime() >= Date.now();
            }).map((ev, i) => {
              const d = new Date(ev.date);
              const day = d.toLocaleDateString('en-KE', { day: '2-digit' });
              const month = d.toLocaleDateString('en-KE', { month: 'short' }).toUpperCase();
              const year = d.getFullYear();
              const catColors = {
                'Open Day': { bg: '#E1F5EE', color: '#0F6E56' },
                'Exams': { bg: '#FEE2E2', color: '#991B1B' },
                'Exhibition': { bg: '#EDE9FE', color: '#5B21B6' },
                'Orientation': { bg: '#DBEAFE', color: '#1E40AF' },
                'Sports': { bg: '#FEF3C7', color: '#92400E' },
                'Graduation': { bg: '#FFF8E8', color: '#BA7517' },
              };
              const cat = catColors[ev.category] || { bg: '#E1F5EE', color: '#0F6E56' };
              return (
                <FadeIn key={ev.id} delay={i * 0.07}>
                  <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.06)', transition: 'transform 0.25s, box-shadow 0.25s', display: 'flex', flexDirection: 'column' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.13)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'; }}>
                    {/* Image */}
                    <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={ev.image} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                      {/* Date Badge Overlay */}
                      <div style={{ position: 'absolute', top: '14px', left: '14px', background: '#fff', borderRadius: '12px', padding: '8px 14px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', minWidth: '54px' }}>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F6E56', lineHeight: 1 }}>{day}</div>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#888', letterSpacing: '1px' }}>{month}</div>
                        <div style={{ fontSize: '10px', color: '#aaa' }}>{year}</div>
                      </div>
                      <div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                        <div style={{ background: cat.bg, color: cat.color, fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '5px 10px', borderRadius: '100px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>{ev.category}</div>
                        <div style={{ background: '#0F6E56', color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '5px 10px', borderRadius: '100px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>Upcoming</div>
                      </div>
                    </div>
                    {/* Body */}
                    <div style={{ padding: '22px 24px 24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a1a', marginBottom: '10px', lineHeight: 1.3 }}>{ev.title}</h3>
                      <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, marginBottom: '16px', flexGrow: 1 }}>{ev.description}</p>
                      <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#555', fontWeight: 500 }}>
                          <svg width="14" height="14" fill="none" stroke="#0F6E56" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {ev.time}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#555', fontWeight: 500 }}>
                          <svg width="14" height="14" fill="none" stroke="#0F6E56" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {ev.venue}
                        </div>
                      </div>
                      {ev.badge && (
                        <div style={{ marginTop: '14px', display: 'inline-block', background: '#EF9F27', color: '#1a1a1a', fontSize: '11px', fontWeight: 700, padding: '5px 12px', borderRadius: '100px', alignSelf: 'flex-start' }}>{ev.badge}</div>
                      )}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS CAROUSEL ── */}
      <TestimonialsCarousel testimonials={testimonials} />

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '80px 8%', background: '#1a1a1a', textAlign: 'center' }}>
        <FadeIn>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: '16px' }}>Ready to Start Your Journey?</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto 36px' }}>
            {isActive 
              ? `Applications for the ${intake.yearText} intake are now open. Enroll today and build the skills that last a lifetime.` 
              : 'Our programmes are constantly evolving to meet industry needs. Contact us to learn about upcoming intakes and short courses.'}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {isActive ? (
              <Link href="/apply" style={{ background: '#EF9F27', color: '#1a1a1a', padding: '16px 40px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>Apply Now</Link>
            ) : (
              <Link href="/contact" style={{ background: '#EF9F27', color: '#1a1a1a', padding: '16px 40px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>Contact Us</Link>
            )}
            <Link href="/courses" style={{ background: 'transparent', color: '#fff', padding: '16px 40px', borderRadius: '10px', border: '1.5px solid rgba(255,255,255,0.3)', fontSize: '15px', textDecoration: 'none' }}>View Programmes</Link>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
