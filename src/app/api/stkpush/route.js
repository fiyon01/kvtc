export const runtime = 'nodejs';

/**
 * M-PESA STK Push API Route
 *
 * Reads credentials from environment variables:
 *   MPESA_CONSUMER_KEY
 *   MPESA_CONSUMER_SECRET
 *   MPESA_SHORTCODE
 *   MPESA_PASSKEY
 *   MPESA_CALLBACK_URL    (e.g. https://yourdomain.com/api/mpesa-callback)
 *   MPESA_ENV             "sandbox" | "production" (defaults to sandbox)
 *
 * If any credential is missing → returns mock success so the UI still works
 * during development without credentials.
 */

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

async function getDarajaToken(consumerKey, consumerSecret, env) {
  const base = env === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

  const creds = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const res = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
    method: 'GET',
    headers: { Authorization: `Basic ${creds}` },
  });

  if (!res.ok) throw new Error(`Daraja token request failed: ${res.status}`);
  const data = await res.json();
  return { token: data.access_token, base };
}

export async function POST(req) {
  try {
    const { phone, amount } = await req.json();

    const consumerKey    = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode      = process.env.MPESA_SHORTCODE;
    const passkey        = process.env.MPESA_PASSKEY;
    const callbackUrl    = process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/api/mpesa-callback';
    const env            = process.env.MPESA_ENV || 'sandbox';

    // ── MOCK MODE ─────────────────────────────────────────────
    if (!consumerKey || !consumerSecret || !shortcode || !passkey) {
      console.warn('[STK Push] Running in MOCK mode – no credentials set.');
      // Simulate a 1-second processing delay then success
      await new Promise((r) => setTimeout(r, 1000));
      return Response.json({
        mock: true,
        message: 'Mock STK push initiated. Enter your M-PESA PIN on your phone.',
        CheckoutRequestID: 'MOCK-' + Date.now(),
      });
    }

    // ── REAL DARAJA FLOW ──────────────────────────────────────
    const { token, base } = await getDarajaToken(consumerKey, consumerSecret, env);

    const ts       = timestamp();
    const password = Buffer.from(`${shortcode}${passkey}${ts}`).toString('base64');

    // Normalize phone: strip leading 0 / + / 254, then prefix with 254
    const normalizedPhone = '254' + String(phone).replace(/^(\+?254|0)/, '');

    const body = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: ts,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Number(amount),
      PartyA: normalizedPhone,
      PartyB: shortcode,
      PhoneNumber: normalizedPhone,
      CallBackURL: callbackUrl,
      AccountReference: 'KVTC-ADMISSION',
      TransactionDesc: 'Kinoo VTC Application Fee',
    };

    const stkRes = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const stkData = await stkRes.json();

    if (!stkRes.ok || stkData.ResponseCode !== '0') {
      return Response.json(
        { error: stkData.errorMessage || stkData.ResponseDescription || 'STK Push failed' },
        { status: 400 }
      );
    }

    return Response.json({
      message: 'STK Push sent. Please enter your M-PESA PIN.',
      CheckoutRequestID: stkData.CheckoutRequestID,
      MerchantRequestID: stkData.MerchantRequestID,
    });

  } catch (err) {
    console.error('[STK Push] Error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
