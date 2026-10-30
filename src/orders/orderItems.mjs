import { cartSubtotal, products } from '../catalog.mjs';

/** Snapshot canonical catalog facts, never caller-provided names or prices. */
export function snapshotOrderItems(items) {
  cartSubtotal(items);
  return items.map(({ id, quantity }) => {
    const product = products.find((entry) => entry.id === id);
    return { id: product.id, name: product.name, quantity, unitPriceCents: product.priceCents, lineTotalCents: product.priceCents * quantity };
  });
}
