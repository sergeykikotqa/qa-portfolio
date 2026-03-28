import "server-only";

import type { Metadata } from "next";

import rawSiteSettings from "../../content/settings/site.json";

import { siteSettingsSchema } from "@/lib/content/schemas";

const siteSettingsResult = siteSettingsSchema.safeParse(rawSiteSettings);

if (!siteSettingsResult.success) {
  const issues = siteSettingsResult.error.issues
    .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
    .join("; ");

  throw new Error(`Invalid content/settings/site.json: ${issues}`);
}

export const siteSettings = siteSettingsResult.data;
export const metadataBaseUrl = new URL(siteSettings.siteUrl);
export const navigationItems = siteSettings.navigation;
export const footerConfig = siteSettings.footer;

export const baseMetadata: Metadata = {
  metadataBase: metadataBaseUrl,
  title: {
    default: siteSettings.seo.defaultTitle,
    template: siteSettings.seo.titleTemplate,
  },
  description: siteSettings.seo.defaultDescription,
  openGraph: {
    title: siteSettings.seo.defaultTitle,
    description: siteSettings.seo.defaultDescription,
    siteName: siteSettings.siteName,
    locale: siteSettings.locale.replace("-", "_"),
    type: "website",
    images: siteSettings.seo.openGraphImage ? [siteSettings.seo.openGraphImage] : undefined,
  },
};
