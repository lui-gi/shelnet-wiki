import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rm, mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildManifest } from '../scripts/build-manifest.mjs';

const FIXTURES = new URL('./fixtures/content', import.meta.url).pathname;

async function withTempOut(fn) {
  const out = await mkdtemp(join(tmpdir(), 'wiki-build-'));
  try { await fn(out); } finally { await rm(out, { recursive: true, force: true }); }
}

test('manifest contains both fixture entries with correct fields', async () => {
  await withTempOut(async (out) => {
    await buildManifest({ contentDir: FIXTURES, outDir: out });
    const raw = await readFile(join(out, 'manifest.json'), 'utf8');
    const m = JSON.parse(raw);
    assert.equal(m.version, 1);
    assert.deepEqual(m.sections, ['notes', 'writeups', 'guides']);
    assert.equal(m.entries.length, 2);
    const crypto = m.entries.find((e) => e.slug === 'cryptography');
    assert.equal(crypto.section, 'notes');
    assert.equal(crypto.path, 'notes/security-plus/cryptography');
    assert.deepEqual(crypto.tags, ['crypto', 'networking']);
    assert.equal(crypto.suggested, true);
    const linux = m.entries.find((e) => e.slug === 'intro-linux');
    assert.equal(linux.section, 'guides');
  });
});

test('manifest.recent is sorted by updated desc, capped at 10', async () => {
  await withTempOut(async (out) => {
    await buildManifest({ contentDir: FIXTURES, outDir: out });
    const m = JSON.parse(await readFile(join(out, 'manifest.json'), 'utf8'));
    assert.deepEqual(m.recent.slice(0, 2), ['cryptography', 'intro-linux']);
  });
});

test('manifest.suggested only includes entries with suggested: true', async () => {
  await withTempOut(async (out) => {
    await buildManifest({ contentDir: FIXTURES, outDir: out });
    const m = JSON.parse(await readFile(join(out, 'manifest.json'), 'utf8'));
    assert.deepEqual(m.suggested, ['cryptography']);
  });
});

test('raw markdown copied into outDir/content/', async () => {
  await withTempOut(async (out) => {
    await buildManifest({ contentDir: FIXTURES, outDir: out });
    const raw = await readFile(join(out, 'content/notes/security-plus/cryptography.md'), 'utf8');
    assert.match(raw, /## symmetric/);
  });
});

test.todo('missing required frontmatter throws (covered in Task 3)');
