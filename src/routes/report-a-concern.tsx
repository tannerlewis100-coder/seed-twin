import { createFileRoute } from "@tanstack/react-router";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import RevealText from "@/components/RevealText";
import RevealOnScroll from "@/components/RevealOnScroll";
import { Mail, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/report-a-concern")({
  component: ReportAConcernPage,
  head: () => ({
    meta: [
      { title: "Report a Concern — Complaints & Abuse | Clarum" },
      {
        name: "description",
        content:
          "Report a concern about a product, listing, or content on Clarum. We acknowledge all reports and resolve illegal-content complaints within 7 business days.",
      },
      { property: "og:title", content: "Report a Concern | Clarum" },
      {
        property: "og:description",
        content:
          "How to report misuse, abuse, or illegal content. Email clarumpeptides@gmail.com.",
      },
      { property: "og:url", content: "https://clarumpeptides.com/report-a-concern" },
    ],
    links: [{ rel: "canonical", href: "https://clarumpeptides.com/report-a-concern" }],
  }),
});

function ReportAConcernPage() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <section className="relative bg-background border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 gold-line-texture pointer-events-none" />
          <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-brand-gold/[0.04] blur-[120px]" />
          <div className="relative mx-auto max-w-3xl px-6 pt-20 pb-16 text-center">
            <div className="inline-flex items-center gap-2 mb-4 justify-center">
              <span className="h-px w-8 bg-brand-gold/40" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                Support
              </span>
              <span className="h-px w-8 bg-brand-gold/40" />
            </div>
            <h1 className="font-display text-[40px] sm:text-5xl md:text-6xl text-foreground leading-tight">
              <RevealText text="Report a Concern" />
            </h1>
            <RevealOnScroll as="p" delay={200} className="mt-5 text-foreground/55">
              Complaints &amp; abuse. We read every message.
            </RevealOnScroll>
          </div>
        </section>

        <section className="bg-card">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 py-14 md:py-20 space-y-8">
            <div className="rounded-2xl border border-white/10 bg-background/60 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/[0.06] text-brand-gold">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="space-y-4 text-foreground/75 leading-relaxed">
                  <p>
                    We take complaints and reports of misuse or illegal content seriously.
                    To report a concern about a product, listing, or content on this site,
                    email{" "}
                    <a
                      href="mailto:clarumpeptides@gmail.com"
                      className="text-brand-gold hover:underline"
                    >
                      clarumpeptides@gmail.com
                    </a>
                    . We acknowledge all reports and resolve illegal-content complaints
                    within 7 business days.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a
                href="mailto:clarumpeptides@gmail.com"
                className="inline-flex items-center gap-2 rounded-full border border-brand-gold/50 text-brand-gold px-8 py-4 text-sm font-medium hover:bg-brand-gold/10 transition-colors"
              >
                <Mail className="h-4 w-4" /> Email clarumpeptides@gmail.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
