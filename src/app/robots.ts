import type { MetadataRoute } from "next";
import { isIndexable, metadataBase } from "@/config/site";

// Preview deployments and builds without NEXT_PUBLIC_SITE_URL are kept out of search results.
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", metadataBase).toString(),
  };
}
