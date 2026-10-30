Related Linear ticket: https://linear.app/metahackathon/issue/MET-54/two-treats-one-duck-keep-loyalty-when-applying-a-promo

Customers currently lose their loyalty benefit when applying a promo. Keep both discounts, cap combined savings at 40%, show the breakdown, and save the applied code with the order.

Request: [product acceptance brief](https://github.com/VrolixThomas/duckdemo/blob/demo/met-54-stack-duck-discounts/docs/requests/checkout-discounts.md).

## Suggested reading order

1. `src/pricing/applyDiscounts.mjs`
2. `src/promo/PromoCache.mjs`
3. `src/checkout/quote.mjs`
4. `src/orders/finalizeOrder.mjs`
5. `src/jobs/cartReminder.mjs`
6. `public/checkout.js`

## Validation

- `npm test`: 11 passing tests, executed locally.
- `npm run build`: source syntax checks pass; this app runs directly from source.
- Real local browser: Gold + QUACK15 displays €75.

Preview: `PORT=4321 npm start`, then http://127.0.0.1:4321/checkout.

This is an independent demo review candidate targeting `main`; it is not merged or approved. No real payment or email provider is involved.
