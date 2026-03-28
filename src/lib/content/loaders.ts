import path from "node:path";
import { readdir, readFile } from "node:fs/promises";

import type {
  CollectionEntryMap,
  CollectionFrontmatterMap,
  MarkdownCollectionName,
} from "@/types/content";
import { parseMarkdownEntry, ContentValidationError } from "@/lib/content/markdown";
import { markdownCollectionSchemas } from "@/lib/content/schemas";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

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

export async function loadMarkdownCollection<
  TCollection extends MarkdownCollectionName,
>(collection: TCollection): Promise<CollectionEntryMap[TCollection][]> {
  const collectionDirectory = MARKDOWN_COLLECTION_DIRECTORIES[collection];
  const directoryEntries = await readdir(collectionDirectory, { withFileTypes: true });
  const fileNames = sortFileNames(
    directoryEntries
      .filter((entry) => entry.isFile() && isMarkdownFile(entry.name))
      .map((entry) => entry.name),
  );

  const schema = markdownCollectionSchemas[
    collection
  ] as MarkdownCollectionSchemaMap[TCollection];
  const entries: CollectionEntryMap[TCollection][] = [];
  const seenSlugs = new Map<string, string>();

  for (const fileName of fileNames) {
    const filePath = path.join(collectionDirectory, fileName);
    const source = await readFile(filePath, "utf8");
    const entry = parseMarkdownEntry<CollectionFrontmatterMap[TCollection]>({
      collection,
      filePath,
      source,
      schema,
    }) as CollectionEntryMap[TCollection];

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

export async function loadMarkdownEntryBySlug<
  TCollection extends MarkdownCollectionName,
>(collection: TCollection, slug: string): Promise<CollectionEntryMap[TCollection] | null> {
  const entries = await loadMarkdownCollection(collection);

  return entries.find((entry) => entry.slug === slug) ?? null;
}
