import { z } from "zod";

import type {
  BugFrontmatter,
  BugOverride,
  ChecklistFrontmatter,
  CollectionFrontmatterMap,
  ContactLink,
  FooterContent,
  HeroContent,
  HomeContent,
  HomeSkill,
  NavigationItem,
  ProjectFrontmatter,
  ProjectVideo,
  RelatedLink,
  SeoSettings,
  SiteSettings,
  TestCaseFrontmatter,
  UpdateFrontmatter,
} from "@/types/content";
import {
  BUG_PRIORITIES,
  BUG_SEVERITIES,
  BUG_STATUSES,
  UPDATE_TYPES,
} from "@/types/filters";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const requiredString = z.string().trim().min(1);
const slugSchema = requiredString.regex(
  slugPattern,
  "Slug must use lowercase latin letters, numbers, and hyphens only.",
);
const isoDateTimeSchema = requiredString.refine(
  (value) => !Number.isNaN(Date.parse(value)),
  "Date-time must be a valid ISO 8601 string.",
);
const dateStringSchema = requiredString.regex(
  datePattern,
  "Date must use YYYY-MM-DD format.",
);
const relativeOrAbsoluteHrefSchema = requiredString.refine(
  (value) =>
    value.startsWith("/") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    /^https?:\/\//.test(value),
  "Href must be relative or a valid absolute URL/mailto/tel link.",
);

export const navigationItemSchema: z.ZodType<NavigationItem> = z.object({
  label: requiredString,
  href: relativeOrAbsoluteHrefSchema,
});

export const contactLinkSchema: z.ZodType<ContactLink> = z.object({
  label: requiredString,
  href: relativeOrAbsoluteHrefSchema,
});

export const footerContentSchema: z.ZodType<FooterContent> = z.object({
  description: requiredString,
  stack: z.array(requiredString).min(1),
  contacts: z.array(contactLinkSchema).min(1),
});

export const heroContentSchema: z.ZodType<HeroContent> = z.object({
  title: requiredString,
  subtitle: requiredString,
  ctaLabel: requiredString,
  ctaHref: relativeOrAbsoluteHrefSchema,
});

export const homeSkillSchema: z.ZodType<HomeSkill> = z.object({
  title: requiredString,
  description: requiredString,
});

export const homeContentSchema: z.ZodType<HomeContent> = z.object({
  featuredProjectsTitle: requiredString,
  skillsTitle: requiredString,
  updatesTitle: requiredString,
  skills: z.array(homeSkillSchema).length(3),
});

export const seoSettingsSchema: z.ZodType<SeoSettings> = z.object({
  defaultTitle: requiredString,
  titleTemplate: requiredString,
  defaultDescription: requiredString,
  openGraphImage: relativeOrAbsoluteHrefSchema.optional(),
});

export const siteSettingsSchema: z.ZodType<SiteSettings> = z.object({
  siteName: requiredString,
  siteDescription: requiredString,
  siteUrl: z.url(),
  locale: requiredString,
  seo: seoSettingsSchema,
  navigation: z.array(navigationItemSchema).min(1),
  hero: heroContentSchema,
  home: homeContentSchema,
  footer: footerContentSchema,
});

export const projectVideoSchema: z.ZodType<ProjectVideo> = z.object({
  title: requiredString,
  url: z.url(),
});

export const relatedLinkSchema: z.ZodType<RelatedLink> = z.object({
  label: requiredString,
  url: z.url(),
});

export const projectFrontmatterSchema: z.ZodType<ProjectFrontmatter> = z.object({
  title: requiredString,
  slug: slugSchema,
  description: requiredString,
  shortDescription: requiredString,
  scope: requiredString,
  tags: z.array(requiredString).min(1),
  featured: z.boolean(),
  order: z.number().int().nonnegative(),
  publishedAt: dateStringSchema,
  videos: z.array(projectVideoSchema).optional(),
});

export const bugFrontmatterSchema: z.ZodType<BugFrontmatter> = z.object({
  title: requiredString,
  slug: slugSchema,
  project: slugSchema,
  severity: z.enum(BUG_SEVERITIES),
  priority: z.enum(BUG_PRIORITIES),
  status: z.enum(BUG_STATUSES),
  summary: requiredString,
  environment: requiredString,
  steps: z.array(requiredString).min(1),
  expected: requiredString,
  actual: requiredString,
  screenshots: z.array(relativeOrAbsoluteHrefSchema).default([]),
  videoUrl: z.url().optional(),
  relatedLinks: z.array(relatedLinkSchema).optional(),
  publishedAt: dateStringSchema,
  updatedAt: isoDateTimeSchema.optional(),
  importedAt: isoDateTimeSchema.optional(),
  source: z.enum(["local", "github"]).optional(),
  generated: z.boolean().optional(),
  sourceRepo: requiredString.optional(),
  sourceIssueNumber: z.number().int().positive().optional(),
  sourceIssueUrl: z.url().optional(),
  labelsRaw: z.array(requiredString).default([]),
  labelsNormalized: z.array(requiredString).default([]),
  portfolioNote: requiredString.optional(),
});

export const bugOverrideSchema: z.ZodType<BugOverride> = z.object({
  screenshots: z.array(z.url()).optional(),
  videoUrl: z.url().optional(),
  relatedLinks: z.array(relatedLinkSchema).optional(),
  portfolioNote: requiredString.optional(),
});

export const testCaseFrontmatterSchema: z.ZodType<TestCaseFrontmatter> = z.object({
  title: requiredString,
  slug: slugSchema,
  caseId: requiredString,
  project: slugSchema,
  category: requiredString,
  summary: requiredString.optional(),
  steps: z.array(requiredString).min(1),
  expectedResult: requiredString,
  publishedAt: dateStringSchema,
});

export const checklistFrontmatterSchema: z.ZodType<ChecklistFrontmatter> = z.object({
  title: requiredString,
  slug: slugSchema,
  project: slugSchema,
  category: requiredString,
  description: requiredString.optional(),
  items: z.array(requiredString).min(1),
  publishedAt: dateStringSchema,
});

export const updateFrontmatterSchema: z.ZodType<UpdateFrontmatter> = z.object({
  title: requiredString,
  slug: slugSchema,
  date: dateStringSchema,
  type: z.enum(UPDATE_TYPES),
  description: requiredString,
});

export const markdownCollectionSchemas: {
  [Key in keyof CollectionFrontmatterMap]: z.ZodType<CollectionFrontmatterMap[Key]>;
} = {
  projects: projectFrontmatterSchema,
  bugs: bugFrontmatterSchema,
  "test-cases": testCaseFrontmatterSchema,
  checklists: checklistFrontmatterSchema,
  updates: updateFrontmatterSchema,
};
