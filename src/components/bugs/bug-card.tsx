import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Bug } from "@/types/content";
import { BugMetaBadges } from "@/components/bugs/bug-meta-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type BugCardProps = {
  bug: Bug;
  projectTitle: string;
};

export function BugCard({ bug, projectTitle }: BugCardProps) {
  return (
    <Card className="rounded-3xl border-border/80 bg-card/90">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span>{projectTitle}</span>
          <span>•</span>
          <span>{bug.slug}</span>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl tracking-tight">{bug.title}</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">{bug.summary}</p>
        </div>
      </CardHeader>
      <CardContent>
        <BugMetaBadges
          severity={bug.severity}
          status={bug.status}
          priority={bug.priority}
          publishedAt={bug.publishedAt}
        />
      </CardContent>
      <CardFooter className="justify-between gap-4 rounded-b-3xl">
        <p className="line-clamp-1 text-sm text-muted-foreground">{bug.environment}</p>
        <Button asChild variant="ghost">
          <Link href={`/bugs/${bug.slug}`}>
            Подробнее
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
