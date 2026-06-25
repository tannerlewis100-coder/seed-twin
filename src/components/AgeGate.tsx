import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const STORAGE_KEY = "clarum_age_verified_v2";

export function AgeGate() {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [ageOk, setAgeOk] = useState(false);
  const [researcherOk, setResearcherOk] = useState(false);

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

  const canEnter = ageOk && researcherOk;

  const confirm = () => {
    if (!canEnter) return;
    localStorage.setItem(STORAGE_KEY, "1");
    setVerified(true);
  };

  const decline = () => {
    window.location.href = "https://www.google.com";
  };

  if (verified !== false) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-desc"
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
            Age verification
          </p>
        </div>

        <div className="space-y-5 p-6 md:p-8">
          <h2 id="age-gate-title" className="font-display text-3xl leading-tight text-foreground md:text-4xl">
            Before you enter
          </h2>

          <p id="age-gate-desc" className="text-sm leading-relaxed text-muted-foreground">
            This site sells research peptides for in vitro laboratory use only.
            Not for human consumption. Please confirm both statements below to
            continue.
          </p>

          <div className="space-y-4 rounded-md border border-border bg-muted/20 p-4">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground">
              <Checkbox
                checked={ageOk}
                onCheckedChange={(v) => setAgeOk(v === true)}
                className="mt-0.5"
                aria-label="Age confirmation"
              />
              <span>
                I am 21 or older and agree to the terms of use.
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground">
              <Checkbox
                checked={researcherOk}
                onCheckedChange={(v) => setResearcherOk(v === true)}
                className="mt-0.5"
                aria-label="Researcher confirmation"
              />
              <span>
                I confirm I am a qualified researcher purchasing for in vitro /
                laboratory research only — not for human or veterinary use.
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={confirm}
              disabled={!canEnter}
              className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-primary"
            >
              Enter
            </button>
            <button
              onClick={decline}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted"
            >
              No, take me back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
