import path from "node:path";

import matter from "gray-matter";
import { z } from "zod";

type ParseMarkdownEntryArgs<TFrontmatter extends { slug: string }> = {
  collection: string;
  filePath: string;
  source: string;
  schema: z.ZodType<TFrontmatter>;
};

export class ContentValidationError extends Error {
  public readonly collection?: string;
  public readonly filePath: string;

  constructor(message: string, options: { collection?: string; filePath: string }) {
    super(message);
    this.name = "ContentValidationError";
    this.collection = options.collection;
    this.filePath = options.filePath;
  }
}

function formatZodIssues(error: z.ZodError) {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
    .join("; ");
}

function formatDateToLocalDay(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeFrontmatterValue(value: unknown): unknown {
  if (value instanceof Date) {
    return formatDateToLocalDay(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeFrontmatterValue(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        normalizeFrontmatterValue(nestedValue),
      ]),
    );
  }

  return value;
}

export function parseMarkdownEntry<TFrontmatter extends { slug: string }>({
  collection,
  filePath,
  source,
  schema,
}: ParseMarkdownEntryArgs<TFrontmatter>): TFrontmatter & { body?: string } {
  if (!source.trimStart().startsWith("---")) {
    throw new ContentValidationError(
      `Missing required frontmatter in "${filePath}".`,
      { collection, filePath },
    );
  }

  const parsed = matter(source);
  const normalizedData = normalizeFrontmatterValue(parsed.data);
  const frontmatterResult = schema.safeParse(normalizedData);

  if (!frontmatterResult.success) {
    throw new ContentValidationError(
      `Invalid frontmatter in "${filePath}": ${formatZodIssues(frontmatterResult.error)}`,
      { collection, filePath },
    );
  }

  const frontmatter = frontmatterResult.data;
  const fileSlug = path.basename(filePath, path.extname(filePath));

  if (frontmatter.slug !== fileSlug) {
    throw new ContentValidationError(
      `Slug "${frontmatter.slug}" in "${filePath}" must match filename "${fileSlug}".`,
      { collection, filePath },
    );
  }

  const body = parsed.content.trim();

  return body.length > 0 ? { ...frontmatter, body } : { ...frontmatter };
}
