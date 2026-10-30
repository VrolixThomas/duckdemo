# MET-57 — Show an itemized receipt after bringing a duck home

Source: [Linear ticket](https://linear.app/metahackathon/issue/MET-57/show-an-itemized-receipt-after-bringing-a-duck-home)

After ordering, checkout shows only an ID and total. Make the result useful for review and retain the exact purchased items.

Acceptance:
- Save catalog-derived item ID/name, quantity, unit price and line total on each order.
- Ignore caller-supplied names/prices; later input mutation cannot rewrite an order.
- Display those lines, order ID and charged total in the success panel with safely escaped text.
- Preserve current pricing/promo semantics; storage remains in-memory for this demo.
- Test canonical item identity, multiple lines/quantities, mutation isolation and real HTTP order response.

This is an independent review candidate based on main. Run `npm test`, `npm run build`, then `PORT=4324 npm start` and open http://127.0.0.1:4324/checkout.
