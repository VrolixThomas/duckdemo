import { applyDiscounts } from '../pricing/applyDiscounts.mjs';

/** A single nightly batch: an uncaught pricing error stops all later carts. */
export function sendCartReminders(carts, outbox, now = new Date()) {
  for (const cart of carts) {
    const price = applyDiscounts({ ...cart, now });
    outbox.push({ customer: cart.customer, totalCents: price.totalCents, subject: 'Your duck misses you.' });
  }
  return outbox;
}
