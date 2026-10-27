export function renderDiscountLines(quote, money) {
  return `
    <div class="summary-row"><span>Loyalty ${quote.loyaltyPercent}%</span><span>−${money(quote.loyaltyCents)}</span></div>
    ${quote.promoCode ? `<div class="summary-row"><span class="code-chip">${quote.promoCode} <button type="button" id="remove-code" aria-label="Remove promo code">×</button></span><span>−${money(quote.promoCents)}</span></div>` : ''}
    ${quote.capped ? '<p class="reference-cap" data-preview-marker="cap-note">Your discounts are capped at 40%. Still a very good duck deal.</p>' : ''}
  `;
}
