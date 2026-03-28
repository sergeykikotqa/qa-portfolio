import type { Metadata } from "next";

import { baseMetadata } from "@/lib/site-config";

type BuildPageMetadataOptions = {
  title: string;
  description: string;
};

export function buildPageMetadata({
  title,
  description,
}: BuildPageMetadataOptions): Metadata {
  return {
    ...baseMetadata,
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
    },
  };
}
