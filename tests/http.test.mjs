import test from 'node:test';
import assert from 'node:assert/strict';
import { createShopServer } from '../server.mjs';

test('the real HTTP app serves its routes and executes business scenarios', async (t) => {
  const server = createShopServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise((resolve) => { server.closeAllConnections(); server.close(resolve); }));
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const path of ['/', '/checkout', '/mailroom', '/design', '/lab']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200); assert.match(await response.text(), /QuackMarket/);
  }
  const post = async (path, body = {}) => {
    const response = await fetch(base + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    return { response, data: await response.json() };
  };
  const { data: quote } = await post('/api/quote', { items: [{ id: 'emotional-support', quantity: 1 }] });
  assert.equal(quote.totalCents, 9000);
  const { data: run } = await post('/api/scenarios/expired-coupon');
  assert.equal(run.id, 'expired-coupon'); assert.equal(typeof run.pass, 'boolean');
  const { data: replay } = await post('/api/shipping/replay');
  assert.ok(replay.emails.length >= 1);
  await post('/api/demo/reset');
  assert.deepEqual(await (await fetch(base + '/api/mailbox')).json(), []);
  assert.equal((await fetch(base + '/.env')).status, 404);
  assert.equal((await post('/api/shipping/replay', { parcels: -1 })).response.status, 400);
});
