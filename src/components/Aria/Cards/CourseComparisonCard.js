import React from 'react';
import './CourseComparisonCard.css';

const CourseComparisonCard = ({ data }) => {
  const { courses } = data || {};
  
  if (!courses || courses.length !== 2) {
    return <div className="course-comparison-error">Please provide exactly two courses to compare.</div>;
  }

  const [courseA, courseB] = courses;

  return (
    <div className="course-comparison-card">
      <div className="course-comparison-header">
        <h3 className="course-title">{courseA.name || 'Course A'}</h3>
        <div className="vs-badge">VS</div>
        <h3 className="course-title">{courseB.name || 'Course B'}</h3>
      </div>
      
      <div className="course-comparison-body">
        <div className="comparison-row">
          <div className="course-attr">{courseA.dur || 'N/A'}</div>
          <div className="attr-label">Duration</div>
          <div className="course-attr">{courseB.dur || 'N/A'}</div>
        </div>
        <div className="comparison-row">
          <div className="course-attr">{courseA.fees || 'N/A'}</div>
          <div className="attr-label">Fees</div>
          <div className="course-attr">{courseB.fees || 'N/A'}</div>
        </div>
        <div className="comparison-row">
          <div className="course-attr">{courseA.cert || 'N/A'}</div>
          <div className="attr-label">Exam Body</div>
          <div className="course-attr">{courseB.cert || 'N/A'}</div>
        </div>
      </div>

      <div className="course-comparison-footer">
        <button className="apply-btn apply-btn-a">Apply for {courseA.name || 'Course A'}</button>
        <button className="apply-btn apply-btn-b">Apply for {courseB.name || 'Course B'}</button>
      </div>
    </div>
  );
};

export default CourseComparisonCard;
