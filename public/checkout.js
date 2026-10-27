export function renderDiscountLines(quote, money) {
  return `
    <div class="summary-row"><span>Loyalty ${quote.loyaltyPercent}% ${quote.promoCode ? '<small>(replaced by code)</small>' : ''}</span><span>−${money(quote.loyaltyCents)}</span></div>
    ${quote.promoCode ? `<div class="summary-row"><span class="code-chip">${quote.promoCode} <button type="button" id="remove-code" aria-label="Remove promo code">×</button></span><span>−${money(quote.promoCents)}</span></div>` : ''}
  `;
}
