import { spawn, execFileSync } from 'node:child_process';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const queue = JSON.parse(readFileSync(resolve(root, 'demo/review-queue.json'), 'utf8'));
const git = (...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
const repositoryRoot = dirname(git('rev-parse', '--path-format=absolute', '--git-common-dir'));
const records = git('worktree', 'list', '--porcelain').split('\n\n').filter(Boolean).map((block) => {
  const lines = block.split('\n');
  return { path: lines.find((line) => line.startsWith('worktree '))?.slice(9), branch: lines.find((line) => line.startsWith('branch '))?.slice(7) };
});
const children = [];
let stopping = false;
async function stop(code) {
  if (stopping) return;
  stopping = true;
  await Promise.all(children.map((child) => new Promise((done) => {
    if (child.exitCode !== null || child.signalCode !== null) return done();
    child.once('close', done); child.kill('SIGTERM');
    const timer = setTimeout(() => child.kill('SIGKILL'), 2000); timer.unref();
  })));
  process.exit(code);
}
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { void stop(0); });
try {
  for (const review of queue.reviews) {
    let directory = records.find((record) => record.branch === `refs/heads/${review.branch}`)?.path;
    if (!directory) {
      directory = resolve(repositoryRoot, '..', 'duckdemo-worktrees', review.ticket.toLowerCase());
      if (existsSync(directory)) throw new Error(`Cannot reuse unregistered directory: ${directory}`);
      mkdirSync(dirname(directory), { recursive: true });
      let local = true;
      try { git('show-ref', '--verify', `refs/heads/${review.branch}`); } catch { local = false; }
      if (local) git('worktree', 'add', directory, review.branch);
      else git('worktree', 'add', '-b', review.branch, directory, `origin/${review.branch}`);
    }
    const child = spawn(process.execPath, ['server.mjs'], { cwd: directory, env: { ...process.env, HOST: '127.0.0.1', PORT: String(review.port) }, stdio: ['ignore', 'pipe', 'pipe'] });
    children.push(child);
    child.stderr.on('data', (data) => process.stderr.write(`[${review.port}] ${data}`));
    child.once('error', (error) => { console.error(error.message); void stop(1); });
    child.once('exit', (code) => { if (!stopping) { console.error(`${review.ticket} stopped (${code}); check port ${review.port}.`); void stop(code || 1); } });
    await new Promise((ready, reject) => {
      const timer = setTimeout(() => reject(new Error(`Port ${review.port} did not become ready.`)), 10000);
      child.stdout.on('data', (data) => { if (String(data).includes('QuackMarket is open:')) { clearTimeout(timer); ready(); } });
      child.once('exit', () => { clearTimeout(timer); reject(new Error(`${review.ticket} could not start.`)); });
      child.once('error', (error) => { clearTimeout(timer); reject(error); });
    });
    console.log(`${review.ticket}: http://127.0.0.1:${review.port}/checkout · ${review.branch}`);
  }
  console.log('Ctrl+C stops only these five incoming-review previews. Original rehearsal uses npm run demo on main.');
} catch (error) { console.error(error.message); await stop(1); }
