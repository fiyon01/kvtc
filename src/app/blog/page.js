"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BlogListing() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => setBlogs(data.blogs || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ background: '#f8f7f4', paddingTop: '120px' }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5% 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#0F6E56', background: '#E1F5EE', padding: '6px 14px', borderRadius: '100px', marginBottom: '16px', display: 'inline-block' }}>Latest News</span>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#1a1a1a', marginBottom: '16px' }}>Kinoo VTC Blog</h1>
          <p style={{ color: '#888', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Stay updated with the latest announcements, student success stories, and upcoming events at our campus.</p>
        </div>

        {blogs.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>Loading news...</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
          {blogs.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', textDecoration: 'none', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, box-shadow 0.3s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ height: '220px', background: '#e0e0e0', position: 'relative' }}>
                <img src={post.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80'} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#fff', color: '#0F6E56', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}>
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a', marginBottom: '12px', lineHeight: 1.3 }}>{post.title}</h2>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>{post.excerpt}</p>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F6E56', display: 'flex', alignItems: 'center', gap: '4px' }}>Read Article →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
