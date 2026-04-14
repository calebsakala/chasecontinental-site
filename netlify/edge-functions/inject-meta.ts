import type { Context } from "https://edge.netlify.com";
import {
  DEFAULT_META,
  ROUTE_META,
  SITE_ORIGIN,
  type RouteMeta,
} from "./lib/route-meta.ts";

const SANITY_PROJECT = "87a8gku7";
const SANITY_DATASET = "production";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return SITE_ORIGIN + (path.startsWith("/") ? path : "/" + path);
}

function sanityImageUrl(ref: string | undefined): string | null {
  if (!ref) return null;
  // ref format: image-<assetId>-<dims>-<ext>  e.g. image-abc123-1200x800-png
  const m = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/i);
  if (!m) return null;
  const [, id, dims, ext] = m;
  return `https://cdn.sanity.io/images/${SANITY_PROJECT}/${SANITY_DATASET}/${id}-${dims}.${ext}?w=1200&h=630&fit=crop`;
}

async function fetchBlogMeta(slug: string): Promise<RouteMeta | null> {
  const query = encodeURIComponent(
    `*[_type=="post" && slug.current==$slug][0]{title,"description":coalesce(excerpt,pt::text(body[0...1])),mainImage}`,
  );
  const params = encodeURIComponent(JSON.stringify({ slug }));
  const url = `https://${SANITY_PROJECT}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${query}&%24slug=${params}`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    const json = await res.json();
    const post = json?.result;
    if (!post?.title) return null;
    const img = sanityImageUrl(post.mainImage?.asset?._ref);
    return {
      title: `${post.title} | Chase Continental`,
      description:
        (post.description || "").toString().slice(0, 200) ||
        DEFAULT_META.description,
      image: img || DEFAULT_META.image,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function resolveMeta(pathname: string): Promise<RouteMeta> {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const blogMatch = normalized.match(/^\/blog\/([^\/]+)$/);
  if (blogMatch) {
    const meta = await fetchBlogMeta(decodeURIComponent(blogMatch[1]));
    if (meta) return meta;
    return DEFAULT_META;
  }
  return ROUTE_META[normalized] || DEFAULT_META;
}

function buildMetaBlock(meta: RouteMeta, url: string): string {
  const title = escapeHtml(meta.title);
  const desc = escapeHtml(meta.description);
  const img = escapeHtml(absoluteUrl(meta.image));
  const canonical = escapeHtml(url);
  return `    <title>${title}</title>
    <meta name="description" content="${desc}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:image" content="${img}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Chase Continental" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${img}" />`;
}

const STRIP_PATTERNS: RegExp[] = [
  /<title\b[^>]*>[\s\S]*?<\/title>\s*/i,
  /<meta\s+name=["']description["'][^>]*>\s*/gi,
  /<link\s+rel=["']canonical["'][^>]*>\s*/gi,
  /<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi,
  /<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi,
];

function rewriteHtml(html: string, metaBlock: string): string {
  let out = html;
  for (const re of STRIP_PATTERNS) out = out.replace(re, "");
  return out.replace(/<\/head>/i, `${metaBlock}\n  </head>`);
}

export default async function handler(
  request: Request,
  context: Context,
): Promise<Response | void> {
  const url = new URL(request.url);

  // Only touch HTML document requests. Asset requests with extensions bypass.
  if (/\.[a-zA-Z0-9]+$/.test(url.pathname)) return;

  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  const [meta, html] = await Promise.all([
    resolveMeta(url.pathname),
    response.text(),
  ]);

  const canonical = `${SITE_ORIGIN}${url.pathname}`;
  const metaBlock = buildMetaBlock(meta, canonical);
  const rewritten = rewriteHtml(html, metaBlock);

  const headers = new Headers(response.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("cache-control", "public, max-age=0, must-revalidate");
  headers.delete("content-length");

  return new Response(rewritten, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const config = { path: "/*" };
