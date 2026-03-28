import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type CompactLinkCardProps = {
  title: string;
  description?: string;
  meta?: string;
  href: string;
};

export function CompactLinkCard({
  title,
  description,
  meta,
  href,
}: CompactLinkCardProps) {
  return (
    <Card className="rounded-2xl border-border/80 bg-card/80">
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="space-y-1">
          <Link
            href={href}
            className="text-sm font-semibold tracking-tight transition-colors hover:text-primary"
          >
            {title}
          </Link>
          {meta ? <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{meta}</p> : null}
          {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : null}
        </div>
        <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      </CardContent>
    </Card>
  );
}
