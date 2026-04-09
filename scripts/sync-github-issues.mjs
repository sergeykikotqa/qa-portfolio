import path from "node:path";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";

import matter from "gray-matter";

import {
  DEFAULT_GITHUB_ISSUES_REPO,
  SyncValidationError,
  buildSyncedBugFromIssue,
  planManagedMarkdownChanges,
  shouldSyncIssue,
  stringifyBugMarkdown,
} from "./lib/github-issues-sync.mjs";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const PROJECTS_DIRECTORY = path.join(CONTENT_ROOT, "projects");
const MANUAL_BUGS_DIRECTORY = path.join(CONTENT_ROOT, "bugs");
const SYNCED_BUGS_DIRECTORY = path.join(CONTENT_ROOT, "bugs-synced");
const PER_PAGE = 100;

function parseArguments(argv) {
  const args = new Set(argv);
  return {
    dryRun: args.has("--dry-run"),
  };
}

function parseRepoFullName(value) {
  const [owner, repo] = value.split("/");

  if (!owner || !repo) {
    throw new Error(`Invalid repository "${value}". Use the "owner/repo" format.`);
  }

  return {
    owner,
    repo,
  };
}

async function loadSlugsFromMarkdownDirectory(directory) {
  const directoryEntries = await readdir(directory, { withFileTypes: true });
  const slugs = new Set();

  for (const entry of directoryEntries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }

    const filePath = path.join(directory, entry.name);
    const parsed = matter(await readFile(filePath, "utf8"));
    const slug = typeof parsed.data.slug === "string" && parsed.data.slug.trim()
      ? parsed.data.slug.trim()
      : path.basename(entry.name, ".md");

    slugs.add(slug);
  }

  return slugs;
}

async function fetchIssuesPage({ owner, repo, page, token }) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=${PER_PAGE}&page=${page}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "qa-portfolio-sync",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`GitHub API request failed with ${response.status} ${response.statusText}.`);
  }

  return response.json();
}

async function fetchAllIssues(repoFullName, token) {
  const { owner, repo } = parseRepoFullName(repoFullName);
  const issues = [];
  let page = 1;

  while (true) {
    const pageItems = await fetchIssuesPage({ owner, repo, page, token });
    issues.push(...pageItems);

    if (pageItems.length < PER_PAGE) {
      return issues;
    }

    page += 1;
  }
}

async function readManagedMarkdownFiles(directory) {
  let directoryEntries;

  try {
    directoryEntries = await readdir(directory, { withFileTypes: true });
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

  const files = new Map();

  for (const entry of directoryEntries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }

    const filePath = path.join(directory, entry.name);
    const source = await readFile(filePath, "utf8");
    const parsed = matter(source);

    if (parsed.data.generated !== true) {
      throw new Error(
        `Unsafe managed directory state: "${filePath}" does not contain "generated: true".`,
      );
    }

    files.set(entry.name, source);
  }

  return files;
}

function formatIssuePrefix(issueNumber) {
  return issueNumber ? `Issue #${issueNumber}` : "Sync";
}

function printWarnings(warnings) {
  if (!warnings.length) {
    return;
  }

  console.warn("");
  console.warn("Warnings:");

  for (const warning of warnings) {
    console.warn(`- ${formatIssuePrefix(warning.issueNumber)}: ${warning.message}`);
  }
}

function printErrors(errors) {
  if (!errors.length) {
    return;
  }

  console.error("Sync validation failed:");

  for (const error of errors) {
    console.error(`- ${formatIssuePrefix(error.issueNumber)}: ${error.message}`);
  }
}

function printSummary({
  repoFullName,
  fetchedIssuesCount,
  candidateIssuesCount,
  plannedFilesCount,
  diff,
  dryRun,
  warningsCount,
}) {
  console.log("");
  console.log(dryRun ? "Dry-run summary" : "Sync summary");
  console.log(`Repository: ${repoFullName}`);
  console.log(`Fetched issues: ${fetchedIssuesCount}`);
  console.log(`Eligible issues: ${candidateIssuesCount}`);
  console.log(`Generated files: ${plannedFilesCount}`);
  console.log(`Create: ${diff.create.length}`);
  console.log(`Update: ${diff.update.length}`);
  console.log(`Delete: ${diff.remove.length}`);
  console.log(`Unchanged: ${diff.unchanged}`);
  console.log(`Warnings: ${warningsCount}`);
}

async function writeManagedFiles(directory, diff, nextFiles) {
  await mkdir(directory, { recursive: true });

  for (const fileName of diff.remove) {
    await rm(path.join(directory, fileName), { force: true });
  }

  for (const fileName of [...diff.create, ...diff.update]) {
    await writeFile(path.join(directory, fileName), nextFiles.get(fileName), "utf8");
  }
}

async function main() {
  const { dryRun } = parseArguments(process.argv.slice(2));
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN is required to run sync:issues.");
  }

  const repoFullName = process.env.GITHUB_ISSUES_REPO ?? DEFAULT_GITHUB_ISSUES_REPO;
  const importedAt = new Date().toISOString();
  const [projectSlugs, manualBugSlugs, existingManagedFiles, fetchedIssues] = await Promise.all([
    loadSlugsFromMarkdownDirectory(PROJECTS_DIRECTORY),
    loadSlugsFromMarkdownDirectory(MANUAL_BUGS_DIRECTORY),
    readManagedMarkdownFiles(SYNCED_BUGS_DIRECTORY),
    fetchAllIssues(repoFullName, token),
  ]);
  const candidateIssues = fetchedIssues.filter((issue) => shouldSyncIssue(issue));
  const warnings = [];
  const hardErrors = [];
  const nextFiles = new Map();

  for (const issue of candidateIssues) {
    try {
      const { bug, body, warnings: issueWarnings } = buildSyncedBugFromIssue({
        issue,
        knownProjectSlugs: projectSlugs,
        importedAt,
        repoFullName,
      });

      if (manualBugSlugs.has(bug.slug)) {
        throw new SyncValidationError(
          `Collision: slug "${bug.slug}" already exists in ${path.join(MANUAL_BUGS_DIRECTORY, `${bug.slug}.md`)}.`,
          { issueNumber: issue.number },
        );
      }

      const fileName = `${bug.slug}.md`;

      if (nextFiles.has(fileName)) {
        throw new SyncValidationError(
          `Duplicate generated slug "${bug.slug}" within synced issues.`,
          { issueNumber: issue.number },
        );
      }

      nextFiles.set(fileName, stringifyBugMarkdown({ bug, body }));
      warnings.push(...issueWarnings);
    } catch (error) {
      if (error instanceof SyncValidationError) {
        hardErrors.push(error);
        continue;
      }

      throw error;
    }
  }

  if (hardErrors.length) {
    printErrors(hardErrors);
    process.exitCode = 1;
    return;
  }

  const diff = planManagedMarkdownChanges(existingManagedFiles, nextFiles);

  if (!dryRun) {
    await writeManagedFiles(SYNCED_BUGS_DIRECTORY, diff, nextFiles);
  }

  printWarnings(warnings);
  printSummary({
    repoFullName,
    fetchedIssuesCount: fetchedIssues.length,
    candidateIssuesCount: candidateIssues.length,
    plannedFilesCount: nextFiles.size,
    diff,
    dryRun,
    warningsCount: warnings.length,
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
