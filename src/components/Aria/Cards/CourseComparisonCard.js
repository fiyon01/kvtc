"use client";

import React from 'react';
import { Award, Banknote, BriefcaseBusiness, CheckCircle2, ChevronRight, Clock3, Sparkles } from 'lucide-react';
import './CourseComparisonCard.css';

function summarizeBestFor(course) {
  const name = String(course?.name || '').toLowerCase();
  const duration = String(course?.dur || '').toLowerCase();

  if (duration.includes('month')) return 'Best for quick upskilling or adding a practical skill fast.';
  if (name.includes('computer operator')) return 'Best for a deeper ICT path with formal NITA training.';
  if (name.includes('packages')) return 'Best for basic office computer skills in a short time.';
  if (name.includes('barista') || name.includes('baking')) return 'Best for a focused hospitality skill.';
  if (name.includes('electrical') || name.includes('plumbing') || name.includes('welding')) return 'Best for hands-on technical training.';
  return 'Best for students who want this specific skill area.';
}

function CoursePanel({ course, side, onAction }) {
  const careers = (course.careers || []).slice(0, 3);
  const requirements = (course.requirements || []).slice(0, 4);

  return (
    <article className={`comparison-panel ${side}`}>
      <div className="comparison-panel-top">
        <span className="comparison-kicker">{side === 'left' ? 'Option A' : 'Option B'}</span>
        <h4>{course.name}</h4>
        {course.description && <p>{course.description}</p>}
      </div>

      <div className="comparison-stat-grid">
        <div><Clock3 size={15} /><span>Duration</span><strong>{course.dur || 'Ask admissions'}</strong></div>
        <div><Banknote size={15} /><span>Fee</span><strong>{course.fees || 'Ask admissions'}</strong></div>
        <div><Award size={15} /><span>Certificate</span><strong>{course.cert || 'Ask admissions'}</strong></div>
      </div>

      <div className="comparison-insight">
        <Sparkles size={15} />
        <span>{summarizeBestFor(course)}</span>
      </div>

      {careers.length > 0 && (
        <div className="comparison-list-block">
          <div className="comparison-list-title">
            <BriefcaseBusiness size={14} />
            <span>Career paths</span>
          </div>
          <ul>
            {careers.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
      )}

      {requirements.length > 0 && (
        <div className="comparison-list-block muted">
          <div className="comparison-list-title">
            <CheckCircle2 size={14} />
            <span>Requirements preview</span>
          </div>
          <ul>
            {requirements.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
      )}

      <div className="comparison-actions">
        <button
          type="button"
          className="comparison-apply"
          onClick={() => onAction?.('start_application', course.name)}
        >
          Apply for this course <ChevronRight size={15} />
        </button>
        <button
          type="button"
          className="comparison-secondary"
          onClick={() => onAction?.('send_message', `What are the requirements for ${course.name}?`)}
        >
          View full requirements
        </button>
      </div>
    </article>
  );
}

const CourseComparisonCard = ({ data, onAction }) => {
  const { courses } = data || {};

  if (!courses || courses.length !== 2) {
    return <div className="course-comparison-error">Please provide exactly two courses to compare.</div>;
  }

  const [courseA, courseB] = courses;

  return (
    <div className="course-comparison-card">
      <div className="course-comparison-header">
        <div>
          <span>Course comparison</span>
          <h3>{courseA.name} vs {courseB.name}</h3>
          <p>Compare duration, fees, certification, career direction and practical requirements before applying.</p>
        </div>
        <div className="vs-badge">VS</div>
      </div>

      <div className="course-comparison-grid">
        <CoursePanel course={courseA} side="left" onAction={onAction} />
        <CoursePanel course={courseB} side="right" onAction={onAction} />
      </div>
    </div>
  );
};

export default CourseComparisonCard;
