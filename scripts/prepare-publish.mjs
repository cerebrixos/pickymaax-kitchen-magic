import { cp, mkdir, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp(".output/public", "dist", { recursive: true });

// Bolt's publisher expects a static entry point. This app is server-rendered
// via Nitro, so we provide a minimal fallback that loads the actual app.
await writeFile(
  "dist/index.html",
  `<!doctype html><meta http-equiv="refresh" content="0; url=/">`,
);
