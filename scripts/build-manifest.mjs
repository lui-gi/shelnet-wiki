// scripts/build-manifest.mjs
// Walks content/**/*.md, parses frontmatter, validates, emits manifest.json
// and copies markdown into dist/content/. Pure module — no top-level effects.
// CLI entry at the bottom only runs when called directly.
import { readdir, readFile, mkdir, writeFile, copyFile, stat } from 'node:fs/promises';
import { join, relative, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const SECTIONS = ['notes', 'writeups', 'guides'];
const REQUIRED = ['title', 'slug', 'section', 'path', 'tags', 'created', 'updated', 'summary'];

async function walkMd(dir, acc = []) {
  for (const name of await readdir(dir)) {
    const full = join(dir, name);
    const s = await stat(full);
    if (s.isDirectory()) await walkMd(full, acc);
    else if (name.endsWith('.md')) acc.push(full);
  }
  return acc;
}

function validate(entry, file) {
  for (const key of REQUIRED) {
    if (entry[key] === undefined || entry[key] === null || entry[key] === '') {
      throw new Error(`${file}: missing required frontmatter field "${key}"`);
    }
  }
  if (!SECTIONS.includes(entry.section)) {
    throw new Error(`${file}: section "${entry.section}" not in [${SECTIONS.join(', ')}]`);
  }
  const firstSeg = entry.path.split('/')[0];
  if (firstSeg !== entry.section) {
    throw new Error(`${file}: path "${entry.path}" must start with section "${entry.section}"`);
  }
  if (!Array.isArray(entry.tags)) {
    throw new Error(`${file}: tags must be an array`);
  }
}

export async function buildManifest({ contentDir, outDir }) {
  const files = await walkMd(contentDir);
  const seen = new Map(); // slug -> file
  const entries = [];

  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const { data, content } = matter(raw);
    const entry = {
      title: data.title,
      slug: data.slug,
      section: data.section,
      path: data.path,
      tags: data.tags,
      created: String(data.created || ''),
      updated: String(data.updated || ''),
      summary: data.summary,
      suggested: data.suggested === true,
    };
    validate(entry, relative(contentDir, file));
    if (seen.has(entry.slug)) {
      throw new Error(`duplicate slug "${entry.slug}" in ${relative(contentDir, file)} (also in ${seen.get(entry.slug)})`);
    }
    seen.set(entry.slug, relative(contentDir, file));
    entries.push({ entry, file, body: content });
  }

  // Sort recent by updated desc.
  const recent = [...entries]
    .sort((a, b) => (b.entry.updated > a.entry.updated ? 1 : -1))
    .slice(0, 10)
    .map((e) => e.entry.slug);

  const suggested = entries.filter((e) => e.entry.suggested).map((e) => e.entry.slug);

  const manifest = {
    version: 1,
    generated: new Date().toISOString(),
    sections: SECTIONS,
    entries: entries.map((e) => e.entry),
    recent,
    suggested,
  };

  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  // Copy raw markdown into outDir/content/, preserving structure.
  for (const { file } of entries) {
    const rel = relative(contentDir, file);
    const dest = join(outDir, 'content', rel);
    await mkdir(dirname(dest), { recursive: true });
    await copyFile(file, dest);
  }

  return { manifest, entries };
}

// CLI entry: run only when invoked as a script.
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const here = dirname(fileURLToPath(import.meta.url));
  const repoRoot = join(here, '..');
  try {
    const { manifest } = await buildManifest({
      contentDir: join(repoRoot, 'content'),
      outDir: join(repoRoot, 'dist'),
    });
    console.log(`built manifest: ${manifest.entries.length} entries`);
  } catch (err) {
    console.error(`build failed: ${err.message}`);
    process.exit(1);
  }
}
