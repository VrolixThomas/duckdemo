export const GIFT_WRAP_CENTS = 400;

export function giftOptions({ giftWrap = false, giftMessage = '' }) {
  if (typeof giftWrap !== 'boolean' || typeof giftMessage !== 'string') throw new Error('Choose whether this duck is a gift.');
  if (Array.from(giftMessage).length > 120) throw new Error('Keep your gift quack under 120 characters.');
  return {
    giftWrap, giftWrapCents: giftWrap ? GIFT_WRAP_CENTS : 0,
    giftMessage: giftWrap ? giftMessage.trim() : '',
  };
}
