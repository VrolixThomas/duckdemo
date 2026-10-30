import { quoteCart } from '../checkout/quote.mjs';
import { snapshotOrderItems } from './orderItems.mjs';

export function finalizeOrder(input, orders) {
  const quote = quoteCart(input);
  const order = { id: `DUCK-${String(orders.length + 1042).padStart(4, '0')}`, ...quote, items: snapshotOrderItems(input.items), createdAt: new Date().toISOString() };
  orders.push(order);
  return order;
}
