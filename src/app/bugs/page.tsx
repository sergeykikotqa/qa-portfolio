import type { Metadata } from "next";
import { Suspense } from "react";

import { BugsExplorer } from "@/components/bugs/bugs-explorer";
import { SectionHeading } from "@/components/shared/section-heading";
import { buildPageMetadata } from "@/lib/seo";
import { getAllBugs, getAllProjects } from "@/lib/content/queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Баг-репорты",
  description:
    "Список баг-репортов с поиском, фильтрацией по severity и status, а также сортировкой по важности.",
});

export default async function BugsPage() {
  const [bugs, projects] = await Promise.all([getAllBugs(), getAllProjects()]);

  return (
    <div className="space-y-10 py-12 md:py-14">
      <SectionHeading
        eyebrow="Bug Reports"
        title="Каталог дефектов, оформленный как рабочая QA-база."
        description="Страница читает локальный markdown-контент на сервере, а поиск, фильтры и сортировка работают на клиенте с синхронизацией query params."
      />
      <Suspense fallback={null}>
        <BugsExplorer bugs={bugs} projects={projects} />
      </Suspense>
    </div>
  );
}
