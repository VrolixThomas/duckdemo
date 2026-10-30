Related Linear ticket: https://linear.app/metahackathon/issue/MET-56/make-the-euro50-free-shipping-promise-match-checkout

Align the checkout with one explicit policy: €4.95 shipping below a €50 merchandise subtotal; free from €50 before discounts. Persist the fee in the order and show the real fee/progress.

Request: [product acceptance brief](https://github.com/VrolixThomas/duckdemo/blob/demo/met-56-shipping-threshold/docs/requests/shipping-threshold.md).

## Suggested reading order

1. `src/checkout/shipping.mjs`
2. `src/checkout/quote.mjs`
3. `public/app.js`
4. `public/index.html`
5. `tests/shipping.test.mjs`

## Validation

- `npm test`: 13 passing tests, executed locally.
- `npm run build`: source syntax checks pass; this app runs directly from source.
- Real local browser: The checkout shows the inclusive €50 policy and free delivery for the default eligible basket. Actual quote/order HTTP calls verify €4.95 shipping and €43.35 charged for a €48 basket with Platinum loyalty.

Preview: `PORT=4323 npm start`, then http://127.0.0.1:4323/checkout.

This is an independent demo review candidate targeting `main`; it is not merged or approved. No real payment or email provider is involved.
