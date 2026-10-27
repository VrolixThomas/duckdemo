# SHOP-101 — Two treats. One duck.

Customers lose their loyalty discount when they enter a promo code. Keep the loyalty benefit and allow one promo on top.

## Acceptance criteria

1. A €100 cart with Golden duck loyalty (10%) and QUACK15 (15%) costs **€75**.
2. Combined discounts never exceed **40%**: Platinum (20%) plus BIGQUACK30 (30%) costs **€60**, not €50.
3. Checkout shows both discount lines, an applied-code chip, and a friendly explanation when the cap applies. Check desktop and phone.
4. Save the applied promo code on the order.

Use the existing PromoRepository. **Do not add new services or caches.**

Design reference: run the app and open `/design`.
