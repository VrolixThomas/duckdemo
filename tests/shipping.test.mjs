import test from 'node:test';
import assert from 'node:assert/strict';
import { quoteShipping } from '../src/checkout/shipping.mjs';
import { quoteCart } from '../src/checkout/quote.mjs';
import { finalizeOrder } from '../src/orders/finalizeOrder.mjs';

test('shipping switches at exactly €50 before discounts', () => {
  assert.deepEqual(quoteShipping(4999), { shippingCents: 495, freeShippingRemainingCents: 1 });
  assert.deepEqual(quoteShipping(5000), { shippingCents: 0, freeShippingRemainingCents: 0 });
  assert.equal(quoteShipping(5001).shippingCents, 0);
  for (const invalid of [-1, 0.5, NaN, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => quoteShipping(invalid), /Invalid merchandise/);
  }
});

test('small cart pays an undiscounted fee and exposes progress', () => {
  const quote = quoteCart({ items: [{ id: 'bath-ceo', quantity: 1 }], loyaltyPercent: 20 });
  assert.equal(quote.subtotalCents, 4800);
  assert.equal(quote.discountCents, 960);
  assert.equal(quote.shippingCents, 495);
  assert.equal(quote.freeShippingRemainingCents, 200);
  assert.equal(quote.totalCents, 4335);
});

test('discounting an eligible basket below €50 retains free shipping', () => {
  const quote = quoteCart({ items: [{ id: 'captain-quack', quantity: 2 }], promoCode: 'BIGQUACK30' });
  assert.equal(quote.subtotalCents, 6400);
  assert.equal(quote.totalCents, 4480);
  assert.equal(quote.shippingCents, 0);
});

test('saved order and quote agree on delivery and final total', () => {
  const input = { items: [{ id: 'tiny-ambition', quantity: 1 }], promoCode: 'QUACK15' };
  const orders = [];
  const order = finalizeOrder(input, orders);
  assert.equal(order.shippingCents, 495);
  assert.equal(order.freeShippingRemainingCents, 3800);
  assert.equal(order.totalCents, 1515);
  assert.equal(orders[0], order);
});
