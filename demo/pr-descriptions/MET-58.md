Related Linear ticket: https://linear.app/metahackathon/issue/MET-58/let-a-duck-leave-the-cart-and-keep-an-empty-flock-empty

Add accessible removal controls, preserve intentionally empty carts across reloads, and offer a useful empty checkout with a route back to the catalog. Ignore quote responses targeting a retired checkout DOM.

Request: [product acceptance brief](https://github.com/VrolixThomas/duckdemo/blob/demo/met-58-remove-cart-items/docs/requests/remove-cart-items.md).

## Suggested reading order

1. `public/cart.js`
2. `public/app.js`
3. `tests/cart.test.mjs`

## Validation

- `npm test`: 12 passing tests, executed locally.
- `npm run build`: source syntax checks pass; this app runs directly from source.
- Real local browser: Remove last duck → empty checkout → reload remains empty → add a catalog duck → checkout.

Preview: `PORT=4325 npm start`, then http://127.0.0.1:4325/checkout.

This is an independent demo review candidate targeting `main`; it is not merged or approved. No real payment or email provider is involved.
