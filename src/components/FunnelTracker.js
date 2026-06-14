"use client";
import { useEffect } from 'react';

/**
 * Silently fires a funnel tracking event on mount.
 * Usage: <FunnelTracker stage="page_visits" /> or <FunnelTracker stage="apply_starts" />
 */
export default function FunnelTracker({ stage }) {
  useEffect(() => {
    fetch('/api/funnel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    }).catch(() => {}); // silent — never block UI
  }, [stage]);

  return null;
}
