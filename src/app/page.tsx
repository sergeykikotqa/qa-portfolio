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
  const telegramContact = settings.footer.contacts.find(
    (contact) =>
      contact.label.toLowerCase().includes("telegram") ||
      contact.href.toLowerCase().includes("t.me"),
  );
  const fallbackContact = settings.footer.contacts.find((contact) =>
    contact.href.toLowerCase().startsWith("mailto:"),
  );
  const secondaryContact = telegramContact ?? fallbackContact;
  const secondaryCtaLabel = telegramContact ? "Связаться в Telegram" : "Написать мне";
  const isExternalSecondaryContact =
    secondaryContact?.href.startsWith("http://") || secondaryContact?.href.startsWith("https://");

  return (
    <div className="space-y-16 py-12 md:space-y-20 md:py-16">
      <section className="grid gap-6 rounded-[2.25rem] border border-border/80 bg-card/95 px-6 py-8 shadow-sm md:px-8 md:py-10 xl:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <FolderKanban className="size-3.5" />
            Портфолио Junior QA
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
            {secondaryContact ? (
              <Button asChild variant="outline" size="lg">
                <Link
                  href={secondaryContact.href}
                  target={isExternalSecondaryContact ? "_blank" : undefined}
                  rel={isExternalSecondaryContact ? "noreferrer" : undefined}
                >
                  {secondaryCtaLabel}
                </Link>
              </Button>
            ) : null}
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
              Что это портфолио показывает
            </p>
            <CardTitle className="text-2xl tracking-tight">
              Показываю не только найденные баги, но и аккуратный manual QA-подход.
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-2xl bg-muted/55 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bug className="size-4" />
                Формы и валидация
              </div>
              <p className="mt-2 text-sm leading-6 text-foreground/85">
                Проверяю обязательные поля, ошибки ввода и логику отправки на реальных публичных сайтах.
              </p>
            </div>
            <div className="rounded-2xl bg-muted/55 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ListChecks className="size-4" />
                UI/UX и mobile
              </div>
              <p className="mt-2 text-sm leading-6 text-foreground/85">
                Отслеживаю проблемы интерфейса, адаптивности и поведения страниц в мобильной версии.
              </p>
            </div>
            <div className="rounded-2xl bg-muted/55 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckSquare className="size-4" />
                QA-документация
              </div>
              <p className="mt-2 text-sm leading-6 text-foreground/85">
                Оформляю баг-репорты, тест-кейсы и чек-листы так, чтобы их было удобно читать команде и работодателю.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Багов" value={String(stats.totalBugs)} helper="Все зафиксированные дефекты" />
        <StatCard
          label="Критичных багов"
          value={String(stats.criticalBugs)}
          helper="Проблемы с самым высоким риском"
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
          eyebrow="Проекты"
          title={settings.home.featuredProjectsTitle}
          description="Здесь собраны практические QA-кейсы с баг-репортами, тест-кейсами и чек-листами. Этот раздел быстрее всего показывает мой подход к ручному тестированию, приоритизации дефектов и оформлению артефактов."
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
          eyebrow="Навыки"
          title={settings.home.skillsTitle}
          description="Артефакты на сайте показывают не только результат тестирования, но и то, как я мыслю, документирую проверки и собираю рабочую QA-базу."
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

      {updates.length ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Обновления"
            title={settings.home.updatesTitle}
            description="Короткая история обновлений портфолио и новых артефактов."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {updates.slice(0, 4).map((update) => (
              <UpdateCard key={update.slug} update={update} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
