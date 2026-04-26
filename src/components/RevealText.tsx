import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Per-word stagger in ms */
  stagger?: number;
  /** Initial delay before the first word animates */
  delay?: number;
  /** Optional trailing children rendered after the words (e.g. a period or icon) */
  children?: ReactNode;
};

/**
 * Splits `text` into words and reveals them one-by-one when the element
 * scrolls into view. SSR-safe: words render immediately in the markup; the
 * hidden state and reveal animation are applied client-side only.
 */
export default function RevealText({
  text,
  as: Tag = "span",
  className,
  stagger = 35,
  delay = 0,
  children,
}: RevealTextProps) {
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
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Preserve newlines, then split into words while keeping line breaks.
  const lines = text.split("\n");

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      className={className}
      data-revealed={!mounted || revealed ? "true" : "false"}
    >
      {lines.map((line, lineIdx) => {
        const words = line.split(/(\s+)/); // keep spaces so layout is identical
        return (
          <span key={lineIdx}>
            {words.map((word, wordIdx) => {
              if (/^\s+$/.test(word)) return <span key={wordIdx}>{word}</span>;
              const totalIdx =
                lines.slice(0, lineIdx).reduce(
                  (acc, l) => acc + l.split(/\s+/).filter(Boolean).length,
                  0,
                ) + words.slice(0, wordIdx).filter((w) => !/^\s+$/.test(w)).length;
              return (
                <span
                  key={wordIdx}
                  className="reveal-word"
                  style={{ transitionDelay: `${delay + totalIdx * stagger}ms` }}
                >
                  {word}
                </span>
              );
            })}
            {lineIdx < lines.length - 1 && <br />}
          </span>
        );
      })}
      {children}
    </Tag>
  );
}
