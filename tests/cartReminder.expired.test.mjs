import test from 'node:test';
import assert from 'node:assert/strict';
import { sendCartReminders } from '../src/jobs/cartReminder.mjs';

test('an expired promo keeps loyalty and does not stop later reminders', () => {
  const outbox = [];
  sendCartReminders([
    { customer: 'Alex', subtotalCents: 10000, loyaltyPercent: 10, promoCode: 'YESTERDUCK' },
    { customer: 'Sam', subtotalCents: 10000, loyaltyPercent: 10, promoCode: '' },
  ], outbox, new Date('2026-10-28T12:00:00Z'));
  assert.equal(outbox.length, 2);
  assert.equal(outbox[0].totalCents, 9000);
  assert.equal(outbox[1].customer, 'Sam');
});
