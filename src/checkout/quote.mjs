import { cartSubtotal } from '../catalog.mjs';
import { applyDiscounts } from '../pricing/applyDiscounts.mjs';
import { giftOptions } from './giftOptions.mjs';

export function quoteCart({ items, loyaltyPercent = 10, promoCode = '', giftWrap = false, giftMessage = '' }) {
  const price = applyDiscounts({ subtotalCents: cartSubtotal(items), loyaltyPercent, promoCode });
  const gift = giftOptions({ giftWrap, giftMessage });
  return { ...price, ...gift, totalCents: price.totalCents + gift.giftWrapCents };
}
