import { Link } from "@tanstack/react-router";

export function AnnouncementBar() {
  return (
    <div className="bg-brand-gold text-brand-forest text-sm">
      <div className="mx-auto max-w-7xl px-6 py-2.5 text-center font-medium">
        Every batch tested. Every COA published.{" "}
        <Link to="/coa-library" className="underline underline-offset-4 ml-1">
          View the COA Library →
        </Link>
      </div>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-1.5 font-display text-2xl text-foreground">
            CLARUM
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold" />
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-foreground/80">
            <Link to="/shop" className="hover:text-brand-gold transition-colors" activeProps={{ className: "text-brand-gold" }}>
              Shop
            </Link>
            <Link to="/coa-library" className="hover:text-brand-gold transition-colors" activeProps={{ className: "text-brand-gold" }}>
              COA Library
            </Link>
            <Link to="/about" className="hover:text-brand-gold transition-colors" activeProps={{ className: "text-brand-gold" }}>
              About
            </Link>
            <Link to="/faq" className="hover:text-brand-gold transition-colors" activeProps={{ className: "text-brand-gold" }}>
              FAQ
            </Link>
            <Link to="/contact" className="hover:text-brand-gold transition-colors" activeProps={{ className: "text-brand-gold" }}>
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/shop"
            className="inline-flex items-center rounded-full bg-brand-gold text-brand-forest px-5 py-2.5 text-sm font-medium hover:bg-brand-gold-light transition-colors"
          >
            Shop the Catalog
          </Link>
        </div>
      </div>
    </header>
  );
}
