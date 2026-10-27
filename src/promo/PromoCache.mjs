import { findPromo } from './PromoRepository.mjs';

const snapshots = new Map();
const MAX_CODES = 64;

/** Shared promo lookup snapshots for quote, payment, and nightly callers. */
export function getCachedPromo(code, now = new Date()) {
  if (!code) return null;
  const key = String(code).trim().toUpperCase();
  let snapshot = snapshots.get(key);
  if (!snapshot) {
    const found = findPromo(key, now);
    snapshot = { code: found.code, percent: found.percent, expiresAt: found.expiresAt };
    if (snapshots.size >= MAX_CODES) snapshots.delete(snapshots.keys().next().value);
    snapshots.set(key, snapshot);
  }
  return { ...snapshot, expired: new Date(snapshot.expiresAt) <= now };
}

export function clearPromoCache() { snapshots.clear(); }
