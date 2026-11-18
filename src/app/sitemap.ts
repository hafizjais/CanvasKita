import type { MetadataRoute } from "next";
import { metadataBase, siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, metadataBase).toString();
  const contentUpdated = new Date(siteConfig.contentLastUpdated);
  // Parsed as UTC so the date doesn't shift with the server's time zone.
  const privacyUpdated = new Date(`${siteConfig.privacyLastUpdated} UTC`);

  return [
    { url: url("/"), lastModified: contentUpdated, changeFrequency: "monthly", priority: 1 },
    { url: url("/get-quote"), lastModified: contentUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/privacy"), lastModified: privacyUpdated, changeFrequency: "yearly", priority: 0.2 },
  ];
}
