import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { isAdminRequest } from '@/lib/adminAuth';
import { listAriaInsights, reviewAriaInsight } from '@/lib/ariaStore';

const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');

function isAuthorized(req) {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return isAdminRequest(req, db.security?.password);
  } catch {
    return false;
  }
}

export async function GET(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
  }

  try {
    const status = new URL(req.url).searchParams.get('status') || 'pending';
    const result = await listAriaInsights(status);
    return NextResponse.json({
      insights: result.data,
      configured: result.configured,
    });
  } catch (error) {
    const missingTable = error?.code === '42P01' || /aria_insights/i.test(error?.message || '');
    return NextResponse.json(
      {
        error: missingTable
          ? 'ARIA insight tables have not been deployed to Supabase.'
          : 'Could not load ARIA insights.',
      },
      { status: missingTable ? 503 : 500 },
    );
  }
}

export async function PATCH(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = Number(body.id);
    const status = body.status;

    if (!Number.isInteger(id) || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid insight review request.' }, { status: 400 });
    }

    const insight = await reviewAriaInsight(id, status);
    return NextResponse.json({ success: true, insight });
  } catch (error) {
    console.error('[ARIA Admin] Review failed:', error.message);
    return NextResponse.json({ error: 'Could not update the insight.' }, { status: 500 });
  }
}
