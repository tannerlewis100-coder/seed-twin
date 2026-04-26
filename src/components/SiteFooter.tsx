import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  const cols: Array<[string, Array<{ label: string; to: string }>]> = [
    [
      "Shop",
      [
        { label: "All Compounds", to: "/shop" },
        { label: "COA Library", to: "/coa-library" },
        { label: "FAQ", to: "/faq" },
      ],
    ],
    [
      "Company",
      [
        { label: "About", to: "/about" },
        { label: "Contact", to: "/contact" },
        { label: "Disclaimer", to: "/disclaimer" },
      ],
    ],
  ];

  return (
    <footer className="bg-brand-forest-deep text-foreground/75 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-4 gap-10 text-sm">
        <div className="md:col-span-2">
          <div className="font-display text-2xl text-foreground flex items-center gap-1.5">
            CLARUM <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold" />
          </div>
          <p className="mt-4 max-w-md text-foreground/55">
            Batch-tested research peptides with full 5-panel COA documentation. Built for
            researchers who refuse to take "trust me" for an answer.
          </p>
        </div>
        {cols.map(([title, items]) => (
          <div key={title}>
            <div className="text-foreground font-medium mb-4">{title}</div>
            <ul className="space-y-2.5 text-foreground/60">
              {items.map((i) => (
                <li key={i.label}>
                  <Link to={i.to} className="hover:text-brand-gold transition-colors">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-foreground/45 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Clarum. All rights reserved.</span>
          <span>
            For in vitro laboratory research use only. Not for human or veterinary use.
          </span>
        </div>
      </div>
    </footer>
  );
}
