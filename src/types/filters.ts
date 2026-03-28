export const BUG_SEVERITIES = ["critical", "high", "medium", "low"] as const;
export type BugSeverity = (typeof BUG_SEVERITIES)[number];

export const BUG_PRIORITIES = ["high", "medium", "low"] as const;
export type BugPriority = (typeof BUG_PRIORITIES)[number];

export const BUG_STATUSES = [
  "open",
  "in_progress",
  "closed",
  "reopened",
] as const;
export type BugStatus = (typeof BUG_STATUSES)[number];

export const UPDATE_TYPES = [
  "project",
  "bug",
  "test-case",
  "checklist",
  "general",
] as const;
export type UpdateType = (typeof UPDATE_TYPES)[number];

export const BUG_SORT_OPTIONS = [
  "newest",
  "oldest",
  "severity",
  "priority",
] as const;
export type BugSortOption = (typeof BUG_SORT_OPTIONS)[number];

export interface BugFilterState {
  query?: string;
  severity?: BugSeverity;
  status?: BugStatus;
  project?: string;
  sort?: BugSortOption;
}
