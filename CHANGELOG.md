# bun-plugin-jsx-script-bundler

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
