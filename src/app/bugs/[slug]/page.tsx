import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BugDetailView } from "@/components/bugs/bug-detail-view";
import { getBugBySlug, getBugSlugs, getProjectBySlug } from "@/lib/content/queries";
import { buildPageMetadata } from "@/lib/seo";

type BugDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getBugSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BugDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bug = await getBugBySlug(slug);

  if (!bug) {
    return buildPageMetadata({
      title: "Баг не найден",
      description: "Запрашиваемый баг-репорт не существует.",
    });
  }

  return buildPageMetadata({
    title: bug.title,
    description: bug.summary,
  });
}

export default async function BugDetailsPage({ params }: BugDetailsPageProps) {
  const { slug } = await params;
  const bug = await getBugBySlug(slug);

  if (!bug) {
    notFound();
  }

  const project = await getProjectBySlug(bug.project);

  if (!project) {
    notFound();
  }

  return <BugDetailView bug={bug} projectTitle={project.title} />;
}
