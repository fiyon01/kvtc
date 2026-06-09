const transactions = globalThis.__kvtcMpesaTransactions || new Map();
globalThis.__kvtcMpesaTransactions = transactions;

export function setTransactionStatus(checkoutId, status, message, details = {}) {
  const previous = transactions.get(checkoutId) || {};
  transactions.set(checkoutId, {
    ...previous,
    ...details,
    status,
    message,
    updatedAt: new Date().toISOString(),
  });
}

export function getTransactionStatus(checkoutId) {
  return transactions.get(checkoutId) || {
    status: "unknown",
    message: "Waiting for M-PESA confirmation",
  };
}
