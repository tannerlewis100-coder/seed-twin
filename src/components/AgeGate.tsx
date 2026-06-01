import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

const STORAGE_KEY = "clarum_age_verified";

export function AgeGate() {
  const [verified, setVerified] = useState<boolean | null>(null);

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
      aria-label="Age verification"
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-6 py-4">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
            Age verification
          </p>
        </div>

        <div className="space-y-5 p-6 md:p-8">
          <h2 className="font-display text-3xl leading-tight text-foreground md:text-4xl">
            Are you 21 or older?
          </h2>

          <p className="text-sm leading-relaxed text-muted-foreground">
            This site sells research peptides for in vitro laboratory use only.
            Not for human consumption. By entering, you confirm you're at least 18
            and agree to our terms.
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={confirm}
              className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Yes, I'm 21 or older
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
