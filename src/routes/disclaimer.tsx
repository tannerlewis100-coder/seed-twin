import { createFileRoute } from "@tanstack/react-router";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import RevealText from "@/components/RevealText";
import RevealOnScroll from "@/components/RevealOnScroll";

export const Route = createFileRoute("/disclaimer")({
  component: DisclaimerPage,
  head: () => ({
    meta: [
      { title: "Research Use Only Disclaimer | CLARUM" },
      {
        name: "description",
        content:
          "All Clarum products are intended strictly for in vitro laboratory research. Not for human or veterinary use, clinical application, or food.",
      },
      { property: "og:title", content: "Research Use Only Disclaimer | CLARUM" },
      {
        property: "og:description",
        content: "Read the full Research Use Only terms governing all Clarum products.",
      },
    ],
  }),
});

function DisclaimerPage() {
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
                Disclaimer
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
              <RevealText text="For in vitro laboratory research use only." />
            </h1>
          </div>
        </section>

        <section className="bg-card">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 py-14 md:py-20 space-y-6 text-foreground/65 leading-[1.8]">
            <RevealOnScroll as="p">
              All products sold by Clarum are intended strictly for in vitro laboratory research
              by qualified professionals. Products are{" "}
              <strong className="text-foreground">not</strong> intended for human consumption,
              clinical use, veterinary use, food additives, cosmetics, or household purposes.
            </RevealOnScroll>
            <RevealOnScroll as="p" delay={120}>
              By purchasing from Clarum, you affirm that you are at least 18 years of age, that
              you are a qualified researcher or affiliated with a research institution, and that
              all products will be used in compliance with applicable laws and ethical research
              standards in your jurisdiction.
            </RevealOnScroll>
            <RevealOnScroll as="p" delay={240}>
              Statements made on this website have not been evaluated by the FDA, EMA, or any
              other regulatory body. No product is intended to diagnose, treat, cure, or prevent
              any disease. Clarum makes no claims regarding the therapeutic or human-use efficacy
              of any compound listed.
            </RevealOnScroll>
            <RevealOnScroll as="p" delay={360}>
              Certificates of Analysis published in our COA Library reflect testing performed on
              the specific batch indicated. Independent verification is encouraged. Clarum
              disclaims liability for any misuse of products outside the scope of permitted
              research applications.
            </RevealOnScroll>
            <p className="text-xs text-foreground/45 pt-6 border-t border-white/5">
              Questions about compliance or research applications? Contact us.
              We're glad to help.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
