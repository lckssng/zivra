import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Zivra patient overview", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Zivra \| Maandelijkse voortgang<\/title>/);
  assert.match(html, /Patiënten/);
  assert.match(html, /Aandacht nodig/);
  assert.match(html, /Saskia Groen/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("removes the disposable starter preview", async () => {
  const [page, layout, styles, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /export default function ZivraDashboard/);
  assert.match(page, /game === "Balloon Burst"\) return <Balloon/);
  assert.match(page, /game === "Blokki"\) return <ToyBrick/);
  assert.match(page, /return <CircleDotDashed/);
  assert.doesNotMatch(page, /Bekijk videobeelden in 3D/);
  assert.doesNotMatch(page, /Bekijk in video\/model|measurement-timeline/);
  assert.match(layout, /lang="nl"/);
  assert.match(layout, /Zivra \| Maandelijkse voortgang/);
  assert.doesNotMatch(styles, /text-transform:\s*uppercase/);
  assert.match(styles, /--heading-text:\s*#202637/);
  assert.match(styles, /--body-text:\s*#667085/);
  assert.match(styles, /--font-heading:\s*"Segoe UI Variable Display"/);
  assert.match(styles, /--font-body:\s*"Segoe UI Variable Text"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview/", import.meta.url)));
});

test("keeps session scores and daily training totals consistent", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  const sessionScores = [...page.matchAll(/score:\s*(\d+),\s*\n\s*maximum:\s*(\d+),/g)];
  assert.ok(sessionScores.length > 0);
  for (const [, score, maximum] of sessionScores) {
    assert.ok(Number(score) <= Number(maximum), `${score} behaald kan niet hoger zijn dan ${maximum} gepland`);
  }

  const currentDay = page.match(/"2026-08-11":\s*\{([\s\S]*?)\n\s*\},\n\s*"2026-08-10"/);
  assert.ok(currentDay);
  const results = [...currentDay[1].matchAll(/achieved:\s*(\d+),\s*target:\s*(\d+)/g)];
  assert.equal(results.length, 4);

  const achieved = results.reduce((sum, result) => sum + Number(result[1]), 0);
  const planned = results.reduce((sum, result) => sum + Number(result[2]), 0);
  assert.equal(achieved, 32);
  assert.equal(planned, 36);
  assert.equal(Math.round((achieved / planned) * 100), 89);

  const touchResult = currentDay[1].match(/touch:\s*\{\s*achieved:\s*(\d+),\s*target:\s*(\d+)/);
  assert.ok(touchResult);
  assert.equal(Number(touchResult[1]), 17);
  assert.equal(Number(touchResult[2]), 18);

  const blokki = page.match(/id:\s*822,[\s\S]*?game:\s*"Blokki",[\s\S]*?score:\s*(\d+),\s*\n\s*maximum:\s*(\d+),/);
  assert.ok(blokki);
  assert.equal(Number(blokki[1]), achieved);
  assert.equal(Number(blokki[2]), planned);
  assert.match(page, /values:\s*\[0, 3, 6, 8, 12, 17\]/);
  assert.match(page, /821:[\s\S]*?touch:\s*\[0, 1, 4, 5, 6, 8\]/);
  assert.match(page, /822:[\s\S]*?touch:\s*\[0, 2, 3, 6, 7, 9\]/);
  assert.match(page, /823:[\s\S]*?touch:\s*\[0, 1, 2, 3, 5, 7\]/);
  assert.match(page, /sessionMetricSeries\[session\.id\]\?\.\[metric\]/);
  assert.match(page, /session\.durationSeconds \* index/);
  assert.match(page, /metric-line-ticks/);
});

test("is ready for static GitHub Pages deployment", async () => {
  const [nextConfig, viteConfig, layout, workflow] = await Promise.all([
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8"),
  ]);

  assert.match(nextConfig, /GITHUB_PAGES === "true"/);
  assert.match(nextConfig, /output: isGitHubPages \? "export"/);
  assert.match(nextConfig, /assetPrefix: pagesPath/);
  assert.match(viteConfig, /base: pagesBase/);
  assert.match(viteConfig, /`\/\$\{repositoryName\}\/`/);
  assert.match(layout, /`\$\{basePath\}\/favicon\.svg`/);
  assert.match(layout, /export const dynamic = "force-static"/);
  assert.match(workflow, /branches:\s*\n\s*- github-pages/);
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /path: \.\/dist\/client/);
  assert.match(workflow, /actions\/deploy-pages@v5/);
});
