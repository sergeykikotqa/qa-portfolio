import Link from "next/link";

import type { FooterContent } from "@/types/content";

type SiteFooterProps = {
  siteName: string;
  footer: FooterContent;
};

export function SiteFooter({ siteName, footer }: SiteFooterProps) {
  return (
    <footer className="border-t border-border/70 bg-background/85">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div className="space-y-3">
          <p className="text-lg font-semibold tracking-tight">{siteName}</p>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            {footer.description}
          </p>
        </div>
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Фокус
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {footer.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Контакты
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {footer.contacts.map((contact) => (
              <li key={contact.label}>
                <Link href={contact.href} className="transition-colors hover:text-foreground">
                  {contact.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
