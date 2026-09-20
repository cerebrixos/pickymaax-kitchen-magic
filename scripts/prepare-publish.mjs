import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp(".output/public", "dist", { recursive: true });

// Remove the prerendered shell — it contains embedded SSR router state and
// stream-barrier scripts that cause a render loop in SPA mode. We write a
// clean shell instead so the client does a fresh render with no hydration
// mismatch.
await rm("dist/_shell.html", { force: true }).catch(() => {});

const assets = await readdir("dist/assets");
const jsBundle = assets.find((f) => /^index-[A-Za-z0-9_-]+\.js$/.test(f));
const cssBundle = assets.find((f) => /^styles-[A-Za-z0-9_-]+\.css$/.test(f));

if (!jsBundle || !cssBundle) {
  console.error("Could not find JS or CSS bundle in dist/assets");
  process.exit(1);
}

await writeFile(
  "dist/index.html",
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>PickyMaax — Life Enhancing Kibble Topper for Picky Dogs</title>
<meta name="description" content="A savory, life enhancing kibble topper made to help picky dogs actually eat. Just sprinkle, toss, and serve." />
<link rel="icon" href="/pickymaax-logo.webp" type="image/webp" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600;700&display=swap" />
<link rel="stylesheet" href="/assets/${cssBundle}" />
</head>
<body>
<div id="root"></div>
<script type="module" src="/assets/${jsBundle}"></script>
</body>
</html>`,
);

// SPA fallback: every path that isn't a static file should serve the shell.
await writeFile(
  "dist/_redirects",
  `/*    /index.html   200
`,
);
