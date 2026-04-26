import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealOnScrollProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Initial delay in ms */
  delay?: number;
};

/**
 * Wraps any block (card, image, button row) and fades + rises it into view
 * the first time it intersects the viewport. SSR-safe.
 */
export default function RevealOnScroll({
  children,
  as: Tag = "div",
  className,
  delay = 0,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      className={`reveal-block ${className ?? ""}`}
      data-revealed={!mounted || revealed ? "true" : "false"}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
