import { sendCartReminders } from '../jobs/cartReminder.mjs';
import { sendShippingEmail } from '../notifications/shippingEmails.mjs';

export function expiredCouponScenario() {
  const outbox = [];
  let error = null;
  try {
    sendCartReminders([
      { customer: 'Alex and the emotional-support duck', subtotalCents: 10000, loyaltyPercent: 10, promoCode: 'YESTERDUCK' },
      { customer: 'Sam and Captain Quack', subtotalCents: 10000, loyaltyPercent: 10, promoCode: '' },
    ], outbox, new Date('2026-10-28T12:00:00.000Z'));
  } catch (cause) { error = cause.message; }
  return {
    id: 'expired-coupon', title: 'One expired coupon. Two waiting ducks.',
    pass: !error && outbox.length === 2 && outbox[0].totalCents === 9000,
    expected: 'Ignore the expired code. Send both reminders, keeping the 10% loyalty discount.',
    actual: error ? `${error}. Batch stopped after ${outbox.length} reminder(s).` : `${outbox.length} reminders sent. Alex pays €90.00.`,
    error, outbox,
    source: ['src/jobs/cartReminder.mjs', 'src/pricing/applyDiscounts.mjs'],
  };
}

export function duplicateShippingScenario(parcels = 1) {
  const store = { emails: [], sentParcels: new Set() };
  for (let parcel = 1; parcel <= parcels; parcel++) {
    for (let replay = 1; replay <= 3; replay++) {
      sendShippingEmail({ eventId: `courier-${parcel}-${replay}`, orderId: 'DUCK-1042', parcelId: `PARCEL-${parcel}` }, store);
    }
  }
  return {
    id: 'duplicate-shipping', title: 'Three updates. One very confused customer.',
    pass: store.emails.length === parcels,
    expected: `${parcels} email(s): one per parcel, even when the courier repeats itself.`,
    actual: `${store.emails.length} shipping emails for ${parcels} parcel(s).`,
    emails: store.emails, source: ['src/notifications/shippingEmails.mjs'],
  };
}
