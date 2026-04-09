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
import { loadMergedBugs } from "@/lib/content/bugs";
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

type ProjectDependencies = {
  projectSlug: string;
  bugs: Bug[];
  testCases: TestCase[];
  checklists: Checklist[];
};

type ValidatedProjectCollections = {
  projects: Project[];
  bugs: Bug[];
  testCases: TestCase[];
  checklists: Checklist[];
};

function collectProjectDependencies(
  projectSlug: string,
  bugs: Bug[],
  testCases: TestCase[],
  checklists: Checklist[],
): ProjectDependencies {
  return {
    projectSlug,
    bugs: bugs.filter((bug) => bug.project === projectSlug),
    testCases: testCases.filter((testCase) => testCase.project === projectSlug),
    checklists: checklists.filter((checklist) => checklist.project === projectSlug),
  };
}

function formatBlockingEntries(label: string, entries: { slug: string }[]) {
  return entries.length ? `${label}: ${entries.map((entry) => entry.slug).join(", ")}` : null;
}

function buildProjectDeletionError(dependencies: ProjectDependencies) {
  const blockingCollections = [
    formatBlockingEntries("bugs", dependencies.bugs),
    formatBlockingEntries("test-cases", dependencies.testCases),
    formatBlockingEntries("checklists", dependencies.checklists),
  ].filter(Boolean);

  const filePath = path.join(
    MARKDOWN_COLLECTION_DIRECTORIES.projects,
    `${dependencies.projectSlug}.md`,
  );

  return new ContentValidationError(
    `Project "${dependencies.projectSlug}" cannot be deleted while related content still exists. Remove or re-link the blocking entries first. Blocking collections: ${blockingCollections.join("; ")}.`,
    {
      collection: "projects",
      filePath,
    },
  );
}

const getValidatedProjectCollections = cache(
  async (): Promise<ValidatedProjectCollections> => {
    const [projects, bugs, testCases, checklists] = await Promise.all([
      loadMarkdownCollection("projects"),
      loadMergedBugs(),
      loadMarkdownCollection("test-cases"),
      loadMarkdownCollection("checklists"),
    ]);
    const projectSlugs = new Set(projects.map((project) => project.slug));
    const referencedProjectSlugs = new Set(
      [...bugs, ...testCases, ...checklists].map((entry) => entry.project),
    );
    const missingProjectSlugs = [...referencedProjectSlugs]
      .filter((projectSlug) => !projectSlugs.has(projectSlug))
      .sort();

    if (missingProjectSlugs.length) {
      const dependencies = collectProjectDependencies(
        missingProjectSlugs[0],
        bugs,
        testCases,
        checklists,
      );

      throw buildProjectDeletionError(dependencies);
    }

    return {
      projects: sortProjects(projects),
      bugs: sortBugs(bugs),
      testCases: sortTestCases(testCases),
      checklists: sortChecklists(checklists),
    };
  },
);

export const getSiteSettings = cache(async (): Promise<SiteSettings> => siteSettings);

export const getAllProjects = cache(async (): Promise<Project[]> => {
  return (await getValidatedProjectCollections()).projects;
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
  return (await getValidatedProjectCollections()).bugs;
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
  return (await getValidatedProjectCollections()).testCases;
});

export const getAllChecklists = cache(async (): Promise<Checklist[]> => {
  return (await getValidatedProjectCollections()).checklists;
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
    const [project, dependencies] = await Promise.all([
      getProjectBySlug(slug),
      getProjectDependencies(slug),
    ]);

    if (!project) {
      return null;
    }

    const { bugs: relatedBugs, testCases: relatedTestCases, checklists: relatedChecklists } =
      dependencies;

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

export const getProjectDependencies = cache(
  async (projectSlug: string): Promise<ProjectDependencies> => {
    const { bugs, testCases, checklists } = await getValidatedProjectCollections();

    return collectProjectDependencies(projectSlug, bugs, testCases, checklists);
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
