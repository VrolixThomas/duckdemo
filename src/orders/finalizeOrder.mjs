import { quoteCart } from '../checkout/quote.mjs';

export function finalizeOrder(input, orders) {
  const quote = quoteCart(input);
  const order = { id: `DUCK-${String(orders.length + 1042).padStart(4, '0')}`, ...quote, appliedPromoCode: quote.promoCode, createdAt: new Date().toISOString() };
  orders.push(order);
  return order;
}
