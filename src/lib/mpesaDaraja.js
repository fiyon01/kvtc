import { Worker } from 'node:worker_threads';

export function mpesaBaseUrl(env = process.env.MPESA_ENV || 'sandbox') {
  return env === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
}

export function darajaHeaders(additional = {}) {
  return {
    Accept: 'application/json',
    'User-Agent': 'KVTC-Admissions/1.0',
    ...additional,
  };
}

export function darajaRequest(url, { method = 'GET', headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const workerCode = `
      import { parentPort, workerData } from 'node:worker_threads';
      try {
        const response = await fetch(workerData.url, {
          method: workerData.method,
          headers: workerData.headers,
          body: workerData.body,
          signal: AbortSignal.timeout(15000),
        });
        parentPort.postMessage({
          ok: response.ok,
          status: response.status,
          body: await response.text(),
        });
      } catch (error) {
        parentPort.postMessage({ error: error.message });
      }
    `;
    const worker = new Worker(workerCode, {
      eval: true,
      type: 'module',
      workerData: {
        url,
        method,
        headers: darajaHeaders(headers),
        body,
      },
    });
    const timeout = setTimeout(() => {
      worker.terminate();
      reject(new Error('Daraja request timed out'));
    }, 17000);
    worker.once('message', (result) => {
      clearTimeout(timeout);
      worker.terminate();
      if (result.error) {
        reject(new Error(result.error));
        return;
      }
      resolve({
        ok: result.ok,
        status: result.status,
        text: async () => result.body,
      });
    });
    worker.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

export function mpesaTimestamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${value.year}${value.month}${value.day}${value.hour}${value.minute}${value.second}`;
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
  const consumerKey = process.env.MPESA_CONSUMER_KEY?.trim();
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET?.trim();

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
  const requestToken = () => darajaRequest(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  let response = await requestToken();
  for (const delay of [1500, 3000]) {
    if (response.status !== 400 && response.status < 500) break;
    console.warn(`[Daraja Token] OAuth returned HTTP ${response.status}; retrying in ${delay}ms.`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    response = await requestToken();
  }
  const data = await readDarajaResponse(response);

  if (!response.ok) {
    console.error('[Daraja Token] Auth failed:', response.status, JSON.stringify(data));
    const error = new Error(
      response.status === 401 || response.status === 403
        ? `M-PESA authentication failed (HTTP ${response.status}): ${data?.errorMessage || data?.error_description || 'Check the Daraja app credentials and environment.'}`
        : `M-PESA authentication service returned HTTP ${response.status}: ${data?.errorMessage || ''}`
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
