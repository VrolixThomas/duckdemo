import { findPromo } from '../promo/PromoRepository.mjs';

/** Money stays in cents; before the stacking PR a promo replaces loyalty. */
export function applyDiscounts({ subtotalCents, loyaltyPercent = 10, promoCode = '', now = new Date() }) {
  if (!Number.isSafeInteger(subtotalCents) || subtotalCents < 0) throw new Error('Invalid subtotal.');
  if (![0, 10, 20].includes(loyaltyPercent)) throw new Error('Unknown loyalty tier.');
  const promo = findPromo(promoCode, now);
  const validPromo = promo && !promo.expired ? promo : null;
  const percent = validPromo ? validPromo.percent : loyaltyPercent;
  const discountCents = Math.round(subtotalCents * percent / 100);
  return {
    subtotalCents, loyaltyPercent, promoPercent: validPromo?.percent ?? 0,
    loyaltyCents: validPromo ? 0 : discountCents,
    promoCents: validPromo ? discountCents : 0,
    discountCents, totalCents: subtotalCents - discountCents,
    promoCode: validPromo?.code ?? null, capped: false, stacking: false,
  };
}
