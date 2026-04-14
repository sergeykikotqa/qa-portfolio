import { MarkdownContent } from "@/components/shared/markdown-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TestCaseCardProps = {
  title: string;
  caseId: string;
  category: string;
  projectTitle: string;
  summary?: string;
  steps: string[];
  expectedResult: string;
  body?: string;
};

export function TestCaseCard({
  title,
  caseId,
  category,
  projectTitle,
  summary,
  steps,
  expectedResult,
  body,
}: TestCaseCardProps) {
  return (
    <Card className="rounded-3xl border-border/80 bg-card/90">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span>{caseId}</span>
          <span>•</span>
          <span>{projectTitle}</span>
          <span>•</span>
          <span>{category}</span>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        {summary ? <p className="text-sm leading-6 text-muted-foreground">{summary}</p> : null}
      </CardHeader>
      <CardContent className="space-y-6">
        {body ? (
          <div className="rounded-2xl bg-muted/40 p-4">
            <MarkdownContent content={body} />
          </div>
        ) : null}
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Steps
          </h3>
          <ol className="space-y-2 pl-5 text-sm leading-6 text-foreground/85">
            {steps.map((step) => (
              <li key={`${caseId}-${step}`} className="list-decimal">
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl bg-muted/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Expected Result
          </h3>
          <p className="mt-3 text-sm leading-6 text-foreground/85">{expectedResult}</p>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
