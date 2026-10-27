import test from 'node:test';
import assert from 'node:assert/strict';
import { applyDiscounts } from '../src/pricing/applyDiscounts.mjs';
import { quoteCart } from '../src/checkout/quote.mjs';

test('a €100 duck with Gold loyalty costs €90', () => {
  assert.equal(applyDiscounts({ subtotalCents: 10000, loyaltyPercent: 10 }).totalCents, 9000);
});
test('a promo works without a loyalty tier', () => {
  assert.equal(applyDiscounts({ subtotalCents: 10000, loyaltyPercent: 0, promoCode: 'QUACK15' }).totalCents, 8500);
});
test('invalid codes produce friendly feedback', () => {
  assert.throws(() => applyDiscounts({ subtotalCents: 10000, promoCode: 'NOTADUCK' }), /flown the coop/);
});
test('quotes use catalog prices, not caller-supplied prices', () => {
  assert.equal(quoteCart({ items: [{ id: 'emotional-support', quantity: 1, priceCents: 1 }] }).subtotalCents, 10000);
});
test('invalid cart quantities are rejected', () => {
  assert.throws(() => quoteCart({ items: [{ id: 'emotional-support', quantity: -1 }] }));
});

test('SHOP-101: loyalty and QUACK15 stack to €75', () => {
  const quote = applyDiscounts({ subtotalCents: 10000, loyaltyPercent: 10, promoCode: 'QUACK15' });
  assert.equal(quote.totalCents, 7500);
  assert.equal(quote.loyaltyCents, 1000);
  assert.equal(quote.promoCents, 1500);
});
test('SHOP-101: combined savings are capped at 40%', () => {
  const quote = applyDiscounts({ subtotalCents: 10000, loyaltyPercent: 20, promoCode: 'BIGQUACK30' });
  assert.equal(quote.totalCents, 6000);
  assert.equal(quote.promoCents, 2000);
  assert.equal(quote.capped, true);
});
