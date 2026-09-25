import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import typiaPlugin from "../../../../../index.ts";

const outdir = mkdtempSync(join(tmpdir(), "bun-plugin-typia-"));

const result = await Bun.build({
    entrypoints: ["./index.ts"],
    outdir,
    target: "bun",
    plugins: [typiaPlugin()],
});

if (!result.success) throw new AggregateError(result.logs, "Build failed");

await import(result.outputs[0].path);
