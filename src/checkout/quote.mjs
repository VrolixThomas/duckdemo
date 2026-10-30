import { cartSubtotal } from '../catalog.mjs';
import { applyDiscounts } from '../pricing/applyDiscounts.mjs';
import { quoteShipping } from './shipping.mjs';

export function quoteCart({ items, loyaltyPercent = 10, promoCode = '' }) {
  const price = applyDiscounts({ subtotalCents: cartSubtotal(items), loyaltyPercent, promoCode });
  const shipping = quoteShipping(price.subtotalCents);
  return { ...price, ...shipping, totalCents: price.totalCents + shipping.shippingCents };
}
