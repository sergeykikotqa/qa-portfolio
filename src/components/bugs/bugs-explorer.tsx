"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from "next/navigation";

import type { Bug, Project } from "@/types/content";
import type {
  BugFilterState,
  BugSortOption,
  BugStatus,
  BugSeverity,
} from "@/types/filters";
import {
  BUG_SEVERITIES,
  BUG_SORT_OPTIONS,
  BUG_STATUSES,
} from "@/types/filters";
import {
  getBugPriorityWeight,
  getBugSeverityLabel,
  getBugSeverityWeight,
  getBugStatusLabel,
} from "@/lib/formatters";
import { BugCard } from "@/components/bugs/bug-card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ExplorerSelectValue<TValue extends string> = TValue | "all";

type ExplorerState = {
  query: string;
  severity: ExplorerSelectValue<BugSeverity>;
  status: ExplorerSelectValue<BugStatus>;
  project: ExplorerSelectValue<string>;
  sort: BugSortOption;
};

type BugsExplorerProps = {
  bugs: Bug[];
  projects: Project[];
  initialFilters?: BugFilterState;
};

const defaultState: ExplorerState = {
  query: "",
  severity: "all",
  status: "all",
  project: "all",
  sort: "newest",
};

const sortLabels: Record<BugSortOption, string> = {
  newest: "Сначала новые",
  oldest: "Сначала старые",
  severity: "По severity",
  priority: "По priority",
};

function buildState(
  filters: BugFilterState | Record<string, string | undefined>,
  projects: Project[],
): ExplorerState {
  const projectSlugs = new Set(projects.map((project) => project.slug));
  const severity =
    filters.severity && BUG_SEVERITIES.includes(filters.severity as BugSeverity)
      ? (filters.severity as BugSeverity)
      : undefined;
  const status =
    filters.status && BUG_STATUSES.includes(filters.status as BugStatus)
      ? (filters.status as BugStatus)
      : undefined;
  const sort =
    filters.sort && BUG_SORT_OPTIONS.includes(filters.sort as BugSortOption)
      ? (filters.sort as BugSortOption)
      : undefined;
  const project =
    filters.project && projectSlugs.has(filters.project)
      ? filters.project
      : undefined;

  return {
    query: filters.query?.trim() ?? "",
    severity: severity ?? "all",
    status: status ?? "all",
    project: project ?? "all",
    sort: sort ?? "newest",
  };
}

function parseSearchParams(
  searchParams: ReadonlyURLSearchParams,
): Record<string, string | undefined> {
  return {
    query: searchParams.get("q") ?? undefined,
    severity: searchParams.get("severity") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    project: searchParams.get("project") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
  };
}

function serializeState(state: ExplorerState) {
  const params = new URLSearchParams();

  if (state.query.trim()) {
    params.set("q", state.query.trim());
  }

  if (state.severity !== "all") {
    params.set("severity", state.severity);
  }

  if (state.status !== "all") {
    params.set("status", state.status);
  }

  if (state.project !== "all") {
    params.set("project", state.project);
  }

  if (state.sort !== "newest") {
    params.set("sort", state.sort);
  }

  return params.toString();
}

function compareBugs(left: Bug, right: Bug, sort: BugSortOption) {
  switch (sort) {
    case "oldest":
      return (
        left.publishedAt.localeCompare(right.publishedAt) ||
        getBugSeverityWeight(left.severity) - getBugSeverityWeight(right.severity) ||
        getBugPriorityWeight(left.priority) - getBugPriorityWeight(right.priority)
      );
    case "severity":
      return (
        getBugSeverityWeight(left.severity) - getBugSeverityWeight(right.severity) ||
        right.publishedAt.localeCompare(left.publishedAt) ||
        getBugPriorityWeight(left.priority) - getBugPriorityWeight(right.priority)
      );
    case "priority":
      return (
        getBugPriorityWeight(left.priority) - getBugPriorityWeight(right.priority) ||
        getBugSeverityWeight(left.severity) - getBugSeverityWeight(right.severity) ||
        right.publishedAt.localeCompare(left.publishedAt)
      );
    case "newest":
    default:
      return (
        right.publishedAt.localeCompare(left.publishedAt) ||
        getBugSeverityWeight(left.severity) - getBugSeverityWeight(right.severity) ||
        getBugPriorityWeight(left.priority) - getBugPriorityWeight(right.priority)
      );
  }
}

