import test from "node:test";
import assert from "node:assert/strict";

import {
  SyncValidationError,
  buildSyncedBugFromIssue,
  parseIssueSections,
  planManagedMarkdownChanges,
} from "./lib/github-issues-sync.mjs";

function createIssue(overrides = {}) {
  return {
    number: 12,
    title: "Phone field accepts letters",
    state: "open",
    html_url: "https://github.com/sergeykikotqa/qa-practice/issues/12",
    created_at: "2026-04-09T10:15:00.000Z",
    updated_at: "2026-04-09T11:20:00.000Z",
    body: `
## Summary
Phone field accepts alphabetic values.

### Steps
1. Open the form
2. Enter abcdef into Phone
3. Submit the form

Expected:
Validation should reject alphabetic values.

## Actual Result
Form accepts alphabetic values and submits successfully.

Env:
Windows 11, Chrome 135

### Attachments
![capture](https://user-images.githubusercontent.com/example-1.png)
https://example.com/second.png
ftp://invalid.example.com/not-used.png

### Notes
Observed during negative testing.
`.trim(),
    labels: [
      { name: "bug" },
      { name: "portfolio" },
      { name: "project:qamanual" },
      { name: "severity:high" },
      { name: "status:in_progress" },
      { name: "type:validation" },
      { name: "manual-qa" },
    ],
    ...overrides,
  };
}

test("parseIssueSections supports headings, aliases and inline label content", () => {
  const sections = parseIssueSections(`
<!-- ignored -->
Description:
Short summary.

### Steps to Reproduce
- Open form

Expected Result:
Should block invalid data.

Actual:
Saves invalid data.

Environment:
Chrome
`.trim());

  assert.equal(sections.summary, "Short summary.");
  assert.equal(sections.steps, "- Open form");
  assert.equal(sections.expected, "Should block invalid data.");
  assert.equal(sections.actual, "Saves invalid data.");
  assert.equal(sections.environment, "Chrome");
});

test("parseIssueSections tolerates emoji-prefixed headings", () => {
  const sections = parseIssueSections(`
### 🐞 Bug Title
Short summary.

### 🔁 Steps to Reproduce
1. Open form

### ✅ Expected Result
Expected result.

### ❌ Actual Result
Actual result.

### 🌐 Environment
Firefox
`.trim());

  assert.equal(sections.summary, "Short summary.");
  assert.equal(sections.steps, "1. Open form");
  assert.equal(sections.expected, "Expected result.");
  assert.equal(sections.actual, "Actual result.");
  assert.equal(sections.environment, "Firefox");
});

test("buildSyncedBugFromIssue maps labels, screenshots and defaults", () => {
  const result = buildSyncedBugFromIssue({
    issue: createIssue(),
    knownProjectSlugs: new Set(["qamanual"]),
    importedAt: "2026-04-09T12:00:00.000Z",
    repoFullName: "sergeykikotqa/qa-practice",
  });

  assert.equal(result.bug.slug, "qamanual-issue-12");
  assert.equal(result.bug.priority, "medium");
  assert.equal(result.bug.status, "in_progress");
  assert.equal(result.bug.source, "github");
  assert.equal(result.bug.generated, true);
  assert.deepEqual(result.bug.screenshots, [
    "https://user-images.githubusercontent.com/example-1.png",
    "https://example.com/second.png",
  ]);
  assert.deepEqual(result.bug.labelsNormalized, ["validation", "manual-qa"]);
  assert.equal(result.body, "Observed during negative testing.");
  assert.ok(
    result.warnings.some((warning) =>
      warning.message.includes('Missing optional label "priority:<high|medium|low>"'),
    ),
  );
  assert.ok(
    result.warnings.some((warning) =>
      warning.message.includes('Skipping invalid screenshot URL "ftp://invalid.example.com/not-used.png"'),
    ),
  );
});

test("buildSyncedBugFromIssue returns empty body when Additional Context is absent", () => {
  const result = buildSyncedBugFromIssue({
    issue: createIssue({
      body: `
Summary:
Short summary.

Steps:
- Step one

Expected:
Expected result.

Actual:
Actual result.

Environment:
Safari
`.trim(),
    }),
    knownProjectSlugs: new Set(["qamanual"]),
    importedAt: "2026-04-09T12:00:00.000Z",
    repoFullName: "sergeykikotqa/qa-practice",
  });

  assert.equal(result.body, "");
  assert.ok(
    result.warnings.some((warning) =>
      warning.message.includes('Missing optional section "Additional Context"'),
    ),
  );
});

test("buildSyncedBugFromIssue fails on conflicting scoped labels", () => {
  assert.throws(
    () =>
      buildSyncedBugFromIssue({
        issue: createIssue({
          labels: [
            { name: "bug" },
            { name: "portfolio" },
            { name: "project:qamanual" },
            { name: "severity:high" },
            { name: "severity:low" },
          ],
        }),
        knownProjectSlugs: new Set(["qamanual"]),
        importedAt: "2026-04-09T12:00:00.000Z",
        repoFullName: "sergeykikotqa/qa-practice",
      }),
    (error) =>
      error instanceof SyncValidationError &&
      error.message.includes("Found more than one severity:* label"),
  );
});

test("planManagedMarkdownChanges reports create, update, delete and unchanged files", () => {
  const diff = planManagedMarkdownChanges(
    new Map([
      ["existing.md", "same"],
      ["updated.md", "before"],
      ["deleted.md", "remove me"],
    ]),
    new Map([
      ["existing.md", "same"],
      ["updated.md", "after"],
      ["created.md", "new file"],
    ]),
  );

  assert.deepEqual(diff.create, ["created.md"]);
  assert.deepEqual(diff.update, ["updated.md"]);
  assert.deepEqual(diff.remove, ["deleted.md"]);
  assert.equal(diff.unchanged, 1);
});
