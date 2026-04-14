import type { Checklist, ChecklistItemStatus } from "@/types/content";
import { formatContentDate, getChecklistStatusLabel } from "@/lib/formatters";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type ChecklistCardProps = {
  checklist: Checklist;
  projectTitle: string;
};

const checklistStatusStyles: Record<ChecklistItemStatus, string> = {
  passed:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-200",
  failed:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200",
  not_tested:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-200",
};

function countItemsByStatus(checklist: Checklist, status: ChecklistItemStatus) {
  return checklist.items.filter((item) => item.status === status).length;
}

export function ChecklistCard({
  checklist,
  projectTitle,
}: ChecklistCardProps) {
  const passedCount = countItemsByStatus(checklist, "passed");
  const failedCount = countItemsByStatus(checklist, "failed");
  const notTestedCount = countItemsByStatus(checklist, "not_tested");

  return (
    <Card className="rounded-3xl border-border/80 bg-card/90">
      <Accordion type="single" collapsible>
        <AccordionItem value={checklist.slug} className="border-b-0">
          <AccordionTrigger className="px-4 py-4 hover:no-underline">
            <div className="w-full space-y-4 pr-4 text-left">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span>{projectTitle}</span>
                <span>•</span>
                <span>{formatContentDate(checklist.publishedAt)}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold tracking-tight">{checklist.title}</h3>
                {checklist.description ? (
                  <p className="text-sm leading-6 text-muted-foreground">
                    {checklist.description}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={checklistStatusStyles.passed}>
                  {getChecklistStatusLabel("passed")}: {passedCount}
                </Badge>
                <Badge variant="outline" className={checklistStatusStyles.failed}>
                  {getChecklistStatusLabel("failed")}: {failedCount}
                </Badge>
                <Badge variant="outline" className={checklistStatusStyles.not_tested}>
                  {getChecklistStatusLabel("not_tested")}: {notTestedCount}
                </Badge>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3 rounded-2xl bg-muted/45 p-4">
              {checklist.items.map((item, index) => (
                <div
                  key={`${checklist.slug}-${index}-${item.text}`}
                  className="rounded-2xl border border-border/70 bg-background/80 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="max-w-3xl text-sm leading-6 text-foreground/90">{item.text}</p>
                    <Badge
                      variant="outline"
                      className={checklistStatusStyles[item.status]}
                    >
                      {getChecklistStatusLabel(item.status)}
                    </Badge>
                  </div>
                  {item.evidence?.length || item.note ? (
                    <div className="mt-3 space-y-1 text-xs leading-5 text-muted-foreground">
                      {item.evidence?.length ? (
                        <p>Основание: {item.evidence.join(", ")}</p>
                      ) : null}
                      {item.note ? <p>{item.note}</p> : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
