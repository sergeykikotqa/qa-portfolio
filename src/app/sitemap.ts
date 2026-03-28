import type { MetadataRoute } from "next";

import { getBugSlugs, getProjectSlugs } from "@/lib/content/queries";
import { navigationItems, toAbsoluteSiteUrl } from "@/lib/site-config";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [bugSlugs, projectSlugs] = await Promise.all([getBugSlugs(), getProjectSlugs()]);
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = navigationItems.map((item) => ({
    url: toAbsoluteSiteUrl(item.href),
    lastModified: now,
    changeFrequency: item.href === "/" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : 0.7,
  }));
  const bugRoutes = bugSlugs.map((slug) => ({
    url: toAbsoluteSiteUrl(`/bugs/${slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const projectRoutes = projectSlugs.map((slug) => ({
    url: toAbsoluteSiteUrl(`/projects/${slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticRoutes, ...bugRoutes, ...projectRoutes];
}
