import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { rateLimit, requestIp } from '@/lib/rateLimit';

const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req) {
  try {
    const attempt = rateLimit(`newsletter:${requestIp(req)}`, {
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });
    if (!attempt.allowed) {
      return NextResponse.json({ message: 'Too many attempts. Please try again later.' }, {
        status: 429,
        headers: { 'Retry-After': String(attempt.retryAfter) },
      });
    }

    const body = await req.json();
    const email = String(body.email || '').trim().toLowerCase();
    if (email.length > 254 || !emailPattern.test(email)) {
      return NextResponse.json({ message: 'Enter a valid email address.' }, { status: 400 });
    }

    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const subscribers = Array.isArray(db.newsletterSubscribers) ? db.newsletterSubscribers : [];
    const alreadySubscribed = subscribers.some(item => item.email === email);

    if (!alreadySubscribed) {
      subscribers.unshift({
        email,
        subscribedAt: new Date().toISOString(),
        status: 'active',
      });
      db.newsletterSubscribers = subscribers;
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
        await transporter.sendMail({
          from: `"KVTC Website" <${process.env.EMAIL_USER}>`,
          to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
          subject: 'New KVTC newsletter subscriber',
          text: `A new visitor subscribed to KVTC updates: ${email}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: alreadySubscribed
        ? 'You are already subscribed to KVTC updates.'
        : 'You are subscribed. Welcome to KVTC updates.',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ message: 'Subscription is temporarily unavailable.' }, { status: 500 });
  }
}
