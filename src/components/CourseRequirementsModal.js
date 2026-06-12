"use client";

import { createPortal } from "react-dom";

export default function CourseRequirementsModal({ course, onChooseAnother, onConfirm }) {
  if (!course) return null;
  const requirements = Array.isArray(course.requirements) ? course.requirements : [];

  return createPortal(
    <div className="course-review-backdrop">
      <section className="course-review-modal" role="dialog" aria-modal="true" aria-labelledby="course-review-title">
        <header>
          <div>
            <span>Review your programme</span>
            <h2 id="course-review-title">{course.name}</h2>
            <p>Confirm the programme details and its specific training requirements.</p>
          </div>
          <button type="button" onClick={onChooseAnother} aria-label="Close course requirements">×</button>
        </header>

        <div className="course-review-summary">
          <div><span>Duration</span><strong>{course.dur || 'Contact institution'}</strong></div>
          <div><span>Certification</span><strong>{course.cert || 'Internal'}</strong></div>
          <div><span>Course fee</span><strong>{course.fees || 'Contact institution'}</strong></div>
          <div><span>Department</span><strong>{course.tag || 'Vocational Training'}</strong></div>
        </div>

        <div className="course-review-body">
          <div className="course-review-heading">
            <div>
              <span>Course-specific requirements</span>
              <strong>{requirements.length} item{requirements.length === 1 ? '' : 's'}</strong>
            </div>
            <p>Prepare these items before reporting for training.</p>
          </div>
          {requirements.length ? (
            <ol>
              {requirements.map((item, index) => (
                <li key={`${course.id || course.slug}-${index}`}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="course-review-empty">No additional course-specific equipment is currently listed.</div>
          )}
        </div>

        <footer>
          <p>By continuing, you confirm that you have reviewed these requirements.</p>
          <div>
            <button type="button" className="course-review-secondary" onClick={onChooseAnother}>Choose Another Course</button>
            <button type="button" className="course-review-primary" onClick={onConfirm}>Continue With This Course</button>
          </div>
        </footer>
      </section>
      <style>{`
        .course-review-backdrop{position:fixed;inset:0;z-index:1000000;display:grid;place-items:center;padding:20px;background:rgba(15,31,40,.66);backdrop-filter:blur(7px)}
        .course-review-modal{width:min(760px,100%);max-height:min(88vh,820px);display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(47,121,183,.2);border-radius:20px;background:#fff;box-shadow:0 30px 90px rgba(10,31,42,.32);font-family:var(--sans)}
        .course-review-modal header{display:flex;justify-content:space-between;gap:20px;padding:24px 26px 20px;border-top:4px solid #2F79B7;background:linear-gradient(135deg,#f8fbfd,#f4faf7)}
        .course-review-modal header span,.course-review-heading span{color:#2F79B7;font-size:9px;font-weight:850;letter-spacing:1.2px;text-transform:uppercase}
        .course-review-modal h2{margin:7px 0 5px;color:#1d3440;font-family:var(--serif);font-size:clamp(22px,3vw,30px);line-height:1.2}
        .course-review-modal header p{margin:0;color:#6f818a;font-size:12px;line-height:1.5}
        .course-review-modal header>button{width:38px;height:38px;flex-shrink:0;border:1px solid #dce5e9;border-radius:11px;background:#fff;color:#516873;font-size:22px;cursor:pointer}
        .course-review-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#dfe8ec;border-block:1px solid #dfe8ec}
        .course-review-summary div{min-width:0;padding:14px 16px;background:#fff}
        .course-review-summary span{display:block;margin-bottom:5px;color:#809099;font-size:8px;font-weight:800;letter-spacing:.7px;text-transform:uppercase}
        .course-review-summary strong{display:block;color:#263f4b;font-size:12px;line-height:1.35}
        .course-review-body{flex:1;overflow-y:auto;padding:22px 26px}
        .course-review-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:15px}
        .course-review-heading strong{display:block;margin-top:4px;color:#263f4b;font-size:14px}
        .course-review-heading p{margin:0;color:#829199;font-size:10px}
        .course-review-body ol{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0;padding:0;list-style:none}
        .course-review-body li{display:flex;align-items:flex-start;gap:10px;min-height:46px;padding:10px 11px;border:1px solid #e2eaed;border-radius:10px;background:#f9fbfc}
        .course-review-body li>span{color:#2F79B7;font-size:9px;font-weight:850;letter-spacing:.5px}
        .course-review-body li p{margin:0;color:#405660;font-size:11px;line-height:1.45}
        .course-review-empty{padding:24px;border-radius:11px;background:#f6f9fa;color:#72838c;font-size:12px;text-align:center}
        .course-review-modal footer{padding:17px 26px 21px;border-top:1px solid #e3eaed;background:#fafcfc}
        .course-review-modal footer>p{margin:0 0 12px;color:#71828b;font-size:10px}
        .course-review-modal footer>div{display:flex;justify-content:flex-end;gap:9px}
        .course-review-modal footer button{min-height:43px;padding:0 17px;border-radius:9px;font-size:11px;font-weight:750;cursor:pointer}
        .course-review-secondary{border:1px solid #cedae0;background:#fff;color:#405660}
        .course-review-primary{border:0;background:linear-gradient(135deg,#0F6E56,#198665);color:#fff;box-shadow:0 8px 20px rgba(15,110,86,.18)}
        @media(max-width:640px){.course-review-backdrop{align-items:end;padding:0}.course-review-modal{width:100%;max-height:91vh;border-radius:22px 22px 0 0}.course-review-modal header{padding:22px 18px 17px}.course-review-summary{grid-template-columns:1fr 1fr}.course-review-body{padding:18px}.course-review-body ol{grid-template-columns:1fr}.course-review-heading{align-items:flex-start;flex-direction:column;gap:5px}.course-review-modal footer{padding:14px 18px max(18px,env(safe-area-inset-bottom))}.course-review-modal footer>div{flex-direction:column-reverse}.course-review-modal footer button{width:100%}}
      `}</style>
    </div>,
    document.body
  );
}
