import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp(".output/public", "dist", { recursive: true });

// In SPA mode, nitro emits the prerendered app shell as _shell.html.
// Use it as the root index.html so the page has real content on first paint.
let shellHtml = await readFile("dist/_shell.html", "utf8").catch(() => "");

if (shellHtml) {
  await writeFile("dist/index.html", shellHtml);
  await rm("dist/_shell.html").catch(() => {});
} else {
  // Fallback: construct a minimal shell from the bundled assets.
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
}

// SPA fallback: every path that isn't a static file should serve the shell.
await writeFile(
  "dist/_redirects",
  `/*    /index.html   200
`,
);
