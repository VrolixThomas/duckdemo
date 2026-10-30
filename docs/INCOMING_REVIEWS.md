# DuckDemo incoming-review setup

Dedicated Linear project: [DuckDemo — QuackMarket](https://linear.app/metahackathon/project/duckdemo-quackmarket-681ab811be17). All 12 tickets are assigned to Thomas for the app's real assigned-ticket queue. Five review candidates are In Progress; five worker tasks are Todo; two later tasks are Backlog. No ticket was marked Done.

## Five real review branches

Each branch is independently based on main `9bac1a34d45812e88bd59c7574a81e83e9f50580`. The discount and gift changes replay the original PRs on current main. The other three contain new working changes, request briefs and regression tests.

| Ticket | Branch | GitHub comparison | Preview port | Passing tests |
| --- | --- | --- | --- | --- |
| [MET-54](https://linear.app/metahackathon/issue/MET-54/two-treats-one-duck-keep-loyalty-when-applying-a-promo) | `demo/met-54-stack-duck-discounts` | [Open comparison](https://github.com/VrolixThomas/duckdemo/compare/main...demo/met-54-stack-duck-discounts?expand=1) | 4321 | 11 |
| [MET-55](https://linear.app/metahackathon/issue/MET-55/a-duck-but-make-it-a-gift-optional-wrapping-and-personal-note) | `demo/met-55-gift-wrapping` | [Open comparison](https://github.com/VrolixThomas/duckdemo/compare/main...demo/met-55-gift-wrapping?expand=1) | 4322 | 14 |
| [MET-56](https://linear.app/metahackathon/issue/MET-56/make-the-euro50-free-shipping-promise-match-checkout) | `demo/met-56-shipping-threshold` | [Open comparison](https://github.com/VrolixThomas/duckdemo/compare/main...demo/met-56-shipping-threshold?expand=1) | 4323 | 13 |
| [MET-57](https://linear.app/metahackathon/issue/MET-57/show-an-itemized-receipt-after-bringing-a-duck-home) | `demo/met-57-itemized-receipts` | [Open comparison](https://github.com/VrolixThomas/duckdemo/compare/main...demo/met-57-itemized-receipts?expand=1) | 4324 | 12 |
| [MET-58](https://linear.app/metahackathon/issue/MET-58/let-a-duck-leave-the-cart-and-keep-an-empty-flock-empty) | `demo/met-58-remove-cart-items` | [Open comparison](https://github.com/VrolixThomas/duckdemo/compare/main...demo/met-58-remove-cart-items?expand=1) | 4325 | 12 |

Each PR description is prepared under `demo/pr-descriptions/`. Each comparison targets main and has a real diff. Existing PRs #1/#2 and all earlier rehearsal branches remain available. These new branches have no PRs yet: open them as the second account so they belong to the incoming-review queue.

## Open as the second account

The GitHub account that submits the PR is its author. A branch name or commit author cannot make a VrolixThomas-authored PR incoming. The reviewer must be explicitly requested as `VrolixThomas`, which is the account connected to the app.

Browser route: sign into the second account and open a comparison above. Create a non-draft PR targeting `VrolixThomas/duckdemo:main`, paste its prepared description, then request `VrolixThomas` in Reviewers. If GitHub requires a fork, use the fork route below.

CLI route (the helper defaults to a preview and does not create PRs):

```sh
# If needed, authenticate your second account interactively first:
gh auth login --hostname github.com
# Select it if both accounts are already authenticated:
gh auth switch --hostname github.com --user SECOND_ACCOUNT
# Verify the PR author before creating anything:
gh api user --jq .login
node demo/open-incoming-prs.mjs --only MET-54,MET-55
# Open the first two reviews, linked to their tickets, requesting VrolixThomas:
node demo/open-incoming-prs.mjs --only MET-54,MET-55 --create
# Omit --only to open all five, or select the others as needed.
```

Run these from this setup worktree. The helper refuses creation while the active account is VrolixThomas and reuses matching open PRs on rerun. It uses checked-in description files with real newlines. It does not merge, approve or complete Linear issues.

### Fork route when the second account cannot use upstream branches

As the second account, fork `VrolixThomas/duckdemo` to `SECOND_ACCOUNT/duckdemo` (GitHub's Fork button, or `gh repo fork VrolixThomas/duckdemo --clone=false`). Then authenticate Git for that account (`gh auth setup-git`) and push the desired local branches to the fork:

```sh
git push https://github.com/SECOND_ACCOUNT/duckdemo.git \
  demo/met-54-stack-duck-discounts \
  demo/met-55-gift-wrapping \
  demo/met-56-shipping-threshold \
  demo/met-57-itemized-receipts \
  demo/met-58-remove-cart-items
node demo/open-incoming-prs.mjs --from-fork --only MET-54,MET-55
node demo/open-incoming-prs.mjs --from-fork --only MET-54,MET-55 --create
```

This requires no account invitation or permission changes on upstream. After opening, verify the PR shows the second account as author and VrolixThomas under Reviewers. Refresh the real GitHub source in Muse; incoming requested reviews and own-PR feedback remain separate.

## Run the new previews

From this setup worktree:

```sh
node demo/serve-incoming.mjs
```

It starts the five registered worktrees on ports 4321–4325, creating missing clean worktrees from the prepared local/remote refs when needed. It does not switch or reset an existing checkout. Ctrl+C stops only its children. Ports must be free. The original `npm run demo` from main still runs ports 4310–4314.

An individual branch uses `PORT=4323 npm start` in its own worktree. Each URL is a separate origin and has a separate local cart; orders/mailbox are in-memory and reset with the server. Do not treat a local URL as proof of a GitHub head: verify the worktree's branch/commit.

## Validation and rehearsal notes

- Every review branch: `npm test` and `npm run build` passed locally (Node v25.2.1; CI uses Node 22).
- Discounts: 11 tests. Browser confirmed Gold + QUACK15 = €75. `npm run demo:expired` exits 1 because the preserved regression stops the reminder batch; that failure is intentional.
- Gift wrapping: 14 tests. Browser confirmed €4 additional wrap fee and editable note.
- Shipping: 13 tests. Boundary tests cover 4999/5000 cents and a discounted basket that retains eligibility. Actual quote/order HTTP calls returned a 495-cent fee, 200 cents remaining and a 4335-cent final total for a €48 cart with Platinum loyalty. Browser verified the inclusive banner and eligible default cart. The baseline UI cannot remove its seeded €100 duck; the cart-removal branch addresses that separately. Small-cart UI was not exercised through that baseline flow.
- Receipts: 12 tests. Real HTTP tests and a browser pretend order verified canonical item prices, purchased items and €90 charged total.
- Cart removal: 12 tests. Browser verified last-item removal, focused empty state, reload persistence, adding a catalog product and returning to checkout.
- Expired-coupon scenario passes on the four other new branches. Existing duplicate-shipping behavior remains pending for MET-59.
- These are real local business/HTTP/browser checks. They do not prove live Muse voice, live provider ingestion or a real two-account incoming review before the second account opens the PRs.

Presenter spoilers remain in the original `demo/PRESENTER.md`. Keep the planted expiry regression intact until the review beat. For the new MET-54 branch, the earlier author-fix commit can be cherry-picked onto it later (`920d6495c79ea6f7cbbafe0ecfec9b5ba420c339`); do not advance its head before recording the broken state.

## Ticket inventory

- [MET-54](https://linear.app/metahackathon/issue/MET-54/two-treats-one-duck-keep-loyalty-when-applying-a-promo) — Two treats. One duck: keep loyalty when applying a promo (In Progress)
- [MET-55](https://linear.app/metahackathon/issue/MET-55/a-duck-but-make-it-a-gift-optional-wrapping-and-personal-note) — A duck, but make it a gift: optional wrapping and personal note (In Progress)
- [MET-56](https://linear.app/metahackathon/issue/MET-56/make-the-euro50-free-shipping-promise-match-checkout) — Make the €50 free-shipping promise match checkout (In Progress)
- [MET-57](https://linear.app/metahackathon/issue/MET-57/show-an-itemized-receipt-after-bringing-a-duck-home) — Show an itemized receipt after bringing a duck home (In Progress)
- [MET-58](https://linear.app/metahackathon/issue/MET-58/let-a-duck-leave-the-cart-and-keep-an-empty-flock-empty) — Let a duck leave the cart and keep an empty flock empty (In Progress)
- [MET-59](https://linear.app/metahackathon/issue/MET-59/one-duck-one-shipping-email-please) — One duck. One shipping email. Please. (Todo)
- [MET-60](https://linear.app/metahackathon/issue/MET-60/keep-one-invalid-promo-from-stopping-the-whole-reminder-flock) — Keep one invalid promo from stopping the whole reminder flock (Todo)
- [MET-61](https://linear.app/metahackathon/issue/MET-61/normalize-duplicate-cart-rows-before-enforcing-the-per-duck-limit) — Normalize duplicate cart rows before enforcing the per-duck limit (Todo)
- [MET-62](https://linear.app/metahackathon/issue/MET-62/clear-stale-checkout-totals-when-a-promo-cannot-be-applied) — Clear stale checkout totals when a promo cannot be applied (Todo)
- [MET-63](https://linear.app/metahackathon/issue/MET-63/prevent-slower-old-quote-responses-from-replacing-the-latest-cart) — Prevent slower old quote responses from replacing the latest cart (Todo)
- [MET-64](https://linear.app/metahackathon/issue/MET-64/separate-clearing-the-delivery-inbox-from-resetting-orders) — Separate clearing the delivery inbox from resetting orders (Backlog)
- [MET-65](https://linear.app/metahackathon/issue/MET-65/make-checkout-validation-and-order-completion-easy-to-follow-by) — Make checkout validation and order completion easy to follow by keyboard (Backlog)

The original GitHub shipping task #3 is linked from MET-59. A real background worker should ask the per-order/per-parcel question before implementing it. Reference solution branches are rehearsal assets, not evidence that a worker executed or the task was accepted.
