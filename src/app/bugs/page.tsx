import type { Metadata } from "next";
import { Suspense } from "react";

import { BugsExplorer } from "@/components/bugs/bugs-explorer";
import { SectionHeading } from "@/components/shared/section-heading";
import { buildPageMetadata } from "@/lib/seo";
import { getAllBugs, getAllProjects } from "@/lib/content/queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Баг-репорты",
  description:
    "Реальные баг-репорты, которые показывают навык анализа, воспроизведения и оформления дефектов в ручном тестировании.",
});

export default async function BugsPage() {
  const [bugs, projects] = await Promise.all([getAllBugs(), getAllProjects()]);

  return (
    <div className="space-y-10 py-12 md:py-14">
      <SectionHeading
        eyebrow="Баг-репорты"
        title="Реальные баг-репорты, которые показывают мой навык анализа и оформления дефектов."
        description="Этот раздел доказывает, что я умею находить проблему, воспроизводить её, оценивать серьёзность и описывать результат так, чтобы он был понятен команде."
      />
      <Suspense fallback={null}>
        <BugsExplorer bugs={bugs} projects={projects} />
      </Suspense>
    </div>
  );
}
