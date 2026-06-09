"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        const found = data.blogs?.find(b => b.slug === slug);
        setPost(found);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div style={{ padding: '200px 20px', textAlign: 'center', fontFamily: 'var(--sans)' }}>Loading article...</div>;

  if (!post) return (
    <div style={{ padding: '200px 20px', textAlign: 'center', fontFamily: 'var(--sans)' }}>
      <h2>Article Not Found</h2>
      <Link href="/blog" style={{ color: '#0F6E56', textDecoration: 'none', marginTop: '16px', display: 'inline-block' }}>← Back to Blog</Link>
    </div>
  );

  return (
    <div style={{ background: '#fff', paddingTop: '100px' }}>
      
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 5% 100px' }}>
        <Link href="/blog" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '32px', fontWeight: 500 }}>← Back to all news</Link>
        
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#1a1a1a', marginBottom: '24px', lineHeight: 1.1 }}>{post.title}</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <img src="/kvtc_logo.png" alt="KVTC" className="kvtc-logo-crop" style={{ width: '40px', height: '40px' }} />
          <div>
            <strong style={{ display: 'block', fontSize: '14px', color: '#1a1a1a' }}>Kinoo VTC Administration</strong>
            <span style={{ fontSize: '12px', color: '#888' }}>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {post.image && (
          <div style={{ width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden', marginBottom: '48px', background: '#f0f0f0' }}>
            <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333' }} className="blog-content">
          {post.content.split('\n').map((paragraph, idx) => (
            <p key={idx} style={{ marginBottom: '24px' }}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
