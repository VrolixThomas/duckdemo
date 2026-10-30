Related Linear ticket: https://linear.app/metahackathon/issue/MET-55/a-duck-but-make-it-a-gift-optional-wrapping-and-personal-note

Let customers opt into €4 gift wrapping and a personal message of at most 120 characters. Add the wrapping fee after discounts and preserve the ordinary unwrapped checkout.

Request: [product acceptance brief](https://github.com/VrolixThomas/duckdemo/blob/demo/met-55-gift-wrapping/docs/requests/gift-wrapping.md).

## Suggested reading order

1. `src/checkout/giftOptions.mjs`
2. `src/checkout/quote.mjs`
3. `public/gift-wrap.js`
4. `public/app.js`
5. `tests/gift-wrapping.test.mjs`

## Validation

- `npm test`: 14 passing tests, executed locally.
- `npm run build`: source syntax checks pass; this app runs directly from source.
- Real local browser: Gift wrapping adds €4 and accepts the personal message.

Preview: `PORT=4322 npm start`, then http://127.0.0.1:4322/checkout.

This is an independent demo review candidate targeting `main`; it is not merged or approved. No real payment or email provider is involved.
