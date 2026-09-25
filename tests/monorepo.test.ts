import { test, expect } from "bun:test";
import { join } from "node:path";

test("should transform sibling package imports when built from a monorepo package", () => {
    const proc = Bun.spawnSync(["bun", "build.ts"], {
        cwd: join(import.meta.dir, "fixtures/monorepo/packages/app"),
        env: { ...process.env, NODE_ENV: "production" },
    });

    expect(proc.stderr.toString()).not.toContain("no transform has been configured");
    expect(JSON.parse(proc.stdout.toString())).toEqual({ valid: true, invalid: false });
});
