import { spawn, execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, existsSync } from 'node:fs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const git = (...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
if (git('branch', '--show-current') !== 'main') throw new Error('Run npm run demo from the main checkout. Individual branches use npm start.');
const records = git('worktree', 'list', '--porcelain').split('\n\n').filter(Boolean).map((block) => {
  const lines = block.split('\n');
  return { path: lines.find((line) => line.startsWith('worktree '))?.slice(9), branch: lines.find((line) => line.startsWith('branch '))?.slice(7) };
});
const configurations = [
  { name: 'Baseline shop', branch: 'main', slug: 'baseline', port: 4310 },
  { name: 'Review PR #1 · discount stacking', branch: 'demo/stack-duck-discounts', slug: 'discounts', port: 4311 },
  { name: 'Review PR #2 · gift wrapping', branch: 'demo/gift-wrapping', slug: 'gift-wrapping', port: 4312 },
  { name: 'Background agent solution', branch: 'demo/shipping-agent-solution', slug: 'shipping-solution', port: 4313 },
  { name: 'Author response · expiry fixed', branch: 'demo/discounts-author-fix', slug: 'author-fix', port: 4314 },
];
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
  console.log('\n🦆 Opening the QuackMarket demo ponds…\n');
  for (const config of configurations) {
    let directory = records.find((record) => record.branch === `refs/heads/${config.branch}`)?.path;
    if (!directory) {
      directory = resolve(root, '..', 'duckdemo-worktrees', config.slug);
      if (existsSync(directory)) throw new Error(`Cannot reuse unregistered directory: ${directory}`);
      mkdirSync(dirname(directory), { recursive: true });
      let local = true;
      try { git('show-ref', '--verify', `refs/heads/${config.branch}`); } catch { local = false; }
      if (local) git('worktree', 'add', directory, config.branch);
      else git('worktree', 'add', '-b', config.branch, directory, `origin/${config.branch}`);
    }
    const child = spawn(process.execPath, ['server.mjs'], {
      cwd: directory, env: { ...process.env, HOST: '127.0.0.1', PORT: String(config.port) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    children.push(child);
    child.stderr.on('data', (data) => process.stderr.write(`[${config.port}] ${data}`));
    child.once('error', (error) => { console.error(error.message); void stop(1); });
    child.once('exit', (code) => { if (!stopping) { console.error(`${config.name} stopped (${code}). Check that port ${config.port} is free.`); void stop(code || 1); } });
    await new Promise((ready, reject) => {
      const timer = setTimeout(() => reject(new Error(`Port ${config.port} did not become ready.`)), 10000);
      child.stdout.on('data', (data) => {
        if (String(data).includes('QuackMarket is open:')) { clearTimeout(timer); ready(); }
      });
      child.once('exit', () => { clearTimeout(timer); reject(new Error(`${config.name} could not start.`)); });
      child.once('error', (error) => { clearTimeout(timer); reject(error); });
    });
    console.log(`${String(config.port)}  http://127.0.0.1:${config.port}  ${config.name}`);
  }
  console.log('\nPR review: http://127.0.0.1:4311/checkout · reference: /design · backend: /lab');
  console.log('Shipping before: http://127.0.0.1:4310/mailroom · after: http://127.0.0.1:4313/mailroom');
  console.log('Ctrl+C stops only the servers launched by this command.\n');
} catch (error) { console.error(error.message); await stop(1); }
