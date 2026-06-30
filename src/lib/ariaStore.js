import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && serviceRoleKey && !supabaseUrl.startsWith('your_')
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

function redactQuestion(question) {
  return question
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[email redacted]')
    .replace(/(?:\+?254|0)?[\s-]?(?:7|1)\d(?:[\s-]?\d){7,8}\b/g, '[phone redacted]')
    .replace(/\b\d{7,12}\b/g, '[number redacted]');
}

export async function recordAriaQuestion({ question, matchedCourse = null }) {
  if (!supabase || !question?.trim()) return;

  const { error } = await supabase.from('aria_questions').insert({
    question: redactQuestion(question.trim()).slice(0, 300),
    matched_course: matchedCourse,
  });

  if (error) {
    console.error('[ARIA Store] Failed to record question:', error.message);
  }
}

export async function getApprovedAriaInsights(limit = 100) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('aria_insights')
    .select('insight')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[ARIA Store] Failed to load approved insights:', error.message);
    return [];
  }

  return data || [];
}

export async function saveAriaInsight(insight) {
  const cleanedInsight = insight?.trim().slice(0, 500);
  if (!supabase || !cleanedInsight) return false;

  const { error } = await supabase.from('aria_insights').insert({
    insight: cleanedInsight,
    status: 'pending',
  });

  if (error) {
    console.error('[ARIA Store] Failed to save insight:', error.message);
    return false;
  }

  return true;
}

export async function checkAriaRateLimit(key, limit = 20, windowSeconds = 60) {
  if (!supabase) return null;

  const { data, error } = await supabase.rpc('check_aria_rate_limit', {
    p_key: key,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    console.error('[ARIA Store] Distributed rate limit unavailable:', error.message);
    return null;
  }

  const result = Array.isArray(data) ? data[0] : data;
  return result
    ? {
        allowed: Boolean(result.allowed),
        remaining: Number(result.remaining || 0),
        retryAfter: Number(result.retry_after || 0),
      }
    : null;
}

export async function listAriaInsights(status = 'pending', limit = 100) {
  if (!supabase) return { data: [], configured: false };

  let query = supabase
    .from('aria_insights')
    .select('id, insight, status, created_at, reviewed_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status !== 'all') query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;
  return { data: data || [], configured: true };
}

export async function reviewAriaInsight(id, status) {
  if (!supabase) throw new Error('Supabase is not configured');
  if (!['approved', 'rejected'].includes(status)) throw new Error('Invalid review status');

  const { data, error } = await supabase
    .from('aria_insights')
    .update({
      status,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id, insight, status, created_at, reviewed_at')
    .single();

  if (error) throw error;
  return data;
}
