const escape = (text) => String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function renderGiftWrap({ giftWrap = false, giftMessage = '' } = {}) {
  return `<div class="step-title"><span>03</span><h2>A little gift quack?</h2></div>
    <label class="customer-card" for="gift-wrap"><input type="checkbox" id="gift-wrap" ${giftWrap ? 'checked' : ''}><div><strong>Wrap my duck · €4.00</strong><span>For someone who needs a little duck.</span></div></label>
    <label class="field-label" for="gift-message">Your personal message</label>
    <textarea class="full-select" id="gift-message" maxlength="120" rows="3" placeholder="You're doing ducking great.">${escape(giftMessage)}</textarea>
    <p class="field-feedback">Up to 120 characters. Included when gift wrapping is selected.</p>`;
}
