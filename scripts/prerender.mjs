/*
  Build-time prerender: serve dist/, drive each route with headless Chrome,
  and write the fully-rendered HTML back to dist/<route>/index.html so crawlers
  (Googlebot, GPTBot, ClaudeBot, PerplexityBot) receive real content instead of
  an empty SPA shell. Non-fatal by design — the caller ignores a failure and
  ships the SPA rather than breaking the deploy.
*/
import http from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 45678;

const ROUTES = [
  "/",
  "/products",
  "/resources",
  "/resources/charles",
  "/resources/heineken-case-study",
  "/resources/ccid-case-study",
  "/blogs",
  "/privacy",
  "/blog/why-most-ai-projects-fail-inside-organizations",
  "/blog/the-shift-from-tools-to-agent-systems",
  "/blog/why-reliable-ai-matters-more-than-powerful-ai",
  "/blog/the-production-possibility-frontier-of-organizations",
  "/blog/intelligence-as-operating-expenditure",
  "/blog/designing-organizations-that-think",
];

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

// Static server for dist with SPA fallback to index.html.
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent(req.url.split("?")[0]);
        let filePath = path.join(DIST, urlPath);
        if (urlPath.endsWith("/")) filePath = path.join(filePath, "index.html");
        if (!existsSync(filePath) || !path.extname(filePath)) {
          filePath = path.join(DIST, "index.html"); // SPA fallback
        }
        const body = await readFile(filePath);
        res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
        res.end(body);
      } catch {
        res.writeHead(404);
        res.end("not found");
      }
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function run() {
  // Hard watchdog: never let prerender hang the deploy. If anything stalls,
  // exit 0 so the build ships whatever was produced (plus the SPA fallback).
  const watchdog = setTimeout(() => {
    console.warn("prerender watchdog: time budget exceeded, shipping what we have");
    process.exit(0);
  }, 240000);
  if (typeof watchdog.unref === "function") watchdog.unref();

  const server = await startServer();

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      timeout: 60000,
    });
  } catch (e) {
    console.warn(`prerender: could not launch Chrome, shipping SPA: ${e.message}`);
    server.close();
    clearTimeout(watchdog);
    process.exit(0);
  }

  let ok = 0;
  for (const route of ROUTES) {
    const page = await browser.newPage();
    try {
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: "networkidle0",
        timeout: 45000,
      });
      // Ensure the app actually rendered content into #root.
      await page.waitForFunction(
        () => {
          const r = document.getElementById("root");
          return r && r.childElementCount > 0 && document.querySelector("h1, h2");
        },
        { timeout: 20000 }
      );
      // let entrance animations settle so content is at final (visible) state
      await new Promise((r) => setTimeout(r, 600));

      const html = await page.content();
      const outDir = route === "/" ? DIST : path.join(DIST, route);
      await mkdir(outDir, { recursive: true });
      await writeFile(path.join(outDir, "index.html"), html, "utf8");
      ok += 1;
      console.log(`prerendered ${route}`);
    } catch (e) {
      console.warn(`skip ${route}: ${e.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();
  clearTimeout(watchdog);
  console.log(`prerender complete: ${ok}/${ROUTES.length} routes`);
  // Always exit 0: prerender is an enhancement, never a reason to fail a deploy.
  process.exit(0);
}

run().catch((e) => {
  console.warn(`prerender skipped, shipping SPA: ${e.message}`);
  process.exit(0);
});
