import { NextResponse } from 'next/server';
import { getTopCourses } from '@/lib/analytics';
import fs from 'fs';
import path from 'path';

const analyticsPath = path.join(process.cwd(), 'src', 'data', 'course_analytics.json');
const leadsPath = path.join(process.cwd(), 'src', 'data', 'leads.json');

function readLocalAnalytics() {
  try {
    if (!fs.existsSync(analyticsPath)) return [];
    const file = fs.readFileSync(analyticsPath, 'utf8');
    return file.trim() ? JSON.parse(file) : [];
  } catch { return []; }
}

function readLeads() {
  try {
    if (!fs.existsSync(leadsPath)) return [];
    const file = fs.readFileSync(leadsPath, 'utf8');
    return file.trim() ? JSON.parse(file) : [];
  } catch { return []; }
}

export async function GET() {
  try {
    // ── 1. Top courses (uses Supabase or JSON fallback automatically)
    const topCourses = await getTopCourses(10);

    // ── 2. Raw events for recent activity log
    let recentEvents = [];
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (url && key && !url.startsWith('your_')) {
        const supabase = createClient(url, key);
        const { data } = await supabase
          .from('course_events')
          .select('event_type, course_name, created_at')
          .order('created_at', { ascending: false })
          .limit(50);
        recentEvents = data || [];
      }
    } catch (_) {
      // Fallback to local JSON for recent events
      const raw = readLocalAnalytics();
      recentEvents = raw.slice(-50).reverse().map(e => ({
        event_type: e.type,
        course_name: e.course,
        created_at: e.timestamp
      }));
    }

    // ── 3. KPI calculations
    const allEvents = readLocalAnalytics();
    const today = new Date().toISOString().slice(0, 10);
    const eventsToday = allEvents.filter(e => (e.timestamp || '').startsWith(today)).length;
    const uniqueCourses = new Set(topCourses.map(c => c.course)).size;
    const totalEvents = allEvents.length;

    // ── 4. Funnel: compare ARIA mentions vs actual applications
    const leads = readLeads();
    const appCounts = {};
    leads.forEach(lead => {
      if (lead.course) {
        appCounts[lead.course] = (appCounts[lead.course] || 0) + 1;
      }
    });

    const funnelData = topCourses.slice(0, 7).map(item => {
      const applications = appCounts[item.course] || 0;
      const rate = item.count > 0 ? Math.round((applications / item.count) * 100) : 0;
      return {
        course: item.course,
        mentions: item.count,
        applications,
        rate
      };
    });

    return NextResponse.json({
      topCourses,
      recentEvents,
      funnelData,
      totalEvents,
      eventsToday,
      uniqueCourses
    });
  } catch (error) {
    console.error('Admin Analytics API Error:', error);
    return NextResponse.json({ topCourses: [], recentEvents: [], funnelData: [], totalEvents: 0, eventsToday: 0, uniqueCourses: 0 }, { status: 500 });
  }
}
