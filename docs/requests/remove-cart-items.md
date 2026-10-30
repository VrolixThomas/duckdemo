# MET-58 — Let a duck leave the cart and keep an empty flock empty

Source: [Linear ticket](https://linear.app/metahackathon/issue/MET-58/let-a-duck-leave-the-cart-and-keep-an-empty-flock-empty)

The cart only allows quantities 1–20, and startup replaces an empty persisted cart with an emotional-support duck. Customers cannot deliberately empty their flock.

Acceptance:
- Every checkout item has an accessible Remove control.
- Removing the last item shows a friendly empty state and a link back to the catalog; do not request a quote or show a payment button for an empty cart.
- Persist intentional empty carts across reloads; fresh/corrupt storage still starts the original demo cart.
- Header count follows removal; adding a catalog product to an empty cart works.
- Restore only known catalog IDs and integer quantities 1–20.
- Verify empty/corrupt restoration and removal; check the actual browser flow.

This is an independent review candidate based on main. Run `npm test`, `npm run build`, then `PORT=4325 npm start` and open http://127.0.0.1:4325/checkout.
