import { useEffect, useRef, useState } from "react";
import type { WooProduct } from "@/lib/woo";
import {
  formatStartingPrice,
  loadStartingPrice,
  peekStartingPrice,
  startingPriceForSimple,
  type StartingPrice,
} from "@/lib/variationPricing";

/**
 * Resolves the advertised starting price for a card. Variable products load
 * their variation summary once (shared cache, bounded concurrency) and only
 * when the card scrolls into view; until then the caller shows a neutral
 * label instead of the parent range, which can start at a sold-out size.
 */
export function useStartingPrice(product: WooProduct) {
  const ref = useRef<HTMLElement | null>(null);
  const isVariable = product.type === "variable" && (product.variations?.length ?? 0) > 0;
  const [price, setPrice] = useState<StartingPrice>(() =>
    isVariable
      ? peekStartingPrice(product.id) ?? { state: "unknown" }
      : startingPriceForSimple(product),
  );

  useEffect(() => {
    if (!isVariable) {
      setPrice(startingPriceForSimple(product));
      return;
    }
    const known = peekStartingPrice(product.id);
    if (known) {
      setPrice(known);
      return;
    }
    setPrice({ state: "unknown" });

    let cancelled = false;
    const fetchNow = () => {
      loadStartingPrice(product.id).then((p) => {
        if (!cancelled) setPrice(p);
      });
    };

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      fetchNow();
      return () => {
        cancelled = true;
      };
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          fetchNow();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [product, product.id, isVariable]);

  return { ref, price, label: formatStartingPrice(price) };
}
