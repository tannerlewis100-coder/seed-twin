import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RESEARCHER_TYPES = [
  "Academic / university researcher",
  "Biotech or pharmaceutical professional",
  "Contract research organization (CRO)",
  "Independent / private laboratory researcher",
];

const STORAGE_KEY = "clarum_age_verified";

export function AgeGate() {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [researcher, setResearcher] = useState(false);
  const [researcherType, setResearcherType] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setVerified(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (verified === false) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [verified]);

  const confirm = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVerified(true);
    try {
      fetch("https://admin.clarumpeptides.com/wp-json/clarum/v1/gate-consent", {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          researcherType: researcherType || null,
          source: "site_entry",
        }),
      }).catch(() => {});
    } catch {}
  };

  const decline = () => {
    window.location.href = "https://www.google.com";
  };

  if (verified !== false) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-desc"
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-center gap-2 border-b border-primary/15 bg-black/40 px-6 py-4">
          <ShieldAlert className="h-4 w-4 text-primary" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
            Age verification
          </p>
        </div>

        <div className="space-y-6 p-7 md:p-9">
          <div className="space-y-3 text-center">
            <h2
              id="age-gate-title"
              className="font-display text-3xl leading-tight text-foreground md:text-4xl"
            >
              Are you 21 or older?
            </h2>
            <p
              id="age-gate-desc"
              className="text-sm leading-relaxed text-muted-foreground"
            >
              This site sells research peptides for in vitro laboratory use only.
              Not for human consumption. By entering, you confirm you're at least
              21 and agree to our terms.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              What type of researcher are you?
            </label>
            <Select value={researcherType} onValueChange={setResearcherType}>
              <SelectTrigger className="h-11 w-full rounded-full border-primary/25 bg-black/40 px-4 text-sm text-foreground focus:border-primary focus:ring-primary/40">
                <SelectValue placeholder="Select researcher type" />
              </SelectTrigger>
              <SelectContent>
                {RESEARCHER_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-black/30 p-4 text-xs leading-relaxed text-muted-foreground cursor-pointer transition hover:border-primary/30">
            <input
              type="checkbox"
              checked={researcher}
              onChange={(e) => setResearcher(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
            />
            <span>
              I confirm I am a qualified researcher purchasing for in vitro /
              laboratory research only — not for human or veterinary use.
            </span>
          </label>

          <div className="flex flex-col gap-2.5 pt-1">
            <button
              onClick={confirm}
              disabled={!researcher || !researcherType}
              className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              Yes, I'm 21 or older
            </button>
            <button
              onClick={decline}
              className="w-full rounded-full px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
            >
              No, take me back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
