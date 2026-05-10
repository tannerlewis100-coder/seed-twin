import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  FlaskConical,
  FileCheck,
  ShieldCheck,
  BookOpen,
  Beaker,
  Microscope,
  LogOut,
  Menu,
  X,
  HelpCircle,
  Mail,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { peptides } from "@/data/peptides";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AnnouncementBar() {
  return (
    <div className="bg-brand-gold text-brand-forest text-[12px] sm:text-[13px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 sm:py-2.5 text-center font-medium flex flex-col sm:flex-row items-center justify-center gap-x-1.5 gap-y-0.5 leading-snug">
        <span>Every batch tested. Every COA published.</span>
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

type LinkTo = "/shop" | "/coa-library" | "/about" | "/faq" | "/contact" | "/disclaimer";

type Row = {
  to: LinkTo;
  title: string;
  desc?: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
};

function MenuRow({ row }: { row: Row }) {
  const Icon = row.icon;
  return (
    <Link
      to={row.to}
      className="group relative flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors"
    >
      <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-brand-gold opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-brand-gold/10 ring-1 ring-inset ring-brand-gold/15 group-hover:ring-brand-gold/40 transition">
        <Icon className="h-4 w-4 text-brand-gold" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-display text-[15px] text-foreground leading-tight group-hover:text-brand-gold transition-colors">
            {row.title}
          </span>
          {row.badge && (
            <span className="rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-semibold px-1.5 py-0.5 uppercase tracking-wider">
              {row.badge}
            </span>
          )}
        </span>
        {row.desc && (
          <span className="block text-[12.5px] text-foreground/55 mt-0.5 leading-snug">
            {row.desc}
          </span>
        )}
      </span>
      <ArrowUpRight className="h-4 w-4 text-foreground/30 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
    </Link>
  );
}

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/40 font-medium px-3 mb-2">
      {children}
    </div>
  );
}

function QuickLink({ to, children }: { to: LinkTo; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between px-3 py-2 rounded-lg text-[14px] text-foreground/75 hover:text-brand-gold hover:bg-white/[0.04] transition-colors"
    >
      <span>{children}</span>
      <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
    </Link>
  );
}

