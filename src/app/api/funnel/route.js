import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { incrementFunnel } from '@/lib/analytics';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey && !supabaseUrl.startsWith('your_')
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const funnelPath = path.join(process.cwd(), 'src', 'data', 'funnel_stats.json');
const DEFAULT_FUNNEL = { page_visits: 0, aria_chats: 0, apply_starts: 0, apply_completes: 0, enrolled: 0, last_updated: new Date().toISOString() };

function readFunnel() {
  try {
    if (!fs.existsSync(funnelPath)) return { ...DEFAULT_FUNNEL };
    const file = fs.readFileSync(funnelPath, 'utf8');
    return file.trim() ? JSON.parse(file) : { ...DEFAULT_FUNNEL };
  } catch { return { ...DEFAULT_FUNNEL }; }
}

// GET /api/funnel — read funnel stats
export async function GET() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('funnel_stats').select('*').limit(1).single();
      if (!error && data) {
        return NextResponse.json(data);
      }
    } catch (err) {
      console.error('[Funnel API] Supabase read failed, falling back to JSON:', err.message);
    }
  }

  try {
    const data = readFunnel();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Could not read funnel' }, { status: 500 });
  }
}

// POST /api/funnel — increment a stage
export async function POST(req) {
  try {
    const { stage, value } = await req.json();
    const data = await incrementFunnel(stage, value);
    if (!data) return NextResponse.json({ error: 'Invalid stage' }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
