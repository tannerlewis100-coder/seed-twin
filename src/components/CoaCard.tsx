import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Peptide } from "@/data/peptides";
import { coaForSlug, formatTestedAt, purityOf, NOT_REPORTED } from "@/data/coaLibrary";
import { CoaDecisionBadge, coaRows } from "@/components/CoaResults";

type Props = {
  peptide: Peptide;
  variant?: "full" | "mini";
  showLink?: boolean;
};

export default function CoaCard({ peptide, variant = "full", showLink = true }: Props) {
  const status = coaForSlug(peptide.slug);
  const record = status.state === "published" ? status.record : null;
  const purity = record ? purityOf(record) : null;
  const purityNum = purity ? parseFloat(purity.replace(/[^\d.]/g, "")) : NaN;
  const batch = record?.batch ?? "—";

  if (variant === "mini") {
    return (
      <div className="w-full rounded-2xl border border-brand-gold/15 bg-black/40 backdrop-blur-sm p-4 text-left">
        <div className="flex items-center justify-between mb-3 gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/70 truncate">
            Batch {batch}
          </span>
          {record ? (
            <CoaDecisionBadge record={record} />
          ) : (
            <span className="text-[10px] uppercase tracking-wider font-bold bg-white/5 text-white/40 px-2.5 py-1 rounded-full border border-white/10">
              {status.state === "pending" ? "Pending" : "Unavailable"}
            </span>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/60">Purity</span>
            <span className="text-xs font-semibold text-white tabular-nums">
              {purity ?? NOT_REPORTED}
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-gold/80 to-brand-gold rounded-full animate-grow-bar"
              style={{ width: `${Number.isFinite(purityNum) ? purityNum : 0}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  const rows = record ? coaRows(record) : [];

  return (
    <div className="relative group w-full max-w-md">
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-brand-gold/25 via-brand-gold/5 to-transparent blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="relative bg-card rounded-3xl p-7 border border-brand-gold/15 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1 truncate">
              Batch {batch}
            </p>
            <p className="font-display text-lg text-white">
              {peptide.name}{" "}
              <span className="text-sm text-white/50">({peptide.size})</span>
            </p>
          </div>
          {record ? (
            <CoaDecisionBadge record={record} />
          ) : (
            <span className="text-[10px] uppercase tracking-wider font-bold bg-white/5 text-white/40 px-3 py-1.5 rounded-full border border-white/10">
              {status.state === "pending" ? "Report pending" : "Unavailable"}
            </span>
          )}
        </div>

        {record ? (
          <div className="space-y-1">
            {purity && (
              <div className="pb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/55">Purity</span>
                  <span className="text-sm font-semibold text-white tabular-nums">{purity}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-gold/80 to-brand-gold rounded-full animate-grow-bar"
                    style={{ width: `${Number.isFinite(purityNum) ? purityNum : 0}%` }}
                  />
                </div>
              </div>
            )}
            {rows.slice(0, 5).map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-3 py-2 border-t border-white/5"
              >
                <span className="text-xs text-white/45">{row.label}</span>
                <span className="text-xs font-semibold text-white/85 text-right">{row.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-white/45 py-4">
            {status.state === "pending"
              ? "Report pending — no published certificate for this SKU yet."
              : "Current report unavailable for this item."}
          </p>
        )}

        {showLink && (
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <span className="text-[10px] text-white/30">
              {record
                ? `${record.lab.name ?? "Independent lab"} · ${formatTestedAt(record.testedAt)}`
                : "Independent 3rd-party lab verified"}
            </span>
            <Link
              to="/coa-library"
              className="text-[10px] text-brand-gold font-semibold hover:text-brand-gold-light transition-colors flex items-center gap-1 shrink-0"
            >
              View all COAs <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
