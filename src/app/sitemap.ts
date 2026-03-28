import type { MetadataRoute } from "next";

import { getBugSlugs, getProjectSlugs } from "@/lib/content/queries";
import { metadataBaseUrl, navigationItems } from "@/lib/site-config";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [bugSlugs, projectSlugs] = await Promise.all([getBugSlugs(), getProjectSlugs()]);
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = navigationItems.map((item) => ({
    url: new URL(item.href, metadataBaseUrl).toString(),
    lastModified: now,
    changeFrequency: item.href === "/" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : 0.7,
  }));
  const bugRoutes = bugSlugs.map((slug) => ({
    url: new URL(`/bugs/${slug}`, metadataBaseUrl).toString(),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const projectRoutes = projectSlugs.map((slug) => ({
    url: new URL(`/projects/${slug}`, metadataBaseUrl).toString(),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticRoutes, ...bugRoutes, ...projectRoutes];
}
