"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function slugify(value = '') {
  return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function normalizeContent(data) {
  const blogs = (data.blogs || []).map(item => ({
    ...item,
    source: 'article',
    type: item.type || item.category || 'Article',
    summary: item.excerpt || item.description || '',
    slug: item.slug || slugify(item.title || item.id),
  }));

  const events = (data.events || []).map(item => ({
    ...item,
    source: 'event',
    type: item.category || 'Event',
    summary: item.description || '',
    content: item.description || '',
    slug: item.slug || slugify(item.title || item.id),
  }));

  return [...blogs, ...events].filter(item => item.title);
}

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug;
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        const all = normalizeContent(data);
        const found = all.find(item => item.slug === slug);
        setPost(found || null);
        setRelated(all.filter(item => item.slug !== slug).slice(0, 3));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="reader-loading">Loading update...</div>;

  if (!post) return (
    <main className="reader-loading">
      <h1>Update Not Found</h1>
      <Link href="/blog">← Back to Latest News</Link>
    </main>
  );

  const date = post.date ? new Date(post.date) : null;
  const dateLabel = date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Latest update';
  const paragraphs = String(post.content || post.summary || '').split('\n').filter(Boolean);

  return (
    <main className="reader-page">
      <section className="reader-hero">
        <div className="reader-hero-copy">
          <Link href="/blog" className="reader-back">← Latest News</Link>
          <div className="reader-chips">
            <span>{post.type}</span>
            <span>{dateLabel}</span>
          </div>
          <h1>{post.title}</h1>
          {post.summary && <p>{post.summary}</p>}
        </div>
        <div className="reader-hero-image">
          <Image src={post.image || '/hero-students.jpg'} alt={post.title} fill sizes="(max-width: 860px) 90vw, 52vw" style={{ objectFit: 'cover' }} unoptimized />
        </div>
      </section>

      <section className="reader-shell">
        <aside className="reader-side">
          <div>
            <Image src="/kvtc_logo.png" alt="KVTC" width={48} height={48} className="kvtc-logo-crop" />
            <strong>Kinoo VTC</strong>
            <span>Official Update</span>
          </div>

          {post.source === 'event' && (
            <dl>
              <dt>Date</dt>
              <dd>{dateLabel}</dd>
              {post.time && <><dt>Time</dt><dd>{post.time}</dd></>}
              {post.venue && <><dt>Venue</dt><dd>{post.venue}</dd></>}
              {post.badge && <><dt>Note</dt><dd>{post.badge}</dd></>}
            </dl>
          )}
        </aside>

        <article className="reader-content">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          {post.source === 'event' && (
            <div className="reader-event-cta">
              <h2>Need More Details?</h2>
              <p>Contact the admissions office to confirm attendance, requirements, or any schedule changes before visiting.</p>
              <Link href="/contact">Contact KVTC</Link>
            </div>
          )}
        </article>
      </section>

      {related.length > 0 && (
        <section className="reader-related">
          <h2>More From Kinoo VTC</h2>
          <div>
            {related.map(item => (
              <Link href={`/blog/${item.slug}`} key={item.id}>
                <Image src={item.image || '/hero-students.jpg'} alt={item.title} width={360} height={225} style={{ objectFit: 'cover' }} unoptimized />
                <span>{item.type}</span>
                <strong>{item.title}</strong>
              </Link>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .reader-page { min-height: 100vh; background: #f8f7f4; color: #10251f; padding-top: 86px; }
        .reader-loading { min-height: 70vh; display: grid; place-content: center; text-align: center; font-family: var(--sans); color: #10251f; gap: 14px; padding: 120px 20px; }
        .reader-loading a { color: #0F6E56; font-weight: 800; text-decoration: none; }
        .reader-hero {
          display: grid;
          grid-template-columns: minmax(0, .96fr) minmax(320px, 1.04fr);
          gap: 40px;
          align-items: center;
          padding: 68px 6% 54px;
          background:
            radial-gradient(circle at 10% 12%, rgba(55,138,221,.16), transparent 28%),
            linear-gradient(135deg, #ffffff 0%, #eef7f4 100%);
        }
        .reader-back { display: inline-block; color: #0F6E56; text-decoration: none; font-size: 13px; font-weight: 850; margin-bottom: 28px; }
        .reader-chips { display: flex; flex-wrap: wrap; gap: 9px; margin-bottom: 20px; }
        .reader-chips span {
          padding: 8px 13px;
          border-radius: 999px;
          background: #fff;
          color: #0F6E56;
          border: 1px solid rgba(15,110,86,.12);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .reader-hero h1 {
          font-family: var(--serif);
          font-size: clamp(2.25rem, 5vw, 4.5rem);
          line-height: 1.05;
          margin: 0 0 18px;
          color: #10251f;
        }
        .reader-hero p { color: #5f706b; font-size: 1.08rem; line-height: 1.8; max-width: 620px; margin: 0; }
        .reader-hero-image {
          min-height: 440px;
          overflow: hidden;
          border-radius: 30px;
          background: #dfeae7;
          box-shadow: 0 30px 90px rgba(15,57,49,.16);
          animation: readerFloat .7s ease both;
        }
        .reader-hero-image img { display: block; }
        .reader-shell {
          display: grid;
          grid-template-columns: 260px minmax(0, 780px);
          gap: 44px;
          max-width: 1120px;
          margin: 0 auto;
          padding: 58px 5% 78px;
        }
        .reader-side {
          position: sticky;
          top: 110px;
          align-self: start;
          background: #fff;
          border: 1px solid rgba(16,37,31,.08);
          border-radius: 22px;
          padding: 22px;
          box-shadow: 0 14px 42px rgba(15,57,49,.08);
        }
        .reader-side > div { display: grid; grid-template-columns: 48px 1fr; gap: 10px 12px; align-items: center; margin-bottom: 18px; }
        .reader-side img { width: 48px; height: 48px; grid-row: span 2; }
        .reader-side strong { color: #10251f; font-size: 14px; }
        .reader-side span { color: #78908a; font-size: 12px; font-weight: 700; }
        .reader-side dl { margin: 0; border-top: 1px solid #edf1f0; padding-top: 16px; }
        .reader-side dt { color: #78908a; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .12em; margin-top: 13px; }
        .reader-side dd { margin: 5px 0 0; color: #10251f; font-size: 14px; line-height: 1.5; font-weight: 750; }
        .reader-content {
          background: #fff;
          border: 1px solid rgba(16,37,31,.08);
          border-radius: 26px;
          padding: clamp(28px, 5vw, 54px);
          box-shadow: 0 18px 60px rgba(15,57,49,.08);
        }
        .reader-content p { color: #33433f; font-size: 1.08rem; line-height: 1.9; margin: 0 0 24px; }
        .reader-content p:first-child::first-letter {
          float: left;
          font-family: var(--serif);
          font-size: 4rem;
          line-height: .9;
          padding: 8px 10px 0 0;
          color: #0F6E56;
        }
        .reader-event-cta {
          margin-top: 36px;
          padding: 24px;
          border-radius: 20px;
          background: linear-gradient(135deg, #0F6E56, #245A87);
          color: #fff;
        }
        .reader-event-cta h2 { margin: 0 0 8px; font-size: 1.35rem; }
        .reader-event-cta p { color: rgba(255,255,255,.78); font-size: 14px; margin-bottom: 18px; }
        .reader-event-cta a { display: inline-block; color: #10251f; background: #fff; padding: 11px 16px; border-radius: 999px; text-decoration: none; font-weight: 900; }
        .reader-related { max-width: 1120px; margin: 0 auto; padding: 0 5% 96px; }
        .reader-related h2 { font-family: var(--serif); font-size: 2rem; margin-bottom: 22px; }
        .reader-related > div { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
        .reader-related a {
          display: grid;
          gap: 10px;
          padding: 12px;
          border-radius: 18px;
          background: #fff;
          border: 1px solid rgba(16,37,31,.08);
          text-decoration: none;
          color: #10251f;
          box-shadow: 0 10px 32px rgba(15,57,49,.06);
        }
        .reader-related img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; border-radius: 13px; }
        .reader-related span { color: #0F6E56; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .1em; }
        .reader-related strong { line-height: 1.35; }
        @keyframes readerFloat { from { opacity: 0; transform: translateY(18px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media(max-width: 860px) {
          .reader-hero { grid-template-columns: 1fr; padding-top: 48px; }
          .reader-hero-image { min-height: 310px; border-radius: 24px; }
          .reader-shell { grid-template-columns: 1fr; gap: 22px; }
          .reader-side { position: static; }
          .reader-related > div { grid-template-columns: 1fr; }
        }
        @media(max-width: 560px) {
          .reader-page { padding-top: 76px; }
          .reader-hero { padding: 36px 5% 36px; }
          .reader-hero-image { min-height: 240px; }
          .reader-content { border-radius: 20px; }
          .reader-content p { font-size: 1rem; }
        }
      `}</style>
    </main>
  );
}
