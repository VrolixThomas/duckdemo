Related Linear ticket: https://linear.app/metahackathon/issue/MET-57/show-an-itemized-receipt-after-bringing-a-duck-home

Retain catalog-derived purchased item snapshots on each order and show a safely escaped receipt with quantities, unit prices, line totals, order ID and the charged total.

Request: [product acceptance brief](https://github.com/VrolixThomas/duckdemo/blob/demo/met-57-itemized-receipts/docs/requests/itemized-receipts.md).

## Suggested reading order

1. `src/orders/orderItems.mjs`
2. `src/orders/finalizeOrder.mjs`
3. `public/receipt.js`
4. `public/app.js`
5. `tests/receipts.test.mjs`

## Validation

- `npm test`: 12 passing tests, executed locally.
- `npm run build`: source syntax checks pass; this app runs directly from source.
- Real local browser: A pretend order displays its purchased duck, unit/line price and €90 charged total.

Preview: `PORT=4324 npm start`, then http://127.0.0.1:4324/checkout.

This is an independent demo review candidate targeting `main`; it is not merged or approved. No real payment or email provider is involved.
