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

type MenuRow = {
  to: "/shop" | "/coa-library" | "/about" | "/faq" | "/contact" | "/disclaimer";
  eyebrow?: string;
  title: string;
  desc?: string;
  badge?: string;
  iconBg?: string;
  icon: React.ComponentType<{ className?: string }>;
};

function MenuTile({ row }: { row: MenuRow }) {
  const Icon = row.icon;
  return (
    <Link
      to={row.to}
      className="group flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/[0.06] transition-colors"
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-brand-gold/20 ${
          row.iconBg ?? "bg-brand-gold/10"
        }`}
      >
        <Icon className="h-5 w-5 text-brand-gold" />
      </div>
      <div className="min-w-0">
        {row.eyebrow && (
          <div className="text-[12px] text-foreground/45 leading-tight">{row.eyebrow}</div>
        )}
        <div className="flex items-center gap-2">
          {row.badge && (
            <span className="inline-block rounded-full bg-brand-gold/20 text-brand-gold text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">
              {row.badge}
            </span>
          )}
          <div className="font-display text-[18px] text-foreground leading-tight group-hover:text-brand-gold transition-colors">
            {row.title}
          </div>
        </div>
        {row.desc && (
          <div className="text-[13px] text-foreground/55 mt-0.5 leading-snug">{row.desc}</div>
        )}
      </div>
    </Link>
  );
}

function ShopMenu() {
  const featured = peptides.slice(0, 5);
  return (
    <div className="p-4 w-[380px]">
      <div className="flex flex-col">
        {featured.map((p, i) => (
          <MenuTile
            key={p.slug}
            row={{
              to: "/shop",
              eyebrow: p.tag ?? p.category,
              title: `${p.name} ${p.size}`,
              badge: i === 2 ? "Save 25%" : undefined,
              icon: FlaskConical,
            }}
          />
        ))}
      </div>
      <div className="border-t border-white/10 mt-2 pt-4 px-4 pb-2">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-foreground hover:text-brand-gold border-b border-foreground/30 hover:border-brand-gold pb-0.5 transition-colors"
        >
          Shop All Products <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function CoaMenu() {
  const rows: MenuRow[] = [
    { to: "/coa-library", title: "All Batch Reports", desc: "Every COA, every compound.", icon: FileCheck },
    { to: "/coa-library", title: "HPLC Purity", desc: "≥99% verified by lab.", icon: Beaker },
    { to: "/coa-library", title: "Mass Spectrometry", desc: "Molecular identity confirmed.", icon: Microscope },
    { to: "/coa-library", title: "Heavy Metals & Endotoxin", desc: "The tests most vendors skip.", icon: ShieldCheck },
  ];
  return (
    <div className="p-4 w-[380px]">
      <div className="flex flex-col">
        {rows.map((r) => (
          <MenuTile key={r.title} row={r} />
        ))}
      </div>
      <div className="border-t border-white/10 mt-2 pt-4 px-4 pb-2 space-y-1">
        <div className="text-[11px] uppercase tracking-[0.22em] text-foreground/40 mb-2">Reference</div>
        <Link to="/coa-library" className="block text-[14px] text-foreground/80 hover:text-brand-gold py-1 transition-colors">
          How to Read a COA
        </Link>
        <Link to="/coa-library" className="block text-[14px] text-foreground/80 hover:text-brand-gold py-1 transition-colors">
          Verify by Batch #
        </Link>
      </div>
    </div>
  );
}

function AboutMenu() {
  const rows: MenuRow[] = [
    { to: "/about", eyebrow: "Approach", title: "Our Story", desc: "Why we built Clarum.", icon: BookOpen },
    { to: "/about", eyebrow: "Standards", title: "Lab Partners", desc: "ISO/IEC 17025 accredited testing.", icon: ShieldCheck },
    { to: "/about", eyebrow: "Method", title: "5-Panel Testing", desc: "What we test on every batch.", icon: Microscope },
    { to: "/contact", eyebrow: "Get in Touch", title: "Contact", desc: "Questions about a batch?", icon: BookOpen },
  ];
  return (
    <div className="p-4 w-[380px]">
      <div className="flex flex-col">
        {rows.map((r) => (
          <MenuTile key={r.title} row={r} />
        ))}
      </div>
      <div className="border-t border-white/10 mt-2 pt-4 px-4 pb-2 space-y-1">
        <div className="text-[11px] uppercase tracking-[0.22em] text-foreground/40 mb-2">Reference</div>
        <Link to="/faq" className="block text-[14px] text-foreground/80 hover:text-brand-gold py-1 transition-colors">
          Frequently Asked Questions
        </Link>
        <Link to="/disclaimer" className="block text-[14px] text-foreground/80 hover:text-brand-gold py-1 transition-colors">
          Research Use Disclaimer
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

  const navItem = (key: Exclude<MenuKey, null>, label: string) => {
    const isOpen = openMenu === key;
    return (
      <div
        className="h-full flex items-center"
        onMouseEnter={() => setOpenMenu(key)}
      >
        <button
          type="button"
          onFocus={() => setOpenMenu(key)}
          className={`relative h-full inline-flex items-center text-[15px] transition-colors ${
            isOpen ? "text-brand-gold" : "text-foreground/85 hover:text-brand-gold"
          }`}
        >
          {label}
        </button>
      </div>
    );
  };

  const ActiveMenu =
    openMenu === "shop" ? ShopMenu : openMenu === "coa" ? CoaMenu : openMenu === "about" ? AboutMenu : null;

  const floating = scrolled || !!openMenu;

  return (
    <header
      onMouseLeave={() => setOpenMenu(null)}
      className="sticky top-0 z-40"
    >
      <div
        className={`relative transition-[padding] duration-200 ease-out ${
          floating ? "px-3 sm:px-6 pt-3" : "px-0 pt-0"
        }`}
      >
        <div
          className={`relative mx-auto flex items-center transition-all duration-200 ease-out ${
            floating
              ? "max-w-6xl justify-between gap-3"
              : "max-w-7xl px-6 lg:px-10 h-20 justify-between bg-background/70 border-b border-white/5"
          }`}
        >
          {/* LEFT pill: brand + nav */}
          <div
            className={`flex items-center gap-8 lg:gap-12 transition-all duration-200 ease-out ${
              floating
                ? "h-14 px-5 sm:px-7 rounded-full bg-background/80 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)]"
                : "h-full"
            }`}
          >
            <Link
              to="/"
              onMouseEnter={() => setOpenMenu(null)}
              className="flex items-center gap-1.5 font-display text-[22px] lg:text-[26px] tracking-tight text-foreground"
            >
              clarum
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold translate-y-1.5" />
            </Link>
            <nav className="hidden md:flex items-center gap-7 lg:gap-9 h-full">
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

          {/* RIGHT pill: sign in + CTA */}
          <div
            onMouseEnter={() => setOpenMenu(null)}
            className={`flex items-center gap-3 transition-all duration-200 ease-out ${
              floating
                ? "h-14 pl-5 pr-2 rounded-full bg-background/80 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)]"
                : "h-full"
            }`}
          >
            <Link
              to="/contact"
              className="hidden md:inline-flex text-[15px] text-foreground/85 hover:text-brand-gold transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/shop"
              className={`inline-flex items-center rounded-full bg-brand-gold text-brand-forest text-[14px] font-medium hover:bg-brand-gold-light transition-colors ${
                floating ? "px-5 py-2" : "px-6 py-2.5"
              }`}
            >
              Get Started
            </Link>
          </div>

          {/* Left-anchored mega-menu panel (anchored under the LEFT pill) */}
          <div
            className={`absolute left-0 top-full transition-opacity duration-150 ease-out ${
              openMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="pt-3 pb-6">
              <div className="rounded-3xl bg-background/95 backdrop-blur-2xl border border-white/10 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85)] overflow-hidden">
                {ActiveMenu && <ActiveMenu />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
