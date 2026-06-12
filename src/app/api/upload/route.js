import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'node:crypto';
import { isAdminRequest } from '@/lib/adminAuth';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const IMAGE_EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

export async function POST(req) {
  try {
    const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');
    const currentData = JSON.parse(await fs.readFile(dbPath, 'utf8'));
    if (!isAdminRequest(req, currentData.security?.password)) {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
    }
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'No valid file provided' }, { status: 400 });
    }
    if (!IMAGE_EXTENSIONS[file.type]) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP and GIF images are allowed' }, { status: 415 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'Image exceeds the 5 MB limit' }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `upload-${crypto.randomUUID()}${IMAGE_EXTENSIONS[file.type]}`;
    
    // Write to public/uploads directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // Return the public URL
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
