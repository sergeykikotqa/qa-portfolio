import type { BugPriority } from "@/types/filters";
import { getBugPriorityLabel } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const priorityClasses: Record<BugPriority, string> = {
  high: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
  medium: "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
  low: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

type BugPriorityBadgeProps = {
  priority: BugPriority;
};

export function BugPriorityBadge({ priority }: BugPriorityBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("border-transparent", priorityClasses[priority])}
    >
      {getBugPriorityLabel(priority)}
    </Badge>
  );
}
