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
              All products provided by Clarum are exclusively designed for use in in vitro
              laboratory research by professional researchers. None of the products offered are
              meant for ingestion, clinical applications, animal applications, dietary or
              nutritional supplements, cosmeceutical uses, household use, or similar applications.
            </RevealOnScroll>
            <RevealOnScroll as="p" delay={120}>
              When purchasing products from Clarum, you declare that you are at least 18 years
              old, that you are a legitimate researcher, and that you will conduct research with
              all products purchased in accordance with all relevant laws and regulations in your
              jurisdiction.
            </RevealOnScroll>
            <RevealOnScroll as="p" delay={240}>
              None of the information provided on our website has been evaluated by the FDA, EMA,
              or any other regulatory agency. None of the products are claimed to diagnose, treat,
              cure, or prevent any disease. Clarum makes no representations concerning the
              efficacy or human application of any compounds mentioned.
            </RevealOnScroll>
            <RevealOnScroll as="p" delay={360}>
              Certificates of analysis posted in our COA library refer only to the lot number
              mentioned. Independent testing is encouraged. Clarum is not liable for any misuse
              of products not consistent with legitimate scientific research purposes.
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
