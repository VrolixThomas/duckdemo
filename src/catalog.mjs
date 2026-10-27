export const products = [
  { id: 'emotional-support', name: 'The emotional-support duck', subtitle: 'For meetings that could have been a bath.', priceCents: 10000, tag: 'Cult favourite', color: 'yellow', emoji: '🦆' },
  { id: 'captain-quack', name: 'Captain Quack', subtitle: 'No navigation skills. Excellent hat.', priceCents: 3200, tag: 'Ship happens', color: 'blue', emoji: '⚓' },
  { id: 'tiny-ambition', name: 'Tiny duck. Big ambitions.', subtitle: 'Small enough to attend every stand-up.', priceCents: 1200, tag: 'Pocket-sized', color: 'pink', emoji: '✨' },
  { id: 'bath-ceo', name: 'The bath-time CEO', subtitle: 'Disrupting the tub since 2026.', priceCents: 4800, tag: 'Executive squeak', color: 'green', emoji: '👑' },
];

export function cartSubtotal(items) {
  if (!Array.isArray(items) || items.length === 0 || items.length > 20) throw new Error('Your flock needs at least one duck.');
  return items.reduce((total, item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) throw new Error('That duck or quantity is not in our pond.');
    return total + product.priceCents * item.quantity;
  }, 0);
}
