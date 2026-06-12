import crypto from 'node:crypto';

const COOKIE_NAME = 'kvtc_admin_session';
const SESSION_SECONDS = 8 * 60 * 60;

function sessionSecret(fallbackPassword = '') {
  return process.env.ADMIN_SESSION_SECRET
    || process.env.ADMIN_PASSWORD
    || fallbackPassword;
}

function signature(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function configuredAdminPassword(fallbackPassword = '') {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === 'production' ? '' : fallbackPassword;
}

export function verifyAdminPassword(candidate, fallbackPassword = '') {
  const expected = configuredAdminPassword(fallbackPassword);
  return Boolean(expected) && safeEqual(candidate, expected);
}

export function createAdminSession(fallbackPassword = '') {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const value = String(expires);
  return `${value}.${signature(value, sessionSecret(fallbackPassword))}`;
}

export function isAdminRequest(req, fallbackPassword = '') {
  const token = req.cookies?.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const [expires, suppliedSignature] = token.split('.');
  if (!expires || !suppliedSignature || Number(expires) <= Math.floor(Date.now() / 1000)) return false;
  return safeEqual(suppliedSignature, signature(expires, sessionSecret(fallbackPassword)));
}

export function setAdminCookie(response, fallbackPassword = '') {
  response.cookies.set(COOKIE_NAME, createAdminSession(fallbackPassword), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_SECONDS,
    path: '/',
  });
  return response;
}

export function clearAdminCookie(response) {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });
  return response;
}
