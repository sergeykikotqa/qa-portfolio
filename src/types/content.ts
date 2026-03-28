import type {
  BugPriority,
  BugSeverity,
  BugStatus,
  UpdateType,
} from "@/types/filters";

export interface NavigationItem {
  label: string;
  href: string;
}

export interface ContactLink {
  label: string;
  href: string;
}

export interface FooterContent {
  description: string;
  stack: string[];
  contacts: ContactLink[];
}

export interface HeroContent {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface HomeSkill {
  title: string;
  description: string;
}

export interface HomeContent {
  featuredProjectsTitle: string;
  skillsTitle: string;
  updatesTitle: string;
  skills: HomeSkill[];
}

export interface SeoSettings {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  openGraphImage?: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  locale: string;
  seo: SeoSettings;
  navigation: NavigationItem[];
  hero: HeroContent;
  home: HomeContent;
  footer: FooterContent;
}

export interface MarkdownEntryBase {
  slug: string;
  body?: string;
}

export interface ProjectVideo {
  title: string;
  url: string;
}

export interface RelatedLink {
  label: string;
  url: string;
}

export interface ProjectFrontmatter {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  scope: string;
  tags: string[];
  featured: boolean;
  order: number;
  publishedAt: string;
  videos?: ProjectVideo[];
}

export type Project = ProjectFrontmatter & MarkdownEntryBase;

export interface BugFrontmatter {
  title: string;
  slug: string;
  project: string;
  severity: BugSeverity;
  priority: BugPriority;
  status: BugStatus;
  summary: string;
  environment: string;
  steps: string[];
  expected: string;
  actual: string;
  screenshots: string[];
  videoUrl?: string;
  relatedLinks?: RelatedLink[];
  publishedAt: string;
}

export type Bug = BugFrontmatter & MarkdownEntryBase;

export interface TestCaseFrontmatter {
  title: string;
  slug: string;
  caseId: string;
  project: string;
  category: string;
  summary?: string;
  steps: string[];
  expectedResult: string;
  publishedAt: string;
}

export type TestCase = TestCaseFrontmatter & MarkdownEntryBase;

export interface ChecklistFrontmatter {
  title: string;
  slug: string;
  project: string;
  category: string;
  description?: string;
  items: string[];
  publishedAt: string;
}

export type Checklist = ChecklistFrontmatter & MarkdownEntryBase;

export interface UpdateFrontmatter {
  title: string;
  slug: string;
  date: string;
  type: UpdateType;
  description: string;
}

export type UpdateItem = UpdateFrontmatter & MarkdownEntryBase;

export interface ProjectAggregateCounts {
  bugs: number;
  testCases: number;
  checklists: number;
  checklistItems: number;
}

export interface ProjectAggregate {
  project: Project;
  bugs: Bug[];
  testCases: TestCase[];
  checklists: Checklist[];
  counts: ProjectAggregateCounts;
}

export interface SiteStats {
  totalProjects: number;
  totalBugs: number;
  criticalBugs: number;
  totalTestCases: number;
  totalChecklists: number;
  totalChecklistItems: number;
  totalUpdates: number;
}

export interface CollectionFrontmatterMap {
  projects: ProjectFrontmatter;
  bugs: BugFrontmatter;
  "test-cases": TestCaseFrontmatter;
  checklists: ChecklistFrontmatter;
  updates: UpdateFrontmatter;
}

export interface CollectionEntryMap {
  projects: Project;
  bugs: Bug;
  "test-cases": TestCase;
  checklists: Checklist;
  updates: UpdateItem;
}

export type MarkdownCollectionName = keyof CollectionEntryMap;
