import type React from "react";
import { useEffect, useState } from "react";
import { fetchProducts, type WooProduct } from "@/lib/woo";
import { featuredPriceFor, formatFeaturedPrice } from "@/lib/featuredPricing";
import { createFileRoute, Link } from "@tanstack/react-router";

import { motion } from "framer-motion";
import heroVials from "@/assets/hero-vials.png";
import { ArrowRight } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import CoaCard from "@/components/CoaCard";
import RevealText from "@/components/RevealText";
import RevealOnScroll from "@/components/RevealOnScroll";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { peptides, featuredPeptides } from "@/data/peptides";
import { vialImageFor } from "@/lib/vialImages";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Clarum — Research Peptides with Public Batch Reports" },
      {
        name: "description",
        content:
          "Research peptides with public, independent third-party batch reports where available. Published purity results are 99% or higher where reported. Free U.S. shipping over $150.",
      },
      { property: "og:title", content: "Clarum — Research Peptides with Public Batch Reports" },
      {
        property: "og:description",
        content: "Research peptides with public, independent third-party batch reports where available. Some reports are pending or unavailable.",
      },
      { property: "og:url", content: "https://clarumpeptides.com/" },
      { property: "og:image", content: "https://clarumpeptides.com/og-image.png" },
      { name: "twitter:title", content: "Clarum — Research Peptides with Public Batch Reports" },
      {
        name: "twitter:description",
        content: "Research peptides with public, independent third-party batch reports where available. Some reports are pending or unavailable.",
      },

      { name: "twitter:image", content: "https://clarumpeptides.com/og-image.png" },
    ],
    links: [
      { rel: "canonical", href: "https://clarumpeptides.com/" },
    ],
  }),

});

/* ---------------- Hero ---------------- */

function Hero() {
  const headlineWhite = "Research peptides,".split(" ");
  const headlineGold = "without the guesswork.".split(" ");
  const allWords = [
    ...headlineWhite.map((w) => ({ word: w, gold: false })),
    ...headlineGold.map((w) => ({ word: w, gold: true })),
  ];

  return (
    <section className="relative bg-black border-b border-white/[0.08]">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 pt-10 sm:pt-20 pb-[60px] min-h-[70vh] sm:min-h-[90vh] flex items-center">
        <div className="w-full grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left column 60% */}
          <div className="order-2 lg:order-1 lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[11px] tracking-[0.22em] uppercase font-medium text-[#D4A93E] mb-6"
            >
              Independently Lab-Tested
            </motion.div>

            <h1 className="font-display text-[40px] sm:text-[52px] lg:text-[64px] leading-[1.05] tracking-[-0.02em] text-white">
              {allWords.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                  className={
                    w.gold
                      ? "inline-block italic text-[#D4A93E]"
                      : "inline-block"
                  }
                >
                  {w.word}
                </motion.span>
              )).reduce<React.ReactNode[]>((acc, node, i) => {
                if (i > 0) acc.push(" ");
                acc.push(node);
                return acc;
              }, [])}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: allWords.length * 0.05 + 0.1, duration: 0.5 }}
              className="mt-6 text-[18px] leading-[1.6] text-[#A0A0A0] max-w-[480px]"
            >
              Independent third-party lab testing, with the batch reports published for you to read. Panels vary by report.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: allWords.length * 0.05 + 0.2, duration: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full bg-[#D4A93E] text-black h-12 px-7 text-[14px] font-medium transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#e0b955]"
              >
                Shop the Catalog
              </Link>
              <Link
                to="/coa-library"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D4A93E] text-[#D4A93E] bg-transparent h-12 px-7 text-[14px] font-medium transition-colors hover:bg-[#D4A93E]/10"
              >
                View COA Library <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: allWords.length * 0.05 + 0.35, duration: 0.6 }}
              className="mt-8 text-[14px] text-[#777]"
            >
              Purity · Label-Claim Assay · Microbial & Heavy Metals where reported
            </motion.div>
          </div>

          {/* Right column 40% */}
          <div className="order-1 lg:order-2 lg:col-span-2 relative hidden lg:flex justify-center items-center">
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div
                className="w-[420px] h-[420px] rounded-full"
                style={{
                  background: "#D4A93E",
                  opacity: 0.08,
                  filter: "blur(80px)",
                }}
              />
            </div>
            <motion.img
              src={heroVials}
              alt="Clarum research peptide vials"
              className="relative w-full h-auto object-contain"
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Mobile image */}
          <div className="order-1 lg:hidden relative w-full flex justify-center items-center" style={{ height: 260 }}>
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div
                className="w-[240px] h-[240px] rounded-full"
                style={{ background: "#D4A93E", opacity: 0.08, filter: "blur(80px)" }}
              />
            </div>
            <motion.img
              src={heroVials}
              alt="Clarum research peptide vials"
              className="relative max-h-[260px] w-auto object-contain"
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}


