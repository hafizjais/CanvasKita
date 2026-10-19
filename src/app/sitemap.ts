import type { MetadataRoute } from "next";
import { metadataBase } from "@/config/site";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, metadataBase).toString();

  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: url(`/work/${project.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    { url: url("/privacy"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
