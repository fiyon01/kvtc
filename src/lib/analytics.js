import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// ── Supabase client (server-side, uses service role key for writes) ────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseKey && !supabaseUrl.startsWith('your_')
    ? createClient(supabaseUrl, supabaseKey)
    : null;

// ── JSON fallback (used when Supabase is not yet configured) ──────────────────
const analyticsPath = path.join(process.cwd(), 'src', 'data', 'course_analytics.json');

function readLocalAnalytics() {
  try {
    if (!fs.existsSync(analyticsPath)) return [];
    const file = fs.readFileSync(analyticsPath, 'utf8');
    return file.trim() ? JSON.parse(file) : [];
  } catch {
    return [];
  }
}

function writeLocalAnalytics(data) {
  fs.writeFileSync(analyticsPath, JSON.stringify(data, null, 2), 'utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Logs an event indicating a course was mentioned, clicked, or explored.
 * Uses Supabase if configured, falls back to local JSON file.
 *
 * @param {string} eventType  e.g. 'aria_mention' | 'aria_requirements' | 'apply_click'
 * @param {string} courseName The name of the course being tracked
 */
export async function trackCourseEvent(eventType, courseName) {
  if (!courseName) return;

  // ── Supabase path ──
  if (supabase) {
    try {
      const { error } = await supabase
        .from('course_events')
        .insert({ event_type: eventType, course_name: courseName });

      if (error) throw error;
      return; // success — skip local fallback
    } catch (err) {
      console.error('[Analytics] Supabase insert failed, falling back to JSON:', err.message);
    }
  }

  // ── Local JSON fallback ──
  try {
    let data = readLocalAnalytics();
    data.push({ type: eventType, course: courseName, timestamp: new Date().toISOString() });
    // Keep only the last 10,000 events to prevent unbounded growth
    if (data.length > 10000) data = data.slice(data.length - 10000);
    writeLocalAnalytics(data);
  } catch (err) {
    console.error('[Analytics] Local JSON write failed:', err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Aggregates tracked events and returns the top requested courses.
 * Uses Supabase if configured, falls back to local JSON file.
 *
 * @param {number} limit  Number of top courses to return (default: 5)
 * @returns {Promise<Array<{course: string, count: number}>>}
 */
export async function getTopCourses(limit = 5) {
  // ── Supabase path ──
  if (supabase) {
    try {
      // Use a Postgres aggregate to count and sort server-side — fast even at scale
      const { data, error } = await supabase
        .from('course_events')
        .select('course_name')
        .order('created_at', { ascending: false })
        .limit(5000); // read last 5k events for aggregation

      if (error) throw error;

      const counts = {};
      data.forEach(row => {
        if (row.course_name) {
          const rawName = row.course_name.trim();
          // We can just rely on the exact string if it comes from our DB, but let's normalize case just in case.
          const name = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
          counts[name] = (counts[name] || 0) + 1;
        }
      });

      return Object.entries(counts)
        .map(([course, count]) => ({ course, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    } catch (err) {
      console.error('[Analytics] Supabase read failed, falling back to JSON:', err.message);
    }
  }

  // ── Local JSON fallback ──
  try {
    const data = readLocalAnalytics();
    const counts = {};
    data.forEach(event => {
      if (event.course) {
        const rawName = event.course.trim();
        const name = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
        counts[name] = (counts[name] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([course, count]) => ({ course, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Increments a funnel stage counter.
 */
const funnelPath = path.join(process.cwd(), 'src', 'data', 'funnel_stats.json');

const DEFAULT_FUNNEL = {
  page_visits: 0, aria_chats: 0, apply_starts: 0, apply_completes: 0, enrolled: 0,
  last_updated: new Date().toISOString(),
};

function readFunnel() {
  try {
    if (!fs.existsSync(funnelPath)) return { ...DEFAULT_FUNNEL };
    const file = fs.readFileSync(funnelPath, 'utf8');
    return file.trim() ? JSON.parse(file) : { ...DEFAULT_FUNNEL };
  } catch { return { ...DEFAULT_FUNNEL }; }
}

function writeFunnel(data) {
  fs.writeFileSync(funnelPath, JSON.stringify({ ...data, last_updated: new Date().toISOString() }, null, 2), 'utf8');
}

export async function incrementFunnel(stage, value) {
  const validStages = ['page_visits', 'aria_chats', 'apply_starts', 'apply_completes', 'enrolled'];
  if (!validStages.includes(stage)) return;

  if (supabase) {
    try {
      const { data: currentData, error: readError } = await supabase.from('funnel_stats').select('*').limit(1).single();
      if (!readError && currentData) {
        const updates = {};
        if (stage === 'enrolled' && value !== undefined) {
          updates.enrolled = Math.max(0, Number(value) || 0);
        } else {
          updates[stage] = (currentData[stage] || 0) + 1;
        }
        updates.last_updated = new Date().toISOString();
        const { error: updateError } = await supabase.from('funnel_stats').update(updates).eq('id', currentData.id);
        if (!updateError) return { ...currentData, ...updates };
      }
    } catch (err) { console.error('[Funnel] Supabase update failed:', err.message); }
  }

  // JSON fallback
  const data = readFunnel();
  if (stage === 'enrolled' && value !== undefined) {
    data.enrolled = Math.max(0, Number(value) || 0);
  } else {
    data[stage] = (data[stage] || 0) + 1;
  }
  writeFunnel(data);
  return data;
}
