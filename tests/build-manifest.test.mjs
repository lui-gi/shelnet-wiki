import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rm, mkdtemp, readFile, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildManifest } from '../scripts/build-manifest.mjs';
import MiniSearch from 'minisearch';

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

test('throws on missing required frontmatter field', async () => {
  await withTempOut(async (out) => {
    const bad = await mkdtemp(join(tmpdir(), 'wiki-bad-'));
    await mkdir(join(bad, 'notes'), { recursive: true });
    await writeFile(join(bad, 'notes/a.md'), `---\ntitle: a\nsection: notes\npath: notes/a\ntags: []\ncreated: 2026-01-01\nupdated: 2026-01-01\nsummary: x\n---\nbody\n`);
    await assert.rejects(buildManifest({ contentDir: bad, outDir: out }), /missing required frontmatter field "slug"/);
    await rm(bad, { recursive: true, force: true });
  });
});

test('throws on duplicate slugs across files', async () => {
  await withTempOut(async (out) => {
    const FIX = new URL('./fixtures-invalid', import.meta.url).pathname;
    await assert.rejects(buildManifest({ contentDir: FIX, outDir: out }), /duplicate slug "dupe"/);
  });
});

test('throws on section/path mismatch', async () => {
  await withTempOut(async (out) => {
    const bad = await mkdtemp(join(tmpdir(), 'wiki-bad-'));
    await mkdir(join(bad, 'notes'), { recursive: true });
    await writeFile(join(bad, 'notes/x.md'), `---\ntitle: x\nslug: x\nsection: notes\npath: writeups/x\ntags: []\ncreated: 2026-01-01\nupdated: 2026-01-01\nsummary: x\n---\nbody\n`);
    await assert.rejects(buildManifest({ contentDir: bad, outDir: out }), /must start with section "notes"/);
    await rm(bad, { recursive: true, force: true });
  });
});

test('graph.json has nodes for every entry and edges for resolved wikilinks', async () => {
  await withTempOut(async (out) => {
    // Use a temp fixture set where two entries link to each other.
    const dir = await mkdtemp(join(tmpdir(), 'wiki-graph-'));
    await mkdir(join(dir, 'notes'), { recursive: true });
    await writeFile(join(dir, 'notes/a.md'),
      `---\ntitle: a\nslug: a\nsection: notes\npath: notes/a\ntags: []\ncreated: 2026-01-01\nupdated: 2026-01-01\nsummary: a\n---\nsee [[b]] for more.\n`);
    await writeFile(join(dir, 'notes/b.md'),
      `---\ntitle: b\nslug: b\nsection: notes\npath: notes/b\ntags: []\ncreated: 2026-01-01\nupdated: 2026-01-01\nsummary: b\n---\nrelated: [[a]] and [[a|alpha]] and [[ghost]].\n`);
    await buildManifest({ contentDir: dir, outDir: out });
    const g = JSON.parse(await readFile(join(out, 'graph.json'), 'utf8'));
    assert.equal(g.nodes.length, 2);
    const ids = g.nodes.map((n) => n.id).sort();
    assert.deepEqual(ids, ['a', 'b']);
    const edges = g.edges.map((e) => `${e.from}->${e.to}`).sort();
    assert.deepEqual(edges, ['a->b', 'b->a']);
    await rm(dir, { recursive: true, force: true });
  });
});

test('unresolved wikilink emits a warning, not an error', async () => {
  await withTempOut(async (out) => {
    const dir = await mkdtemp(join(tmpdir(), 'wiki-warn-'));
    await mkdir(join(dir, 'notes'), { recursive: true });
    await writeFile(join(dir, 'notes/a.md'),
      `---\ntitle: a\nslug: a\nsection: notes\npath: notes/a\ntags: []\ncreated: 2026-01-01\nupdated: 2026-01-01\nsummary: a\n---\nlink to [[ghost]]\n`);
    const result = await buildManifest({ contentDir: dir, outDir: out });
    assert.ok(result.warnings.some((w) => /unresolved wikilink "ghost"/.test(w)));
    await rm(dir, { recursive: true, force: true });
  });
});

test('search-index.json is a valid MiniSearch index, finds entries by body text', async () => {
  await withTempOut(async (out) => {
    const FIXTURES = new URL('./fixtures/content', import.meta.url).pathname;
    await buildManifest({ contentDir: FIXTURES, outDir: out });
    const raw = await readFile(join(out, 'search-index.json'), 'utf8');
    const index = MiniSearch.loadJSON(raw, {
      fields: ['title', 'body', 'tags', 'summary'],
      storeFields: ['slug', 'title', 'section', 'path', 'summary'],
    });
    const hits = index.search('symmetric');
    assert.ok(hits.length >= 1);
    assert.equal(hits[0].slug, 'cryptography');
  });
});
