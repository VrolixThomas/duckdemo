const defaultCart = () => [{ id: 'emotional-support', quantity: 1 }];

export function restoreCart(raw, products) {
  if (raw === null) return defaultCart();
  let saved;
  try { saved = JSON.parse(raw); } catch { return defaultCart(); }
  if (!Array.isArray(saved)) return defaultCart();
  if (saved.length === 0) return [];
  const valid = saved.filter((item) => item && products.some((p) => p.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20);
  return valid.length ? valid.map(({ id, quantity }) => ({ id, quantity })) : defaultCart();
}

export function removeCartItem(cart, id) {
  return cart.filter((item) => item.id !== id);
}
