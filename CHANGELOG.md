# bun-plugin-jsx-script-bundler

## 2.0.2

### Patch Changes

- 2e9b56a: Raise the minimum typia version to 13.1.19. The `typia` peer range is now `>=13.1.19 <16`. With typia 13.0.0 to 13.1.1, an installed plugin fails with `TtscUnstableGenerationError`.

## 2.0.1

### Patch Changes

- 8f1207d: Allow typia 13 and 14. The `typia` peer range is now `>=13.0.0 <16`. Tested with typia 13.0.0 to 15.0.0 and TypeScript 7.0.2.

## 2.0.0

### Major Changes

- c9b1949: Support typia 15 and TypeScript 7. The plugin is now a thin wrapper around `@ttsc/unplugin/bun`.
  
  Breaking changes:
  
  - Peer ranges are now `typia` `>=15.0.0 <16` and `typescript` `>=7.0.0 <8`. typia 5 to 11 are only supported by 1.x, which gets no more updates.
  - `ttsc` and `@ttsc/unplugin` are installed as dependencies. `ttsc` needs Node.js 22.15 or later.
  - The `verbose` and `disableLoader` options are removed. The plugin no longer returns `results` or `onLoadCallback`. It accepts the `@ttsc/unplugin` options instead: `project`, `compilerOptions` and `plugins`.

## 1.0.0

### Major Changes

- e818966: First stable release. Supports typia 5.5.4 to 11.x and TypeScript 5.x.
  
  - `typia` is now a peer dependency (`>=5.5.4 <12`). Install it in your project.
  - `typescript` peer range is now `>=5.0.0 <6`.
  - Tested on every typia major from 5 to 11 with Bun 1.4.2.

## 0.1.1

### Patch Changes

- 555cc87: fix: transform sibling package imports when building from inside a monorepo package (#2)

## 0.1.0

### Minor Changes

- b8f200e: feat(\*): add typia plugin for bun

## 0.1.0

### Minor Changes

- 6800079: feat: add passing sourceFiles option and expose onLoadCallback
  feat: add inline option

  The sourceFiles option must be a map of absolute file path to file contents.
  This allows passing in files that has been transformed by other plugins. This
  feature was added as a temporary workaround for a bug involving multiple
  plugins filtering the same file type. oven-sh/bun#9373

  The inline option allows bundling the script as an inline script tag. If the
  plugin is running during runtime (preload), it will inline the script tag with
  the contents of the script by default regardless of the inline option. If the
  plugin is running during build time (Bun.build()) and the inline option is true,
  it will inline the script tag with the contents of the script, otherwise it will
  copy/download the referenced script to outDir.

## 0.0.1

### Patch Changes

- 096c524: feat(\*): initial commit
