import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  helper?: string;
  className?: string;
  valueClassName?: string;
};

export function StatCard({
  label,
  value,
  helper,
  className,
  valueClassName,
}: StatCardProps) {
  return (
    <Card className={cn("rounded-3xl", className)}>
      <CardContent className="space-y-2 p-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        <p className={cn("text-3xl font-semibold tracking-tight", valueClassName)}>{value}</p>
        {helper ? <p className="text-sm text-muted-foreground">{helper}</p> : null}
      </CardContent>
    </Card>
  );
}
