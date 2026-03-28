import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

import type {
  BugPriority,
  BugSeverity,
  BugStatus,
  UpdateType,
} from "@/types/filters";

const severityLabelMap: Record<BugSeverity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const priorityLabelMap: Record<BugPriority, string> = {
  high: "Priority: High",
  medium: "Priority: Medium",
  low: "Priority: Low",
};

const statusLabelMap: Record<BugStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  closed: "Closed",
  reopened: "Reopened",
};

const updateTypeLabelMap: Record<UpdateType, string> = {
  project: "Проект",
  bug: "Баг",
  "test-case": "Тест-кейс",
  checklist: "Чек-лист",
  general: "Обновление",
};

const severityWeightMap: Record<BugSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const priorityWeightMap: Record<BugPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function formatContentDate(value: string, style: "short" | "long" = "short") {
  return format(parseISO(value), style === "long" ? "d MMMM yyyy" : "dd.MM.yyyy", {
    locale: ru,
  });
}

export function getBugSeverityLabel(value: BugSeverity) {
  return severityLabelMap[value];
}

export function getBugPriorityLabel(value: BugPriority) {
  return priorityLabelMap[value];
}

export function getBugStatusLabel(value: BugStatus) {
  return statusLabelMap[value];
}

export function getUpdateTypeLabel(value: UpdateType) {
  return updateTypeLabelMap[value];
}

export function getBugSeverityWeight(value: BugSeverity) {
  return severityWeightMap[value];
}

export function getBugPriorityWeight(value: BugPriority) {
  return priorityWeightMap[value];
}
