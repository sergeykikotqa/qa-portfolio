import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Video } from "lucide-react";

import { RelatedPreviewList } from "@/components/projects/related-preview-list";
import { MarkdownContent } from "@/components/shared/markdown-content";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatContentDate, getBugSeverityLabel, getBugStatusLabel } from "@/lib/formatters";
import { getProjectAggregate, getProjectSlugs } from "@/lib/content/queries";
import { buildPageMetadata } from "@/lib/seo";

type ProjectDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const aggregate = await getProjectAggregate(slug);

  if (!aggregate) {
    return buildPageMetadata({
      title: "Проект не найден",
      description: "Запрашиваемый проект не найден в локальном контенте.",
    });
  }

  return buildPageMetadata({
    title: aggregate.project.title,
    description: aggregate.project.shortDescription,
  });
}

export default async function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  const { slug } = await params;
  const aggregate = await getProjectAggregate(slug);

  if (!aggregate) {
    notFound();
  }

  const { project, bugs, testCases, checklists, counts } = aggregate;
  const projectBugHighlights = project.bugHighlights ?? [];
  const displayBugCount = projectBugHighlights.length || counts.bugs;
  const bugPreviewTitle = projectBugHighlights.length
    ? "Ключевые системные дефекты"
    : "Связанные баги";
  const bugPreviewEmptyText = projectBugHighlights.length
    ? "Для этого проекта пока не оформлены витринные системные дефекты."
    : "Для этого проекта пока нет связанных баг-репортов.";
  const bugPreviewItems = projectBugHighlights.length
    ? projectBugHighlights.map((highlight) => ({
        title: highlight.title,
        description: highlight.summary,
        meta: [
          getBugSeverityLabel(highlight.severity),
          highlight.category ?? "Validation",
        ].join(" • "),
      }))
    : bugs.slice(0, 4).map((bug) => ({
        title: bug.title,
        description: bug.summary,
        meta: `${getBugSeverityLabel(bug.severity)} • ${getBugStatusLabel(bug.status)}`,
        href: `/bugs/${bug.slug}`,
      }));

  return (
    <div className="space-y-10 py-12 md:py-14">
      <section className="rounded-[2rem] border border-border/80 bg-card/95 px-6 py-8 shadow-sm md:px-8 md:py-10">
        <div className="space-y-5">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Назад на главную
            </Link>
          </Button>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full bg-background/80">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              {project.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              {project.description}
            </p>
            <div className="rounded-2xl bg-muted/60 p-4">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Testing Scope
              </p>
              <p className="mt-3 text-sm leading-7 text-foreground/85">{project.scope}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Багов"
          value={String(displayBugCount)}
          helper={
            projectBugHighlights.length
              ? "Ключевые системные дефекты для витрины"
              : "Связанные баг-репорты"
          }
        />
        <StatCard label="Тест-кейсов" value={String(counts.testCases)} helper="Формальные сценарии" />
        <StatCard label="Чек-листов" value={String(counts.checklists)} helper="Быстрые проверки" />
        <StatCard
          label="Пунктов"
          value={String(counts.checklistItems)}
          helper={`Опубликован ${formatContentDate(project.publishedAt)}`}
        />
      </section>

      {project.body ? (
        <Card className="rounded-3xl border-border/80 bg-card/90">
          <CardContent className="p-6">
            <MarkdownContent content={project.body} />
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-8 xl:grid-cols-3">
        <RelatedPreviewList
          title={bugPreviewTitle}
          emptyText={bugPreviewEmptyText}
          items={bugPreviewItems}
        />
        <RelatedPreviewList
          title="Связанные тест-кейсы"
          emptyText="Для этого проекта пока нет опубликованных тест-кейсов."
          items={testCases.slice(0, 4).map((testCase) => ({
            title: testCase.title,
            description: testCase.summary ?? testCase.expectedResult,
            meta: `${testCase.caseId} • ${testCase.category}`,
            href: "/test-cases",
          }))}
        />
        <RelatedPreviewList
          title="Связанные чек-листы"
          emptyText="Для этого проекта пока нет чек-листов."
          items={checklists.slice(0, 4).map((checklist) => ({
            title: checklist.title,
            description: checklist.description,
            meta: `${checklist.category} • ${checklist.items.length} пунктов`,
            href: "/checklists",
          }))}
        />
      </section>

      {project.videos?.length ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Видео-разборы</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {project.videos.map((video) => (
              <Card key={`${project.slug}-${video.url}`} className="rounded-3xl border-border/80 bg-card/90">
                <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold tracking-tight">{video.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Дополнительный walkthrough по наблюдениям и артефактам проекта.
                    </p>
                  </div>
                  <Button asChild variant="outline" className="justify-between">
                    <Link href={video.url} target="_blank" rel="noreferrer">
                      Открыть видео
                      <Video className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
