const FREE_SHIPPING_THRESHOLD = 150;

type Props = {
  /** Current subtotal used to compute progress. */
  subtotal: number;
  /** Wrap in a subtle rounded container (cart) vs. bare block (product page). */
  boxed?: boolean;
  /** Copy shown when the cart is empty (subtotal is 0). Defaults to the "away from" line. */
  emptyMessage?: string;
  /** Copy shown once the threshold is met. */
  unlockedMessage?: string;
  /** Tailwind height class for the bar. */
  barClassName?: string;
  className?: string;
};

export function FreeShippingProgress({
  subtotal,
  boxed = false,
  emptyMessage,
  unlockedMessage = "🎉 You've unlocked free shipping!",
  barClassName = "h-1.5",
  className = "",
}: Props) {
  const value = Math.max(0, subtotal);
  const unlocked = value >= FREE_SHIPPING_THRESHOLD;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - value);
  const pct = unlocked ? 100 : Math.min(100, (value / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div
      className={`${
        boxed ? "rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3" : ""
      } ${className}`}
    >
      <p className="text-[12px] leading-snug text-foreground/70">
        {unlocked ? (
          <span className="text-brand-gold">{unlockedMessage}</span>
        ) : value === 0 && emptyMessage ? (
          <>{emptyMessage}</>
        ) : (
          <>
            Only{" "}
            <span className="font-semibold text-brand-gold">${remaining.toFixed(2)}</span> away from
            free shipping!
          </>
        )}
      </p>

      <div
        className={`mt-2 ${barClassName} w-full overflow-hidden rounded-full bg-black/40 ring-1 ring-inset ring-white/5`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={FREE_SHIPPING_THRESHOLD}
        aria-valuenow={Math.min(value, FREE_SHIPPING_THRESHOLD)}
        aria-label="Progress toward free shipping"
      >
        <div
          className="h-full rounded-full bg-brand-gold transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
