const transactions = new Map();

export function setTransactionStatus(checkoutId, status, message) {
  transactions.set(checkoutId, { status, message, updatedAt: new Date().toISOString() });
}

export function getTransactionStatus(checkoutId) {
  return transactions.get(checkoutId) || { status: "unknown", message: "Transaction not found" };
}
