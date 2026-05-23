import { ReactNode } from "react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import RevealText from "@/components/RevealText";

export function LegalPage({
  eyebrow,
  title,
  lastUpdated,
  children,
}: {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <section className="relative bg-background border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 gold-line-texture pointer-events-none" />
          <div className="relative mx-auto max-w-3xl px-6 pt-20 pb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-brand-gold/40" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                {eyebrow}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
              <RevealText text={title} />
            </h1>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-foreground/40">
              Last updated: {lastUpdated}
            </p>
          </div>
        </section>

        <section className="bg-card">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 py-14 md:py-20 space-y-5 text-foreground/65 leading-[1.8] legal-body">
            {children}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export function LegalH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-2xl md:text-3xl text-foreground mt-10 mb-3 leading-tight">
      {children}
    </h2>
  );
}

export function LegalH3({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-display text-lg md:text-xl text-foreground mt-6 mb-2">
      {children}
    </h3>
  );
}
