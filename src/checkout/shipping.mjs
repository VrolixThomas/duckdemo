const freeShippingThresholdCents = 5000;
const deliveryFeeCents = 495;

/** Eligibility uses merchandise before discounts; shipping is never discounted. */
export function quoteShipping(subtotalCents) {
  if (!Number.isSafeInteger(subtotalCents) || subtotalCents < 0) throw new Error('Invalid merchandise subtotal.');
  const freeShippingRemainingCents = Math.max(0, freeShippingThresholdCents - subtotalCents);
  return { shippingCents: freeShippingRemainingCents ? deliveryFeeCents : 0, freeShippingRemainingCents };
}
