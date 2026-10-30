import test from 'node:test';
import assert from 'node:assert/strict';
import { finalizeOrder } from '../src/orders/finalizeOrder.mjs';
import { renderOrderReceipt } from '../public/receipt.js';
import { createShopServer } from '../server.mjs';

test('receipt captures canonical catalog items without trusting names or prices', () => {
  const items = [{ id: 'captain-quack', quantity: 2, name: 'Fake name', priceCents: 1 }, { id: 'tiny-ambition', quantity: 3 }];
  const orders = [];
  const order = finalizeOrder({ items, loyaltyPercent: 0 }, orders);
  assert.deepEqual(order.items, [
    { id: 'captain-quack', name: 'Captain Quack', quantity: 2, unitPriceCents: 3200, lineTotalCents: 6400 },
    { id: 'tiny-ambition', name: 'Tiny duck. Big ambitions.', quantity: 3, unitPriceCents: 1200, lineTotalCents: 3600 },
  ]);
  assert.equal(order.totalCents, 10000);
  items[0].quantity = 20;
  items.pop();
  assert.equal(orders[0].items.length, 2);
  assert.equal(orders[0].items[0].quantity, 2);
});

test('receipt renders text safely and distinguishes line totals from the paid total', () => {
  const markup = renderOrderReceipt({ id: '<order>', totalCents: 9000, items: [{ name: '<img src=x onerror=alert(1)>', quantity: 1, unitPriceCents: 10000, lineTotalCents: 10000 }] }, (cents) => `€${(cents / 100).toFixed(2)}`);
  assert.ok(!markup.includes('<img'));
  assert.match(markup, /&lt;order&gt;/);
  assert.match(markup, /€100.00 each/);
  assert.match(markup, /Total paid: €90.00/);
});

test('actual order API returns saved item identities and rejects invalid purchases', async (t) => {
  const server = createShopServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => { server.closeAllConnections(); server.close(resolve); }));
  const submit = (items) => fetch(`http://127.0.0.1:${server.address().port}/api/orders`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items }) });
  const invalid = await submit([{ id: 'imaginary-duck', quantity: 1 }]);
  assert.equal(invalid.status, 400);
  const response = await submit([{ id: 'emotional-support', quantity: 1, priceCents: 1 }]);
  assert.equal(response.status, 201);
  const order = await response.json();
  assert.equal(order.id, 'DUCK-1042');
  assert.equal(order.items[0].unitPriceCents, 10000);
  assert.equal(order.items[0].lineTotalCents, 10000);
  assert.equal(order.totalCents, 9000);
});