function ShopMenu() {
  const featured = peptides.slice(0, 4);
  return (
    <div className="grid grid-cols-[1fr_240px] gap-2 p-3 w-[600px]">
      <div>
        <ColumnLabel>Featured</ColumnLabel>
        <div className="flex flex-col">
          {featured.map((p, i) => (
            <MenuRow
              key={p.slug}
              row={{
                to: "/shop",
                title: `${p.name} ${p.size}`,
                desc: p.tag ?? p.category,
                badge: i === 1 ? "Save 25%" : undefined,
                icon: FlaskConical,
              }}
            />
          ))}
        </div>
      </div>
      <div className="border-l border-white/5 pl-2">
        <ColumnLabel>Browse</ColumnLabel>
        <div className="flex flex-col">
          <QuickLink to="/shop">Shop all</QuickLink>
          <QuickLink to="/shop">Bestsellers</QuickLink>
          <QuickLink to="/shop">New arrivals</QuickLink>
          <QuickLink to="/shop">Bundles</QuickLink>
        </div>
        <div className="mt-3 mx-2 rounded-xl border border-brand-gold/20 bg-brand-gold/[0.06] p-3">
          <div className="flex items-center gap-1.5 text-brand-gold text-[11px] font-semibold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" /> Verified
          </div>
          <div className="text-[13px] text-foreground/80 mt-1 leading-snug">
            Every batch tested at Eurofins.
          </div>
          <Link
            to="/coa-library"
            className="inline-flex items-center gap-1 text-[12.5px] font-medium text-brand-gold mt-2 hover:underline underline-offset-4"
          >
            View COAs <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function CoaMenu() {
  const rows: Row[] = [
    { to: "/coa-library", title: "All Batch Reports", desc: "Every COA, every compound.", icon: FileCheck },
    { to: "/coa-library", title: "HPLC Purity", desc: "≥99% verified by lab.", icon: Beaker },
    { to: "/coa-library", title: "Mass Spectrometry", desc: "Molecular identity confirmed.", icon: Microscope },
    { to: "/coa-library", title: "Heavy Metals & Endotoxin", desc: "The tests most vendors skip.", icon: ShieldCheck },
  ];
  return (
    <div className="grid grid-cols-[1fr_220px] gap-2 p-3 w-[600px]">
      <div>
        <ColumnLabel>Test Panels</ColumnLabel>
        <div className="flex flex-col">
          {rows.map((r) => (
            <MenuRow key={r.title} row={r} />
          ))}
        </div>
      </div>
      <div className="border-l border-white/5 pl-2 flex flex-col">
        <ColumnLabel>Reference</ColumnLabel>
        <div className="flex flex-col">
          <QuickLink to="/coa-library">How to read a COA</QuickLink>
          <QuickLink to="/coa-library">Verify by batch #</QuickLink>
          <QuickLink to="/about">Our lab partner</QuickLink>
        </div>
        <div className="mt-auto mx-2 mt-3 text-[11.5px] text-foreground/45 leading-snug">
          Eurofins · Lancaster, PA
          <br />
          ISO/IEC 17025 accredited
        </div>
      </div>
    </div>
  );
}

function AboutMenu() {
  const rows: Row[] = [
    { to: "/about", title: "Our Story", desc: "Why we built Clarum.", icon: BookOpen },
    { to: "/about", title: "5-Panel Testing", desc: "What we test on every batch.", icon: Microscope },
    { to: "/about", title: "Lab Partners", desc: "ISO/IEC 17025 accredited.", icon: ShieldCheck },
    { to: "/contact", title: "Contact", desc: "Questions about a batch?", icon: Mail },
  ];
  return (
    <div className="grid grid-cols-[1fr_220px] gap-2 p-3 w-[600px]">
      <div>
        <ColumnLabel>Company</ColumnLabel>
        <div className="flex flex-col">
          {rows.map((r) => (
            <MenuRow key={r.title} row={r} />
          ))}
        </div>
      </div>
      <div className="border-l border-white/5 pl-2">
        <ColumnLabel>Reference</ColumnLabel>
        <div className="flex flex-col">
          <Link
            to="/faq"
            className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] text-foreground/75 hover:text-brand-gold hover:bg-white/[0.04] transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5 text-foreground/40 group-hover:text-brand-gold" />
            Frequently asked
          </Link>
          <Link
            to="/disclaimer"
            className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] text-foreground/75 hover:text-brand-gold hover:bg-white/[0.04] transition-colors"
          >
            <ScrollText className="h-3.5 w-3.5 text-foreground/40 group-hover:text-brand-gold" />
            Research disclaimer
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [panelLeft, setPanelLeft] = useState(0);
  const auth = useAuth();
  const user = auth?.user ?? null;

  const triggerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navRowRef = useRef<HTMLDivElement | null>(null);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else toast.success("Signed out");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (!openMenu) return;
    const triggerEl = triggerRefs.current[openMenu];
    const rowEl = navRowRef.current;
    if (!triggerEl || !rowEl) return;
    const t = triggerEl.getBoundingClientRect();
    const r = rowEl.getBoundingClientRect();
    setPanelLeft(t.left - r.left + t.width / 2);
  }, [openMenu, scrolled]);

  const ActiveMenu = useMemo(
    () =>
      openMenu === "shop"
        ? ShopMenu
        : openMenu === "coa"
          ? CoaMenu
          : openMenu === "about"
            ? AboutMenu
            : null,
    [openMenu],
  );

  const floating = scrolled || !!openMenu;

  const navItem = (key: Exclude<MenuKey, null>, label: string) => {
    const isOpen = openMenu === key;
    return (
      <div
        ref={(el) => {
          triggerRefs.current[key] = el;
        }}
        className="h-full flex items-center"
        onMouseEnter={() => setOpenMenu(key)}
      >
        <button
          type="button"
          onFocus={() => setOpenMenu(key)}
          className={`group relative h-full inline-flex items-center gap-1 text-[15px] transition-colors ${
            isOpen ? "text-brand-gold" : "text-foreground/85 hover:text-brand-gold"
          }`}
        >
          <span className="relative">
            {label}
            <span
              className={`absolute -bottom-1 left-0 h-[1.5px] bg-brand-gold transition-all duration-200 ${
                isOpen ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    );
  };

  return (
    <header onMouseLeave={() => setOpenMenu(null)} className="sticky top-0 z-40">
      <div
        className={`relative transition-[padding] duration-200 ease-out ${
          floating ? "px-2 sm:px-3 md:px-6 pt-2 sm:pt-3" : "px-0 pt-0"
        }`}
      >
        <div
          ref={navRowRef}
          className={`relative mx-auto flex items-center transition-all duration-200 ease-out ${
            floating
              ? "max-w-6xl justify-between gap-2 sm:gap-3"
              : "max-w-7xl px-4 sm:px-6 lg:px-10 h-16 md:h-20 justify-between bg-background/70 border-b border-white/5"
          }`}
        >
          {/* LEFT pill */}
          <div
            className={`flex items-center gap-8 lg:gap-12 transition-all duration-200 ease-out ${
              floating
                ? "h-12 md:h-14 px-4 sm:px-5 md:px-7 rounded-full bg-background/80 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)]"
                : "h-full"
            }`}
          >
            <Link
              to="/"
              onMouseEnter={() => setOpenMenu(null)}
              aria-label="Clarum Research Peptides"
              className="flex items-center"
            >
              <img
                src={clarumLogo}
                alt="Clarum Research Peptides"
                className="h-8 md:h-9 lg:h-10 w-auto"
              />
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

          {/* RIGHT pill */}
          <div
            onMouseEnter={() => setOpenMenu(null)}
            className={`flex items-center gap-2 sm:gap-3 transition-all duration-200 ease-out ${
              floating
                ? "h-12 md:h-14 pl-3 sm:pl-5 pr-2 rounded-full bg-background/80 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)]"
                : "h-full"
            }`}
          >
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="hidden md:inline-flex items-center gap-1.5 text-[15px] text-foreground/85 hover:text-brand-gold transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            ) : (
              <Link
                to="/sign-in"
                className="hidden md:inline-flex text-[15px] text-foreground/85 hover:text-brand-gold transition-colors"
              >
                Sign in
              </Link>
            )}
            <Link
              to="/shop"
              className={`hidden sm:inline-flex items-center rounded-full bg-brand-gold text-brand-forest text-[14px] font-medium hover:bg-brand-gold-light transition-colors ${
                floating ? "px-4 md:px-5 py-2" : "px-5 md:px-6 py-2 md:py-2.5"
              }`}
            >
              Get Started
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-foreground hover:text-brand-gold transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Mega-menu panel anchored under active trigger */}
          <div
            className={`absolute top-full hidden md:block transition-all duration-200 ease-out ${
              openMenu
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-1 pointer-events-none"
            }`}
            style={{ left: panelLeft, transform: `translateX(-50%) ${openMenu ? "" : "translateY(4px)"}` }}
          >
            <div className="pt-3 pb-6">
              <div className="rounded-3xl bg-background/95 backdrop-blur-2xl border border-white/8 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.85)] overflow-hidden">
                {ActiveMenu && <ActiveMenu />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              aria-label="Clarum Research Peptides"
              className="flex items-center"
            >
              <img
                src={clarumLogo}
                alt="Clarum Research Peptides"
                className="h-9 w-auto"
              />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full text-foreground hover:text-brand-gold transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 py-8 flex flex-col gap-1">
            {[
              { to: "/shop" as const, label: "Shop" },
              { to: "/coa-library" as const, label: "COA Library" },
              { to: "/about" as const, label: "About" },
              { to: "/faq" as const, label: "FAQ" },
              { to: "/contact" as const, label: "Contact" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="font-display text-[28px] text-foreground hover:text-brand-gold transition-colors py-3 border-b border-white/5"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-8 flex flex-col gap-3">
              <Link
                to="/shop"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-brand-gold text-brand-forest text-[15px] font-medium hover:bg-brand-gold-light transition-colors h-12"
              >
                Get Started
              </Link>
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleSignOut();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 text-foreground hover:text-brand-gold hover:border-brand-gold/40 transition-colors h-12 text-[15px]"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              ) : (
                <Link
                  to="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 text-foreground hover:text-brand-gold hover:border-brand-gold/40 transition-colors h-12 text-[15px]"
                >
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
