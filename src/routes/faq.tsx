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
    a: "Peptides used for research purposes are composed of amino acid sequences. They are not meant for use by humans or animals but rather for use in laboratory tests and research.",
  },
  {
    q: 'What does "Research Use Only" mean?',
    a: "All items offered by Clarum are meant to be used exclusively for research in the laboratory. These products are neither for human nor animal use or consumption. Purchasing them implies that you are using them only for research purposes.",
  },
  {
    q: "How do I read a Certificate of Analysis (COA)?",
    a: "COA includes the name of the compound, batch numbers, and information about all the tests carried out. COA should have details such as HPLC purity greater than 99%, mass spectrometry, no detectable heavy metals, and levels of microbial and endotoxins.",
  },
  {
    q: "What is endotoxin testing and why does it matter?",
    a: "Endotoxin detection (LAL test) is used to identify endotoxins, which are toxins produced from gram-negative bacteria. Most peptide suppliers do not conduct this test at all. Clarum conducts this test on all batches, since contamination with endotoxins may affect experimental results.",
  },
  {
    q: "What makes Clarum's testing different from other vendors?",
    a: "This is where most vendors will stop. Our batches, however, go through a complete 5-panel test that includes HPLC purity, LC-MS identity, ICP-MS heavy metals, microbial and yeast counts, and LAL endotoxin. The entire test results are uploaded to the publicly accessible COA library before shipment.",
  },
  {
    q: "Do you ship internationally?",
    a: "For now, Clarum only ships to addresses in the US. International shipping is under consideration and will be updated when it becomes available.",
  },
  {
    q: "How are products shipped and stored?",
    a: "The product is delivered using insulated packaging with proper temperature control measures. It is recommended that the lyophilized peptides be stored at -20°C for optimal storage.",
  },
  {
    q: "Can I see the COA before I purchase?",
    a: "Yes, our entire library of COA documents is accessible to you without having to log in. You have an opportunity to confirm the test results of any batch of products.",
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
