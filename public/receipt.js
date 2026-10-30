const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function renderOrderReceipt(order, money) {
  return `<p>${escape(order.id)} · Your pretend duck is on its pretend way.</p>
    <ul aria-label="Purchased ducks">${order.items.map((item) => `<li>${item.quantity} × ${escape(item.name)} · ${money(item.unitPriceCents)} each · ${money(item.lineTotalCents)}</li>`).join('')}</ul>
    <p><strong>Total paid: ${money(order.totalCents)}</strong></p>`;
}
