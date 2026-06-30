"use client";

import React from 'react';
import * as LucideIcons from 'lucide-react';

// ─── Render plain text from AI with markdown-like formatting ─────────────────
function renderAIText(text) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} style={{ height: '8px' }} />;

    // **bold** support
    const parts = trimmed.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    // Bullet point
    if (trimmed.startsWith('•') || trimmed.startsWith('-') || (trimmed.startsWith('*') && !trimmed.startsWith('**'))) {
      const cleanText = trimmed.replace(/^[•\-*]\s*/, '');
      const cleanParts = cleanText.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return (
        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', margin: '4px 0' }}>
          <span style={{ color: '#0F6E56', fontWeight: 700, marginTop: '2px', flexShrink: 0 }}>•</span>
          <span style={{ fontSize: '14px', color: '#333', lineHeight: 1.6 }}>{cleanParts}</span>
        </div>
      );
    }

    // Numbered list
    if (/^\d+\./.test(trimmed)) {
      const numMatch = trimmed.match(/^\d+/)[0];
      const cleanText = trimmed.replace(/^\d+\.\s*/, '');
      const cleanParts = cleanText.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return (
        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', margin: '4px 0' }}>
          <span style={{ color: '#0F6E56', fontWeight: 700, minWidth: '20px', flexShrink: 0, fontSize: '13px' }}>{numMatch}.</span>
          <span style={{ fontSize: '14px', color: '#333', lineHeight: 1.6 }}>{cleanParts}</span>
        </div>
      );
    }

    // Section heading (ALL CAPS or ends with :)
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && !/^\d/.test(trimmed)) {
      return (
        <div key={i} style={{ fontSize: '11px', fontWeight: 700, color: '#0F6E56', letterSpacing: '1px', textTransform: 'uppercase', margin: '14px 0 6px' }}>
          {trimmed}
        </div>
      );
    }

    // Regular paragraph
    return (
      <p key={i} style={{ margin: '4px 0', fontSize: '14px', color: '#333', lineHeight: 1.65 }}>
        {parts}
      </p>
    );
  });
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ResponseRail({ data, onAction }) {
  if (!data) return null;

  // ── Real AI text response ──────────────────────────────────────────────────
  if (data.response_type === 'text' || data.response_type === 'application_wizard' || (!data.rail_items && data.text)) {
    return (
      <div className="ai-text-response">
        {/* Avatar */}
        <div className="ai-avatar">
          <img src="/aria-avatar.png" alt="" aria-hidden="true" />
        </div>

        {/* Bubble */}
        <div className="ai-bubble">
          {/* ARIA name tag */}
          <div className="ai-name-tag">
            <span className="ai-name">ARIA</span>
            <span className="ai-role">· Virtual Admissions Assistant</span>
          </div>

          {/* Content */}
          <div className="ai-content">
            {renderAIText(data.text || data.content)}
          </div>

          {/* Timestamp */}
          {data.timestamp && (
            <div className="ai-timestamp">
              {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        <style jsx>{`
          .ai-text-response {
            display: flex;
            gap: 10px;
            align-items: flex-start;
            max-width: 100%;
            animation: msgIn 0.35s cubic-bezier(0.22,1,0.36,1) both;
          }

          @keyframes msgIn {
            from { opacity: 0; transform: translateY(10px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }

          .ai-avatar {
            width: 38px;
            height: 38px;
            background: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border: 1px solid rgba(15,110,86,0.16);
            box-shadow: 0 6px 16px rgba(15,110,86,0.16);
            margin-top: 2px;
            overflow: hidden;
            padding: 2px;
          }

          .ai-avatar img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            object-position: center;
            transform: scale(1.22);
            display: block;
          }

          .ai-bubble {
            flex: 1;
            background: #ffffff;
            border: 1.5px solid rgba(15,110,86,0.12);
            border-radius: 3px 18px 18px 18px;
            padding: 13px 16px 10px;
            box-shadow: 0 2px 14px rgba(0,0,0,0.06);
            position: relative;
          }

          .ai-name-tag {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-bottom: 9px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(15,110,86,0.08);
          }

          .ai-name {
            font-size: 12px;
            font-weight: 800;
            color: #0F6E56;
            letter-spacing: 0.5px;
          }

          .ai-role {
            font-size: 11px;
            color: #aaa;
            font-weight: 500;
          }

          .ai-content {
            line-height: 1.65;
            color: #1a1a1a;
          }

          .ai-timestamp {
            margin-top: 9px;
            font-size: 10px;
            color: #c0c0c0;
            font-weight: 500;
            text-align: right;
          }
        `}</style>
      </div>
    );
  }

  // ── Structured rail response (legacy mock / quick actions) ─────────────────
  if (!data.rail_items) return null;

  return (
    <div className="response-rail-container">
      {data.title && <h3 className="rail-main-title">{data.title}</h3>}
      {data.intro && <p className="rail-intro">{data.intro}</p>}
      
      <div className="rail-timeline">
        <div className="vertical-connector"></div>
        
        {data.rail_items.map((item, idx) => {
          const IconComponent = LucideIcons[item.icon] || LucideIcons.Info;
          return (
            <div key={idx} className="rail-item">
              <div className="rail-icon"><IconComponent size={14} color="#0F6E56" strokeWidth={2.5} /></div>
              <div className="rail-card">
                <div className="rail-header">
                  <h4>{item.title}</h4>
                  {item.badge && <span className="rail-badge">{item.badge}</span>}
                </div>
                <div className="rail-body">
                  <p>{item.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .response-rail-container {
          background: #fff;
          border-radius: 16px;
          padding: 20px 0;
          max-width: 500px;
        }
        .rail-main-title {
          font-size: 18px;
          font-family: var(--serif);
          color: #1a1a1a;
          margin: 0 0 8px 24px;
        }
        .rail-intro {
          font-size: 14px;
          color: #555;
          margin: 0 0 20px 24px;
          line-height: 1.5;
        }
        .rail-timeline {
          position: relative;
          padding-left: 24px;
        }
        .vertical-connector {
          position: absolute;
          left: 36px;
          top: 20px;
          bottom: 20px;
          width: 2px;
          background: #e0e0e0;
          z-index: 1;
        }
        .rail-item {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          position: relative;
          z-index: 2;
          padding-right: 24px;
        }
        .rail-item:last-child { margin-bottom: 0; }
        .rail-icon {
          width: 26px;
          height: 26px;
          background: #fff;
          border: 2px solid #0F6E56;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 4px;
          box-shadow: 0 0 0 4px #fff;
        }
        .rail-card {
          flex: 1;
          background: #fdfdfc;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .rail-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          border-color: rgba(15,110,86,0.3);
        }
        .rail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          gap: 10px;
        }
        .rail-header h4 {
          margin: 0;
          font-size: 15px;
          color: #1a1a1a;
          font-weight: 600;
        }
        .rail-badge {
          font-size: 11px;
          font-weight: 600;
          color: #0F6E56;
          background: #E1F5EE;
          padding: 4px 8px;
          border-radius: 100px;
          white-space: nowrap;
        }
        .rail-body p {
          margin: 0;
          font-size: 14px;
          color: #444;
          line-height: 1.5;
        }
        @media (max-width: 480px) {
          .rail-timeline { padding-left: 12px; }
          .vertical-connector { left: 24px; }
          .rail-item { padding-right: 12px; }
        }
      `}</style>
    </div>
  );
}
