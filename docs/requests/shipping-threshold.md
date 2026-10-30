# MET-56 — Make the €50 free-shipping promise match checkout

Source: [Linear ticket](https://linear.app/metahackathon/issue/MET-56/make-the-euro50-free-shipping-promise-match-checkout)

The announcement promises free shipping above €50, while checkout currently charges nothing for every basket. Introduce one clear policy.

Acceptance:
- Shipping is €4.95 below a €50 merchandise subtotal and free at €50 or more.
- Eligibility uses merchandise subtotal before loyalty/promo discounts; discounted €100 remains eligible.
- Shipping is added after discounts and is not itself discounted.
- Quote and saved order include the fee and amount remaining to reach free shipping.
- Checkout displays the real fee and progress; banner says “€50 or more”.
- Tests cover the cent below/exact boundary, a discounted eligible cart, and saved-order totals.

This is an independent review candidate based on main. Run `npm test`, `npm run build`, then `PORT=4323 npm start` and open http://127.0.0.1:4323/checkout.
