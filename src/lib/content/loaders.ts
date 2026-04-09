import path from "node:path";
import { readdir, readFile } from "node:fs/promises";
import { z } from "zod";

import type {
  CollectionEntryMap,
  CollectionFrontmatterMap,
  MarkdownCollectionName,
} from "@/types/content";
import { parseMarkdownEntry, ContentValidationError } from "@/lib/content/markdown";
import { markdownCollectionSchemas } from "@/lib/content/schemas";

export const CONTENT_ROOT = path.join(process.cwd(), "content");
export const BUG_SYNC_DIRECTORY = path.join(CONTENT_ROOT, "bugs-synced");
export const BUG_OVERRIDE_DIRECTORY = path.join(CONTENT_ROOT, "bug-overrides");

export const MARKDOWN_COLLECTION_DIRECTORIES: Record<
  MarkdownCollectionName,
  string
> = {
  projects: path.join(CONTENT_ROOT, "projects"),
  bugs: path.join(CONTENT_ROOT, "bugs"),
  "test-cases": path.join(CONTENT_ROOT, "test-cases"),
  checklists: path.join(CONTENT_ROOT, "checklists"),
  updates: path.join(CONTENT_ROOT, "updates"),
};

type MarkdownCollectionSchemaMap = typeof markdownCollectionSchemas;

function isMarkdownFile(fileName: string) {
  return fileName.endsWith(".md");
}

function sortFileNames(fileNames: string[]) {
  return [...fileNames].sort((left, right) => left.localeCompare(right));
}

type LoadMarkdownDirectoryArgs<TFrontmatter extends { slug: string }> = {
  collection: string;
  directory: string;
  schema: z.ZodType<TFrontmatter>;
  allowMissingDirectory?: boolean;
};

export async function loadMarkdownEntriesFromDirectory<
  TFrontmatter extends { slug: string },
>({
  collection,
  directory,
  schema,
  allowMissingDirectory = false,
}: LoadMarkdownDirectoryArgs<TFrontmatter>): Promise<(TFrontmatter & { body?: string })[]> {
  let directoryEntries;

  try {
    directoryEntries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (
      allowMissingDirectory &&
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return [];
    }

    throw error;
  }

  const fileNames = sortFileNames(
    directoryEntries
      .filter((entry) => entry.isFile() && isMarkdownFile(entry.name))
      .map((entry) => entry.name),
  );
  const entries: (TFrontmatter & { body?: string })[] = [];
  const seenSlugs = new Map<string, string>();

  for (const fileName of fileNames) {
    const filePath = path.join(directory, fileName);
    const source = await readFile(filePath, "utf8");
    const entry = parseMarkdownEntry<TFrontmatter>({
      collection,
      filePath,
      source,
      schema,
    });

    const duplicatePath = seenSlugs.get(entry.slug);

    if (duplicatePath) {
      throw new ContentValidationError(
        `Duplicate slug "${entry.slug}" detected in collection "${collection}" for files "${duplicatePath}" and "${filePath}".`,
        { collection, filePath },
      );
    }

    seenSlugs.set(entry.slug, filePath);
    entries.push(entry);
  }

  return entries;
}

export async function loadMarkdownCollection<
  TCollection extends MarkdownCollectionName,
>(collection: TCollection): Promise<CollectionEntryMap[TCollection][]> {
  const collectionDirectory = MARKDOWN_COLLECTION_DIRECTORIES[collection];
  const schema = markdownCollectionSchemas[
    collection
  ] as MarkdownCollectionSchemaMap[TCollection];

  return loadMarkdownEntriesFromDirectory<CollectionFrontmatterMap[TCollection]>({
    collection,
    directory: collectionDirectory,
    schema,
  }) as Promise<CollectionEntryMap[TCollection][]>;
}

export async function loadMarkdownEntryBySlug<
  TCollection extends MarkdownCollectionName,
>(collection: TCollection, slug: string): Promise<CollectionEntryMap[TCollection] | null> {
  const entries = await loadMarkdownCollection(collection);

  return entries.find((entry) => entry.slug === slug) ?? null;
}
