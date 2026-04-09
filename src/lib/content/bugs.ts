import path from "node:path";
import { readdir, readFile } from "node:fs/promises";

import type { Bug, BugFrontmatter, BugOverride } from "@/types/content";
import {
  BUG_OVERRIDE_DIRECTORY,
  BUG_SYNC_DIRECTORY,
  loadMarkdownCollection,
  loadMarkdownEntriesFromDirectory,
} from "@/lib/content/loaders";
import { ContentValidationError } from "@/lib/content/markdown";
import { bugFrontmatterSchema, bugOverrideSchema } from "@/lib/content/schemas";

type StoredBugOverride = {
  filePath: string;
  value: BugOverride;
};

function toBug(
  bug: BugFrontmatter & { body?: string },
  fallbackSource: Bug["source"],
): Bug {
  return {
    ...bug,
    source: bug.source ?? fallbackSource,
    generated: bug.generated ?? fallbackSource === "github",
    labelsRaw: bug.labelsRaw ?? [],
    labelsNormalized: bug.labelsNormalized ?? [],
  };
}

function applyOverride(bug: Bug, override?: BugOverride): Bug {
  if (!override) {
    return bug;
  }

  return {
    ...bug,
    screenshots: override.screenshots ?? bug.screenshots,
    videoUrl: override.videoUrl ?? bug.videoUrl,
    relatedLinks: override.relatedLinks ?? bug.relatedLinks,
    portfolioNote: override.portfolioNote ?? bug.portfolioNote,
  };
}

function buildBugFilePath(directory: string, slug: string, extension = ".md") {
  return path.join(directory, `${slug}${extension}`);
}

function buildSlugCollisionError(slug: string, existingPath: string, incomingPath: string) {
  return new ContentValidationError(
    `Duplicate bug slug "${slug}" detected across bug sources: "${existingPath}" and "${incomingPath}".`,
    {
      collection: "bugs",
      filePath: incomingPath,
    },
  );
}

function assertUniqueBugSlugs(manualBugs: Bug[], syncedBugs: Bug[]) {
  const seenPaths = new Map<string, string>();

  for (const bug of manualBugs) {
    seenPaths.set(bug.slug, buildBugFilePath(path.join(process.cwd(), "content", "bugs"), bug.slug));
  }

  for (const bug of syncedBugs) {
    const filePath = buildBugFilePath(BUG_SYNC_DIRECTORY, bug.slug);
    const existingPath = seenPaths.get(bug.slug);

    if (existingPath) {
      throw buildSlugCollisionError(bug.slug, existingPath, filePath);
    }

    seenPaths.set(bug.slug, filePath);
  }
}

async function loadBugOverrides(): Promise<Map<string, StoredBugOverride>> {
  let directoryEntries;

  try {
    directoryEntries = await readdir(BUG_OVERRIDE_DIRECTORY, { withFileTypes: true });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return new Map();
    }

    throw error;
  }

  const overrideFiles = directoryEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
  const overrides = new Map<string, StoredBugOverride>();

  for (const fileName of overrideFiles) {
    const filePath = path.join(BUG_OVERRIDE_DIRECTORY, fileName);
    const slug = path.basename(fileName, ".json");

    let parsedJson: unknown;

    try {
      parsedJson = JSON.parse(await readFile(filePath, "utf8"));
    } catch (error) {
      throw new ContentValidationError(
        `Invalid JSON in "${filePath}": ${error instanceof Error ? error.message : String(error)}.`,
        { filePath },
      );
    }

    const result = bugOverrideSchema.safeParse(parsedJson);

    if (!result.success) {
      throw new ContentValidationError(
        `Invalid bug override in "${filePath}": ${result.error.issues
          .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
          .join("; ")}.`,
        { filePath },
      );
    }

    overrides.set(slug, {
      filePath,
      value: result.data,
    });
  }

  return overrides;
}

export async function loadMergedBugs(): Promise<Bug[]> {
  const [manualEntries, syncedEntries, overrides] = await Promise.all([
    loadMarkdownCollection("bugs"),
    loadMarkdownEntriesFromDirectory<BugFrontmatter>({
      collection: "bugs-synced",
      directory: BUG_SYNC_DIRECTORY,
      schema: bugFrontmatterSchema,
      allowMissingDirectory: true,
    }),
    loadBugOverrides(),
  ]);
  const manualBugs = manualEntries.map((bug) => toBug(bug, "local"));
  const syncedBugs = syncedEntries.map((bug) => toBug(bug, "github"));

  assertUniqueBugSlugs(manualBugs, syncedBugs);

  const syncedSlugs = new Set(syncedBugs.map((bug) => bug.slug));

  for (const [slug, override] of overrides.entries()) {
    if (!syncedSlugs.has(slug)) {
      throw new ContentValidationError(
        `Bug override "${slug}" does not match any synced bug slug.`,
        {
          filePath: override.filePath,
        },
      );
    }
  }

  return [
    ...manualBugs,
    ...syncedBugs.map((bug) => applyOverride(bug, overrides.get(bug.slug)?.value)),
  ];
}
