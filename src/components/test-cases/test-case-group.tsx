import type { TestCase } from "@/types/content";
import { TestCaseCard } from "@/components/test-cases/test-case-card";

type TestCaseGroupProps = {
  title: string;
  description: string;
  items: TestCase[];
};

export function TestCaseGroup({ title, description, items }: TestCaseGroupProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4">
        {items.map((item) => (
          <TestCaseCard
            key={item.slug}
            title={item.title}
            caseId={item.caseId}
            category={item.category}
            projectTitle={title}
            summary={item.summary}
            steps={item.steps}
            expectedResult={item.expectedResult}
            body={item.body}
          />
        ))}
      </div>
    </section>
  );
}
