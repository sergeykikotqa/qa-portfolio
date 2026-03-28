import Link from "next/link";
import type { Metadata } from "next";

import { ChecklistGroup } from "@/components/checklists/checklist-group";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { getAllChecklists, getAllProjects } from "@/lib/content/queries";
import { buildPageMetadata } from "@/lib/seo";
import { groupBy } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: "Чек-листы",
  description:
    "Список QA-чек-листов с accordion layout и локальным прогрессом, который сохраняется в браузере.",
});

export default async function ChecklistsPage() {
  const [projects, checklists] = await Promise.all([getAllProjects(), getAllChecklists()]);
  const groupedChecklists = Object.entries(groupBy(checklists, (item) => item.category)).sort(
    ([left], [right]) => left.localeCompare(right, "ru"),
  );
  const projectTitles = Object.fromEntries(
    projects.map((project) => [project.slug, project.title]),
  ) as Record<string, string>;
  const totalItems = checklists.reduce((sum, checklist) => sum + checklist.items.length, 0);

  return (
    <div className="space-y-10 py-12 md:py-14">
      <SectionHeading
        eyebrow="Checklists"
        title="Компактные smoke и exploratory-проверки с локальным прогрессом."
        description="Каждый чек-лист хранится в markdown, а пользовательские отметки остаются только в браузере через localStorage."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Чек-листов" value={String(checklists.length)} helper="Всего в портфолио" />
        <StatCard label="Категорий" value={String(groupedChecklists.length)} helper="Группировка по разделам" />
        <StatCard label="Пунктов" value={String(totalItems)} helper="Суммарное покрытие проверок" />
      </section>

      {groupedChecklists.length ? (
        <section className="space-y-8">
          {groupedChecklists.map(([category, items]) => (
            <ChecklistGroup
              key={category}
              title={category}
              items={items}
              projectTitles={projectTitles}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title="Чек-листов пока нет"
          description="Когда в коллекции checklists появятся записи, эта страница автоматически покажет их по категориям и сохранит локальный прогресс в браузере."
          action={
            <Button asChild variant="ghost">
              <Link href="/">Вернуться на главную</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
