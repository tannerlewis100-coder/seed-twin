import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import RevealText from "@/components/RevealText";
import RevealOnScroll from "@/components/RevealOnScroll";
import { ArrowRight, Search } from "lucide-react";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: "FAQ — Research Peptides, COAs & Testing Explained | CLARUM" },
      {
        name: "description",
        content:
          "Answers to common questions about research peptides, our COA process, shipping, storage, and Research Use Only compliance.",
      },
      { property: "og:title", content: "Frequently Asked Questions | CLARUM" },
      {
        property: "og:description",
        content:
          "Answers about research peptides, our COA process, shipping, and RUO compliance.",
      },
    ],
  }),
});

type Faq = { q: string; a: string };
type Group = { id: string; label: string; items: Faq[] };

const groups: Group[] = [
  {
    id: "products",
    label: "Products & Compliance",
    items: [
      {
        q: "What are research peptides?",
        a: "Peptides used for research purposes are composed of amino acid sequences. They are not meant for use by humans or animals but rather for use in laboratory tests and research.",
      },
      {
        q: 'What does "Research Use Only" mean?',
        a: "All items offered by Clarum are meant to be used exclusively for research in the laboratory. These products are neither for human nor animal use or consumption. Purchasing them implies that you are using them only for research purposes.",
      },
    ],
  },
  {
    id: "coas",
    label: "COAs & Testing",
    items: [
      {
        q: "How do I read a Certificate of Analysis (COA)?",
        a: "A COA includes the name of the compound, batch numbers, and the results of every test in the panel. Ours show qualitative identity (UV/Vis λmax match), percent purity (NLT 98%), quantitative label-claim assay (NLT 95% of label), total heavy metals (NMT 150 ppb), and microbial & yeast/mold counts (TAMC and TYMC).",
      },
      {
        q: "What does the microbial and mold testing cover?",
        a: "Every batch is screened with TAMC (Total Aerobic Microbial Count, spec NMT 1,000 CFU) and TYMC (Total Yeast & Mold Count, spec NMT 100 CFU). Many vendors skip microbial testing entirely. We run it on every batch and publish the numbers.",
      },
      {
        q: "What makes Clarum's testing different from other vendors?",
        a: "This is where most vendors stop. Every Clarum batch runs the full panel — qualitative ID by UV/Vis λmax, percent purity by correlation coefficient (NLT 98%), a Beer-Lambert quantitative assay confirming the vial actually contains the labeled amount (NLT 95% of label), total heavy metals (NMT 150 ppb), and microbial/mold (TAMC + TYMC). All results are uploaded to the publicly accessible COA library before shipment.",
      },
      {
        q: "Can I see the COA before I purchase?",
        a: "Yes, our entire library of COA documents is accessible to you without having to log in. You have an opportunity to confirm the test results of any batch of products.",
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping & Storage",
    items: [
      {
        q: "Do you ship internationally?",
        a: "For now, Clarum only ships to addresses in the US. International shipping is under consideration and will be updated when it becomes available.",
      },
      {
        q: "How are products shipped and stored?",
        a: "The product is delivered using insulated packaging with proper temperature control measures. It is recommended that the lyophilized peptides be stored at -20°C for optimal storage.",
      },
    ],
  },
];

const totalCount = groups.reduce((n, g) => n + g.items.length, 0);

function FaqPage() {
  const [active, setActive] = useState<string>(groups[0].id);

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative bg-background border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 gold-line-texture pointer-events-none" />
          <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-brand-gold/[0.04] blur-[120px]" />
          <div className="relative mx-auto max-w-3xl px-6 pt-20 pb-16 text-center">
            <div className="inline-flex items-center gap-2 mb-4 justify-center">
              <span className="h-px w-8 bg-brand-gold/40" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                Frequently Asked
              </span>
              <span className="h-px w-8 bg-brand-gold/40" />
            </div>
            <h1 className="font-display text-[40px] sm:text-5xl md:text-6xl text-foreground leading-tight">
              <RevealText text="Questions, answered." />
            </h1>
            <RevealOnScroll as="p" delay={200} className="mt-5 text-foreground/55">
              Peptides, COAs, shipping, storage, RUO compliance. Short answers.
            </RevealOnScroll>
            <RevealOnScroll
              as="div"
              delay={350}
              className="mt-8 flex items-center justify-center gap-3 flex-wrap"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/60 px-4 py-2 text-xs text-foreground/55">
                <Search className="h-3.5 w-3.5 text-brand-gold/70" />
                Browse answers below
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-brand-gold font-semibold">
                {totalCount} questions
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Two-column */}
        <section className="bg-card">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 py-14 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              {/* Sticky category nav */}
              <aside className="lg:col-span-3">
                <div className="lg:sticky lg:top-28">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold mb-4">
                    Categories
                  </div>
                  <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
                    {groups.map((g) => (
                      <a
                        key={g.id}
                        href={`#${g.id}`}
                        onClick={() => setActive(g.id)}
                        className={`shrink-0 lg:shrink text-left text-sm rounded-lg px-3 py-2.5 border transition-colors ${
                          active === g.id
                            ? "border-brand-gold/40 bg-brand-gold/[0.06] text-foreground"
                            : "border-white/5 text-foreground/55 hover:text-foreground hover:border-white/10"
                        }`}
                      >
                        <span className="font-display">{g.label}</span>
                        <span className="ml-2 text-[10px] text-foreground/40">
                          {g.items.length}
                        </span>
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Accordion list */}
              <div className="lg:col-span-9 space-y-14">
                {groups.map((g) => {
                  let runningIndex = 0;
                  for (const prev of groups) {
                    if (prev.id === g.id) break;
                    runningIndex += prev.items.length;
                  }
                  return (
                    <div key={g.id} id={g.id} className="scroll-mt-28">
                      <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-white/10">
                        <h2 className="font-display text-2xl text-foreground">{g.label}</h2>
                        <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/40">
                          {g.items.length} {g.items.length === 1 ? "answer" : "answers"}
                        </span>
                      </div>
                      <Accordion type="single" collapsible className="space-y-3">
                        {g.items.map((f, i) => {
                          const idx = runningIndex + i + 1;
                          return (
                            <RevealOnScroll key={f.q} delay={i * 50}>
                              <AccordionItem
                                value={`${g.id}-${i}`}
                                className="bg-background border border-white/5 rounded-2xl px-5 data-[state=open]:border-brand-gold/30 transition-colors"
                              >
                                <AccordionTrigger className="font-display text-base sm:text-lg text-foreground text-left hover:no-underline py-5">
                                  <span className="flex items-baseline gap-4">
                                    <span className="font-display text-brand-gold/60 text-sm tabular-nums w-7">
                                      {String(idx).padStart(2, "0")}
                                    </span>
                                    <span>{f.q}</span>
                                  </span>
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-foreground/65 leading-relaxed pl-11">
                                  {f.a}
                                </AccordionContent>
                              </AccordionItem>
                            </RevealOnScroll>
                          );
                        })}
                      </Accordion>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Still have questions */}
        <section className="bg-background border-t border-white/5">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 py-16 md:py-20 text-center">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-3">
              Still have questions?
            </h2>
            <p className="text-foreground/55 mb-8">
              Reach out. A human reads every message.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-brand-gold/50 text-brand-gold px-8 py-4 text-sm font-medium hover:bg-brand-gold/10 transition-colors"
            >
              Contact us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
