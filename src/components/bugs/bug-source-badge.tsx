import type { BugSource } from "@/types/content";
import { getBugSourceLabel } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const sourceClasses: Record<BugSource, string> = {
  local: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  github: "bg-zinc-900 text-white ring-1 ring-zinc-900/10",
};

type BugSourceBadgeProps = {
  source: BugSource;
};

export function BugSourceBadge({ source }: BugSourceBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("border-transparent", sourceClasses[source])}
    >
      {getBugSourceLabel(source)}
    </Badge>
  );
}
