import type { MetadataRoute } from "next";
import { metadataBase } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, metadataBase).toString();

  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/get-quote"), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/privacy"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
