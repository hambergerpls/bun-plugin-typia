#!/usr/bin/env bash
# Install the packed plugin in a clean project, the way a user does, and run it.
# Usage: TYPIA=15.0.0 TYPESCRIPT=7.0.2 scripts/smoke-pack.sh
set -euo pipefail

: "${TYPIA:?set TYPIA}"
: "${TYPESCRIPT:?set TYPESCRIPT}"

root="$(cd "$(dirname "$0")/.." && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

npm pack --silent --pack-destination "$work" --prefix "$root" "$root" >/dev/null
tarball="$(ls "$work"/bun-plugin-typia-*.tgz)"

app="$work/app"
mkdir -p "$app"
cd "$app"

cat > package.json <<'EOF'
{ "name": "smoke", "private": true, "type": "module" }
EOF
cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "types": ["bun"]
  }
}
EOF
cat > typiaPlugin.ts <<'EOF'
import typiaPlugin from "bun-plugin-typia";

Bun.plugin(typiaPlugin());
EOF
echo 'preload = ["./typiaPlugin.ts"]' > bunfig.toml
cat > index.ts <<'EOF'
import typia, { type tags } from "typia";

interface A {
  id: string & tags.Format<"uuid">;
  n: number & tags.Type<"uint32">;
}

console.log(
  typia.is<A>({ id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", n: 1 }),
  typia.is<A>({ id: "x", n: -1 }),
);
EOF

bun add "typia@$TYPIA"
bun add -d "$tarball" "typescript@$TYPESCRIPT" @types/bun

output="$(bun index.ts)"
echo "$output"
if [ "$(echo "$output" | tail -n 1)" != "true false" ]; then
  echo "smoke test failed: expected 'true false'" >&2
  exit 1
fi
echo "smoke test passed"
