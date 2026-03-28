import { CompactLinkCard } from "@/components/shared/compact-link-card";

type RelatedPreviewItem = {
  title: string;
  description?: string;
  meta?: string;
  href: string;
};

type RelatedPreviewListProps = {
  title: string;
  items: RelatedPreviewItem[];
  emptyText: string;
};

export function RelatedPreviewList({
  title,
  items,
  emptyText,
}: RelatedPreviewListProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {items.length ? (
        <div className="grid gap-3">
          {items.map((item) => (
            <CompactLinkCard
              key={`${title}-${item.href}-${item.title}`}
              title={item.title}
              description={item.description}
              meta={item.meta}
              href={item.href}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      )}
    </section>
  );
}
