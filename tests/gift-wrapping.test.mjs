import test from 'node:test';
import assert from 'node:assert/strict';
import { quoteCart } from '../src/checkout/quote.mjs';
import { finalizeOrder } from '../src/orders/finalizeOrder.mjs';
import { renderGiftWrap } from '../public/gift-wrap.js';

const cart = { items: [{ id: 'emotional-support', quantity: 1 }], loyaltyPercent: 10 };

test('wrapping is opt-in and leaves ordinary orders unchanged', () => {
  assert.equal(quoteCart(cart).totalCents, 9000);
  assert.equal(quoteCart(cart).giftWrapCents, 0);
});
test('€4 wrapping is added after duck discounts', () => {
  const quote = quoteCart({ ...cart, giftWrap: true });
  assert.equal(quote.totalCents, 9400);
  assert.equal(quote.giftWrapCents, 400);
  assert.equal(quote.discountCents, 1000);
});
test('gift message is saved with the order', () => {
  const orders = [];
  const order = finalizeOrder({ ...cart, giftWrap: true, giftMessage: '  You are doing ducking great.  ' }, orders);
  assert.equal(order.giftMessage, 'You are doing ducking great.');
  assert.equal(order.giftWrapCents, 400);
});
test('messages are bounded and absent from unwrapped orders', () => {
  assert.throws(() => quoteCart({ ...cart, giftMessage: 'q'.repeat(121) }), /120/);
  assert.equal(quoteCart({ ...cart, giftMessage: 'Not a gift' }).giftMessage, '');
});
test('messages remain plain text in the interface', () => {
  const html = renderGiftWrap({ giftMessage: '</textarea><script>alert(1)</script>' });
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
});
