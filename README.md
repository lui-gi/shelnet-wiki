# shelnet-wiki

content source for the shelnet.org wiki. markdown entries live under `content/`, organized by section (notes, writeups, guides). a node build script emits `manifest.json`, `graph.json`, `search-index.json`, and raw `.md` into `dist/`, which CI publishes to the `gh-pages` branch. shelnet-site fetches those at runtime.

## structure

- `content/notes/`: cert/study notes
- `content/writeups/`: ctf / lab writeups
- `content/guides/`: longer explanatory pieces
- `scripts/build-manifest.mjs`: build pipeline
