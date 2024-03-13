# `bun-plugin-typia`

Adds support for [typia](https://github.com/samchon/typia), a transformer library that features super-fast runtime validators.

## Installation

```sh
bun add bun-plugin-typia -d
```

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