import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { sampleCoa, type Peptide } from "@/data/peptides";

type Props = {
  peptide: Peptide;
  variant?: "full" | "mini";
  showLink?: boolean;
};

export default function CoaCard({ peptide, variant = "full", showLink = true }: Props) {
  const rows = sampleCoa(peptide);
  const purityNum = parseFloat(peptide.purity);

  if (variant === "mini") {
    return (
      <div className="w-full rounded-2xl border border-brand-gold/15 bg-black/40 backdrop-blur-sm p-4 text-left">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/70">
            Batch {peptide.batch}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
            ● Pass
          </span>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/60">Percent Purity</span>
            <span className="text-xs font-semibold text-white tabular-nums">{peptide.purity}</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-gold/80 to-brand-gold rounded-full animate-grow-bar"
              style={{ width: `${purityNum}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group w-full max-w-md">
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-brand-gold/25 via-brand-gold/5 to-transparent blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="relative bg-card rounded-3xl p-7 border border-brand-gold/15 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
              Batch {peptide.batch}
            </p>
            <p className="font-display text-lg text-white">
              {peptide.name}{" "}
              <span className="text-sm text-white/50">({peptide.size})</span>
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/15 text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-500/20">
            <span className="inline-block animate-pulse">●</span> Pass
          </span>
        </div>
        <div className="space-y-3.5">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white/55">Percent Purity</span>
              <span className="text-sm font-semibold text-white tabular-nums">{peptide.purity}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-gold/80 to-brand-gold rounded-full animate-grow-bar"
                style={{ width: `${purityNum}%` }}
              />
            </div>
          </div>
          {rows.slice(1).map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-2 border-t border-white/5"
            >
              <span className="text-xs text-white/45">{row.label}</span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[9px]">
                  ✓
                </span>
                {row.value}
              </span>
            </div>
          ))}
        </div>
        {showLink && (
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] text-white/30">
              Independent 3rd-party lab verified
            </span>
            <Link
              to="/coa-library"
              className="text-[10px] text-brand-gold font-semibold hover:text-brand-gold-light transition-colors flex items-center gap-1"
            >
              View all COAs <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
