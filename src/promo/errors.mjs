export class PromoExpiredError extends Error {
  constructor(code) {
    super(`Promo ${code} has expired`);
    this.name = 'PromoExpiredError';
  }
}
