import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey && !supabaseUrl.startsWith('your_')
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const leadsPath = path.join(process.cwd(), 'src', 'data', 'leads.json');

function readLeads() {
  try {
    if (!fs.existsSync(leadsPath)) return [];
    const file = fs.readFileSync(leadsPath, 'utf8');
    return file.trim() ? JSON.parse(file) : [];
  } catch { return []; }
}

function writeLeads(data) {
  fs.writeFileSync(leadsPath, JSON.stringify(data, null, 2), 'utf8');
}

// POST /api/leads — save a new lead
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, course, source = 'exit_intent' } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const newLead = {
      id: `lead_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      course: course?.trim() || 'Not specified',
      source,
      status: 'new',
      timestamp: new Date().toISOString(),
    };

    // Supabase path
    if (supabase) {
      try {
        // Simple check for duplicates by phone in Supabase (optional, but good)
        const { data: existing } = await supabase.from('leads').select('id').eq('phone', newLead.phone).limit(1);
        if (existing && existing.length > 0) {
           return NextResponse.json({ success: true, message: 'Lead already captured' });
        }

        const { error } = await supabase.from('leads').insert(newLead);
        if (!error) {
          return NextResponse.json({ success: true, lead: newLead });
        }
      } catch (err) {
        console.error('[Leads API] Supabase insert failed, falling back to JSON:', err.message);
      }
    }

    // JSON fallback
    const leads = readLeads();
    const duplicate = leads.find(l => l.phone === newLead.phone);
    if (duplicate) {
      return NextResponse.json({ success: true, message: 'Lead already captured' });
    }

    leads.unshift(newLead); // newest first
    if (leads.length > 5000) leads.splice(5000);
    writeLeads(leads);

    return NextResponse.json({ success: true, lead: newLead });
  } catch (err) {
    console.error('[Leads API] Error:', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET /api/leads — fetch all leads (admin only)
export async function GET() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('leads').select('*').order('timestamp', { ascending: false }).limit(5000);
      if (!error && data) {
        return NextResponse.json({ leads: data, total: data.length });
      }
    } catch (err) {
      console.error('[Leads API] Supabase read failed, falling back to JSON:', err.message);
    }
  }

  try {
    const leads = readLeads();
    return NextResponse.json({ leads, total: leads.length });
  } catch (err) {
    return NextResponse.json({ error: 'Could not read leads' }, { status: 500 });
  }
}

