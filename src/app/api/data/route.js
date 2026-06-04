import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');

export async function GET() {
  try {
    const file = fs.readFileSync(dbPath, 'utf8');
    const data = JSON.parse(file);
    // Remove sensitive data before sending to client
    delete data.security;
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
      if (body.password === currentData.security.password) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    }

    // Merge incoming data with existing security (unless security is being updated)
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
