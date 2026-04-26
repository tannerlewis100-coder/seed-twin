import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

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

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link
            to="/"
            className="flex items-center gap-1.5 font-display text-[26px] tracking-tight text-foreground"
          >
            clarum
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold translate-y-1.5" />
          </Link>
          <nav className="hidden md:flex items-center gap-9 text-[15px] text-foreground/85">
            <Link
              to="/shop"
              className="hover:text-brand-gold transition-colors"
              activeProps={{ className: "text-brand-gold" }}
            >
              Shop
            </Link>
            <Link
              to="/coa-library"
              className="hover:text-brand-gold transition-colors"
              activeProps={{ className: "text-brand-gold" }}
            >
              COA Library
            </Link>
            <Link
              to="/about"
              className="hover:text-brand-gold transition-colors"
              activeProps={{ className: "text-brand-gold" }}
            >
              Science
            </Link>
            <Link
              to="/faq"
              className="hover:text-brand-gold transition-colors"
              activeProps={{ className: "text-brand-gold" }}
            >
              Learn
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
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
    </header>
  );
}
