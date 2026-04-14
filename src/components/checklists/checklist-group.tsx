import type { Checklist } from "@/types/content";
import { ChecklistCard } from "@/components/checklists/checklist-card";

type ChecklistGroupProps = {
  title: string;
  items: Checklist[];
  projectTitles: Record<string, string>;
};

export function ChecklistGroup({
  title,
  items,
  projectTitles,
}: ChecklistGroupProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">
          {items.length} чек-листов в категории
        </p>
      </div>
      <div className="grid gap-4">
        {items.map((item) => (
          <ChecklistCard
            key={item.slug}
            checklist={item}
            projectTitle={projectTitles[item.project] ?? item.project}
          />
        ))}
      </div>
    </section>
  );
}
