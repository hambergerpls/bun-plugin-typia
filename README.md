# `bun-plugin-typia`

Adds support for [typia](https://github.com/samchon/typia), a transformer library that features super-fast runtime validators.

## Installation

```sh
bun add typia
bun add -d bun-plugin-typia typescript
```

`typia` and `typescript` are peer dependencies. Install the versions you want to use.

## Supported versions

| `bun-plugin-typia` | typia | TypeScript | Status |
|---|---|---|---|
| 2.x | 15.x | 7.x | Supported |
| 1.x | 5.5.4 to 11.x | 5.x | No longer supported |

typia 12, 13 and 14 are not supported by any version.

Version 2 is a thin wrapper around [`@ttsc/unplugin`](https://github.com/samchon/ttsc/tree/master/packages/unplugin), the Bun plugin from the makers of typia. It installs `ttsc` for you. `ttsc` needs Node.js 22.15 or later.

The first run compiles the typia plugin for `ttsc`. This can take a few minutes. Later runs use the cache in `node_modules/.cache/ttsc`.

### Upgrade from 1.x

1. Update the packages: `bun add typia@15` and `bun add -d bun-plugin-typia@2 typescript@7`.
2. Remove the `verbose` and `disableLoader` options. Version 2 does not have them, and it no longer returns `results` or `onLoadCallback`.
3. Rename typia APIs that changed in typia 13 to 15. For example, `typia.misc` is now `typia.plain`.

The options of version 2 are the options of `@ttsc/unplugin`: `project`, `compilerOptions` and `plugins`.

## Plugin usage

This plugin can be used to run typia validators at runtime with Bun without needing to create a template and generate the files:

1. Create a preload script to register the plugin via `Bun.plugin()`

```ts
// typiaPlugin.ts
import typiaPlugin from "bun-plugin-typia";

Bun.plugin(typiaPlugin());
```

2. Register the plugin in bunfig.toml
```toml
# bunfig.toml
preload = ["./typiaPlugin.ts"]

# for using in tests
[test]
preload = ["./typiaPlugin.ts"]
```

3. Use typia validators in your scripts and test files:
```ts
// index.ts
import typia, { tags } from "typia";
 
const res: typia.IValidation<IMember> = typia.validate<IMember>({
  id: 5, // wrong, must be string (uuid)
  age: 20.75, // wrong, not integer
  email: "danial@hambergerpls.com",
});
 
if (!res.success) console.log(res.errors);
// [
//   {
//     path: "$input.id",
//     expected: "(string & Format<\"uuid\">)",
//     value: 5,
//   }, {
//     path: "$input.age",
//     expected: "number & Type<\"uint32\">",
//     value: 20.75,
//   }
// ]
 
interface IMember {
  id: string & tags.Format<"uuid">;
  email: string & tags.Format<"email">;
  age: number &
    tags.Type<"uint32"> &
    tags.ExclusiveMinimum<19> &
    tags.Maximum<100>;
}

// test.ts
test("should be able to use validate function", async () => {
    const res: typia.IValidation<IMember> = typia.validate<IMember>({
        id: 5, // wrong, must be string (uuid)
        age: 20.75, // wrong, not integer
        email: "danial@hambergerpls.com",
      });
    
    
    expect(res.success).toEqual(false);
    if (res.success) throw new Error("expected validation to fail");
    expect(res.errors).toEqual([
        {
          path: "$input.id",
          expected: "(string & Format<\"uuid\">)",
          value: 5,
        }, {
          path: "$input.age",
          expected: "number & Type<\"uint32\">",
          value: 20.75,
        }
      ]);
  });

```

```bash
$ bun run index.ts
```

## Contributing

```bash
$ bun install # project setup
$ bun test # run tests
```