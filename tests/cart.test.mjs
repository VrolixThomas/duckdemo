import test from 'node:test';
import assert from 'node:assert/strict';
import { restoreCart, removeCartItem } from '../public/cart.js';
import { products } from '../src/catalog.mjs';

test('intentional empty cart survives reload while fresh/corrupt storage gets the demo default', () => {
  assert.deepEqual(restoreCart('[]', products), []);
  for (const raw of [null, '{broken', 'null', '{}', '"a duck"', '[null]', '[{"id":"not-a-duck","quantity":1}]']) {
    assert.deepEqual(restoreCart(raw, products), [{ id: 'emotional-support', quantity: 1 }]);
  }
});

test('restoration retains only known catalog products and integer quantities in bounds', () => {
  const saved = [null, { id: 'captain-quack', quantity: 2, priceCents: 1 }, { id: 'tiny-ambition', quantity: 21 }, { id: 'bath-ceo', quantity: 0 }, { id: 'bath-ceo', quantity: 1.5 }];
  assert.deepEqual(restoreCart(JSON.stringify(saved), products), [{ id: 'captain-quack', quantity: 2 }]);
});

test('removal preserves other choices and persists removing the last duck', () => {
  const original = [{ id: 'captain-quack', quantity: 2 }, { id: 'tiny-ambition', quantity: 1 }];
  const remaining = removeCartItem(original, 'captain-quack');
  assert.deepEqual(remaining, [{ id: 'tiny-ambition', quantity: 1 }]);
  assert.equal(original.length, 2);
  const empty = removeCartItem(remaining, 'tiny-ambition');
  assert.deepEqual(restoreCart(JSON.stringify(empty), products), []);
});
