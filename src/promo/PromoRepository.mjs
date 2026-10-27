const codes = new Map([
  ['QUACK15', { code: 'QUACK15', percent: 15, expiresAt: '2099-12-31T23:59:59.000Z' }],
  ['BIGQUACK30', { code: 'BIGQUACK30', percent: 30, expiresAt: '2099-12-31T23:59:59.000Z' }],
  ['YESTERDUCK', { code: 'YESTERDUCK', percent: 15, expiresAt: '2000-01-01T00:00:00.000Z' }],
]);

export function findPromo(code, now = new Date()) {
  if (!code) return null;
  const promo = codes.get(String(code).trim().toUpperCase());
  if (!promo) throw new Error('That code has flown the coop. Try QUACK15.');
  return { ...promo, expired: new Date(promo.expiresAt) <= now };
}
