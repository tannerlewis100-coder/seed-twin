import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: "FAQ — Research Peptides, COAs & Testing Explained | CLARUM" },
      {
        name: "description",
        content:
          "Answers to common questions about research peptides, our 5-panel COA process, shipping, storage, and Research Use Only compliance.",
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

const faqs = [
  {
    q: "What are research peptides?",
    a: "Research peptides are short chains of amino acids used in scientific and laboratory research. They are synthesized for in vitro study and are not intended for human or veterinary use.",
  },
  {
    q: 'What does "Research Use Only" mean?',
    a: "All products sold by Clarum are intended strictly for in vitro laboratory research. They are not for human consumption, clinical application, or veterinary use. By purchasing, you confirm the products will be used solely for legitimate research purposes.",
  },
  {
    q: "How do I read a Certificate of Analysis (COA)?",
    a: "A COA includes the compound name, batch number, and results from each test panel. Look for HPLC purity (≥99%), mass spectrometry confirmation, heavy metals (ND = non-detect), microbial counts, and endotoxin levels. All values should be within specification for a PASS result.",
  },
  {
    q: "What is endotoxin testing and why does it matter?",
    a: "Endotoxin testing (LAL method) detects bacterial endotoxins, the toxic byproducts of gram-negative bacteria. Most peptide vendors skip this test entirely. Clarum runs it on every batch because endotoxin contamination can compromise research results.",
  },
  {
    q: "What makes Clarum's testing different from other vendors?",
    a: "Most vendors stop at HPLC. We send every batch to Eurofins in Lancaster, PA (ISO/IEC 17025 accredited) for the full 5-panel: HPLC purity, mass spec identity (LC-MS), heavy metals (ICP-MS), microbial and yeast counts, and endotoxin (LAL). The full report goes into the public COA library before the batch ships.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently, Clarum ships within the United States. International shipping is being evaluated and will be announced when available.",
  },
  {
    q: "How are products shipped and stored?",
    a: "Products are shipped in insulated packaging with appropriate temperature controls. Upon receipt, we recommend storing lyophilized peptides in a freezer (-20°C) for maximum stability.",
  },
  {
    q: "Can I see the COA before I purchase?",
    a: "Yes. Our entire COA Library is publicly available, no login required. You can verify testing results for any product and batch before ordering.",
  },
  {
    q: "What is your return policy?",
    a: "Due to the nature of research materials, we cannot accept returns on opened products. Unopened products may be returned within 14 days. Contact us for specific inquiries.",
  },
];

function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <section className="relative bg-background border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 gold-line-texture pointer-events-none" />
          <div className="relative mx-auto max-w-3xl px-6 pt-20 pb-14 text-center">
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
          </div>
        </section>

        <section className="bg-card">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 py-14 md:py-20">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((f, i) => (
                <RevealOnScroll key={f.q} delay={i * 60}>
                  <AccordionItem
                    value={`item-${i}`}
                    className="bg-background border border-white/5 rounded-2xl px-5 data-[state=open]:border-brand-gold/30 transition-colors"
                  >
                    <AccordionTrigger className="font-display text-lg text-foreground text-left hover:no-underline">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-foreground/65 leading-relaxed">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                </RevealOnScroll>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
