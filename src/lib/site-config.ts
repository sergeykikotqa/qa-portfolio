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

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function joinSitePath(path: string) {
  const basePath = trimTrailingSlash(metadataBaseUrl.pathname || "/");
  const normalizedPath =
    path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;

  return `${basePath}${normalizedPath}` || "/";
}

export function toAbsoluteSiteUrl(path: string) {
  return new URL(joinSitePath(path), metadataBaseUrl.origin).toString();
}

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
    images: siteSettings.seo.openGraphImage
      ? [toAbsoluteSiteUrl(siteSettings.seo.openGraphImage)]
      : undefined,
  },
};
