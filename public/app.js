import { renderDiscountLines } from './checkout.js';
import { renderGiftWrap } from './gift-wrap.js';

const app = document.querySelector('#app');
const money = (cents) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
const escape = (text) => String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
let products = [];
let cart;
try { cart = JSON.parse(localStorage.getItem('quackmarket-cart')); } catch { /* A fresh pond. */ }
if (!Array.isArray(cart) || !cart.length) cart = [{ id: 'emotional-support', quantity: 1 }];
let loyaltyPercent = 10;
let promoCode = '';
let giftWrap = false;
let giftMessage = '';

async function api(path, input) {
  const response = await fetch(path, input === undefined ? undefined : {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Something went quackers.');
  return data;
}
function toast(text) {
  const element = document.querySelector('#toast');
  element.textContent = text; element.classList.add('visible');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => element.classList.remove('visible'), 2800);
}
function saveCart() {
  localStorage.setItem('quackmarket-cart', JSON.stringify(cart));
  document.querySelector('#cart-count').textContent = cart.reduce((n, item) => n + item.quantity, 0);
}
function addDuck(id) {
  const item = cart.find((entry) => entry.id === id);
  if (item) item.quantity = Math.min(20, item.quantity + 1);
  else cart.push({ id, quantity: 1 });
  saveCart(); toast('One more very good decision in your flock.');
}
function productCard(product, index) {
  return `<article class="product-card">
    <div class="product-photo ${product.color}"><span class="product-label">${product.tag}</span><img src="/images/duck-studio.png" alt="Cheerful yellow rubber ducks photographed in a sunny studio" style="--duck-hue:${index === 2 ? '-12deg' : index === 3 ? '12deg' : '0deg'}"><span class="photo-number">0${index + 1}</span></div>
    <div class="product-details"><div><h3>${product.name}</h3><p>${product.subtitle}</p></div><span class="price">${money(product.priceCents)}</span></div>
    <button class="product-add" data-add="${product.id}">Add to your flock <span>+</span></button>
  </article>`;
}
function shop() {
  app.innerHTML = `<section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="tiny-dot"></span> YOUR NEW FAVOURITE LITTLE WEIRDO</div><h1>Life's a lot.<br>Get a <em>duck.</em></h1><p>Exceptional bath companions. Excellent listeners.<br>Absolutely no useful career advice.</p><a class="button primary" href="/checkout">Find your emotional support <span>↗</span></a><div class="hero-note"><span>★★★★★</span> “He gets me.” — a perfectly normal customer</div></div><div class="hero-art"><img src="/images/duck-studio.png" alt="Two delightful yellow rubber ducks ready to improve your day"><div class="hero-sticker">100%<br><strong>good duck</strong></div><span class="hero-caption">SMALL BATCH. BIG QUACK ENERGY.</span></div></section>
    <section class="benefits"><span>↗ Ships from our pond to yours</span><span>♡ Built for the long bath</span><span>✓ Zero notifications. Just squeaks.</span></section>
    <section class="collection"><div class="section-heading"><div class="eyebrow">A LITTLE RETAIL THERAPY</div><h2>Meet the flock<span> (4)</span></h2><p>Choose your personality. We won't judge.</p></div><div class="product-grid">${products.map(productCard).join('')}</div></section>
    <section class="pond-note"><span class="note-symbol">“</span><h2>Not every problem needs a solution.<br>Sometimes it needs a duck.</h2><span>THE QUACKMARKET PHILOSOPHY, PROBABLY</span></section>`;
  app.querySelectorAll('[data-add]').forEach((button) => button.addEventListener('click', () => addDuck(button.dataset.add)));
}

async function checkout() {
  app.innerHTML = `<section class="page-heading"><a class="back-link" href="/">← Back to the flock</a><div class="eyebrow">ONE EXCELLENT LIFE CHOICE AWAY</div><h1>Your flock is almost home.</h1><p>Good ducks come to those who checkout.</p></section>
    <div class="checkout-grid"><section class="checkout-details"><div class="step-title"><span>01</span><h2>Your excellent choices</h2></div><div class="cart-items">${cart.map((item) => {
      const p = products.find((entry) => entry.id === item.id);
      return p ? `<article class="cart-item"><div class="cart-thumb"><img src="/images/duck-studio.png" alt="${p.name}"></div><div><h3>${p.name}</h3><p>${p.subtitle}</p><label class="quantity-control">Quantity <select aria-label="Quantity of ${p.name}" data-quantity="${p.id}">${Array.from({ length: 20 }, (_, i) => `<option ${i + 1 === item.quantity ? 'selected' : ''}>${i + 1}</option>`).join('')}</select></label></div><strong>${money(p.priceCents * item.quantity)}</strong></article>` : '';
    }).join('')}</div><div class="step-title"><span>02</span><h2>Who's joining the flock?</h2></div><div class="customer-card"><div class="avatar">A</div><div><strong>Alex Pond</strong><span>alex@example.test</span></div><span class="customer-tag">Welcome back ♡</span></div><label class="field-label" for="loyalty-tier">Your loyalty tier</label><select class="full-select" id="loyalty-tier"><option value="0" ${loyaltyPercent === 0 ? 'selected' : ''}>New to the pond · no loyalty discount</option><option value="10" ${loyaltyPercent === 10 ? 'selected' : ''}>Golden duck · 10% loyalty discount</option><option value="20" ${loyaltyPercent === 20 ? 'selected' : ''}>Platinum pond · 20% loyalty discount</option></select><div class="delivery-note"><span>📦</span><div><strong>Special delivery. Very ordinary box.</strong><p><span id="delivery-policy">Calculating delivery…</span> · 2–3 working days · squeak on arrival</p></div></div><div id="gift-options">${renderGiftWrap({ giftWrap, giftMessage })}</div></section>
    <aside class="order-summary"><div class="summary-heading"><h2>The duck maths</h2><span>ALL IN EUR</span></div><div id="quote-content" aria-live="polite">Getting our ducks in a row…</div><form id="promo-form"><label class="field-label" for="promo-code">Got a secret quack?</label><div class="promo-input"><input id="promo-code" name="promo" placeholder="Try QUACK15" value="${escape(promoCode)}" autocomplete="off"><button type="submit">Apply ↗</button></div><p id="promo-feedback" class="field-feedback" aria-live="polite">Codes: QUACK15 · BIGQUACK30</p></form><div id="pay-area"></div><div class="payment-note">A pretend payment. A very real good duck.</div><div class="trust-note"><span>♡</span> 30-day happiness guarantee. Ducks don't judge.</div></aside></div>`;
  document.querySelector('#promo-form').addEventListener('submit', async (event) => {
    event.preventDefault(); promoCode = document.querySelector('#promo-code').value.trim().toUpperCase(); await updateQuote();
  });
  document.querySelector('#loyalty-tier').addEventListener('change', async (event) => { loyaltyPercent = Number(event.target.value); await updateQuote(); });
  app.querySelectorAll('[data-quantity]').forEach((select) => select.addEventListener('change', () => {
    cart.find((item) => item.id === select.dataset.quantity).quantity = Number(select.value); saveCart(); checkout();
  }));
  document.querySelector('#gift-wrap')?.addEventListener('change', async (event) => { giftWrap = event.target.checked; await updateQuote(); });
  document.querySelector('#gift-message')?.addEventListener('input', (event) => { giftMessage = event.target.value; });
  await updateQuote();
}

async function updateQuote() {
  const feedback = document.querySelector('#promo-feedback');
  try {
    const quote = await api('/api/quote', { items: cart, loyaltyPercent, promoCode, giftWrap, giftMessage });
    document.querySelector('#quote-content').innerHTML = `<div class="summary-row"><span>Subtotal</span><span>${money(quote.subtotalCents)}</span></div>${renderDiscountLines(quote, money)}${quote.giftWrapCents ? `<div class="summary-row"><span>A little gift quack</span><span>${money(quote.giftWrapCents)}</span></div>` : ''}<div class="summary-row shipping"><span>Shipping</span><span>${quote.shippingCents ? money(quote.shippingCents) : 'On us ♡'}</span></div>${quote.freeShippingRemainingCents ? `<p class="field-feedback">Add ${money(quote.freeShippingRemainingCents)} in ducks for free delivery, before discounts.</p>` : ''}<div class="summary-total"><span>Total</span><strong>${money(quote.totalCents)}</strong></div>`;
    document.querySelector('#delivery-policy').textContent = quote.shippingCents ? `${money(quote.shippingCents)} delivery · free from €50 in ducks before discounts` : 'Free delivery';
    feedback.textContent = promoCode ? 'Code applied. A little treat for your beak.' : 'Codes: QUACK15 · BIGQUACK30';
    feedback.classList.remove('error');
    document.querySelector('#pay-area').innerHTML = `<button class="button primary pay-button" id="pay-button" data-preview-marker="pay">Bring my duck home · ${money(quote.totalCents)} <span>↗</span></button>`;
    document.querySelector('#remove-code')?.addEventListener('click', () => { promoCode = ''; document.querySelector('#promo-code').value = ''; updateQuote(); });
    document.querySelector('#pay-button').addEventListener('click', async () => {
      try {
        const order = await api('/api/orders', { items: cart, loyaltyPercent, promoCode, giftWrap, giftMessage });
        document.querySelector('#pay-area').innerHTML = `<div class="order-success" role="status"><span>✓</span><h3>A duck decision well made.</h3><p>${order.id} · ${money(order.totalCents)}<br>Your pretend duck is on its pretend way.</p></div>`;
      } catch (error) { toast(error.message); }
    });
  } catch (error) {
    feedback.textContent = error.message; feedback.classList.add('error');
    document.querySelector('#pay-area').innerHTML = '<p class="field-feedback error">Remove or correct the code to continue.</p>';
  }
}

async function mailroom() {
  app.innerHTML = `<section class="page-heading"><div class="eyebrow">THE NOT-SO-SECRET BACK OFFICE</div><h1>Duck dispatch.</h1><p>One duck. One parcel. How many emails is too many?</p></section><div class="mailroom-grid"><section class="dispatch-panel"><span class="status-pill">COURIER SIMULATOR</span><h2>The courier has<br>a lot to say.</h2><p>Delivery partners sometimes send the same update three times. Our job is to tell Alex once.</p><div class="parcel-card"><span>📦</span><div><strong>DUCK-1042</strong><small>1 emotional-support duck</small><span>Recipient: Alex Pond</span></div><span class="parcel-status">In transit</span></div><label class="field-label" for="parcel-count">How big is this flock?</label><select class="full-select" id="parcel-count"><option value="1">One parcel</option><option value="2">Two parcels, same order</option></select><button class="button primary" id="replay-updates">Send 3 updates per parcel <span>↗</span></button><button class="text-button" id="clear-mail">Clear the inbox and start again</button><div id="dispatch-result" role="status"></div></section><section class="inbox"><div class="inbox-heading"><div><span class="eyebrow">ALEX'S INBOX</span><h2>You've got quack.</h2></div><span id="email-count" class="count-badge">0</span></div><div id="emails"></div></section></div>`;
  const refresh = async () => {
    const emails = await api('/api/mailbox');
    document.querySelector('#email-count').textContent = emails.length;
    document.querySelector('#emails').innerHTML = emails.length ? emails.map((email) => `<article class="email-card"><div class="email-avatar">Q</div><div><strong>${escape(email.subject)}</strong><span>QuackMarket → ${escape(email.to)}</span><p>${escape(email.body)}</p></div><small>${escape(email.parcelId)}</small></article>`).join('') : '<div class="empty-inbox"><span>✉</span><h3>A peaceful pond.</h3><p>No shipping emails yet. Try a courier update.</p></div>';
  };
  document.querySelector('#replay-updates').addEventListener('click', async () => {
    const button = document.querySelector('#replay-updates'); button.disabled = true;
    try {
      const result = await api('/api/shipping/replay', { parcels: Number(document.querySelector('#parcel-count').value) });
      document.querySelector('#dispatch-result').textContent = `${result.events} courier updates received. ${result.emails.length} email(s) in Alex's inbox.`;
      await refresh();
    } catch (error) { toast(error.message); } finally { button.disabled = false; }
  });
  document.querySelector('#clear-mail').addEventListener('click', async () => { await api('/api/demo/reset', {}); document.querySelector('#dispatch-result').textContent = ''; await refresh(); });
  await refresh();
}

function design() {
  app.innerHTML = `<section class="page-heading"><div class="eyebrow">DESIGN REFERENCE · CHECKOUT V2</div><h1>The blueprint for a better quack.</h1><p>A reference for the discount-stacking PR. Compare it with the running checkout.</p></section><section class="design-grid"><article class="design-board"><span class="eyebrow">01 · HAPPY PATH</span><h2>Two treats. One duck.</h2><p>When Alex adds a promo code, keep the loyalty discount visible. Never quietly take a perk away.</p><div class="reference-summary"><div class="summary-row"><span>Emotional-support duck</span><span>€100.00</span></div><div class="summary-row"><span>Loyalty, Golden duck · 10%</span><span>−€10.00</span></div><div class="summary-row"><span class="code-chip">QUACK15 ×</span><span>−€15.00</span></div><div class="summary-total"><span>Total</span><strong>€75.00</strong></div><div class="reference-pay">Bring my duck home · €75.00 ↗</div></div><span class="design-note">✓ Keep both discounts visible. Show clear, friendly copy.</span></article><article class="design-board blue-board"><span class="eyebrow">02 · A GENEROUS CEILING</span><h2>Generous. Not bankrupt.</h2><p>Platinum loyalty (20%) plus BIGQUACK30 (30%) is capped at a combined 40%. The customer pays €60.</p><div class="reference-summary"><div class="summary-row"><span>Subtotal</span><span>€100.00</span></div><div class="summary-row"><span>Loyalty · 20%</span><span>−€20.00</span></div><div class="summary-row"><span>BIGQUACK30</span><span>−€20.00</span></div><p class="reference-cap">Your discounts are capped at 40%. Still a very good duck deal.</p><div class="summary-total"><span>Total</span><strong>€60.00</strong></div><div class="reference-pay">Bring my duck home · €60.00 ↗</div></div><span class="design-note">✓ Put the explanation beside the savings, on desktop and phone.</span></article></section><section class="design-criteria"><h2>The three things the ticket asks for</h2><ol><li>Keep loyalty when a promo code is applied.</li><li>Cap the combined discount at 40% of the subtotal.</li><li>Show both discounts and a friendly cap explanation at checkout.</li></ol><a class="button primary" href="/checkout">Compare with the running checkout ↗</a><p>No new pricing services or caches are requested.</p></section>`;
}

function lab() {
  app.innerHTML = `<section class="page-heading"><div class="eyebrow">BACKEND SCENARIOS · EXECUTED, NOT ANIMATED</div><h1>Let's get our ducks in a row.</h1><p>Real requests through the same functions used by checkout, reminders, and shipping.</p></section><section class="lab-grid"><article class="lab-card"><span class="scenario-letter">A</span><h2>Yesterday's coupon.</h2><p>Alex's code expires before the nightly reminder. Sam's cart comes next. Do both customers still get a reminder?</p><button class="button primary" data-scenario="expired-coupon">Run expired-coupon scenario ↗</button><div id="result-expired-coupon" class="scenario-result" aria-live="polite"></div></article><article class="lab-card"><span class="scenario-letter">B</span><h2>One duck. Three emails.</h2><p>The courier repeats itself three times for one parcel. Does Alex receive one shipping email or a small newsletter?</p><button class="button primary" data-scenario="duplicate-shipping">Run repeated-update scenario ↗</button><div id="result-duplicate-shipping" class="scenario-result" aria-live="polite"></div></article></section><p class="lab-footnote">The shipping scenario starts red on main: that's the task for your background agent. The expiry scenario is green on main and red on the checkout PR.</p>`;
  app.querySelectorAll('[data-scenario]').forEach((button) => button.addEventListener('click', async () => {
    const target = document.querySelector(`#result-${button.dataset.scenario}`);
    button.disabled = true; target.textContent = 'Running the actual business code…';
    try {
      const result = await api(`/api/scenarios/${button.dataset.scenario}`, {});
      target.innerHTML = `<span class="test-status ${result.pass ? 'pass' : 'fail'}">${result.pass ? '✓ PASS' : '✕ FAIL'}</span><dl><dt>Expected</dt><dd>${escape(result.expected)}</dd><dt>Actual</dt><dd>${escape(result.actual)}</dd></dl><div class="test-source">${result.source.map(escape).join(' → ')}</div>`;
    } catch (error) { target.textContent = error.message; } finally { button.disabled = false; }
  }));
}

try {
  products = await api('/api/catalog');
  cart = cart.filter((item) => products.some((p) => p.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20);
  if (!cart.length) cart = [{ id: 'emotional-support', quantity: 1 }];
  saveCart();
  const route = location.pathname;
  const active = route === '/' ? 'shop' : route.slice(1);
  document.querySelector(`[data-nav="${active}"]`)?.classList.add('active');
  if (route === '/checkout') await checkout(); else if (route === '/mailroom') await mailroom(); else if (route === '/design') design(); else if (route === '/lab') lab(); else shop();
} catch (error) { app.innerHTML = `<section class="page-heading"><h1>A duck out of water.</h1><p>${escape(error.message)}</p><a class="button primary" href="/">Try the pond again ↗</a></section>`; }
