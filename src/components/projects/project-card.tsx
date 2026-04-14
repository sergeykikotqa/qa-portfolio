import Link from "next/link";
import { ArrowUpRight, Bug, CheckSquare, ListChecks } from "lucide-react";

import type { Project } from "@/types/content";
import { formatContentDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type ProjectCardProps = {
  project: Project;
  counts: {
    bugs: number;
    testCases: number;
    checklists: number;
  };
};

export function ProjectCard({ project, counts }: ProjectCardProps) {
  const displayBugCount = counts.bugs;

  return (
    <Card className="rounded-3xl border-border/80 bg-card/90">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-full">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl">{project.title}</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">{project.shortDescription}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-foreground/80">{project.scope}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-muted/70 p-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bug className="size-4" />
              Баги
            </div>
            <p className="mt-2 text-lg font-semibold">{displayBugCount}</p>
          </div>
          <div className="rounded-2xl bg-muted/70 p-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ListChecks className="size-4" />
              Тест-кейсы
            </div>
            <p className="mt-2 text-lg font-semibold">{counts.testCases}</p>
          </div>
          <div className="rounded-2xl bg-muted/70 p-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckSquare className="size-4" />
              Чек-листы
            </div>
            <p className="mt-2 text-lg font-semibold">{counts.checklists}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-4 rounded-b-3xl">
        <p className="text-sm text-muted-foreground">
          Опубликован {formatContentDate(project.publishedAt)}
        </p>
        <Button asChild variant="ghost">
          <Link href={`/projects/${project.slug}`}>
            Открыть проект
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
