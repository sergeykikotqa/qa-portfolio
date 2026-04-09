import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";

import type { Bug } from "@/types/content";
import { BugMetaBadges } from "@/components/bugs/bug-meta-badges";
import { BugSourceBadge } from "@/components/bugs/bug-source-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
          <BugSourceBadge source={bug.source} />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl tracking-tight">{bug.title}</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">{bug.summary}</p>
        </div>
        {bug.labelsNormalized.length ? (
          <div className="flex flex-wrap gap-2">
            {bug.labelsNormalized.map((label) => (
              <Badge
                key={`${bug.slug}-${label}`}
                variant="outline"
                className="rounded-full bg-background/80 text-[11px] text-muted-foreground"
              >
                {label}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <BugMetaBadges
          severity={bug.severity}
          status={bug.status}
          priority={bug.priority}
          publishedAt={bug.publishedAt}
          showPriority={false}
        />
      </CardContent>
      <CardFooter className="flex-wrap justify-between gap-4 rounded-b-3xl">
        <p className="line-clamp-1 text-sm text-muted-foreground">{bug.environment}</p>
        <div className="flex flex-wrap items-center gap-2">
          {bug.sourceIssueUrl ? (
            <Button asChild variant="outline" size="sm">
              <Link href={bug.sourceIssueUrl} target="_blank" rel="noreferrer">
                GitHub Issue
                <ExternalLink className="size-4" />
              </Link>
            </Button>
          ) : null}
          <Button asChild variant="ghost" size="sm">
            <Link href={`/bugs/${bug.slug}`}>
              Подробнее
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
