import type { BugStatus } from "@/types/filters";
import { getBugStatusLabel } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const statusClasses: Record<BugStatus, string> = {
  open: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
  in_progress: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  closed: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  reopened: "bg-fuchsia-100 text-fuchsia-700 ring-1 ring-fuchsia-200",
};

type BugStatusBadgeProps = {
  status: BugStatus;
};

export function BugStatusBadge({ status }: BugStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("border-transparent", statusClasses[status])}
    >
      {getBugStatusLabel(status)}
    </Badge>
  );
}
