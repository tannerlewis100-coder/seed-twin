import { useEffect, useState } from "react";
import { FlaskConical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import promoVials from "@/assets/promo-vials.png";

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
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-desc"
    >
      <div className="relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-xl border border-border bg-card shadow-2xl md:max-w-2xl md:overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Visual panel */}
          <div className="relative w-full overflow-hidden bg-black aspect-[4/3] md:aspect-auto md:min-h-[480px]">
            <img
              src={promoVials}
              alt="Clarum research peptide vials"
              className="h-full w-full object-cover opacity-60 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent md:bg-gradient-to-r" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-background/80 backdrop-blur-sm">
                <FlaskConical className="h-5 w-5 text-primary" />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Clarum Lab System
              </span>
            </div>
          </div>

          {/* Content panel */}
          <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
            <div>
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                Lab access
              </span>
              <h2
                id="age-gate-title"
                className="mb-3 font-display text-3xl leading-[0.95] text-foreground md:text-4xl"
              >
                For researchers.
              </h2>
              <p
                id="age-gate-desc"
                className="text-xs leading-relaxed text-muted-foreground"
              >
                This site sells research peptides for in vitro laboratory use
                only. Not for human or veterinary use. Confirm both statements
                below to enter.
              </p>

              <div className="mt-6 space-y-3">
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-foreground">
                  <Checkbox
                    checked={ageOk}
                    onCheckedChange={(v) => setAgeOk(v === true)}
                    className="mt-0.5 border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                    aria-label="Age confirmation"
                  />
                  <span>
                    I am 21 or older and agree to the terms of use.
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-foreground">
                  <Checkbox
                    checked={researcherOk}
                    onCheckedChange={(v) => setResearcherOk(v === true)}
                    className="mt-0.5 border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                    aria-label="Researcher confirmation"
                  />
                  <span>
                    I confirm I am a qualified researcher purchasing for in
                    vitro / laboratory research only — not for human or
                    veterinary use.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <button
                onClick={confirm}
                disabled={!canEnter}
                className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
              >
                Enter
              </button>
              <button
                onClick={decline}
                className="text-[11px] font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
              >
                No, take me back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
