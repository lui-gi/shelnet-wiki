# shelnet-wiki

content source for the shelnet.org wiki. markdown entries live under `content/`, organized by section (notes, writeups, guides). a node build script emits `manifest.json`, `graph.json`, `search-index.json`, and raw `.md` into `dist/`, which CI publishes to the `gh-pages` branch. shelnet-site fetches those at runtime.

## structure

- `content/notes/` — cert/study notes
- `content/writeups/` — ctf / lab writeups
- `content/guides/` — longer explanatory pieces
- `scripts/build-manifest.mjs` — build pipeline
- `inbox/` — (gitignored) drop zone for rough notes handed to the style agent
- `.claude/agents/style-agent.md` — (gitignored) local subagent that restyles rough notes into entries

## local

```
npm install
npm test
npm run build      # emits dist/
```

## publish

push to `main`. GitHub Actions runs the build and publishes `dist/` to `gh-pages`. served at https://lui-gi.github.io/shelnet-wiki/.
```
