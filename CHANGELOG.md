# bun-plugin-jsx-script-bundler

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
