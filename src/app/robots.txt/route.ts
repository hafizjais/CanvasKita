import { isIndexable, metadataBase, siteConfig } from "@/config/site";

// A route handler rather than robots.ts, because Next's robots helper can't emit
// the Content-Signal directive (https://contentsignals.org). Prerendered at build time.

export function GET() {
  // Preview deployments and builds without NEXT_PUBLIC_SITE_URL are kept out of search results.
  const body = isIndexable
    ? [
        "User-Agent: *",
        `Content-Signal: ${siteConfig.contentSignal}`,
        "Allow: /",
        "",
        `Sitemap: ${new URL("/sitemap.xml", metadataBase)}`,
        "",
      ].join("\n")
    : ["User-Agent: *", "Disallow: /", ""].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
