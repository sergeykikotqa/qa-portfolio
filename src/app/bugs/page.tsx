import type { Metadata } from "next";

import { BugsExplorer } from "@/components/bugs/bugs-explorer";
import { SectionHeading } from "@/components/shared/section-heading";
import { buildPageMetadata } from "@/lib/seo";
import { getAllBugs, getAllProjects } from "@/lib/content/queries";
import type { BugFilterState } from "@/types/filters";

type BugsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export const metadata: Metadata = buildPageMetadata({
  title: "Баг-репорты",
  description:
    "Список баг-репортов с поиском, фильтрацией по severity и status, а также сортировкой по важности.",
});

export default async function BugsPage({ searchParams }: BugsPageProps) {
  const [{ q, severity, status, project, sort }, bugs, projects] = await Promise.all([
    searchParams,
    getAllBugs(),
    getAllProjects(),
  ]);
  const initialFilters: BugFilterState = {
    query: readSingleValue(q),
    severity: readSingleValue(severity) as BugFilterState["severity"],
    status: readSingleValue(status) as BugFilterState["status"],
    project: readSingleValue(project),
    sort: readSingleValue(sort) as BugFilterState["sort"],
  };

  return (
    <div className="space-y-10 py-12 md:py-14">
      <SectionHeading
        eyebrow="Bug Reports"
        title="Каталог дефектов, оформленный как рабочая QA-база."
        description="Страница читает локальный markdown-контент на сервере, а поиск, фильтры и сортировка работают на клиенте с синхронизацией query params."
      />
      <BugsExplorer bugs={bugs} projects={projects} initialFilters={initialFilters} />
    </div>
  );
}
