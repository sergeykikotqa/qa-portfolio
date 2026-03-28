import type { UpdateType } from "@/types/filters";
import { getUpdateTypeLabel } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const updateTypeClasses: Record<UpdateType, string> = {
  project: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  bug: "bg-red-100 text-red-700 ring-1 ring-red-200",
  "test-case": "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  checklist: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
  general: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};

type UpdateTypeBadgeProps = {
  type: UpdateType;
};

export function UpdateTypeBadge({ type }: UpdateTypeBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("border-transparent", updateTypeClasses[type])}
    >
      {getUpdateTypeLabel(type)}
    </Badge>
  );
}
