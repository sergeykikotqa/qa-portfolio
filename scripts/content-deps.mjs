import path from "node:path";
import { readdir, readFile } from "node:fs/promises";

import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const COLLECTION_DIRS = {
  projects: path.join(CONTENT_ROOT, "projects"),
  bugs: path.join(CONTENT_ROOT, "bugs"),
  "test-cases": path.join(CONTENT_ROOT, "test-cases"),
  checklists: path.join(CONTENT_ROOT, "checklists"),
};

async function loadMarkdownEntries(collection) {
  const directory = COLLECTION_DIRS[collection];
  const entries = await readdir(directory, { withFileTypes: true });
  const markdownFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  const result = [];

  for (const fileName of markdownFiles) {
    const filePath = path.join(directory, fileName);
    const source = await readFile(filePath, "utf8");
    const parsed = matter(source);
    const slug = parsed.data.slug ?? path.basename(fileName, ".md");

    result.push({
      slug,
      project: parsed.data.project,
      filePath,
    });
  }

  return result;
}

function formatEntryList(entries) {
  return entries.length ? entries.map((entry) => entry.slug).join(", ") : "—";
}

async function main() {
  const [projects, bugs, testCases, checklists] = await Promise.all([
    loadMarkdownEntries("projects"),
    loadMarkdownEntries("bugs"),
    loadMarkdownEntries("test-cases"),
    loadMarkdownEntries("checklists"),
  ]);

  if (!projects.length) {
    console.log("No projects found in content/projects.");
    return;
  }

  console.log("Project dependency report");
  console.log("");

  for (const project of projects) {
    const relatedBugs = bugs.filter((entry) => entry.project === project.slug);
    const relatedTestCases = testCases.filter((entry) => entry.project === project.slug);
    const relatedChecklists = checklists.filter((entry) => entry.project === project.slug);
    const isBlocked =
      relatedBugs.length > 0 || relatedTestCases.length > 0 || relatedChecklists.length > 0;

    console.log(`${isBlocked ? "[BLOCKED]" : "[CLEAR]"} ${project.slug}`);
    console.log(`  bugs: ${formatEntryList(relatedBugs)}`);
    console.log(`  test-cases: ${formatEntryList(relatedTestCases)}`);
    console.log(`  checklists: ${formatEntryList(relatedChecklists)}`);
    console.log("");
  }

  const projectSlugs = new Set(projects.map((project) => project.slug));
  const orphanedReferences = [...bugs, ...testCases, ...checklists].filter(
    (entry) => entry.project && !projectSlugs.has(entry.project),
  );

  if (orphanedReferences.length) {
    console.error("Orphaned project references detected:");

    for (const entry of orphanedReferences) {
      console.error(`- ${entry.slug} -> ${entry.project} (${entry.filePath})`);
    }

    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
