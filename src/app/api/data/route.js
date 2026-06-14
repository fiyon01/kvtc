import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  clearAdminCookie,
  isAdminRequest,
  setAdminCookie,
  verifyAdminPassword,
} from '@/lib/adminAuth';
import { rateLimit, requestIp } from '@/lib/rateLimit';

const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');

export async function GET(req) {
  try {
    const file = fs.readFileSync(dbPath, 'utf8');
    const data = JSON.parse(file);
    const isAdmin = isAdminRequest(req, data.security?.password);
    delete data.security;
    if (!isAdmin) {
      delete data.applications;
      delete data.newsletterSubscribers;
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey && !supabaseUrl.startsWith('your_')
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function POST(req) {
  try {
    const body = await req.json();
    const file = fs.readFileSync(dbPath, 'utf8');
    const currentData = JSON.parse(file);

    if (body.action === 'login') {
      const attempt = rateLimit(`admin-login:${requestIp(req)}`, {
        limit: 5,
        windowMs: 15 * 60 * 1000,
      });
      if (!attempt.allowed) {
        return NextResponse.json({ success: false, error: 'Too many login attempts' }, {
          status: 429,
          headers: { 'Retry-After': String(attempt.retryAfter) },
        });
      }

      if (supabase) {
        // Authenticate with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: body.email,
          password: body.password,
        });

        if (error || !data.session) {
          return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
        }

        // Issue our existing admin cookie to preserve existing backend protections
        return setAdminCookie(
          NextResponse.json({ success: true, user: data.user.email }),
          currentData.security?.password || 'fallback-secret',
        );
      } else {
        // Fallback to legacy password-only auth if Supabase isn't configured
        if (verifyAdminPassword(body.password, currentData.security?.password)) {
          return setAdminCookie(
            NextResponse.json({ success: true }),
            currentData.security?.password,
          );
        }
        return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
      }
    }

    if (body.action === 'logout') {
      return clearAdminCookie(NextResponse.json({ success: true }));
    }

    if (!isAdminRequest(req, currentData.security?.password)) {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }

    const newData = {
      ...body,
      security: body.security || currentData.security
    };

    fs.writeFileSync(dbPath, JSON.stringify(newData, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
