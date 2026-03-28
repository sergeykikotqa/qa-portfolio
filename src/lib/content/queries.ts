import path from "node:path";
import { cache } from "react";
import { compareAsc, compareDesc, parseISO } from "date-fns";

import type {
  Bug,
  Checklist,
  Project,
  ProjectAggregate,
  SiteSettings,
  SiteStats,
  TestCase,
  UpdateItem,
} from "@/types/content";
import { ContentValidationError } from "@/lib/content/markdown";
import { MARKDOWN_COLLECTION_DIRECTORIES, loadMarkdownCollection } from "@/lib/content/loaders";
import { siteSettings } from "@/lib/site-config";

const severityOrder: Record<Bug["severity"], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const priorityOrder: Record<Bug["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function compareDateDesc(left: string, right: string) {
  return compareDesc(parseISO(left), parseISO(right));
}

function compareDateAsc(left: string, right: string) {
  return compareAsc(parseISO(left), parseISO(right));
}

function sortProjects(projects: Project[]) {
  return [...projects].sort((left, right) => {
    const byOrder = left.order - right.order;

    if (byOrder !== 0) {
      return byOrder;
    }

    return compareDateDesc(left.publishedAt, right.publishedAt);
  });
}

function sortBugs(bugs: Bug[]) {
  return [...bugs].sort((left, right) => {
    const byDate = compareDateDesc(left.publishedAt, right.publishedAt);

    if (byDate !== 0) {
      return byDate;
    }

    const bySeverity = severityOrder[left.severity] - severityOrder[right.severity];

    if (bySeverity !== 0) {
      return bySeverity;
    }

    return priorityOrder[left.priority] - priorityOrder[right.priority];
  });
}

function sortTestCases(testCases: TestCase[]) {
  return [...testCases].sort((left, right) => {
    const byProject = left.project.localeCompare(right.project);

    if (byProject !== 0) {
      return byProject;
    }

    const byDate = compareDateDesc(left.publishedAt, right.publishedAt);

    if (byDate !== 0) {
      return byDate;
    }

    return left.caseId.localeCompare(right.caseId);
  });
}

function sortChecklists(checklists: Checklist[]) {
  return [...checklists].sort((left, right) => {
    const byCategory = left.category.localeCompare(right.category);

    if (byCategory !== 0) {
      return byCategory;
    }

    return compareDateDesc(left.publishedAt, right.publishedAt);
  });
}

function sortUpdates(updates: UpdateItem[]) {
  return [...updates].sort((left, right) => compareDateDesc(left.date, right.date));
}

function assertProjectReferences<
  TEntry extends {
    slug: string;
    project: string;
  },
>(entries: TEntry[], projects: Project[], collection: "bugs" | "test-cases" | "checklists") {
  const projectSlugs = new Set(projects.map((project) => project.slug));
  const collectionDirectory = MARKDOWN_COLLECTION_DIRECTORIES[collection];

  for (const entry of entries) {
    if (!projectSlugs.has(entry.project)) {
      const availableProjects = projects.map((project) => project.slug).sort().join(", ");
      const filePath = path.join(collectionDirectory, `${entry.slug}.md`);

      throw new ContentValidationError(
        `Invalid project reference "${entry.project}" in ${collection} entry "${entry.slug}". Expected one of: ${availableProjects || "no published projects"}.`,
        { collection, filePath },
      );
    }
  }
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => siteSettings);

export const getAllProjects = cache(async (): Promise<Project[]> => {
  const projects = await loadMarkdownCollection("projects");
  return sortProjects(projects);
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const projects = await getAllProjects();
  return projects.find((project) => project.slug === slug) ?? null;
});

export const getProjectSlugs = cache(async (): Promise<string[]> => {
  const projects = await getAllProjects();
  return projects.map((project) => project.slug);
});

export const getAllBugs = cache(async (): Promise<Bug[]> => {
  const [bugs, projects] = await Promise.all([
    loadMarkdownCollection("bugs"),
    getAllProjects(),
  ]);

  assertProjectReferences(bugs, projects, "bugs");

  return sortBugs(bugs);
});

export const getBugBySlug = cache(async (slug: string): Promise<Bug | null> => {
  const bugs = await getAllBugs();
  return bugs.find((bug) => bug.slug === slug) ?? null;
});

export const getBugSlugs = cache(async (): Promise<string[]> => {
  const bugs = await getAllBugs();
  return bugs.map((bug) => bug.slug);
});

export const getAllTestCases = cache(async (): Promise<TestCase[]> => {
  const [testCases, projects] = await Promise.all([
    loadMarkdownCollection("test-cases"),
    getAllProjects(),
  ]);

  assertProjectReferences(testCases, projects, "test-cases");

  return sortTestCases(testCases);
});

export const getAllChecklists = cache(async (): Promise<Checklist[]> => {
  const [checklists, projects] = await Promise.all([
    loadMarkdownCollection("checklists"),
    getAllProjects(),
  ]);

  assertProjectReferences(checklists, projects, "checklists");

  return sortChecklists(checklists);
});

export const getAllUpdates = cache(async (): Promise<UpdateItem[]> => {
  const updates = await loadMarkdownCollection("updates");
  return sortUpdates(updates);
});

export const getSiteStats = cache(async (): Promise<SiteStats> => {
  const [projects, bugs, testCases, checklists, updates] = await Promise.all([
    getAllProjects(),
    getAllBugs(),
    getAllTestCases(),
    getAllChecklists(),
    getAllUpdates(),
  ]);

  return {
    totalProjects: projects.length,
    totalBugs: bugs.length,
    criticalBugs: bugs.filter((bug) => bug.severity === "critical").length,
    totalTestCases: testCases.length,
    totalChecklists: checklists.length,
    totalChecklistItems: checklists.reduce(
      (total, checklist) => total + checklist.items.length,
      0,
    ),
    totalUpdates: updates.length,
  };
});

export const getProjectAggregate = cache(
  async (slug: string): Promise<ProjectAggregate | null> => {
    const [project, bugs, testCases, checklists] = await Promise.all([
      getProjectBySlug(slug),
      getAllBugs(),
      getAllTestCases(),
      getAllChecklists(),
    ]);

    if (!project) {
      return null;
    }

    const relatedBugs = bugs.filter((bug) => bug.project === slug);
    const relatedTestCases = testCases.filter((testCase) => testCase.project === slug);
    const relatedChecklists = checklists.filter((checklist) => checklist.project === slug);

    return {
      project,
      bugs: relatedBugs,
      testCases: relatedTestCases,
      checklists: relatedChecklists,
      counts: {
        bugs: relatedBugs.length,
        testCases: relatedTestCases.length,
        checklists: relatedChecklists.length,
        checklistItems: relatedChecklists.reduce(
          (total, checklist) => total + checklist.items.length,
          0,
        ),
      },
    };
  },
);

export const getNewestUpdate = cache(async (): Promise<UpdateItem | null> => {
  const updates = await getAllUpdates();
  return updates[0] ?? null;
});

export const getChronologicalUpdates = cache(async (): Promise<UpdateItem[]> => {
  const updates = await getAllUpdates();
  return [...updates].sort((left, right) => compareDateAsc(left.date, right.date));
});
