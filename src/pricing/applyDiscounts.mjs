import { getCachedPromo } from '../promo/PromoCache.mjs';
import { PromoExpiredError } from '../promo/errors.mjs';

export const MAX_DISCOUNT_PERCENT = 40;

/** SHOP-101: keep loyalty, stack one promo, cap the combined discount. */
export function applyDiscounts({ subtotalCents, loyaltyPercent = 10, promoCode = '', now = new Date() }) {
  if (!Number.isSafeInteger(subtotalCents) || subtotalCents < 0) throw new Error('Invalid subtotal.');
  if (![0, 10, 20].includes(loyaltyPercent)) throw new Error('Unknown loyalty tier.');
  const promo = getCachedPromo(promoCode, now);
  if (promo?.expired) throw new PromoExpiredError(promo.code);

  const combinedPercent = loyaltyPercent + (promo?.percent ?? 0);
  const percent = Math.min(combinedPercent, MAX_DISCOUNT_PERCENT);
  const loyaltyCents = Math.round(subtotalCents * loyaltyPercent / 100);
  const discountCents = Math.round(subtotalCents * percent / 100);
  return {
    subtotalCents, loyaltyPercent, promoPercent: promo?.percent ?? 0,
    loyaltyCents, promoCents: discountCents - loyaltyCents,
    discountCents, totalCents: subtotalCents - discountCents,
    promoCode: promo?.code ?? null, capped: combinedPercent > MAX_DISCOUNT_PERCENT,
    stacking: true,
  };
}
