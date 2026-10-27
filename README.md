# QuackMarket 🦆

Exceptional rubber ducks. Questionable life advice. A working web shop and GitHub PR dataset for the conversational-review hackathon demo.

## Run the shop

Requires Node.js 22 or newer. There are **no npm dependencies, API keys, accounts, database, or install step**.

```sh
npm start
```

Open **http://127.0.0.1:4310**. `npm run dev` watches server-side changes. Restart or reload after switching branches.

| Page | What you can do |
| --- | --- |
| `/` | Browse the flock and add real catalog items to the cart |
| `/checkout` | Change quantities/tier, apply a promo, and place a pretend order |
| `/design` | Compare the intended discount-stacking design and acceptance criteria |
| `/mailroom` | Send repeated courier updates and inspect the actual generated email objects |
| `/lab` | Execute the expiry and duplicate-shipping backend scenarios through the real app |

Cart selection is device-local. Orders, email objects, and deduplication state live in memory and reset when the server restarts. All names, emails, orders, purchases, and delivery events are fictional. No payment or email provider is called.

## Checks

```sh
npm test
npm run build
npm run demo:expired
npm run demo:shipping
```

`build` validates source syntax; this app runs directly from source. The ordinary test suite stays green on the two review PRs. The additional expiry scenario intentionally exposes the checkout PR's regression. The shipping scenario intentionally fails until the background task is implemented. These scenarios execute business functions; they are not prerecorded outputs.

## Demo data

- Default cart: one **€100 emotional-support duck**.
- Golden duck loyalty: **10%**. Platinum pond: **20%**.
- `QUACK15`: active **15%** promo.
- `BIGQUACK30`: active **30%** promo; exercise the stacking PR's **40% combined cap**.
- `YESTERDUCK`: expired promo, deterministic across rehearsals.
- PR request briefs: [`docs/requests/`](docs/requests/).
- Presenter instructions and branch choreography: [`demo/PRESENTER.md`](demo/PRESENTER.md).

The intended review flow is calculation → checkout quote → saved order → other callers → running checkout. Each PR description includes its purpose, reading order, checks, and a link to its request. The demo persona “Noor” is a storytelling role; GitHub records the real connected account as PR author.

## Code map

```text
src/pricing/applyDiscounts.mjs    Shared pricing rule
src/checkout/quote.mjs           Catalog-backed checkout price
src/orders/finalizeOrder.mjs     Price saved on the order
src/jobs/cartReminder.mjs        Nightly caller of the same pricing rule
src/notifications/shippingEmails.mjs  Background task
src/demo/scenarios.mjs          Reproducible business scenarios
public/checkout.js              Visible discount lines
public/gift-wrap.js             Gift-wrapping interface
server.mjs                     Local HTTP API and static pages
```

Product artwork was generated with the built-in imagegen tool and is committed under `public/images/`. Fonts are self-hosted, with their OFL licenses in `public/fonts/`.
