"use client";

import { createPortal } from "react-dom";

export default function CourseRequirementsModal({ course, onChooseAnother, onConfirm }) {
  if (!course) return null;

  const requirements = Array.isArray(course.requirements) ? course.requirements : [];
  const summary = [
    { label: "Duration", value: course.dur || "Contact institution" },
    { label: "Certification", value: course.cert || "Internal" },
    { label: "Course fee", value: course.fees || "Contact institution" },
    { label: "Department", value: course.tag || "Vocational Training" },
  ];

  return createPortal(
    <div className="course-review-backdrop">
      <section className="course-review-modal" role="dialog" aria-modal="true" aria-labelledby="course-review-title">
        <header className="course-review-header">
          <div>
            <span>Review programme requirements</span>
            <h2 id="course-review-title">{course.name}</h2>
            <p>Check the course details and reporting requirements before continuing.</p>
          </div>
          <button type="button" onClick={onChooseAnother} aria-label="Close course requirements">×</button>
        </header>

        <div className="course-review-content">
          <aside className="course-review-summary" aria-label="Course summary">
            {summary.map(item => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </aside>

          <main className="course-review-body">
            <div className="course-review-heading">
              <div>
                <span>What you need to prepare</span>
                <strong>{requirements.length || "No"} listed requirement{requirements.length === 1 ? "" : "s"}</strong>
              </div>
              <p>These are shown before admission so the applicant knows what the course expects.</p>
            </div>

            {requirements.length ? (
              <ol className="course-review-list">
                {requirements.map((item, index) => (
                  <li key={`${course.id || course.slug || course.name}-${index}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="course-review-empty">
                No additional course-specific equipment is currently listed for this programme.
              </div>
            )}
          </main>
        </div>

        <footer className="course-review-footer">
          <p>By continuing, you confirm that you have reviewed these requirements.</p>
          <div>
            <button type="button" className="course-review-secondary" onClick={onChooseAnother}>
              Choose Another
            </button>
            <button type="button" className="course-review-primary" onClick={onConfirm}>
              Continue With Course
            </button>
          </div>
        </footer>
      </section>

      <style>{`
        .course-review-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000000;
          display: grid;
          place-items: center;
          padding: clamp(14px, 2vw, 24px);
          background: rgba(8, 24, 35, 0.68);
          backdrop-filter: blur(8px);
        }

        .course-review-modal {
          width: min(940px, 100%);
          max-height: min(92vh, 860px);
          display: grid;
          grid-template-rows: auto minmax(0, 1fr) auto;
          overflow: hidden;
          border: 1px solid rgba(47, 121, 183, 0.24);
          border-radius: 24px;
          background: #fff;
          box-shadow: 0 30px 90px rgba(10, 31, 42, 0.34);
          font-family: var(--sans);
        }

        .course-review-header {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 24px 28px 20px;
          border-top: 5px solid #2F79B7;
          background:
            radial-gradient(circle at 14% 18%, rgba(47, 121, 183, 0.13), transparent 27%),
            linear-gradient(135deg, #f8fbfd, #f6fbf8);
        }

        .course-review-header span,
        .course-review-heading span,
        .course-review-summary span {
          color: #2F79B7;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 1.15px;
          text-transform: uppercase;
        }

        .course-review-header h2 {
          margin: 8px 0 6px;
          color: #183241;
          font-family: var(--serif);
          font-size: clamp(23px, 3vw, 34px);
          line-height: 1.12;
        }

        .course-review-header p {
          margin: 0;
          max-width: 560px;
          color: #657984;
          font-size: 13px;
          line-height: 1.55;
        }

        .course-review-header > button {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border: 1px solid #dce5e9;
          border-radius: 13px;
          background: #fff;
          color: #405660;
          font-size: 24px;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(10, 31, 42, 0.08);
        }

        .course-review-content {
          min-height: 0;
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr);
          gap: 0;
          overflow: hidden;
          background: #edf3f6;
        }

        .course-review-summary {
          display: grid;
          align-content: start;
          gap: 10px;
          padding: 22px;
          overflow-y: auto;
          background: linear-gradient(180deg, #f7fbfd, #f2f8f5);
          border-right: 1px solid #dbe7ec;
        }

        .course-review-summary div {
          min-width: 0;
          padding: 14px 15px;
          border: 1px solid rgba(47, 121, 183, 0.13);
          border-radius: 15px;
          background: #fff;
          box-shadow: 0 10px 25px rgba(10, 31, 42, 0.05);
        }

        .course-review-summary strong {
          display: block;
          margin-top: 6px;
          color: #233f4d;
          font-size: 13px;
          line-height: 1.35;
        }

        .course-review-body {
          min-height: 0;
          overflow-y: auto;
          padding: 24px 28px 28px;
          background: #fff;
        }

        .course-review-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 22px;
          margin-bottom: 18px;
        }

        .course-review-heading strong {
          display: block;
          margin-top: 5px;
          color: #1d3440;
          font-size: 17px;
        }

        .course-review-heading p {
          max-width: 290px;
          margin: 0;
          color: #758992;
          font-size: 12px;
          line-height: 1.45;
          text-align: right;
        }

        .course-review-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .course-review-list li {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 12px;
          min-height: 64px;
          padding: 15px 16px;
          border: 1px solid #e2eaed;
          border-radius: 16px;
          background: linear-gradient(180deg, #ffffff, #f8fbfc);
          box-shadow: 0 10px 28px rgba(10, 31, 42, 0.045);
        }

        .course-review-list li > span {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: rgba(47, 121, 183, 0.1);
          color: #2F79B7;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.4px;
        }

        .course-review-list li p {
          margin: 0;
          color: #344f5c;
          font-size: 13px;
          line-height: 1.52;
        }

        .course-review-empty {
          padding: 28px;
          border: 1px dashed #cfdde3;
          border-radius: 16px;
          background: #f6f9fa;
          color: #6d8089;
          font-size: 13px;
          text-align: center;
        }

        .course-review-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 18px 28px 22px;
          border-top: 1px solid #e3eaed;
          background: #fafcfc;
        }

        .course-review-footer > p {
          max-width: 330px;
          margin: 0;
          color: #71828b;
          font-size: 11px;
          line-height: 1.45;
        }

        .course-review-footer > div {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .course-review-footer button {
          min-height: 45px;
          padding: 0 18px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .course-review-secondary {
          border: 1px solid #cedae0;
          background: #fff;
          color: #405660;
        }

        .course-review-primary {
          border: 0;
          background: linear-gradient(135deg, #0F6E56, #198665);
          color: #fff;
          box-shadow: 0 10px 24px rgba(15, 110, 86, 0.2);
        }

        @media (max-width: 760px) {
          .course-review-backdrop {
            align-items: end;
            padding: 0;
          }

          .course-review-modal {
            width: 100%;
            height: 100dvh;
            max-height: 100dvh;
            border-radius: 24px 24px 0 0;
          }

          .course-review-header {
            padding: 15px 16px 13px;
          }

          .course-review-header h2 {
            margin: 5px 0 0;
            font-size: clamp(20px, 6.3vw, 27px);
          }

          .course-review-header p {
            display: none;
          }

          .course-review-header > button {
            width: 36px;
            height: 36px;
            border-radius: 12px;
          }

          .course-review-content {
            grid-template-columns: 1fr;
            grid-template-rows: auto minmax(0, 1fr);
            overflow: hidden;
            background: #fff;
          }

          .course-review-summary {
            grid-auto-flow: column;
            grid-auto-columns: minmax(136px, 1fr);
            grid-template-columns: none;
            gap: 7px;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 10px 12px;
            border-right: 0;
            border-bottom: 1px solid #dbe7ec;
            scrollbar-width: thin;
          }

          .course-review-summary div {
            padding: 8px 10px;
            border-radius: 12px;
          }

          .course-review-summary span {
            font-size: 7.5px;
            letter-spacing: 0.75px;
          }

          .course-review-summary strong {
            margin-top: 3px;
            font-size: 10.5px;
          }

          .course-review-body {
            min-height: 0;
            overflow-y: auto;
            padding: 15px 14px 18px;
          }

          .course-review-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 7px;
          }

          .course-review-heading p {
            max-width: none;
            text-align: left;
          }

          .course-review-list {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .course-review-list li {
            min-height: 0;
            padding: 13px;
          }

          .course-review-footer {
            display: block;
            padding: 10px 14px max(12px, env(safe-area-inset-bottom));
          }

          .course-review-footer > p {
            display: none;
          }

          .course-review-footer > div {
            display: grid;
            grid-template-columns: 0.92fr 1.08fr;
            gap: 8px;
          }

          .course-review-footer button {
            width: 100%;
            min-height: 43px;
            padding: 0 10px;
            font-size: 11px;
          }

          .course-review-primary {
            order: -1;
          }
        }

        @media (max-width: 380px) {
          .course-review-modal {
            height: 100dvh;
            max-height: 100dvh;
          }

          .course-review-summary {
            grid-auto-columns: minmax(132px, 1fr);
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
