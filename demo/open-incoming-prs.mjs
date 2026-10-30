import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const queue = JSON.parse(readFileSync(resolve(root, 'demo/review-queue.json'), 'utf8'));
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Preview: node demo/open-incoming-prs.mjs [--only MET-54,MET-55] [--from-fork]');
  console.log('Open PRs as the active second account: add --create. Existing open PRs are reused.');
  process.exit(0);
}
let create = false;
let fromFork = false;
let only;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--create') create = true;
  else if (args[i] === '--from-fork') fromFork = true;
  else if (args[i] === '--only' && args[i + 1]) only = args[++i].toUpperCase().split(',');
  else throw new Error(`Unknown or incomplete argument: ${args[i]}`);
}
if (only?.some((id) => !queue.reviews.some((review) => review.ticket === id))) throw new Error('Unknown ticket in --only.');
const reviews = queue.reviews.filter((review) => !only || only.includes(review.ticket));
const gh = (...argv) => execFileSync('gh', argv, { cwd: root, encoding: 'utf8' }).trim();
const account = gh('api', 'user', '--jq', '.login');
console.log(`Active GitHub account: ${account}. Target: ${queue.repository}. Reviewer: ${queue.reviewer}.`);
if (create && account.toLowerCase() === queue.reviewer.toLowerCase()) {
  throw new Error('Switch gh to your second account first. Opening these as VrolixThomas will not produce incoming reviews. No PR was created.');
}
for (const review of reviews) {
  const head = fromFork ? `${account}:${review.branch}` : review.branch;
  const parameters = ['pr', 'create', '--repo', queue.repository, '--base', queue.base, '--head', head,
    '--title', `${review.ticket} ${review.title}`, '--body-file', resolve(root, review.bodyFile), '--reviewer', queue.reviewer];
  if (!create) {
    console.log('\ngh ' + parameters.map((arg) => JSON.stringify(arg)).join(' '));
    console.log(`Compare in a browser signed into your second account: ${review.compareUrl}`);
    continue;
  }
  // Read back before creation so rerunning after a partial gh failure cannot duplicate a PR.
  const open = JSON.parse(gh('pr', 'list', '--repo', queue.repository, '--state', 'open', '--base', queue.base,
    '--head', review.branch, '--json', 'number,url,author,headRepositoryOwner,reviewRequests'));
  const matches = open.filter((pr) => pr.headRepositoryOwner?.login?.toLowerCase() === (fromFork ? account : queue.repository.split('/')[0]).toLowerCase());
  if (matches.length > 1) throw new Error(`Multiple open PRs found for ${head}; inspect them before continuing.`);
  if (matches.length) {
    const existing = matches[0];
    if (existing.author.login.toLowerCase() !== account.toLowerCase()) throw new Error(`Existing PR has a different author: ${existing.url}`);
    if (!existing.reviewRequests.some((reviewer) => reviewer.login?.toLowerCase() === queue.reviewer.toLowerCase())) {
      gh('pr', 'edit', String(existing.number), '--repo', queue.repository, '--add-reviewer', queue.reviewer);
    }
    console.log(`Reused ${existing.url}`);
    continue;
  }
  try { console.log(gh(...parameters)); }
  catch (error) {
    console.error('GitHub may have created the PR before a later step failed. Rerun this command to inspect/reuse it; do not create a duplicate manually.');
    throw error;
  }
}
if (!create) console.log('\nPreview only. Switch to the second account, then add --create to open the selected PRs.');
