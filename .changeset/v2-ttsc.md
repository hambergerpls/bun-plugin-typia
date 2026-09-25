---
"bun-plugin-typia": major
---

Support typia 15 and TypeScript 7. The plugin is now a thin wrapper around `@ttsc/unplugin/bun`.

Breaking changes:

- Peer ranges are now `typia` `>=15.0.0 <16` and `typescript` `>=7.0.0 <8`. typia 5 to 11 are only supported by 1.x, which gets no more updates.
- `ttsc` and `@ttsc/unplugin` are installed as dependencies. `ttsc` needs Node.js 22.15 or later.
- The `verbose` and `disableLoader` options are removed. The plugin no longer returns `results` or `onLoadCallback`. It accepts the `@ttsc/unplugin` options instead: `project`, `compilerOptions` and `plugins`.
