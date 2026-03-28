import type { UpdateItem } from "@/types/content";
import { formatContentDate } from "@/lib/formatters";
import { MarkdownContent } from "@/components/shared/markdown-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateTypeBadge } from "@/components/shared/update-type-badge";

type UpdateCardProps = {
  update: UpdateItem;
};

export function UpdateCard({ update }: UpdateCardProps) {
  return (
    <Card className="rounded-3xl border-border/80 bg-card/90">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <UpdateTypeBadge type={update.type} />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {formatContentDate(update.date)}
          </span>
        </div>
        <CardTitle className="text-xl">{update.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{update.description}</p>
        {update.body ? <MarkdownContent content={update.body} className="space-y-3" /> : null}
      </CardContent>
    </Card>
  );
}
