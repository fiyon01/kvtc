export const runtime = 'nodejs';

import { setTransactionStatus } from '@/lib/mpesaStore';

function parseTransactionDate(value) {
  const raw = String(value || '');
  if (!/^\d{14}$/.test(raw)) return new Date().toISOString();
  const year = Number(raw.slice(0, 4));
  const month = Number(raw.slice(4, 6)) - 1;
  const day = Number(raw.slice(6, 8));
  const hour = Number(raw.slice(8, 10));
  const minute = Number(raw.slice(10, 12));
  const second = Number(raw.slice(12, 14));
  return new Date(Date.UTC(year, month, day, hour - 3, minute, second)).toISOString();
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { Body } = body;

    if (!Body || !Body.stkCallback) {
      return Response.json({ message: "Invalid callback payload" }, { status: 400 });
    }

    const {
      CheckoutRequestID,
      MerchantRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = Body.stkCallback;

    const metadata = Object.fromEntries(
      (CallbackMetadata?.Item || [])
        .filter((item) => item?.Name)
        .map((item) => [item.Name, item.Value])
    );

    if (ResultCode === 0) {
      setTransactionStatus(CheckoutRequestID, "success", "Payment completed successfully", {
        checkoutRequestId: CheckoutRequestID,
        merchantRequestId: MerchantRequestID,
        paymentReference: metadata.MpesaReceiptNumber || CheckoutRequestID,
        paymentDate: parseTransactionDate(metadata.TransactionDate),
        paymentPhone: metadata.PhoneNumber ? String(metadata.PhoneNumber) : '',
        amount: metadata.Amount,
      });
    } else {
      setTransactionStatus(CheckoutRequestID, "failed", ResultDesc || "Payment failed", {
        checkoutRequestId: CheckoutRequestID,
        merchantRequestId: MerchantRequestID,
        resultCode: ResultCode,
      });
    }

    return Response.json({ message: "OK" });
  } catch (err) {
    console.error("[M-PESA Callback] Error:", err);
    return Response.json({ message: "OK" }); // Always return OK to Safaricom
  }
}
