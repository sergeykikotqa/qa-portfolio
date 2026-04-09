import matter from "gray-matter";

export const DEFAULT_GITHUB_ISSUES_REPO = "sergeykikotqa/qa-practice";
export const REQUIRED_PLAIN_LABELS = ["bug", "portfolio"];
export const REQUIRED_SECTIONS = [
  "summary",
  "steps",
  "expected",
  "actual",
  "environment",
];

const SECTION_ALIASES = new Map([
  ["summary", "summary"],
  ["description", "summary"],
  ["bug title", "summary"],
  ["title", "summary"],
  ["steps to reproduce", "steps"],
  ["steps", "steps"],
  ["expected result", "expected"],
  ["expected", "expected"],
  ["actual result", "actual"],
  ["actual", "actual"],
  ["environment", "environment"],
  ["env", "environment"],
  ["screenshots", "screenshots"],
  ["attachments", "screenshots"],
  ["additional context", "additionalContext"],
  ["notes", "additionalContext"],
]);

const STRUCTURAL_LABEL_FAMILIES = new Set([
  "project",
  "severity",
  "priority",
  "status",
]);
const SEVERITIES = new Set(["critical", "high", "medium", "low"]);
const PRIORITIES = new Set(["high", "medium", "low"]);
const STATUSES = new Set(["in_progress", "reopened"]);
const URL_TRAILING_PUNCTUATION = /[),.;\]]+$/u;

export class SyncValidationError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "SyncValidationError";
    this.issueNumber = options.issueNumber;
  }
}

function createIssueError(issueNumber, message) {
  return new SyncValidationError(message, { issueNumber });
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/gu, " ").trim();
}

function normalizeSectionToken(value) {
  return normalizeWhitespace(
    value
      .toLowerCase()
      .replace(/^[^a-z0-9]+/u, "")
      .replace(/#+$/u, "")
      .replace(/:+$/u, ""),
  );
}

function resolveSectionKey(value) {
  return SECTION_ALIASES.get(normalizeSectionToken(value)) ?? null;
}

function stripHtmlComments(value) {
  return value.replace(/<!--[\s\S]*?-->/gu, "");
}

function appendSectionLine(sectionMap, sectionKey, line) {
  if (!sectionMap.has(sectionKey)) {
    sectionMap.set(sectionKey, []);
  }

  sectionMap.get(sectionKey).push(line);
}

function finalizeSections(sectionMap) {
  return Object.fromEntries(
    [...sectionMap.entries()].map(([key, lines]) => [key, lines.join("\n").trim()]),
  );
}

function collectStructuredSections(body = "") {
  const lines = stripHtmlComments(body).split(/\r?\n/u);
  const sections = new Map();
  const preambleLines = [];
  let currentSectionKey = null;

  for (const rawLine of lines) {
    const headingMatch = rawLine.match(/^\s{0,3}#{1,6}\s*(.+?)\s*#*\s*$/u);

    if (headingMatch) {
      const sectionKey = resolveSectionKey(headingMatch[1]);

      if (sectionKey) {
        currentSectionKey = sectionKey;

        if (!sections.has(sectionKey)) {
          sections.set(sectionKey, []);
        }

        continue;
      }
    }

    const labelMatch = rawLine.match(/^\s*([A-Za-z][A-Za-z ]+?)\s*:\s*(.*)\s*$/u);

    if (labelMatch) {
      const sectionKey = resolveSectionKey(labelMatch[1]);

      if (sectionKey) {
        currentSectionKey = sectionKey;

        if (!sections.has(sectionKey)) {
          sections.set(sectionKey, []);
        }

        if (labelMatch[2]) {
          appendSectionLine(sections, sectionKey, labelMatch[2]);
        }

        continue;
      }
    }

    if (currentSectionKey) {
      appendSectionLine(sections, currentSectionKey, rawLine);
      continue;
    }

    if (rawLine.trim()) {
      preambleLines.push(rawLine);
    }
  }

  if (preambleLines.length && !sections.has("summary")) {
    sections.set("summary", preambleLines);
  }

  return finalizeSections(sections);
}

export function parseIssueSections(body = "") {
  return collectStructuredSections(body);
}

export function parseSteps(sectionValue) {
  return sectionValue
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*+]\s+/u, "").replace(/^\d+[.)]\s+/u, "").trim())
    .filter(Boolean);
}

function normalizeRawLabelName(label) {
  return normalizeWhitespace(label).toLowerCase();
}

