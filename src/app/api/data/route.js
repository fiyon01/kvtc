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
      if (verifyAdminPassword(body.password, currentData.security?.password)) {
        return setAdminCookie(
          NextResponse.json({ success: true }),
          currentData.security?.password,
        );
      }
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
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
