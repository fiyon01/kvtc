export const runtime = 'nodejs';

import { getTransactionStatus } from '@/lib/mpesaStore';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const checkoutId = searchParams.get('CheckoutRequestID');

  if (!checkoutId) {
    return Response.json({ status: "error", message: "Missing CheckoutRequestID" }, { status: 400 });
  }

  const result = getTransactionStatus(checkoutId);
  return Response.json(result);
}
