export const runtime = 'nodejs';

import { getTransactionStatus, setTransactionStatus } from '@/lib/mpesaStore';
import {
  createMpesaPassword,
  darajaRequest,
  getDarajaToken,
  mpesaTimestamp,
  readDarajaResponse,
} from '@/lib/mpesaDaraja';

function isPendingResponse(data) {
  const text = `${data?.errorMessage || ''} ${data?.ResponseDescription || ''} ${data?.ResultDesc || ''}`.toLowerCase();
  return (
    text.includes('being processed') ||
    text.includes('processing') ||
    text.includes('pending') ||
    data?.errorCode === '500.001.1001'
  );
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const checkoutId = searchParams.get('CheckoutRequestID');

  if (!checkoutId) {
    return Response.json({ status: "error", message: "Missing CheckoutRequestID" }, { status: 400 });
  }

  const stored = getTransactionStatus(checkoutId);
  if (stored.status === 'failed') {
    return Response.json(stored);
  }

  if (stored.status === 'success') {
    if (stored.paymentReference) {
      return Response.json(stored);
    }

    return Response.json({
      ...stored,
      status: 'confirming_receipt',
      message: 'Payment completed. Waiting for the M-PESA receipt number.',
    });
  }

  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  if (!shortcode || !passkey || !process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET) {
    return Response.json(stored.status === 'unknown'
      ? { status: 'pending', message: 'Waiting for M-PESA confirmation' }
      : stored
    );
  }

  try {
    const { token, base } = await getDarajaToken();
    const timestamp = mpesaTimestamp();
    const response = await darajaRequest(`${base}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: createMpesaPassword(shortcode, passkey, timestamp),
        Timestamp: timestamp,
        CheckoutRequestID: checkoutId,
      }),
    });
    const data = await readDarajaResponse(response);

    if (!response.ok && !isPendingResponse(data)) {
      console.warn('[M-PESA Status] Daraja query failed, falling back to pending:', data);
      return Response.json({
        ...stored,
        status: 'pending',
        message: 'Waiting for M-PESA confirmation',
      });
    }

    if (isPendingResponse(data)) {
      return Response.json({
        ...stored,
        status: 'pending',
        message: 'Waiting for the customer to complete the M-PESA prompt',
      });
    }

    if (String(data.ResultCode) === '0') {
      const success = {
        checkoutRequestId: checkoutId,
        paymentReference: stored.paymentReference || '',
        paymentDate: stored.paymentDate || new Date().toISOString(),
        paymentPhone: stored.phone || '',
        amount: stored.amount,
        queryConfirmedAt: new Date().toISOString(),
      };
      setTransactionStatus(checkoutId, 'success', 'Payment completed successfully', success);
      return Response.json({
        ...success,
        status: 'confirming_receipt',
        message: 'Payment completed. Waiting for the M-PESA receipt number.',
      });
    }

    if (data.ResultCode !== undefined) {
      // SENIOR FIX: Only permanently mark as failed in DB if it's explicitly cancelled (1032) or other fatal errors.
      // If it's a timeout (1037), we return failed to the frontend, but we don't pollute the DB. 
      // This allows a late-arriving webhook to cleanly overwrite the DB state to 'success'.
      const isTimeout = String(data.ResultCode) === '1037';
      if (!isTimeout) {
        setTransactionStatus(checkoutId, 'failed', data.ResultDesc || 'Payment was not completed', {
          resultCode: data.ResultCode,
        });
      }
      
      return Response.json({
        status: 'failed',
        message: data.ResultDesc || 'Payment was not completed',
        isTimeout
      });
    }

    return Response.json({
      ...stored,
      status: 'pending',
      message: 'Waiting for M-PESA confirmation',
    });
  } catch (error) {
    console.error('[M-PESA Status] Query error:', error);

    if (error.code === 'MPESA_AUTH_FAILED' || error.code === 'MPESA_NOT_CONFIGURED') {
      console.warn('[M-PESA Status] Auth error, falling back to pending:', error.message);
      return Response.json({
        ...stored,
        status: 'pending',
        message: 'Waiting for M-PESA confirmation',
      });
    }

    return Response.json({
      ...stored,
      status: 'pending',
      message: 'Waiting for M-PESA confirmation',
    });
  }
}
