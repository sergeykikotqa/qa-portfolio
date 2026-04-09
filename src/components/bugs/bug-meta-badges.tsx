import { CalendarDays } from "lucide-react";

import type { BugPriority, BugSeverity, BugStatus } from "@/types/filters";
import { formatContentDate } from "@/lib/formatters";
import { BugPriorityBadge } from "@/components/bugs/bug-priority-badge";
import { BugSeverityBadge } from "@/components/bugs/bug-severity-badge";
import { BugStatusBadge } from "@/components/bugs/bug-status-badge";

type BugMetaBadgesProps = {
  severity: BugSeverity;
  status: BugStatus;
  priority: BugPriority;
  publishedAt: string;
  showPriority?: boolean;
};

export function BugMetaBadges({
  severity,
  status,
  priority,
  publishedAt,
  showPriority = true,
}: BugMetaBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <BugSeverityBadge severity={severity} />
      <BugStatusBadge status={status} />
      {showPriority ? <BugPriorityBadge priority={priority} /> : null}
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 ring-1 ring-slate-200">
        <CalendarDays className="size-3.5" />
        {formatContentDate(publishedAt)}
      </span>
    </div>
  );
}
