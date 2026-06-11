export const runtime = 'nodejs';

import { setTransactionStatus } from '@/lib/mpesaStore';
import {
  createMpesaPassword,
  darajaRequest,
  getDarajaToken,
  mpesaTimestamp,
  normalizeMpesaPhone,
  readDarajaResponse,
} from '@/lib/mpesaDaraja';

const stkRequests = globalThis.__kvtcStkRequests || new Map();
globalThis.__kvtcStkRequests = stkRequests;

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

export async function POST(req) {
  try {
    const { phone, amount, idempotencyKey, application } = await req.json();
    const numericAmount = Number(amount);

    if (
      !idempotencyKey ||
      !application?.name?.trim() ||
      !application?.idNo?.trim() ||
      !application?.course?.trim()
    ) {
      return Response.json({
        error: 'Complete and validate the admission form before requesting payment.',
      }, { status: 400 });
    }

    if (!Number.isFinite(numericAmount) || numericAmount < 1) {
      return Response.json({ error: 'Enter a valid payment amount of at least KSh 1' }, { status: 400 });
    }

    const previousRequest = stkRequests.get(idempotencyKey);
    if (previousRequest && Date.now() - previousRequest.createdAt < 10 * 60 * 1000) {
      return Response.json({
        ...previousRequest.response,
        duplicate: true,
        message: 'An STK prompt was already sent for this payment attempt.',
      });
    }

    const consumerKey    = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode      = process.env.MPESA_SHORTCODE;
    const passkey        = process.env.MPESA_PASSKEY;
    const callbackUrl    = process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/api/mpesa-callback';

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
    const { token, base } = await getDarajaToken();

    const ts = mpesaTimestamp();
    const password = createMpesaPassword(shortcode, passkey, ts);

    const normalizedPhone = normalizeMpesaPhone(phone);

    const body = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: ts,
      TransactionType: 'CustomerPayBillOnline',
      Amount: numericAmount,
      PartyA: normalizedPhone,
      PartyB: shortcode,
      PhoneNumber: normalizedPhone,
      CallBackURL: callbackUrl,
      AccountReference: 'KVTC-ADMISSION',
      TransactionDesc: 'Kinoo VTC Application Fee',
    };

    const stkRes = await darajaRequest(`${base}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const stkData = await readDarajaResponse(stkRes);

    if (!stkRes.ok || stkData.ResponseCode !== '0') {
      const errMsg =
        stkData.errorMessage ||
        stkData.ResponseDescription ||
        stkData.ResultDesc ||
        `STK Push request failed (HTTP ${stkRes.status})`;
      console.error('[STK Push] Daraja rejected STK push:', stkRes.status, JSON.stringify(stkData));
      return Response.json({ error: errMsg }, { status: 400 });
    }

    setTransactionStatus(
      stkData.CheckoutRequestID,
      'pending',
      'STK push sent. Waiting for the customer to enter their M-PESA PIN.',
      {
        checkoutRequestId: stkData.CheckoutRequestID,
        merchantRequestId: stkData.MerchantRequestID,
        phone: normalizedPhone,
        amount: numericAmount,
        initiatedAt: new Date().toISOString(),
      }
    );

    const responsePayload = {
      message: 'STK Push sent. Please enter your M-PESA PIN.',
      CheckoutRequestID: stkData.CheckoutRequestID,
      MerchantRequestID: stkData.MerchantRequestID,
    };
    stkRequests.set(idempotencyKey, {
      createdAt: Date.now(),
      response: responsePayload,
    });

    return Response.json(responsePayload);

  } catch (err) {
    console.error('[STK Push] Error:', err.code, err.message, err.status);
    if (err.code === 'MPESA_NOT_CONFIGURED') {
      return Response.json({
        error: 'M-PESA payment is not configured on this server. Contact the institution.',
        code: err.code,
      }, { status: 503 });
    }
    if (err.code === 'MPESA_AUTH_FAILED') {
      return Response.json({
        error: `M-PESA authentication failed (HTTP ${err.status || '?'}). Please try again in a moment or contact the institution.`,
        code: err.code,
      }, { status: 503 });
    }
    return Response.json({
      error: err.message || 'Payment request failed. Please try again.',
      code: err.code || 'MPESA_REQUEST_FAILED',
    }, { status: 500 });
  }
}
