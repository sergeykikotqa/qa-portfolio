import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";

import { PageShell } from "@/components/layout/page-shell";
import { baseMetadata } from "@/lib/site-config";
import { cn } from "@/lib/utils";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={cn(manrope.variable, ibmPlexMono.variable)}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
