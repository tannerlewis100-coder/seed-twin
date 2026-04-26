import { Link } from "@tanstack/react-router";
import { ArrowRight, FlaskConical, FileCheck, ShieldCheck, BookOpen, Beaker, Microscope } from "lucide-react";
import { useState, useEffect } from "react";
import { peptides } from "@/data/peptides";

export function AnnouncementBar() {
  return (
    <div className="bg-brand-gold text-brand-forest text-[13px]">
      <div className="mx-auto max-w-7xl px-6 py-2.5 text-center font-medium flex items-center justify-center gap-1.5">
        Every batch tested. Every COA published.
        <Link
          to="/coa-library"
          className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
        >
          View the COA Library <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

type MenuKey = "shop" | "coa" | "about" | null;

function ShopMenu() {
  const featured = peptides.slice(0, 4);
  return (
    <div className="grid grid-cols-12 gap-10 p-10">
      <div className="col-span-3">
        <div className="text-[11px] uppercase tracking-[0.22em] text-brand-gold/80 mb-4">Catalog</div>
        <ul className="space-y-3 text-[15px]">
          <li><Link to="/shop" className="hover:text-brand-gold transition-colors">All Peptides</Link></li>
          <li><Link to="/shop" className="hover:text-brand-gold transition-colors">Healing &amp; Recovery</Link></li>
          <li><Link to="/shop" className="hover:text-brand-gold transition-colors">Cognitive</Link></li>
          <li><Link to="/shop" className="hover:text-brand-gold transition-colors">Longevity</Link></li>
          <li><Link to="/shop" className="hover:text-brand-gold transition-colors">Metabolic</Link></li>
        </ul>
      </div>
      <div className="col-span-6">
        <div className="text-[11px] uppercase tracking-[0.22em] text-brand-gold/80 mb-4">Featured Compounds</div>
        <div className="grid grid-cols-2 gap-3">
          {featured.map((p) => (
            <Link
              key={p.slug}
              to="/shop"
              className="group flex items-center gap-3 rounded-xl p-3 hover:bg-white/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center shrink-0">
                <FlaskConical className="h-4 w-4 text-brand-gold" />
              </div>
              <div className="min-w-0">
                <div className="font-display text-[15px] text-foreground group-hover:text-brand-gold transition-colors truncate">
                  {p.name} <span className="text-foreground/45 text-[12px]">{p.size}</span>
                </div>
                <div className="text-[12px] text-foreground/55 truncate">{p.category}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="col-span-3 border-l border-white/10 pl-8">
        <div className="text-[11px] uppercase tracking-[0.22em] text-brand-gold/80 mb-4">New Here?</div>
        <p className="text-[13px] text-foreground/65 leading-relaxed mb-5">
          Every batch ships with its own published Certificate of Analysis. See the data first.
        </p>
        <Link
          to="/coa-library"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-gold hover:text-brand-gold-light"
        >
          Browse COAs <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function CoaMenu() {
  return (
    <div className="grid grid-cols-12 gap-10 p-10">
      <div className="col-span-4">
        <div className="text-[11px] uppercase tracking-[0.22em] text-brand-gold/80 mb-4">The Library</div>
        <ul className="space-y-3 text-[15px]">
          <li><Link to="/coa-library" className="hover:text-brand-gold transition-colors">All Batch Reports</Link></li>
          <li><Link to="/coa-library" className="hover:text-brand-gold transition-colors">Latest Batches</Link></li>
          <li><Link to="/coa-library" className="hover:text-brand-gold transition-colors">Search by Compound</Link></li>
          <li><Link to="/coa-library" className="hover:text-brand-gold transition-colors">Verify by Batch #</Link></li>
        </ul>
      </div>
      <div className="col-span-8 border-l border-white/10 pl-10">
        <div className="text-[11px] uppercase tracking-[0.22em] text-brand-gold/80 mb-4">5-Panel Tests</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[14px]">
          {[
            { icon: Beaker, label: "HPLC Purity", desc: "≥99% verified" },
            { icon: Microscope, label: "Mass Spectrometry", desc: "Identity confirmed" },
            { icon: ShieldCheck, label: "Heavy Metals", desc: "ICP-MS screen" },
            { icon: FileCheck, label: "Microbial & Yeast", desc: "Cleanliness verified" },
            { icon: FlaskConical, label: "Endotoxin (LAL)", desc: "Most skip this" },
          ].map((t) => (
            <Link key={t.label} to="/coa-library" className="group flex items-start gap-3 rounded-lg p-2 hover:bg-white/5 transition-colors">
              <t.icon className="h-4 w-4 text-brand-gold/80 mt-0.5 shrink-0" />
              <div>
                <div className="text-foreground group-hover:text-brand-gold transition-colors">{t.label}</div>
                <div className="text-[12px] text-foreground/55">{t.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutMenu() {
  return (
    <div className="grid grid-cols-12 gap-10 p-10">
      <div className="col-span-4">
        <div className="text-[11px] uppercase tracking-[0.22em] text-brand-gold/80 mb-4">Company</div>
        <ul className="space-y-3 text-[15px]">
          <li><Link to="/about" className="hover:text-brand-gold transition-colors">Our Story</Link></li>
          <li><Link to="/about" className="hover:text-brand-gold transition-colors">Lab Standards</Link></li>
          <li><Link to="/about" className="hover:text-brand-gold transition-colors">Why Clarum</Link></li>
          <li><Link to="/contact" className="hover:text-brand-gold transition-colors">Contact</Link></li>
        </ul>
      </div>
      <div className="col-span-4 border-l border-white/10 pl-8">
        <div className="text-[11px] uppercase tracking-[0.22em] text-brand-gold/80 mb-4">Resources</div>
        <ul className="space-y-3 text-[15px]">
          <li><Link to="/faq" className="hover:text-brand-gold transition-colors flex items-center gap-2"><BookOpen className="h-4 w-4 text-brand-gold/70" /> FAQ</Link></li>
          <li><Link to="/disclaimer" className="hover:text-brand-gold transition-colors">Research Disclaimer</Link></li>
          <li><Link to="/coa-library" className="hover:text-brand-gold transition-colors">How to Read a COA</Link></li>
        </ul>
      </div>
      <div className="col-span-4 border-l border-white/10 pl-8">
        <div className="text-[11px] uppercase tracking-[0.22em] text-brand-gold/80 mb-4">Built for Researchers</div>
        <p className="text-[13px] text-foreground/65 leading-relaxed mb-5">
          ISO/IEC 17025 accredited testing partners. Full panel, every batch, public data.
        </p>
        <Link
          to="/about"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-gold hover:text-brand-gold-light"
        >
          Read our story <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItem = (key: MenuKey, label: string) => (
    <button
      type="button"
      onMouseEnter={() => setOpenMenu(key)}
      onFocus={() => setOpenMenu(key)}
      className={`relative h-full inline-flex items-center text-[15px] transition-colors ${
        openMenu === key ? "text-brand-gold" : "text-foreground/85 hover:text-brand-gold"
      }`}
    >
      {label}
      <span
        className={`absolute left-0 right-0 -bottom-px h-px bg-brand-gold transition-opacity ${
          openMenu === key ? "opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );

  return (
    <header
      onMouseLeave={() => setOpenMenu(null)}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled || openMenu
          ? "bg-background/95 backdrop-blur-md border-b border-white/10 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]"
          : "bg-background/60 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12 h-full">
          <Link
            to="/"
            className="flex items-center gap-1.5 font-display text-[26px] tracking-tight text-foreground"
          >
            clarum
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold translate-y-1.5" />
          </Link>
          <nav className="hidden md:flex items-center gap-9 h-full">
            {navItem("shop", "Shop")}
            {navItem("coa", "COA Library")}
            {navItem("about", "About")}
            <Link
              to="/faq"
              onMouseEnter={() => setOpenMenu(null)}
              className="text-[15px] text-foreground/85 hover:text-brand-gold transition-colors"
              activeProps={{ className: "text-brand-gold" }}
            >
              FAQ
            </Link>
          </nav>
        </div>
        <div
          className="flex items-center gap-6"
          onMouseEnter={() => setOpenMenu(null)}
        >
          <Link
            to="/contact"
            className="hidden md:inline-flex text-[15px] text-foreground/85 hover:text-brand-gold transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center rounded-full bg-brand-gold text-brand-forest px-6 py-2.5 text-[14px] font-medium hover:bg-brand-gold-light transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Dropdown panel */}
      <div
        className={`absolute left-0 right-0 top-full overflow-hidden transition-all duration-300 ease-out ${
          openMenu ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-background/98 backdrop-blur-xl border-b border-white/10 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
          <div className="mx-auto max-w-7xl">
            {openMenu === "shop" && <ShopMenu />}
            {openMenu === "coa" && <CoaMenu />}
            {openMenu === "about" && <AboutMenu />}
          </div>
        </div>
      </div>
    </header>
  );
}
