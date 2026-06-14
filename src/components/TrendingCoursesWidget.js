"use client";

import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function TrendingCoursesWidget() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch('/api/analytics/courses');
        if (res.ok) {
          const json = await res.json();
          setCourses(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch trending courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
    const interval = setInterval(fetchTrending, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || courses.length === 0) return null;

  return (
    <section className="tw-section">
      <div className="tw-header">
        <div className="tw-title-group">
          <div className="tw-icon-wrapper">
            <TrendingUp size={16} strokeWidth={2.5} className="tw-icon-glow" />
          </div>
          <span className="tw-title">Trending Searches</span>
        </div>
        <div className="tw-live-badge">
          <span className="pulse-dot" />
          LIVE
        </div>
      </div>

      <div className="tw-scroll-container hide-scrollbar">
        <div className="tw-track">
          {courses.map((item, index) => {
            const isTop = index === 0;
            return (
              <Link 
                href={`/courses?q=${encodeURIComponent(item.course)}`} 
                key={index} 
                className={`tw-premium-card ${isTop ? 'tw-top-card' : ''}`}
              >
                <div className="tw-card-bg"></div>
                <div className="tw-card-content">
                  <div className={`tw-rank-badge ${isTop ? 'rank-1' : 'rank-other'}`}>
                    {isTop ? <Flame size={14} fill="url(#fireGradient)" color="transparent" /> : `#${index + 1}`}
                  </div>
                  
                  <div className="tw-text-group">
                    <span className="tw-course-name" title={item.course}>{item.course}</span>
                    <span className="tw-count">{item.count} views this week</span>
                  </div>

                  <div className="tw-arrow-btn">
                    <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* SVG Gradient for the flame icon */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4b2b" />
            <stop offset="100%" stopColor="#ff416c" />
          </linearGradient>
        </defs>
      </svg>

      <style jsx global>{`
        .tw-section {
          width: 100%;
          max-width: 1300px;
          margin: 0 auto 40px;
          padding: 24px 20px;
          font-family: var(--font-inter, system-ui, sans-serif);
          animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        /* ── Header ── */
        .tw-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .tw-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .tw-icon-wrapper {
          background: linear-gradient(135deg, rgba(15, 110, 86, 0.1), rgba(15, 110, 86, 0.05));
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(15, 110, 86, 0.1);
          box-shadow: 0 4px 12px rgba(15, 110, 86, 0.05);
        }
        .tw-icon-glow {
          color: #0F6E56;
          filter: drop-shadow(0 2px 4px rgba(15, 110, 86, 0.3));
        }
        .tw-title {
          font-size: 16px;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.3px;
        }
        .tw-live-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(90deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.03));
          color: #ef4444;
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          border: 1px solid rgba(239, 68, 68, 0.1);
        }
        .pulse-dot {
          width: 6px;
          height: 6px;
          background: #ef4444;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
          display: block;
        }

        /* ── Track & Scroll ── */
        .tw-scroll-container {
          width: 100%;
          overflow-x: auto;
          padding: 8px 0 24px;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .tw-track {
          display: flex;
          gap: 16px;
          width: max-content;
        }

        /* ── Premium Card Design ── */
        .tw-premium-card {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 260px;
          height: 85px;
          border-radius: 16px;
          text-decoration: none;
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          isolation: isolate;
        }

        /* Hover states */
        .tw-premium-card:hover {
          transform: translateY(-5px);
          border-color: rgba(15, 110, 86, 0.3);
          box-shadow: 0 14px 25px rgba(15, 110, 86, 0.12), 0 4px 10px rgba(0, 0, 0, 0.02);
        }

        .tw-card-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(15, 110, 86, 0.02) 100%);
          z-index: -1;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .tw-premium-card:hover .tw-card-bg {
          opacity: 1;
        }

        .tw-card-content {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 0 16px;
          height: 100%;
          position: relative;
          z-index: 2;
        }

        /* ── Ranks ── */
        .tw-rank-badge {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 13px;
          font-weight: 800;
          transition: all 0.3s ease;
        }
        .rank-1 {
          background: linear-gradient(135deg, rgba(255, 65, 108, 0.1), rgba(255, 75, 43, 0.1));
          box-shadow: inset 0 0 0 1px rgba(255, 65, 108, 0.15);
        }
        .rank-other {
          background: #f1f5f9;
          color: #64748b;
          box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.8);
        }

        /* ── Top Card Special Styles ── */
        .tw-top-card {
          border-color: rgba(255, 65, 108, 0.2);
          background: linear-gradient(to right, #ffffff, #fffcfc);
        }
        .tw-top-card:hover {
          border-color: rgba(255, 65, 108, 0.4);
          box-shadow: 0 14px 25px rgba(255, 65, 108, 0.12);
        }

        /* ── Text Elements ── */
        .tw-text-group {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0; /* for truncation */
        }
        .tw-course-name {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
          transition: color 0.3s ease;
        }
        .tw-premium-card:hover .tw-course-name {
          color: #0F6E56;
        }
        .tw-top-card:hover .tw-course-name {
          color: #ff416c;
        }

        .tw-count {
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
          margin-top: 4px;
        }

        /* ── Arrow Button ── */
        .tw-arrow-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
        }
        .tw-premium-card:hover .tw-arrow-btn {
          background: #0F6E56;
          color: #ffffff;
          transform: translateX(4px);
          box-shadow: 0 4px 10px rgba(15, 110, 86, 0.2);
        }
        .tw-top-card:hover .tw-arrow-btn {
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          box-shadow: 0 4px 10px rgba(255, 65, 108, 0.25);
        }

        /* ── Media Queries ── */
        @media (min-width: 1024px) {
          .tw-track {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            width: 100%;
          }
          .tw-premium-card {
            width: 100%;
          }
        }

        /* ── Keyframes ── */
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70%  { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
