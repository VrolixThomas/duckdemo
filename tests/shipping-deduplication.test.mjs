import test from 'node:test';
import assert from 'node:assert/strict';
import { sendShippingEmail } from '../src/notifications/shippingEmails.mjs';
import { duplicateShippingScenario } from '../src/demo/scenarios.mjs';

const fresh = () => ({ emails: [], sentParcels: new Set() });

test('three separate courier events for one parcel produce one email', () => {
  const result = duplicateShippingScenario(1);
  assert.equal(result.emails.length, 1);
  assert.equal(result.pass, true);
});
test('two parcels in the same order produce two emails, not one', () => {
  assert.equal(duplicateShippingScenario(2).emails.length, 2);
});
test('the same parcel reference on different orders does not lose a notification', () => {
  const store = fresh();
  for (const orderId of ['DUCK-1', 'DUCK-2']) sendShippingEmail({ orderId, parcelId: 'P1' }, store);
  assert.equal(store.emails.length, 2);
});
test('an exact repeated event is also deduplicated', () => {
  const store = fresh();
  const event = { eventId: 'event-1', orderId: 'DUCK-1', parcelId: 'P1' };
  assert.ok(sendShippingEmail(event, store));
  assert.equal(sendShippingEmail(event, store), null);
  assert.equal(store.emails.length, 1);
});
