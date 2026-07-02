"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function slugify(value = '') {
  return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function normalizeContent(data) {
  const blogs = (data.blogs || []).map(item => ({
    ...item,
    type: item.type || item.category || 'Article',
    summary: item.excerpt || item.description || '',
    slug: item.slug || slugify(item.title || item.id),
  }));

  const events = (data.events || []).map(item => ({
    ...item,
    type: item.category || 'Event',
    summary: item.description || '',
    content: item.description || '',
    slug: item.slug || slugify(item.title || item.id),
  }));

  return [...blogs, ...events]
    .filter(item => item.title)
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
}

export default function BlogListing() {
  const [items, setItems] = useState([]);
  const [activeType, setActiveType] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => setItems(normalizeContent(data)))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const types = useMemo(() => ['All', ...Array.from(new Set(items.map(item => item.type || 'Article')))], [items]);
  const filtered = activeType === 'All' ? items : items.filter(item => item.type === activeType);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <main className="news-page">
      <section className="news-hero">
        <Link href="/" className="news-back">← Back home</Link>
        <span>Latest News</span>
        <h1>Stories, Events & Official Updates</h1>
        <p>Follow Kinoo VTC announcements, student achievements, upcoming events, notices, and campus stories in one clean place.</p>
      </section>

      <section className="news-shell">
        <div className="news-filter" aria-label="Filter latest news">
          {types.map(type => (
            <button key={type} type="button" className={activeType === type ? 'active' : ''} onClick={() => setActiveType(type)}>
              {type}
            </button>
          ))}
        </div>

        {loading && <div className="news-empty">Loading latest updates...</div>}
        {!loading && filtered.length === 0 && <div className="news-empty">No updates have been published yet.</div>}

        {featured && (
          <Link href={`/blog/${featured.slug}`} className="featured-news-card">
            <div className="featured-news-image">
              <Image src={featured.image || '/hero-students.jpg'} alt={featured.title} fill sizes="(max-width: 860px) 100vw, 56vw" style={{ objectFit: 'cover' }} unoptimized />
              <strong>{featured.type}</strong>
            </div>
            <div className="featured-news-copy">
              <span>{featured.date ? new Date(featured.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Latest update'}</span>
              <h2>{featured.title}</h2>
              <p>{featured.summary}</p>
              <em>Read full update →</em>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="news-grid">
            {rest.map(item => (
              <Link key={`${item.id}-${item.slug}`} href={`/blog/${item.slug}`} className="news-card">
                <div>
                  <Image src={item.image || '/hero-students.jpg'} alt={item.title} fill sizes="(max-width: 580px) 92vw, (max-width: 860px) 46vw, 31vw" style={{ objectFit: 'cover' }} unoptimized />
                  <span>{item.type}</span>
                </div>
                <article>
                  <small>{item.date ? new Date(item.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Latest update'}</small>
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
                  <strong>Read more →</strong>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .news-page { min-height: 100vh; background: #f8f7f4; color: #10251f; padding-top: 92px; }
        .news-hero {
          position: relative;
          overflow: hidden;
          padding: 82px 6% 96px;
          text-align: center;
          background:
            radial-gradient(circle at 18% 18%, rgba(55,138,221,.18), transparent 26%),
            radial-gradient(circle at 82% 6%, rgba(239,159,39,.2), transparent 30%),
            linear-gradient(135deg, #0F6E56, #123f55);
          color: #fff;
        }
        .news-back {
          position: absolute;
          left: 6%;
          top: 28px;
          color: rgba(255,255,255,.78);
          text-decoration: none;
          font-size: 13px;
          font-weight: 750;
        }
        .news-hero span {
          display: inline-block;
          padding: 7px 15px;
          border-radius: 999px;
          background: rgba(255,255,255,.14);
          border: 1px solid rgba(255,255,255,.22);
          font-size: 11px;
          font-weight: 850;
          letter-spacing: .16em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }
        .news-hero h1 {
          font-family: var(--serif);
          font-size: clamp(2.45rem, 6vw, 4.8rem);
          line-height: 1.04;
          max-width: 880px;
          margin: 0 auto 18px;
        }
        .news-hero p { max-width: 660px; margin: 0 auto; color: rgba(255,255,255,.78); font-size: 1.08rem; line-height: 1.75; }
        .news-shell { max-width: 1180px; margin: -42px auto 0; padding: 0 5% 96px; position: relative; z-index: 2; }
        .news-filter {
          display: flex;
          gap: 9px;
          overflow-x: auto;
          padding: 12px;
          margin-bottom: 24px;
          background: rgba(255,255,255,.92);
          border: 1px solid rgba(16,37,31,.08);
          border-radius: 18px;
          box-shadow: 0 18px 50px rgba(15,57,49,.1);
        }
        .news-filter button {
          border: 0;
          border-radius: 999px;
          padding: 10px 15px;
          background: #f1f5f4;
          color: #52625e;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }
        .news-filter button.active { background: #0F6E56; color: #fff; }
        .featured-news-card {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(320px, .92fr);
          overflow: hidden;
          background: #fff;
          border: 1px solid rgba(16,37,31,.08);
          border-radius: 28px;
          box-shadow: 0 26px 80px rgba(15,57,49,.12);
          text-decoration: none;
          margin-bottom: 34px;
          animation: newsLift .55s ease both;
        }
        .featured-news-image { position: relative; min-height: 420px; background: #dfeae7; overflow: hidden; }
        .featured-news-image img { transition: transform .65s ease; }
        .featured-news-card:hover img { transform: scale(1.05); }
        .featured-news-image strong {
          position: absolute;
          top: 20px;
          left: 20px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,.94);
          color: #0F6E56;
          font-size: 11px;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .featured-news-copy { padding: clamp(28px, 5vw, 54px); align-self: center; }
        .featured-news-copy span, .news-card small { color: #78908a; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
        .featured-news-copy h2 { color: #10251f; font-size: clamp(1.8rem, 3vw, 2.75rem); line-height: 1.12; margin: 14px 0; }
        .featured-news-copy p { color: #60716c; line-height: 1.8; margin-bottom: 24px; }
        .featured-news-copy em { color: #0F6E56; font-style: normal; font-weight: 900; }
        .news-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
        .news-card {
          overflow: hidden;
          background: #fff;
          border: 1px solid rgba(16,37,31,.08);
          border-radius: 22px;
          box-shadow: 0 12px 42px rgba(15,57,49,.07);
          text-decoration: none;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .news-card:hover { transform: translateY(-7px); box-shadow: 0 24px 70px rgba(15,57,49,.14); }
        .news-card > div { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: #dfeae7; }
        .news-card img { transition: transform .5s ease; }
        .news-card:hover img { transform: scale(1.05); }
        .news-card > div span {
          position: absolute;
          top: 14px;
          left: 14px;
          padding: 6px 11px;
          border-radius: 999px;
          background: rgba(255,255,255,.94);
          color: #0F6E56;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        .news-card article { padding: 22px; }
        .news-card h2 { color: #10251f; font-size: 18px; line-height: 1.3; margin: 10px 0; }
        .news-card p {
          color: #667570;
          line-height: 1.65;
          font-size: 14px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .news-card strong { display: inline-block; margin-top: 14px; color: #0F6E56; font-size: 13px; }
        .news-empty { padding: 64px; text-align: center; color: #78908a; background: #fff; border-radius: 24px; }
        @keyframes newsLift { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @media(max-width: 860px) {
          .featured-news-card { grid-template-columns: 1fr; }
          .featured-news-image { min-height: 280px; }
          .news-grid { grid-template-columns: 1fr 1fr; }
        }
        @media(max-width: 580px) {
          .news-page { padding-top: 78px; }
          .news-hero { padding: 66px 5% 84px; text-align: left; }
          .news-back { position: static; display: inline-block; margin-bottom: 22px; }
          .news-shell { padding-inline: 4%; }
          .news-grid { grid-template-columns: 1fr; }
          .featured-news-card { border-radius: 22px; }
          .featured-news-copy { padding: 24px; }
        }
      `}</style>
    </main>
  );
}
