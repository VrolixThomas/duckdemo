/** OPS-201: one email per order/parcel, even when courier events repeat. */
export function sendShippingEmail(event, store) {
  if (!event.orderId || !event.parcelId) throw new Error('A delivery update needs an order and parcel.');
  const parcelKey = JSON.stringify([event.orderId, event.parcelId]);
  if (store.sentParcels.has(parcelKey)) return null;
  const email = {
    id: `mail-${store.emails.length + 1}`, orderId: event.orderId, parcelId: event.parcelId,
    subject: 'Your duck has left the pond!', to: 'alex@example.test',
    body: `Parcel ${event.parcelId} for ${event.orderId} is on its way. Emotional support is in transit.`,
  };
  store.emails.push(email);
  store.sentParcels.add(parcelKey);
  return email;
}
