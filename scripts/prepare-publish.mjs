import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp(".output/public", "dist", { recursive: true });

const assets = await readdir("dist/assets");
const jsBundle = assets.find((f) => /^index-[A-Za-z0-9_-]+\.js$/.test(f));
const cssBundle = assets.find((f) => /^styles-[A-Za-z0-9_-]+\.css$/.test(f));

if (!jsBundle || !cssBundle) {
  console.error("Could not find JS or CSS bundle in dist/assets");
  process.exit(1);
}

// In SPA mode, nitro prerenders the app shell as _shell.html. The client
// bundle uses hydrateRoot(document, ...), so it needs matching HTML to
// hydrate against. But the prerendered shell contains TanStack router
// scripts ($tsr-stream-barrier, scroll restoration, inline bootstrap)
// that assume SSR streaming and cause a render loop in SPA mode.
//
// Strategy: keep the prerendered HTML structure (head + body), strip ALL
// inline scripts, then add back only the JS bundle so the client can
// hydrate cleanly.
let shellHtml = await readFile("dist/_shell.html", "utf8").catch(() => "");

if (shellHtml) {
  // Remove all <script> tags (inline router state, scroll restoration, etc.)
  shellHtml = shellHtml.replace(/<script[\s\S]*?<\/script>/g, "");

  // Remove modulepreload links — the JS bundle loads its own deps.
  shellHtml = shellHtml.replace(/<link rel="modulepreload"[^>]*>/g, "");

  // Inject the JS bundle script right before </body>.
  shellHtml = shellHtml.replace(
    /<\/body>/,
    `<script type="module" src="/assets/${jsBundle}"></script></body>`,
  );

  await writeFile("dist/index.html", shellHtml);
  await rm("dist/_shell.html").catch(() => {});
} else {
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
}

// SPA fallback: every path that isn't a static file should serve the shell.
await writeFile(
  "dist/_redirects",
  `/*    /index.html   200
`,
);
