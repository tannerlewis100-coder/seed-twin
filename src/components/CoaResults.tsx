import { Check, Minus } from "lucide-react";
import { NOT_REPORTED, formatTestedAt, type CoaRecord } from "@/data/coaLibrary";

export type CoaRow = {
  label: string;
  value: string;
  passFail: string | null;
  specification: string | null;
};

/** Analyte rows exactly as reported on the certificate — nothing inferred, nothing added. */
export function coaRows(record: CoaRecord): CoaRow[] {
  return record.analytes.map((a) => ({
    label: a.component ? `${a.name} — ${a.component}` : a.name,
    value: a.result?.trim() || NOT_REPORTED,
    passFail: a.passFail,
    specification: a.specification?.trim() || null,
  }));
}

/** Certificate-level badge. Describes document availability only, never assay outcomes. */
export function decisionLabel(_record: CoaRecord): { text: string; tone: "pass" | "neutral" } {
  return { text: "Report available", tone: "neutral" };
}

export function CoaDecisionBadge({ record }: { record: CoaRecord }) {
  const { text, tone } = decisionLabel(record);
  return (
    <span
      className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border ${
        tone === "pass"
          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
          : "bg-brand-gold/10 text-brand-gold border-brand-gold/25"
      }`}
    >
      {text}
    </span>
  );
}

export function CoaResultRow({ row }: { row: CoaRow }) {
  const reported = row.value !== NOT_REPORTED;
  return (
    <div className="p-5 flex flex-col gap-1.5">
      <span className="text-[10px] uppercase tracking-wider text-foreground/45">{row.label}</span>
      <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
        {row.passFail === "pass" ? (
          <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
        ) : !reported ? (
          <Minus className="h-3.5 w-3.5 text-foreground/30 shrink-0" />
        ) : null}
        <span className={reported ? "" : "text-foreground/40 font-normal"}>{row.value}</span>
      </span>
      {row.specification && (
        <span className="text-[10px] text-foreground/35">Spec: {row.specification}</span>
      )}
    </div>
  );
}

export function CoaAttribution({ record }: { record: CoaRecord }) {
  return (
    <div className="text-[11px] text-foreground/45 leading-relaxed">
      <p>
        Batch {record.batch} · Tested {formatTestedAt(record.testedAt)} · Performing laboratory{" "}
        {record.lab.name ?? NOT_REPORTED}
        {record.signer ? ` · Certificate issued and signed by ${record.signer}` : ""}
      </p>
      {record.methods.length > 0 && (
        <p className="mt-1">
          Methods on this report: {record.methods.map((m) => m.name).join(" · ")}
        </p>
      )}
      {record.signatureIntact && (
        <p className="mt-1 text-foreground/35">
          Digital signature intact — confirms document authenticity, not that every assay passed.
        </p>
      )}
    </div>
  );
}
