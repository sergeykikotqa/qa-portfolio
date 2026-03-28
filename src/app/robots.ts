import type { MetadataRoute } from "next";

import { toAbsoluteSiteUrl } from "@/lib/site-config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: toAbsoluteSiteUrl("/sitemap.xml"),
  };
}