function splitScopedLabels(labelNames, family) {
  return labelNames
    .map((label) => ({
      raw: label,
      normalized: normalizeRawLabelName(label),
    }))
    .filter((label) => label.normalized.startsWith(`${family}:`))
    .map((label) => ({
      raw: label.raw,
      value: label.normalized.slice(family.length + 1),
    }));
}

function assertSingleScopedValue(labelEntries, family, issueNumber) {
  if (labelEntries.length > 1) {
    throw createIssueError(
      issueNumber,
      `Found more than one ${family}:* label: ${labelEntries
        .map((entry) => entry.raw)
        .join(", ")}.`,
    );
  }

  return labelEntries[0]?.value;
}

function normalizeLabelCollection(labelNames) {
  return labelNames.map((label) => normalizeWhitespace(label)).filter(Boolean);
}

function buildNormalizedDisplayLabels(labelNames) {
  const result = [];
  const seen = new Set();

  for (const label of labelNames) {
    const normalized = normalizeRawLabelName(label);

    if (REQUIRED_PLAIN_LABELS.includes(normalized)) {
      continue;
    }

    const scopedMatch = normalized.match(/^([a-z_]+):(.*)$/u);

    if (scopedMatch) {
      const [, family, value] = scopedMatch;

      if (STRUCTURAL_LABEL_FAMILIES.has(family)) {
        continue;
      }

      if (value && !seen.has(value)) {
        seen.add(value);
        result.push(value);
      }

      continue;
    }

    if (!seen.has(label)) {
      seen.add(label);
      result.push(label);
    }
  }

  return result;
}

export function parseLabelMetadata(labelNames, state, issueNumber) {
  const labelsRaw = normalizeLabelCollection(labelNames);
  const normalizedLabels = labelsRaw.map((label) => normalizeRawLabelName(label));

  for (const requiredLabel of REQUIRED_PLAIN_LABELS) {
    if (!normalizedLabels.includes(requiredLabel)) {
      throw createIssueError(issueNumber, `Missing required label "${requiredLabel}".`);
    }
  }

  const projectLabel = assertSingleScopedValue(
    splitScopedLabels(labelsRaw, "project"),
    "project",
    issueNumber,
  );
  const severityLabel = assertSingleScopedValue(
    splitScopedLabels(labelsRaw, "severity"),
    "severity",
    issueNumber,
  );
  const priorityLabel = assertSingleScopedValue(
    splitScopedLabels(labelsRaw, "priority"),
    "priority",
    issueNumber,
  );
  const statusLabel = assertSingleScopedValue(
    splitScopedLabels(labelsRaw, "status"),
    "status",
    issueNumber,
  );

  if (!projectLabel) {
    throw createIssueError(issueNumber, 'Missing required label "project:<slug>".');
  }

  if (!severityLabel) {
    throw createIssueError(
      issueNumber,
      'Missing required label "severity:<critical|high|medium|low>".',
    );
  }

  if (!SEVERITIES.has(severityLabel)) {
    throw createIssueError(issueNumber, `Unsupported severity label value "${severityLabel}".`);
  }

  if (priorityLabel && !PRIORITIES.has(priorityLabel)) {
    throw createIssueError(issueNumber, `Unsupported priority label value "${priorityLabel}".`);
  }

  if (statusLabel && !STATUSES.has(statusLabel)) {
    throw createIssueError(issueNumber, `Unsupported status label value "${statusLabel}".`);
  }

  return {
    project: projectLabel,
    severity: severityLabel,
    priority: priorityLabel ?? "medium",
    status:
      statusLabel ?? (normalizeWhitespace(state).toLowerCase() === "closed" ? "closed" : "open"),
    labelsRaw,
    labelsNormalized: buildNormalizedDisplayLabels(labelsRaw),
    warnings: priorityLabel
      ? []
      : [{ issueNumber, message: 'Missing optional label "priority:<high|medium|low>"; defaulting to medium.' }],
  };
}

function isAbsoluteHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function collectUrl(urls, seen, warnings, issueNumber, rawValue) {
  const candidate = rawValue.trim().replace(URL_TRAILING_PUNCTUATION, "");

  if (!candidate) {
    return;
  }

  if (!isAbsoluteHttpUrl(candidate)) {
    warnings.push({
      issueNumber,
      message: `Skipping invalid screenshot URL "${rawValue}".`,
    });
    return;
  }

  if (!seen.has(candidate)) {
    seen.add(candidate);
    urls.push(candidate);
  }
}

