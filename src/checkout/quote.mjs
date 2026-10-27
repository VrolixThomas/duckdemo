import { cartSubtotal } from '../catalog.mjs';
import { applyDiscounts } from '../pricing/applyDiscounts.mjs';

export function quoteCart({ items, loyaltyPercent = 10, promoCode = '' }) {
  return applyDiscounts({ subtotalCents: cartSubtotal(items), loyaltyPercent, promoCode });
}
