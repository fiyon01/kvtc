"use client";

import React from 'react';
import * as LucideIcons from 'lucide-react';
import ResponseRail from '../ResponseRail';

export default function CourseRecommendationCard({ data, onAction }) {
  if (!data || !data.courses) return null;

  return (
    <div className="course-recommendation-container">
      {data.title && <h3 className="rail-main-title">{data.title}</h3>}
      {data.intro && <p className="rail-intro">{data.intro}</p>}
      
      <div className="courses-list">
        {data.courses.map((course, idx) => (
          <div key={idx} className="course-card">
             <div className="course-header">
                <div className="course-title-area">
                  <h4>{course.name}</h4>
                  {course.match_label && <span className="match-badge">{course.match_label}</span>}
                </div>
                <p className="course-why">{course.why_it_fits}</p>
             </div>
             
             {/* Mini Rail for course details */}
             <div className="course-details">
                {course.rail_items && course.rail_items.map((item, i) => {
                  const IconComponent = LucideIcons[item.icon] || LucideIcons.Info;
                  return (
                  <div key={i} className="mini-rail-item">
                    <span className="mini-icon"><IconComponent size={14} color="#0F6E56" /></span>
                    <div className="mini-content">
                      <span className="mini-title">{item.title}: </span>
                      <span className="mini-text">{item.content}</span>
                      {item.badge && <span className="mini-badge">{item.badge}</span>}
                    </div>
                  </div>
                  );
                })}
             </div>
             
             {course.actions && (
               <div className="course-actions">
                 {course.actions.map((btn, i) => (
                    <button 
                      key={i} 
                      className={`smart-btn ${btn.type || 'secondary'}`}
                      onClick={() => onAction(btn.action, btn.payload || btn.label)}
                    >
                      {btn.label}
                    </button>
                 ))}
               </div>
             )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .course-recommendation-container {
          background: #fff;
          border-radius: 16px;
          padding: 20px 0;
          max-width: 600px;
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

        .courses-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 0 24px;
        }

        .course-card {
          background: #fdfdfc;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          position: relative;
          overflow: hidden;
        }
        
        .course-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, #0F6E56, #4ade80);
        }

        .course-title-area {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .course-title-area h4 {
          margin: 0;
          font-size: 18px;
          color: #1a1a1a;
        }

        .match-badge {
          background: linear-gradient(135deg, #EF9F27, #f59e0b);
          color: #fff;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .course-why {
          font-size: 13px;
          color: #555;
          margin: 0 0 16px 0;
          background: rgba(15,110,86,0.05);
          padding: 10px 12px;
          border-left: 3px solid #0F6E56;
          border-radius: 0 8px 8px 0;
        }

        .course-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .mini-rail-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .mini-icon {
          font-size: 16px;
          background: #E1F5EE;
          width: 28px; height: 28px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .mini-content {
          font-size: 13px;
          line-height: 1.4;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
        }

        .mini-title {
          font-weight: 600;
          color: #333;
        }

        .mini-text {
          color: #555;
        }

        .mini-badge {
          font-size: 10px;
          font-weight: 600;
          background: #f0f0f0;
          padding: 2px 6px;
          border-radius: 4px;
          color: #555;
        }

        .course-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          border-top: 1px solid rgba(0,0,0,0.05);
          padding-top: 16px;
        }

        .smart-btn {
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 1.5px solid transparent;
        }

        .primary {
          background: #0F6E56;
          color: white;
        }

        .primary:hover {
          background: #0c5a46;
          transform: translateY(-2px);
        }

        .secondary {
          background: transparent;
          color: #0F6E56;
          border-color: #0F6E56;
        }

        .secondary:hover {
          background: #E1F5EE;
        }
      `}</style>
    </div>
  );
}