export function extractScreenshotUrls(sectionValue = "", issueNumber) {
  const urls = [];
  const warnings = [];
  const seen = new Set();
  const markdownImagePattern = /!\[[^\]]*\]\(([^)\s]+)\)/gu;
  const rawUrlPattern = /\b[a-z][a-z0-9+.-]*:\/\/\S+/giu;

  for (const match of sectionValue.matchAll(markdownImagePattern)) {
    collectUrl(urls, seen, warnings, issueNumber, match[1]);
  }

  for (const match of sectionValue.matchAll(rawUrlPattern)) {
    collectUrl(urls, seen, warnings, issueNumber, match[0]);
  }

  return {
    urls,
    warnings,
  };
}

function toPublishedDate(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function buildIssueBody(additionalContext = "") {
  return additionalContext.trim();
}

export function shouldSyncIssue(issue) {
  if (issue.pull_request) {
    return false;
  }

  const labelNames = (issue.labels ?? [])
    .map((label) => (typeof label === "string" ? label : label?.name))
    .filter(Boolean);
  const normalized = labelNames.map((label) => normalizeRawLabelName(label));

  return REQUIRED_PLAIN_LABELS.every((label) => normalized.includes(label));
}

export function buildSyncedBugFromIssue({
  issue,
  knownProjectSlugs,
  importedAt,
  repoFullName,
}) {
  const issueNumber = issue.number;
  const labelNames = (issue.labels ?? [])
    .map((label) => (typeof label === "string" ? label : label?.name))
    .filter(Boolean);
  const labelMetadata = parseLabelMetadata(labelNames, issue.state, issueNumber);

  if (!knownProjectSlugs.has(labelMetadata.project)) {
    throw createIssueError(
      issueNumber,
      `Unknown project slug "${labelMetadata.project}" from label "project:${labelMetadata.project}".`,
    );
  }

  const sections = parseIssueSections(issue.body ?? "");
  const missingSections = REQUIRED_SECTIONS.filter((sectionKey) => !sections[sectionKey]?.trim());

  if (missingSections.length) {
    throw createIssueError(
      issueNumber,
      `Missing required section(s): ${missingSections.join(", ")}.`,
    );
  }

  const steps = parseSteps(sections.steps);

  if (!steps.length) {
    throw createIssueError(issueNumber, 'Section "Steps to Reproduce" is empty.');
  }

  const screenshotExtraction = extractScreenshotUrls(sections.screenshots ?? "", issueNumber);
  const warnings = [...labelMetadata.warnings, ...screenshotExtraction.warnings];

  if (!sections.screenshots?.trim()) {
    warnings.push({
      issueNumber,
      message: 'Missing optional section "Screenshots".',
    });
  }

  if (!sections.additionalContext?.trim()) {
    warnings.push({
      issueNumber,
      message: 'Missing optional section "Additional Context".',
    });
  }

  const slug = `${labelMetadata.project}-issue-${issueNumber}`;

  return {
    bug: {
      title: issue.title.trim(),
      slug,
      project: labelMetadata.project,
      severity: labelMetadata.severity,
      priority: labelMetadata.priority,
      status: labelMetadata.status,
      summary: sections.summary.trim(),
      environment: sections.environment.trim(),
      steps,
      expected: sections.expected.trim(),
      actual: sections.actual.trim(),
      screenshots: screenshotExtraction.urls,
      publishedAt: toPublishedDate(issue.created_at),
      updatedAt: new Date(issue.updated_at).toISOString(),
      importedAt,
      source: "github",
      generated: true,
      sourceRepo: repoFullName,
      sourceIssueNumber: issueNumber,
      sourceIssueUrl: issue.html_url,
      labelsRaw: labelMetadata.labelsRaw,
      labelsNormalized: labelMetadata.labelsNormalized,
    },
    body: buildIssueBody(sections.additionalContext),
    warnings,
  };
}

export function stringifyBugMarkdown({ bug, body }) {
  return matter.stringify(body ?? "", bug).trimEnd() + "\n";
}

export function planManagedMarkdownChanges(existingFiles, nextFiles) {
  const create = [];
  const update = [];
  const remove = [];
  let unchanged = 0;

  for (const [fileName, content] of nextFiles.entries()) {
    if (!existingFiles.has(fileName)) {
      create.push(fileName);
      continue;
    }

    if (existingFiles.get(fileName) === content) {
      unchanged += 1;
      continue;
    }

    update.push(fileName);
  }

  for (const fileName of existingFiles.keys()) {
    if (!nextFiles.has(fileName)) {
      remove.push(fileName);
    }
  }

  return {
    create,
    update,
    remove,
    unchanged,
  };
}
