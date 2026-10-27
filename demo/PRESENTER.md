# Presenter guide — QuackMarket

This file contains rehearsal spoilers. It is not a product acceptance brief or recorded author session.

## Starting state

Keep both review PRs **open and unmerged**. The shipping issue stays open for the background agent. Start the shop on the discount PR for the main review; main is the healthy comparison.

Actual demo items: [PR #1](https://github.com/VrolixThomas/duckdemo/pull/1), [PR #2](https://github.com/VrolixThomas/duckdemo/pull/2), [shipping task #3](https://github.com/VrolixThomas/duckdemo/issues/3). Run `npm run demo` in the main checkout to start all five versions on ports 4310–4314. The prepared fix/solution branches have no initial open PRs.

The application is self-contained. No account, key, install, real payment, or email service is necessary.

## Branches and local previews

| Branch | Purpose | Suggested port |
| --- | --- | --- |
| `main` | Healthy price/reminder baseline; shipping duplication still present | 4310 |
| `demo/stack-duck-discounts` | Main review PR, including the planted expiry regression and unrequested cache | 4311 |
| `demo/gift-wrapping` | Small independent second PR | 4312 |
| `demo/discounts-author-fix` | Ready-to-use author response; expiry regression fixed and test added | 4314 |
| `demo/shipping-agent-solution` | Reference result for reviewing the background agent's work | 4313 |

Use the existing sibling worktrees created during setup. In each:

```sh
PORT=4311 npm start
```

For MetaHackathon, connect the real `VrolixThomas/duckdemo` repository and select the real GitHub PR. Open the corresponding local URL in the app's browser. A local URL alone does not prove which Git revision is running; use the matching worktree and verify its branch. No synthetic PR metadata is installed in MetaHackathon by this repository.

## Three-minute conversation

1. **Morning:** “What's up today?” Two reviews and the shipping-email task.
2. **Delegate:** “Start the shipping task. Ask if a decision is missing.”
3. **Review:** “Walk me through the checkout PR.” Follow pricing → quote → saved order → nightly reminder → UI.
4. **Browser/design:** “Show me the design and actual checkout.” `/design`, then `/checkout`. Golden duck + QUACK15 = €75. Switch to phone. Platinum + BIGQUACK30 = €60, with cap explanation.
5. **Background question:** “One email per order or per parcel?” Answer: “Per parcel. Someone might order a whole flock.”
6. **New scenario:** “What if the code expires before the nightly reminder?” Run the expiry scenario. Main sends both reminders; review PR throws before sending any. An unrelated second customer loses their reminder too.
7. **Feedback:** “One duck ruins the whole pond. Keep the test and draft a friendly comment.” Show the draft and confirm publication. Do not post comments automatically during setup.
8. **Author cutaway:** Show the actual PR comment. Use the prepared author-fix branch to add the regression test and restore skipping expired codes.
9. **Review our agent:** Use the shipping solution branch. `/mailroom`: three updates → one email. Then two parcels → two emails. `/lab` shows the corresponding backend result.

## Deterministic checks

```sh
npm run demo:expired
npm run demo:shipping
node demo/run-scenario.mjs duplicate-shipping --two-parcels
```

| Revision | Expired coupon | Repeated shipping updates |
| --- | --- | --- |
| main | PASS: €90; two reminders | FAIL: three emails for one parcel |
| discounts PR | FAIL: batch stops | FAIL: separate background task |
| author fix | PASS: €90; two reminders | FAIL: separate background task |
| shipping solution | PASS | PASS: one per parcel |

Ordinary CI passes on the original discount PR because the changed happy paths are covered but the nightly expiry case is not yet in the test suite. The author's fix adds that missing regression test. Scenario outputs are real executions, not fixed JSON animations.

## Author response during the recording

The prepared fix branch descends from the discount PR. To advance that PR after recording the review, push the fix to its head branch:

```sh
git push origin demo/discounts-author-fix:demo/stack-duck-discounts
```

This is a fast-forward update to the real PR; perform it only when ready for the author-response beat. It makes the original broken state disappear from that PR head. The original buggy commit is also retained on `demo/discounts-review-start` for future rehearsals; create a fresh branch/PR from it for a new recording rather than rewriting shared history.

The shipping reference branch has no open PR at setup, so it does not appear as a third initial review. Let the real background agent solve the issue, or use the reference branch and open its PR when that demo beat arrives.

For a real two-person approve/request-changes workflow, use a second GitHub account: GitHub does not allow approving your own PR. The current account can still post review comments and push the author fix. No reviewer invitations or external notifications are sent by the setup.

## Rehearsal reset

- Restart the relevant server to clear in-memory orders and shipping state.
- Use the mailroom's “Clear the inbox” control between parcel scenarios.
- A fresh browser profile starts with one €100 duck; changing the quantity dropdown back to 1 restores it.
- Use Gold + QUACK15 for stacking, Platinum + BIGQUACK30 for the cap.
- Keep the two initial PRs unmerged. Keep the shipping task unresolved until its part of the recording.