export function BugsExplorer({
  bugs,
  projects,
  initialFilters,
}: BugsExplorerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialState = buildState(initialFilters ?? {}, projects);
  const [query, setQuery] = useState(initialState.query);
  const [severity, setSeverity] = useState<ExplorerSelectValue<BugSeverity>>(
    initialState.severity,
  );
  const [status, setStatus] = useState<ExplorerSelectValue<BugStatus>>(initialState.status);
  const [project, setProject] = useState<ExplorerSelectValue<string>>(initialState.project);
  const [sort, setSort] = useState<BugSortOption>(initialState.sort);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const syncedState = buildState(parseSearchParams(searchParams), projects);
  const currentQueryString = serializeState(syncedState);
  const desiredQueryString = serializeState({
    query,
    severity,
    status,
    project,
    sort,
  });
  const projectTitleBySlug = Object.fromEntries(
    projects.map((entry) => [entry.slug, entry.title]),
  ) as Record<string, string>;

  useEffect(() => {
    if (desiredQueryString === currentQueryString) {
      return;
    }

    const nextHref = desiredQueryString ? `${pathname}?${desiredQueryString}` : pathname;

    startTransition(() => {
      router.replace(nextHref, { scroll: false });
    });
  }, [currentQueryString, desiredQueryString, pathname, router]);

  const filteredBugs = bugs
    .filter((bug) => {
      if (severity !== "all" && bug.severity !== severity) {
        return false;
      }

      if (status !== "all" && bug.status !== status) {
        return false;
      }

      if (project !== "all" && bug.project !== project) {
        return false;
      }

      if (!deferredQuery) {
        return true;
      }

      const projectTitle = projectTitleBySlug[bug.project] ?? bug.project;
      const searchableText = [
        bug.title,
        bug.summary,
        bug.body ?? "",
        bug.project,
        projectTitle,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(deferredQuery);
    })
    .sort((left, right) => compareBugs(left, right, sort));

  const hasActiveFilters =
    query.trim().length > 0 ||
    severity !== "all" ||
    status !== "all" ||
    project !== "all" ||
    sort !== "newest";

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Всего багов" value={String(bugs.length)} helper="Все записи из markdown" />
        <StatCard
          label="Critical"
          value={String(bugs.filter((bug) => bug.severity === "critical").length)}
          helper="Критичные дефекты"
          valueClassName="text-red-700"
        />
        <StatCard
          label="High"
          value={String(bugs.filter((bug) => bug.severity === "high").length)}
          helper="Высокая критичность"
          valueClassName="text-orange-700"
        />
        <StatCard
          label="Medium"
          value={String(bugs.filter((bug) => bug.severity === "medium").length)}
          helper="Средняя критичность"
          valueClassName="text-amber-700"
        />
      </section>

      <section className="rounded-[2rem] border border-border/80 bg-card/95 p-5 shadow-sm md:p-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_repeat(4,minmax(0,1fr))]">
          <div className="space-y-2">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <Search className="size-3.5" />
              Поиск
            </p>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Название, summary или проект"
              className="h-10 bg-background"
            />
          </div>

          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Severity
            </p>
            <Select
              value={severity}
              onValueChange={(value) =>
                setSeverity(value as ExplorerSelectValue<BugSeverity>)
              }
            >
              <SelectTrigger className="h-10 w-full bg-background">
                <SelectValue placeholder="Все severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все severity</SelectItem>
                {BUG_SEVERITIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {getBugSeverityLabel(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Status
            </p>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as ExplorerSelectValue<BugStatus>)}
            >
              <SelectTrigger className="h-10 w-full bg-background">
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                {BUG_STATUSES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {getBugStatusLabel(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Project
            </p>
            <Select value={project} onValueChange={setProject}>
              <SelectTrigger className="h-10 w-full bg-background">
                <SelectValue placeholder="Все проекты" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все проекты</SelectItem>
                {projects.map((entry) => (
                  <SelectItem key={entry.slug} value={entry.slug}>
                    {entry.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <SlidersHorizontal className="size-3.5" />
              Sort
            </p>
            <Select value={sort} onValueChange={(value) => setSort(value as BugSortOption)}>
              <SelectTrigger className="h-10 w-full bg-background">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                {BUG_SORT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {sortLabels[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-5">
          <p className="text-sm text-muted-foreground">
            Показано <span className="font-semibold text-foreground">{filteredBugs.length}</span> из{" "}
            <span className="font-semibold text-foreground">{bugs.length}</span> багов.
          </p>
          {hasActiveFilters ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery(defaultState.query);
                setSeverity(defaultState.severity);
                setStatus(defaultState.status);
                setProject(defaultState.project);
                setSort(defaultState.sort);
              }}
            >
              Сбросить фильтры
            </Button>
          ) : null}
        </div>
      </section>

      {filteredBugs.length ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {filteredBugs.map((bug) => (
            <BugCard
              key={bug.slug}
              bug={bug}
              projectTitle={projectTitleBySlug[bug.project] ?? bug.project}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title="По этим фильтрам ничего не найдено"
          description="Попробуйте убрать часть ограничений или очистить строку поиска — все параметры синхронизированы с URL, поэтому текущую выдачу можно удобно расшарить."
          action={
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setQuery(defaultState.query);
                  setSeverity(defaultState.severity);
                  setStatus(defaultState.status);
                  setProject(defaultState.project);
                  setSort(defaultState.sort);
                }}
              >
                Показать все баги
              </Button>
              <Button asChild variant="ghost">
                <Link href="/">Вернуться на главную</Link>
              </Button>
            </div>
          }
        />
      )}
    </div>
  );
}
