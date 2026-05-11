import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, ExternalLink, Shield } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import RevealOnScroll from "@/components/RevealOnScroll";
import { allPeptides, type Peptide } from "@/data/peptides";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const product = allPeptides.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} ${p.size} — Research Peptide | CLARUM` : "Product | CLARUM";
    const desc = p
      ? `${p.name} ${p.size}. ${p.purity} purity, batch-tested at Eurofins. Public COA, no email required.`
      : "Research peptide product page.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center px-6 py-24 text-center">
        <div>
          <h1 className="font-display text-4xl text-foreground mb-3">Product not found</h1>
          <p className="text-foreground/55 mb-6">That peptide isn't in the catalog.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-brand-gold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to shop
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
      <p className="text-foreground/70">{error.message}</p>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const p = product as Peptide;
  const shortCode = p.batch?.split("-").slice(-1)[0] || p.name.slice(0, 3).toUpperCase();

  const related = allPeptides
    .filter((x) => x.category === p.category && x.slug !== p.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        {/* Breadcrumb */}
        <div className="bg-background border-b border-white/5">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-2 text-xs text-foreground/50">
            <Link to="/shop" className="hover:text-brand-gold inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Shop
            </Link>
            <span>/</span>
            <span className="text-foreground/70">{p.category}</span>
            <span>/</span>
            <span className="text-foreground/90">{p.name}</span>
          </div>
        </div>

        {/* Product hero */}
        <section className="bg-background">
          <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Visual */}
            <RevealOnScroll>
              <div className="relative rounded-3xl bg-brand-forest-deep border border-white/5 overflow-hidden h-[480px] md:h-[560px] flex items-center justify-center">
                <div className="absolute top-5 left-5">
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-brand-gold/90 text-brand-forest px-3 py-1.5 rounded-full">
                    {p.badge ?? p.category}
                  </span>
                </div>
                <div className="relative w-44 h-60 md:w-52 md:h-72">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 rounded-t-md bg-gradient-to-b from-neutral-700 to-neutral-900 border border-black/40" />
                  <div className="absolute top-7 left-1/2 -translate-x-1/2 w-28 h-3 bg-black/60 rounded-sm" />
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-40 h-48 md:w-44 md:h-56 rounded-b-xl rounded-t-sm bg-gradient-to-b from-neutral-900 via-black to-neutral-950 border border-white/10 shadow-2xl overflow-hidden">
                    <div className="absolute inset-x-4 top-12 h-px bg-brand-gold/30" />
                    <div className="absolute inset-x-0 top-14 text-center">
                      <span className="text-[11px] tracking-[0.25em] text-brand-gold/80 font-semibold">
                        CLARUM
                      </span>
                    </div>
                    <div className="absolute inset-x-0 top-24 text-center px-3">
                      <span className="text-[10px] tracking-wider text-white/70 block leading-tight">
                        {p.name}
                      </span>
                      <span className="text-[9px] tracking-wider text-white/50 block mt-1">
                        {p.size}
                      </span>
                    </div>
                    <div className="absolute inset-x-4 bottom-6 text-center">
                      <span className="text-[8px] tracking-wider text-white/40 block">
                        BATCH {shortCode}
                      </span>
                      <span className="text-[8px] tracking-wider text-white/30 block mt-0.5">
                        RESEARCH USE ONLY
                      </span>
                    </div>
                    <div className="absolute inset-y-0 right-2 w-2 bg-gradient-to-r from-transparent to-white/10" />
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            {/* Details */}
            <div className="flex flex-col">
              <div className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold mb-3">
                {p.category}
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
                {p.name}
              </h1>
              <p className="mt-2 text-foreground/55 text-sm">
                {p.size} · Lyophilized · Batch {p.batch}
              </p>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-4xl text-foreground">
                  ${p.price.toFixed(2)}
                </span>
                <span className="text-xs text-foreground/40">USD</span>
              </div>

              <p className="mt-6 text-foreground/70 leading-relaxed">{p.description}</p>

              {/* Spec strip */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                <SpecBox label="Purity" value={p.purity} />
                <SpecBox label="Assay" value={p.coa.assay} />
                <SpecBox label="Identity" value={p.coa.identity} />
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-full bg-brand-gold text-brand-forest font-semibold py-4 hover:bg-brand-gold/90 transition-colors"
                >
                  Add to Order — ${p.price.toFixed(2)}
                </button>
                {p.coaUrl ? (
                  <a
                    href={p.coaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-4 text-foreground/80 hover:border-brand-gold/40 hover:text-brand-gold transition-colors text-sm"
                  >
                    View COA <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    to="/coa-library"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-4 text-foreground/80 hover:border-brand-gold/40 hover:text-brand-gold transition-colors text-sm"
                  >
                    COA Library
                  </Link>
                )}
              </div>

              {/* Trust row */}
              <div className="mt-6 flex items-center gap-2 text-xs text-foreground/55">
                <Shield className="h-3.5 w-3.5 text-brand-gold" />
                <span>Tested at Eurofins, Lancaster, PA · ISO/IEC 17025</span>
              </div>
            </div>
          </div>
        </section>

        {/* COA panel */}
        <section className="bg-card border-y border-white/5">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-px w-8 bg-brand-gold/40" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                Certificate of Analysis
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <CoaCell label="Purity" value={p.coa.purity} />
              <CoaCell label="Assay" value={p.coa.assay} />
              <CoaCell label="Identity" value={p.coa.identity} />
              <CoaCell label="Heavy Metals" value={p.coa.heavyMetals} />
              <CoaCell label="TAMC / TYMC" value={`${p.coa.tamc} / ${p.coa.tymc}`} />
            </div>
            <div className="mt-6 grid sm:grid-cols-3 gap-3 text-xs text-foreground/60">
              <Meta label="SKU" value={p.coa.sku} />
              <Meta label="Form" value={p.coa.form} />
              <Meta label="Test Date" value={p.coa.date} />
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="bg-background">
            <div className="mx-auto max-w-7xl px-6 py-14">
              <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">
                More from {p.category}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to="/shop/$slug"
                    params={{ slug: r.slug }}
                    className="group rounded-2xl bg-brand-forest-deep border border-white/5 hover:border-brand-gold/40 p-5 transition-all hover:-translate-y-0.5"
                  >
                    <div className="text-[10px] uppercase tracking-wider text-brand-gold/80 font-semibold mb-2">
                      {r.category}
                    </div>
                    <div className="font-display text-lg text-foreground">{r.name}</div>
                    <div className="text-xs text-foreground/50 mt-1">{r.size}</div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-foreground/80 font-semibold">${r.price.toFixed(2)}</span>
                      <span className="text-xs text-brand-gold/80 group-hover:text-brand-gold">
                        View →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <p className="text-center text-xs text-foreground/40 max-w-2xl mx-auto py-10 px-6">
          For in vitro laboratory research only. Not for human or veterinary use,
          clinical application, or food.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

function SpecBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-foreground/40">{label}</div>
      <div className="mt-1 text-foreground font-semibold text-sm">{value}</div>
    </div>
  );
}

function CoaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand-gold/15 bg-brand-forest-deep/40 p-4">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-brand-gold/80 font-semibold">
        <Check className="h-3 w-3" /> {label}
      </div>
      <div className="mt-2 text-foreground font-semibold">{value}</div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <div className="text-[10px] uppercase tracking-wider text-foreground/40">{label}</div>
      <div className="mt-1 text-foreground/85">{value}</div>
    </div>
  );
}
