export const runtime = 'nodejs';

import { setTransactionStatus } from '@/lib/mpesaStore';

export async function POST(req) {
  try {
    const body = await req.json();
    const { Body } = body;

    if (!Body || !Body.stkCallback) {
      return Response.json({ message: "Invalid callback payload" }, { status: 400 });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc } = Body.stkCallback;

    if (ResultCode === 0) {
      setTransactionStatus(CheckoutRequestID, "success", "Payment completed successfully");
    } else {
      setTransactionStatus(CheckoutRequestID, "failed", ResultDesc || "Payment failed");
    }

    return Response.json({ message: "OK" });
  } catch (err) {
    console.error("[M-PESA Callback] Error:", err);
    return Response.json({ message: "OK" }); // Always return OK to Safaricom
  }
}
