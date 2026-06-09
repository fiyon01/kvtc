export function mpesaBaseUrl(env = process.env.MPESA_ENV || 'sandbox') {
  return env === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
}

export function mpesaTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

export function normalizeMpesaPhone(phone) {
  return '254' + String(phone).replace(/\s/g, '').replace(/^(\+?254|0)/, '');
}

const tokenCache = globalThis.__kvtcDarajaTokenCache || {
  token: null,
  base: null,
  expiresAt: 0,
};
globalThis.__kvtcDarajaTokenCache = tokenCache;

export async function readDarajaResponse(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {
      errorMessage: response.ok
        ? 'Daraja returned an invalid response'
        : `Daraja request failed with HTTP ${response.status}`,
    };
  }
}

export async function getDarajaToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    const error = new Error('M-PESA credentials are not configured');
    error.code = 'MPESA_NOT_CONFIGURED';
    throw error;
  }

  const base = mpesaBaseUrl();
  if (tokenCache.token && tokenCache.base === base && Date.now() < tokenCache.expiresAt) {
    return { token: tokenCache.token, base };
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const response = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${credentials}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });
  const data = await readDarajaResponse(response);

  if (!response.ok) {
    const error = new Error(
      response.status === 401 || response.status === 403
        ? 'M-PESA authentication failed. Check the Daraja app credentials and environment.'
        : `M-PESA authentication service returned HTTP ${response.status}.`
    );
    error.code = 'MPESA_AUTH_FAILED';
    error.status = response.status;
    throw error;
  }

  if (!data.access_token) {
    const error = new Error('M-PESA authentication returned no access token.');
    error.code = 'MPESA_AUTH_FAILED';
    throw error;
  }

  const lifetimeSeconds = Math.max(60, Number(data.expires_in) || 3599);
  tokenCache.token = data.access_token;
  tokenCache.base = base;
  tokenCache.expiresAt = Date.now() + Math.max(30, lifetimeSeconds - 60) * 1000;

  return { token: data.access_token, base };
}

export function createMpesaPassword(shortcode, passkey, timestamp) {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
}
