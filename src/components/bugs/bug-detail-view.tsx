import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FolderKanban, Video } from "lucide-react";

import type { Bug } from "@/types/content";
import { BugMetaBadges } from "@/components/bugs/bug-meta-badges";
import { MarkdownContent } from "@/components/shared/markdown-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BugDetailViewProps = {
  bug: Bug;
  projectTitle: string;
};

export function BugDetailView({ bug, projectTitle }: BugDetailViewProps) {
  return (
    <div className="space-y-8 py-12 md:space-y-10 md:py-14">
      <section className="rounded-[2rem] border border-border/80 bg-card/95 px-6 py-8 shadow-sm md:px-8 md:py-10">
        <div className="space-y-5">
          <Button asChild variant="ghost" size="sm">
            <Link href="/bugs">
              <ArrowLeft className="size-4" />
              Назад к баг-репортам
            </Link>
          </Button>
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-muted/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <FolderKanban className="size-3.5" />
              <span>{projectTitle}</span>
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance md:text-5xl">
              {bug.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              {bug.summary}
            </p>
          </div>
          <BugMetaBadges
            severity={bug.severity}
            status={bug.status}
            priority={bug.priority}
            publishedAt={bug.publishedAt}
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,24rem)]">
        <div className="space-y-6">
          <Card className="rounded-3xl border-border/80 bg-card/90">
            <CardHeader>
              <CardTitle>Описание дефекта</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Summary
                </h2>
                <p className="text-sm leading-7 text-foreground/85">{bug.summary}</p>
              </div>
              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Steps To Reproduce
                </h2>
                <ol className="space-y-2 pl-5 text-sm leading-7 text-foreground/85">
                  {bug.steps.map((step) => (
                    <li key={`${bug.slug}-${step}`} className="list-decimal">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl bg-muted/60 p-4">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Expected Result
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-foreground/85">{bug.expected}</p>
                </div>
                <div className="rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-100">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-700">
                    Actual Result
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-foreground/85">{bug.actual}</p>
                </div>
              </div>
              {bug.body ? (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Контекст
                  </h2>
                  <MarkdownContent content={bug.body} />
                </div>
              ) : null}
            </CardContent>
          </Card>

          {bug.screenshots.length ? (
            <Card className="rounded-3xl border-border/80 bg-card/90">
              <CardHeader>
                <CardTitle>Attachments / Screenshots</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {bug.screenshots.map((screenshot, index) => (
                  <figure
                    key={`${bug.slug}-screenshot-${screenshot}`}
                    className="overflow-hidden rounded-2xl border border-border/80 bg-muted/40"
                  >
                    <Image
                      src={screenshot}
                      alt={`${bug.title} screenshot ${index + 1}`}
                      width={1280}
                      height={720}
                      className="h-full w-full object-cover"
                    />
                  </figure>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <aside className="space-y-6">
          <Card className="rounded-3xl border-border/80 bg-card/90">
            <CardHeader>
              <CardTitle>Карточка бага</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-foreground/85">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Project
                </p>
                <Link
                  href={`/projects/${bug.project}`}
                  className="mt-2 inline-flex text-sm font-medium text-primary hover:underline"
                >
                  {projectTitle}
                </Link>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Environment
                </p>
                <p className="mt-2 leading-6">{bug.environment}</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Slug
                </p>
                <p className="mt-2 leading-6">{bug.slug}</p>
              </div>
            </CardContent>
          </Card>

          {bug.relatedLinks?.length ? (
            <Card className="rounded-3xl border-border/80 bg-card/90">
              <CardHeader>
                <CardTitle>Related Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {bug.relatedLinks.map((link) => (
                  <Link
                    key={`${bug.slug}-${link.url}`}
                    href={link.url}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/80 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/60"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="size-4 text-muted-foreground" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {bug.videoUrl ? (
            <Card className="rounded-3xl border-border/80 bg-card/90">
              <CardHeader>
                <CardTitle>Видео-разбор</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  Если нужен короткий walkthrough по дефекту, ссылка уже подготовлена.
                </p>
                <Button asChild variant="outline" className="w-full justify-between">
                  <Link href={bug.videoUrl} target="_blank" rel="noreferrer">
                    Открыть видео
                    <Video className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