/* ---------------- Featured products (4-up shadcn Card grid) ---------------- */

function FeaturedProducts() {
  const featured = featuredPeptides.slice(0, 4);
  const [liveProducts, setLiveProducts] = useState<WooProduct[] | null>(null);
  const [priceStatus, setPriceStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((products) => {
        if (cancelled) return;
        setLiveProducts(products);
        setPriceStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setLiveProducts(null);
        setPriceStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);


  return (
    <section className="bg-background border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-10 mb-16 items-end">
          <div className="lg:col-span-7">
            <Badge
              variant="outline"
              className="border-brand-gold/30 text-brand-gold bg-transparent rounded-full px-3 py-1 mb-5 text-[11px] tracking-[0.18em] uppercase font-medium"
            >
              The Catalog
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[56px] leading-[1.05] text-foreground tracking-[-0.02em]">
              <RevealText text={"Verified purity\nstarts in the vial."} />
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-3">
            <RevealOnScroll
              as="p"
              delay={120}
              className="text-foreground/60 leading-[1.6] max-w-md"
            >
              Supplier batch reports from independent third-party labs are
              published here where available. Methods and panels vary by
              report, and some reports are pending or unavailable. Pull the
              batch report before checkout — or after. We don't mind.

            </RevealOnScroll>
            <Button
              asChild
              variant="link"
              className="mt-3 px-0 text-brand-gold hover:text-brand-gold-light"
            >
              <Link to="/shop">
                Shop all compounds <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p, i) => {
            const vial = vialImageFor(p.name, p.slug);
            return (
              <RevealOnScroll key={p.slug} delay={i * 80}>
                <Link
                  to="/shop/$slug"
                  params={{ slug: p.slug.replace(/-\d+(?:\.\d+)?(?:mg|mcg|µg|ml|iu|g)$/i, "") }}
                  className="group/card relative flex flex-col items-center text-center overflow-hidden rounded-3xl h-[520px] w-full p-6 bg-brand-forest-deep border border-white/5 hover:border-brand-gold/40 transition-all duration-500 hover:-translate-y-1 shadow-xl"
                >
                  {/* Top-left badge */}
                  <div className="absolute top-5 left-5 z-10">
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-brand-gold/90 text-brand-forest px-3 py-1.5 rounded-full">
                      {p.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="relative z-10 mt-16 font-display text-2xl md:text-3xl text-foreground leading-tight max-w-[85%] min-h-[4rem] flex items-center justify-center">
                    {p.name}
                  </h3>

                  {/* Vial visual */}
                  <div className="relative z-10 flex-1 flex items-center justify-center w-full my-4">
                    <img
                      src={vial}
                      alt={`${p.name} vial`}
                      loading="lazy"
                      draggable={false}
                      className="h-56 w-auto max-w-full object-contain select-none transition-transform duration-700 group-hover/card:scale-105 drop-shadow-2xl"
                    />
                  </div>

                  {/* Shop Now button */}
                  <div className="relative z-10 w-full">
                    <div className="mx-auto w-fit rounded-full bg-brand-forest border border-white/10 px-10 py-3 text-foreground text-sm font-medium group-hover/card:bg-brand-gold group-hover/card:text-brand-forest group-hover/card:border-brand-gold transition-colors">
                      Shop Now
                    </div>
                    {(() => {
                      const live = featuredPriceFor(liveProducts, p.slug);
                      if (live) {
                        return (
                          <p className="mt-4 text-xs text-foreground/60">
                            {live.isRange ? "Starting at " : ""}
                            <span className="text-foreground/90 font-semibold">
                              {formatFeaturedPrice(live)}
                            </span>
                          </p>
                        );
                      }
                      if (priceStatus === "loading") {
                        return (
                          <p className="mt-4 text-xs text-foreground/60">
                            <span className="inline-block h-3 w-20 rounded-full bg-white/10 align-middle" />
                          </p>
                        );
                      }
                      return (
                        <p className="mt-4 text-xs text-foreground/60">
                          <span className="text-foreground/90 font-semibold">
                            View pricing
                          </span>
                        </p>
                      );
                    })()}

                  </div>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Quality & Transparency (vial photo collage) ---------------- */

const qualitySemax = "/quality-semax-v2.png";
const qualitySs37 = "/quality-ss37-v2.png";
const qualityGlp1s = "/quality-glp1s-v2.png";
const qualityTrio = "/quality-trio-v2.png";

function QualityCollage() {
  return (
    <section className="bg-background border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-16 md:py-24 lg:py-32 grid lg:grid-cols-12 gap-10 lg:gap-20 items-center">
        {/* Image collage */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.08]">
            <img
              src={qualitySs37}
              alt="SS-31 vial"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.08]">
            <img
              src={qualitySemax}
              width={1440}
              height={1920}
              alt="SEMAX vial"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.08]">
            <img
              src={qualityGlp1s}
              width={1536}
              height={1920}
              alt="GLP1-S vial"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.08]">
            <img
              src={qualityTrio}
              width={1920}
              height={1280}
              alt="BPC-157, Selank, and GHK-Cu vials"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Copy */}
        <div className="lg:col-span-6">
          <Badge
            variant="outline"
            className="border-brand-gold/30 text-brand-gold bg-transparent rounded-full px-3 py-1 mb-5 text-[11px] tracking-[0.18em] uppercase font-medium"
          >
            Quality &amp; Transparency
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[52px] leading-[1.05] text-foreground tracking-[-0.02em]">
            <RevealText text={"Receipts,\nnot claims."} />
          </h2>
          <RevealOnScroll
            as="p"
            delay={250}
            className="mt-6 text-foreground/60 leading-[1.6] max-w-lg"
          >
            Explore available batch reports in our public COA library.
          </RevealOnScroll>
          <Button
            asChild
            size="lg"
            className="mt-8 rounded-full bg-brand-gold text-brand-forest hover:bg-brand-gold-light h-12 px-7 text-[14px]"
          >
            <Link to="/coa-library">View COA Library</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Batch reports (COA library teaser) ---------------- */

function BatchReports() {
  const sample = peptides.find((p) => p.slug === "bpc-157-10mg");

  return (
    <section className="bg-background border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-14 md:py-20 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-6">
          <Badge
            variant="outline"
            className="border-brand-gold/30 text-brand-gold bg-transparent rounded-full px-3 py-1 mb-5 text-[11px] tracking-[0.18em] uppercase font-medium"
          >
            COA Library
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] text-foreground tracking-[-0.02em]">
            <RevealText text={"Your batch.\nYour report."} />
          </h2>
          <RevealOnScroll as="p" delay={200} className="mt-5 text-foreground/60 leading-[1.6] max-w-md">
            Browse available certificates by product or batch.
          </RevealOnScroll>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="mt-7 rounded-full border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold-light bg-transparent h-12 px-7 text-[14px]"
          >
            <Link to="/coa-library">
              Open COA Library <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
          <RevealOnScroll delay={120} className="w-full max-w-md">
            {sample ? <CoaCard peptide={sample} /> : null}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <Hero />
        <FeaturedProducts />
        <BatchReports />
      </main>
      <SiteFooter />
    </div>
  );
}
