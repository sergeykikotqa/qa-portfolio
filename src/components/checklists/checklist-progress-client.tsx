"use client";

import { useEffect, useState } from "react";

import type { Checklist } from "@/types/content";
import { formatContentDate } from "@/lib/formatters";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

type ChecklistProgressClientProps = {
  checklist: Checklist;
  projectTitle: string;
};

const storagePrefix = "qa-portfolio:checklist-progress:";

function sanitizeIndexes(value: unknown, maxLength: number) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value.filter(
        (entry): entry is number =>
          Number.isInteger(entry) && entry >= 0 && entry < maxLength,
      ),
    ),
  ].sort((left, right) => left - right);
}

export function ChecklistProgressClient({
  checklist,
  projectTitle,
}: ChecklistProgressClientProps) {
  const storageKey = `${storagePrefix}${checklist.slug}`;
  const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const progress = checklist.items.length
    ? Math.round((checkedIndexes.length / checklist.items.length) * 100)
    : 0;

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(storageKey);

      if (!rawValue) {
        setHydrated(true);
        return;
      }

      setCheckedIndexes(sanitizeIndexes(JSON.parse(rawValue), checklist.items.length));
    } catch {
      setCheckedIndexes([]);
    } finally {
      setHydrated(true);
    }
  }, [checklist.items.length, storageKey]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(checkedIndexes));
  }, [checkedIndexes, hydrated, storageKey]);

  return (
    <Card className="rounded-3xl border-border/80 bg-card/90">
      <Accordion type="single" collapsible>
        <AccordionItem value={checklist.slug} className="border-b-0">
          <AccordionTrigger className="px-4 py-4 hover:no-underline">
            <div className="w-full space-y-4 pr-4">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span>{projectTitle}</span>
                <span>•</span>
                <span>{formatContentDate(checklist.publishedAt)}</span>
              </div>
              <div className="space-y-2 text-left">
                <h3 className="text-xl font-semibold tracking-tight">{checklist.title}</h3>
                {checklist.description ? (
                  <p className="text-sm leading-6 text-muted-foreground">
                    {checklist.description}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Прогресс</span>
                  <span>
                    {checkedIndexes.length}/{checklist.items.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-3 rounded-2xl bg-muted/45 p-4">
              {!hydrated ? (
                <p className="text-sm text-muted-foreground">
                  Восстанавливаю локальный прогресс из браузера…
                </p>
              ) : null}
              {checklist.items.map((item, index) => {
                const isChecked = checkedIndexes.includes(index);

                return (
                  <label
                    key={`${checklist.slug}-${index}-${item}`}
                    className="flex cursor-pointer items-start gap-3 rounded-2xl border border-transparent px-1 py-1 transition-colors hover:border-border/80"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        setCheckedIndexes((current) => {
                          if (checked === true) {
                            return sanitizeIndexes([...current, index], checklist.items.length);
                          }

                          return current.filter((entry) => entry !== index);
                        });
                      }}
                    />
                    <span className="text-sm leading-6 text-foreground/85">{item}</span>
                  </label>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
