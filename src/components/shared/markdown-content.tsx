import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

type MarkdownContentProps = {
  content?: string;
  className?: string;
};

export function MarkdownContent({
  content,
  className,
}: MarkdownContentProps) {
  if (!content) {
    return null;
  }

  return (
    <article
      className={cn(
        "max-w-none space-y-4 text-sm leading-7 text-foreground/85 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_li]:leading-7 [&_ol]:space-y-2 [&_ol]:pl-5 [&_p]:text-foreground/80 [&_strong]:font-semibold [&_ul]:space-y-2 [&_ul]:pl-5",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
