import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, extname, resolve, sep } from 'node:path';
import { products } from './src/catalog.mjs';
import { quoteCart } from './src/checkout/quote.mjs';
import { finalizeOrder } from './src/orders/finalizeOrder.mjs';
import { sendShippingEmail } from './src/notifications/shippingEmails.mjs';
import { expiredCouponScenario, duplicateShippingScenario } from './src/demo/scenarios.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const publicRoot = resolve(root, 'public');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.woff2': 'font/woff2' };

export function createShopServer() {
  const store = { emails: [], sentParcels: new Set(), orders: [] };
  return createServer(async (request, response) => {
    const json = (value, status = 200) => {
      response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
      response.end(JSON.stringify(value));
    };
    try {
      const url = new URL(request.url, 'http://localhost');
      if (url.pathname === '/api/health') return json({ ok: true, app: 'QuackMarket' });
      if (url.pathname === '/api/catalog' && request.method === 'GET') return json(products);
      if (url.pathname === '/api/mailbox' && request.method === 'GET') return json(store.emails);
      if (url.pathname.startsWith('/api/') && request.method === 'POST') {
        let raw = '';
        for await (const chunk of request) {
          raw += chunk;
          if (Buffer.byteLength(raw) > 16_384) return json({ error: 'That is a very large flock.' }, 413);
        }
        const input = raw ? JSON.parse(raw) : {};
        if (url.pathname === '/api/quote') return json(quoteCart(input));
        if (url.pathname === '/api/orders') return json(finalizeOrder(input, store.orders), 201);
        if (url.pathname === '/api/scenarios/expired-coupon') return json(expiredCouponScenario());
        if (url.pathname === '/api/scenarios/duplicate-shipping') {
          if (input.parcels !== undefined && ![1, 2].includes(input.parcels)) return json({ error: 'Choose one or two parcels.' }, 400);
          return json(duplicateShippingScenario(input.parcels ?? 1));
        }
        if (url.pathname === '/api/shipping/replay') {
          if (input.parcels !== undefined && ![1, 2].includes(input.parcels)) return json({ error: 'Choose one or two parcels.' }, 400);
          const parcels = input.parcels ?? 1;
          for (let parcel = 1; parcel <= parcels; parcel++) for (let replay = 1; replay <= 3; replay++) {
            sendShippingEmail({ eventId: `event-${parcel}-${replay}`, orderId: 'DUCK-1042', parcelId: `PARCEL-${parcel}` }, store);
          }
          return json({ emails: store.emails, events: parcels * 3 });
        }
        if (url.pathname === '/api/demo/reset') {
          store.emails.length = 0; store.orders.length = 0; store.sentParcels.clear();
          return json({ ok: true });
        }
        return json({ error: 'This pond has no such endpoint.' }, 404);
      }
      if (url.pathname.startsWith('/api/')) return json({ error: 'This pond has no such endpoint.' }, 404);
      if (request.method !== 'GET' && request.method !== 'HEAD') return json({ error: 'Method not allowed.' }, 405);
      const routes = ['/', '/checkout', '/mailroom', '/design', '/lab'];
      const requested = routes.includes(url.pathname) ? 'index.html' : decodeURIComponent(url.pathname).replace(/^\/+/, '');
      const path = resolve(publicRoot, requested);
      if (!path.startsWith(publicRoot + sep)) return json({ error: 'Not found.' }, 404);
      const content = await readFile(path);
      response.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream', 'cache-control': 'no-cache' });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch (error) {
      if (error.code === 'ENOENT') return json({ error: 'That duck has wandered off.' }, 404);
      json({ error: error.message || 'Something went quackers.' }, 400);
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createShopServer();
  const port = Number(process.env.PORT ?? 4310);
  server.listen(port, process.env.HOST ?? '127.0.0.1', () => {
    console.log(`QuackMarket is open: http://127.0.0.1:${server.address().port}`);
    console.log('Shop /checkout · Delivery /mailroom · Reference /design · Backend scenarios /lab');
  });
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
}
