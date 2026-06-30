"use client";

import { useCallback, useEffect, useState } from 'react';
import { Check, RefreshCw, ShieldCheck, X } from 'lucide-react';

export default function AriaInsightsPanel() {
  const [status, setStatus] = useState('pending');
  const [state, setState] = useState({ loading: true, insights: [], error: '' });
  const [reviewing, setReviewing] = useState(null);

  const loadInsights = useCallback(async () => {
    setState(current => ({ ...current, loading: true, error: '' }));
    try {
      const response = await fetch(`/api/admin/aria-insights?status=${status}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load insights.');
      setState({ loading: false, insights: data.insights || [], error: '' });
    } catch (error) {
      setState({ loading: false, insights: [], error: error.message });
    }
  }, [status]);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  const review = async (id, nextStatus) => {
    setReviewing(id);
    try {
      const response = await fetch('/api/admin/aria-insights', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Review failed.');
      setState(current => ({
        ...current,
        insights: current.insights.filter(item => item.id !== id),
      }));
    } catch (error) {
      setState(current => ({ ...current, error: error.message }));
    } finally {
      setReviewing(null);
    }
  };

  return (
    <section>
      <div className="aria-review-heading">
        <div>
          <div className="aria-review-kicker"><ShieldCheck size={15} /> Verified knowledge</div>
          <h2>ARIA Insight Review</h2>
          <p>ARIA never uses a learned insight until an administrator approves it here.</p>
        </div>
        <button type="button" className="aria-refresh" onClick={loadInsights}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="aria-review-tabs" role="tablist" aria-label="Insight status">
        {['pending', 'approved', 'rejected'].map(option => (
          <button
            type="button"
            role="tab"
            aria-selected={status === option}
            className={status === option ? 'active' : ''}
            key={option}
            onClick={() => setStatus(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {state.error && <div className="aria-review-error">{state.error}</div>}

      {state.loading ? (
        <div className="aria-review-empty">Loading insights...</div>
      ) : state.insights.length === 0 ? (
        <div className="aria-review-empty">
          <ShieldCheck size={34} />
          <strong>No {status} insights</strong>
          <span>New anonymous patterns suggested by ARIA will appear here.</span>
        </div>
      ) : (
        <div className="aria-review-list">
          {state.insights.map(item => (
            <article key={item.id} className="aria-review-card">
              <div>
                <span className={`aria-status ${item.status}`}>{item.status}</span>
                <p>{item.insight}</p>
                <time>{new Date(item.created_at).toLocaleString('en-KE')}</time>
              </div>
              {item.status === 'pending' && (
                <div className="aria-review-actions">
                  <button
                    type="button"
                    className="approve"
                    disabled={reviewing === item.id}
                    onClick={() => review(item.id, 'approved')}
                  >
                    <Check size={15} /> Approve
                  </button>
                  <button
                    type="button"
                    className="reject"
                    disabled={reviewing === item.id}
                    onClick={() => review(item.id, 'rejected')}
                  >
                    <X size={15} /> Reject
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <style jsx>{`
        .aria-review-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 24px;
        }
        .aria-review-kicker {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #0F6E56;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .8px;
          text-transform: uppercase;
        }
        h2 { margin: 8px 0 6px; font-family: var(--serif); font-size: 24px; }
        .aria-review-heading p { margin: 0; color: #64748b; font-size: 14px; }
        .aria-refresh, .aria-review-actions button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }
        .aria-refresh { padding: 9px 13px; border: 1px solid #dbe5e9; background: #fff; color: #31505d; }
        .aria-review-tabs { display: flex; gap: 8px; margin-bottom: 18px; }
        .aria-review-tabs button {
          padding: 8px 14px;
          border: 1px solid #dbe5e9;
          border-radius: 999px;
          background: #fff;
          color: #64748b;
          font-size: 12px;
          font-weight: 750;
          text-transform: capitalize;
          cursor: pointer;
        }
        .aria-review-tabs button.active { border-color: #0F6E56; background: #E1F5EE; color: #0F6E56; }
        .aria-review-list { display: grid; gap: 12px; }
        .aria-review-card {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 18px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #f8fafc;
        }
        .aria-review-card p { margin: 10px 0 8px; color: #1e293b; line-height: 1.6; }
        .aria-review-card time { color: #94a3b8; font-size: 11px; }
        .aria-status { padding: 4px 9px; border-radius: 999px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
        .aria-status.pending { background: #fef3c7; color: #92400e; }
        .aria-status.approved { background: #dcfce7; color: #166534; }
        .aria-status.rejected { background: #fee2e2; color: #991b1b; }
        .aria-review-actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
        .aria-review-actions button { padding: 9px 12px; border: 0; font-size: 12px; }
        .aria-review-actions .approve { background: #0F6E56; color: #fff; }
        .aria-review-actions .reject { background: #fff; color: #b91c1c; border: 1px solid #fecaca; }
        .aria-review-empty {
          min-height: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 1px dashed #cbd5e1;
          border-radius: 16px;
          color: #94a3b8;
          text-align: center;
        }
        .aria-review-empty strong { color: #475569; }
        .aria-review-error { margin-bottom: 16px; padding: 12px 14px; border: 1px solid #fecaca; border-radius: 10px; background: #fef2f2; color: #991b1b; font-size: 13px; }
        @media (max-width: 700px) {
          .aria-review-heading, .aria-review-card { flex-direction: column; }
          .aria-refresh { width: 100%; }
          .aria-review-tabs { overflow-x: auto; }
          .aria-review-actions { width: 100%; }
          .aria-review-actions button { flex: 1; }
        }
      `}</style>
    </section>
  );
}
