import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

async function check(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await check(path);
    else if (/\.(mjs|js)$/.test(path)) execFileSync(process.execPath, ['--check', path], { stdio: 'inherit' });
  }
}
await check('src'); await check('public'); await check('tests');
execFileSync(process.execPath, ['--check', 'server.mjs'], { stdio: 'inherit' });
console.log('QuackMarket source checks passed. No build step or dependencies required.');
