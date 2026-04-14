import Link from "next/link";
import type { Metadata } from "next";

import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatCard } from "@/components/shared/stat-card";
import { TestCaseGroup } from "@/components/test-cases/test-case-group";
import { Button } from "@/components/ui/button";
import { getAllProjects, getAllTestCases } from "@/lib/content/queries";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Тест-кейсы",
  description:
    "Тест-кейсы, которые показывают умение системно покрывать проверки и формализовать сценарии ручного тестирования.",
});

export default async function TestCasesPage() {
  const [projects, testCases] = await Promise.all([getAllProjects(), getAllTestCases()]);
  const groups = projects
    .map((project) => ({
      project,
      items: testCases.filter((testCase) => testCase.project === project.slug),
    }))
    .filter((group) => group.items.length > 0);
  const uniqueCategories = new Set(testCases.map((testCase) => testCase.category));

  return (
    <div className="space-y-10 py-12 md:py-14">
      <SectionHeading
        eyebrow="Тест-кейсы"
        title="Тест-кейсы, которые показывают системный подход к проверкам."
        description="Этот раздел доказывает, что я умею превращать идеи тестирования в понятные пошаговые сценарии с ожидаемым результатом и повторяемым покрытием."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Всего кейсов" value={String(testCases.length)} helper="Сценарии в портфолио" />
        <StatCard label="Проектов" value={String(groups.length)} helper="Проекты с формализованными проверками" />
        <StatCard
          label="Категорий"
          value={String(uniqueCategories.size)}
          helper="Ключевые зоны покрытия"
        />
      </section>

      {groups.length ? (
        <section className="space-y-8">
          {groups.map((group) => (
            <TestCaseGroup
              key={group.project.slug}
              title={group.project.title}
              description={group.project.shortDescription}
              items={group.items}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title="Тест-кейсов пока нет"
          description="После добавления первых сценариев здесь появится раздел с формализованными проверками по проектам."
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
