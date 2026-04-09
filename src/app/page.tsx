import Link from "next/link";
import { ArrowRight, Bug, CheckSquare, FolderKanban, ListChecks } from "lucide-react";

import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatCard } from "@/components/shared/stat-card";
import { UpdateCard } from "@/components/shared/update-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllProjects,
  getAllUpdates,
  getProjectAggregate,
  getSiteSettings,
  getSiteStats,
} from "@/lib/content/queries";
import type { ProjectAggregate } from "@/types/content";

export default async function HomePage() {
  const [settings, stats, projects, updates] = await Promise.all([
    getSiteSettings(),
    getSiteStats(),
    getAllProjects(),
    getAllUpdates(),
  ]);
  const featuredProjects = projects.filter((project) => project.featured);
  const featuredAggregates = (
    await Promise.all(featuredProjects.map((project) => getProjectAggregate(project.slug)))
  ).filter((entry): entry is ProjectAggregate => entry !== null);

  return (
    <div className="space-y-16 py-12 md:space-y-20 md:py-16">
      <section className="grid gap-6 rounded-[2.25rem] border border-border/80 bg-card/95 px-6 py-8 shadow-sm md:px-8 md:py-10 xl:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <FolderKanban className="size-3.5" />
            QA portfolio with GitHub sync
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
              {settings.hero.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              {settings.hero.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href={settings.hero.ctaHref}>
                {settings.hero.ctaLabel}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/test-cases">Открыть тест-кейсы</Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.footer.stack.map((item) => (
              <Badge key={item} variant="outline" className="rounded-full bg-background/80">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        <Card className="rounded-[1.75rem] border-border/80 bg-background/85">
          <CardHeader className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Focus
            </p>
            <CardTitle className="text-2xl tracking-tight">
              Практика ручного тестирования, оформленная как рабочее портфолио.
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-2xl bg-muted/55 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bug className="size-4" />
                Баг-репорты
              </div>
              <p className="mt-2 text-sm leading-6 text-foreground/85">
                Полные карточки дефектов с severity, priority, steps to reproduce и expected/actual result.
              </p>
            </div>
            <div className="rounded-2xl bg-muted/55 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ListChecks className="size-4" />
                Тест-кейсы
              </div>
              <p className="mt-2 text-sm leading-6 text-foreground/85">
                Позитивные и негативные сценарии, сгруппированные по проектам и категориям.
              </p>
            </div>
            <div className="rounded-2xl bg-muted/55 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckSquare className="size-4" />
                Чек-листы
              </div>
              <p className="mt-2 text-sm leading-6 text-foreground/85">
                Компактные smoke и exploratory проверки с локальным прогрессом в браузере.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Багов" value={String(stats.totalBugs)} helper="Все зафиксированные дефекты" />
        <StatCard
          label="Critical"
          value={String(stats.criticalBugs)}
          helper="Самые рискованные проблемы"
          valueClassName="text-red-700"
        />
        <StatCard
          label="Тест-кейсов"
          value={String(stats.totalTestCases)}
          helper="Формализованные сценарии"
        />
        <StatCard
          label="Пунктов чек-листов"
          value={String(stats.totalChecklistItems)}
          helper="Быстрые регрессионные проверки"
        />
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Practice"
          title={settings.home.featuredProjectsTitle}
          description="Карточки ниже собираются из локального контента и синхронизированных GitHub-артефактов, поэтому сразу показывают полный объём QA-практики по каждому проекту."
        />
        {featuredAggregates.length ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {featuredAggregates.map((aggregate) => (
              <ProjectCard
                key={aggregate.project.slug}
                project={aggregate.project}
                counts={aggregate.counts}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Пока нет проектов для витрины"
            description="Секция автоматически заполнится, когда в коллекции projects появится хотя бы один опубликованный проект с флагом featured."
          />
        )}
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Skills"
          title={settings.home.skillsTitle}
          description="Без перегруженного UI: только ключевые компетенции и понятные артефакты, которые можно быстро просмотреть."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {settings.home.skills.map((skill) => (
            <Card key={skill.title} className="rounded-3xl border-border/80 bg-card/90">
              <CardHeader className="space-y-3">
                <CardTitle className="text-xl tracking-tight">{skill.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{skill.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Updates"
          title={settings.home.updatesTitle}
          description="Последние изменения приходят из markdown-коллекции updates, поэтому блок легко поддерживать через контентный workflow."
        />
        {updates.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {updates.slice(0, 4).map((update) => (
              <UpdateCard key={update.slug} update={update} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Обновлений пока нет"
            description="Блок оживёт после первой публикации записи в коллекции updates. До этого страница остаётся стабильной и без пустых карточек."
          />
        )}
      </section>
    </div>
  );
}
