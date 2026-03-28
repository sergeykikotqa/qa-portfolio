import type { BugSeverity } from "@/types/filters";
import { getBugSeverityLabel } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const severityClasses: Record<BugSeverity, string> = {
  critical: "bg-red-100 text-red-700 ring-1 ring-red-200",
  high: "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
  medium: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  low: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};

type BugSeverityBadgeProps = {
  severity: BugSeverity;
};

export function BugSeverityBadge({ severity }: BugSeverityBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("border-transparent", severityClasses[severity])}
    >
      {getBugSeverityLabel(severity)}
    </Badge>
  );
}
