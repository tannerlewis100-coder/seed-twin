import { useId, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Accessible collapsible row. Button semantics give Enter/Space, focus ring
 * and aria-expanded/aria-controls for free.
 */
export function Disclosure({
  open,
  onToggle,
  label,
  sublabel,
  right,
  children,
  variant = "row",
}: {
  open: boolean;
  onToggle: () => void;
  label: ReactNode;
  sublabel?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  variant?: "row" | "panel";
}) {
  const id = useId();
  const panelId = `disclosure-panel-${id}`;
  const buttonId = `disclosure-button-${id}`;

  return (
    <div
      className={
        variant === "row"
          ? "border-t border-white/10 last:border-b"
          : "rounded-3xl border border-brand-gold/15 bg-card overflow-hidden"
      }
    >
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={`w-full min-h-[52px] flex items-center justify-between gap-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus-visible:ring-offset-0 ${
          variant === "row"
            ? "py-5 px-1 hover:text-brand-gold"
            : "py-5 px-6 sm:px-8 hover:bg-white/[0.02]"
        }`}
      >
        <span className="min-w-0 flex-1">
          <span
            className={
              variant === "row"
                ? "block text-[11px] uppercase tracking-[0.22em] font-semibold text-foreground/80"
                : "block font-display text-base sm:text-lg text-foreground"
            }
          >
            {label}
          </span>
          {sublabel && <span className="block mt-1">{sublabel}</span>}
        </span>
        <span className="flex items-center gap-3 shrink-0">
          {right}
          <ChevronDown
            aria-hidden
            className={`h-4 w-4 text-foreground/50 motion-safe:transition-transform motion-safe:duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className={
          variant === "row" ? "pb-6 px-1 text-sm text-foreground/70" : "px-6 sm:px-8 pb-8"
        }
      >
        {open && children}
      </div>
    </div>
  );
}
