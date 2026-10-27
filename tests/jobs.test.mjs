import test from 'node:test';
import assert from 'node:assert/strict';
import { sendCartReminders } from '../src/jobs/cartReminder.mjs';
import { sendShippingEmail } from '../src/notifications/shippingEmails.mjs';

test('nightly reminders price every ordinary cart', () => {
  const outbox = [];
  sendCartReminders([
    { customer: 'Alex', subtotalCents: 10000, loyaltyPercent: 10 },
    { customer: 'Sam', subtotalCents: 3200, loyaltyPercent: 0 },
  ], outbox);
  assert.equal(outbox.length, 2);
  assert.equal(outbox[0].totalCents, 9000);
});
test('a shipping update creates a useful email', () => {
  const store = { emails: [], sentParcels: new Set() };
  const email = sendShippingEmail({ orderId: 'DUCK-1042', parcelId: 'P1' }, store);
  assert.match(email.subject, /left the pond/);
  assert.equal(store.emails.length, 1);
});
test('shipping updates require an order and a parcel', () => {
  assert.throws(() => sendShippingEmail({ orderId: 'DUCK-1042' }, { emails: [] }));
});
