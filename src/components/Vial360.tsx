import { useEffect, useRef, useState } from "react";
import vial1 from "@/assets/vial/vial-1.png";
import vial2 from "@/assets/vial/vial-2.png";
import vial3 from "@/assets/vial/vial-3.png";
import vial4 from "@/assets/vial/vial-4.png";

// Order: front -> right 3/4 -> back -> left 3/4 (continuous spin)
const FRAMES = [vial1, vial2, vial3, vial4];

type Props = {
  size?: "sm" | "lg";
  intervalMs?: number;
  className?: string;
};

const sizeClasses: Record<NonNullable<Props["size"]>, string> = {
  sm: "w-32 h-44",
  lg: "w-44 h-60",
};

export default function Vial360({ size = "sm", intervalMs = 180, className = "" }: Props) {
  const [frame, setFrame] = useState(0);
  const [active, setActive] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Preload
  useEffect(() => {
    FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Respect reduced motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setActive(false);
    const handler = (e: MediaQueryListEvent) => setActive(!e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Pause when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % FRAMES.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [active, intervalMs]);

  return (
    <div
      ref={containerRef}
      className={`relative ${sizeClasses[size]} ${className}`}
    >
      {FRAMES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          draggable={false}
          className={`absolute inset-0 w-full h-full object-contain select-none transition-opacity duration-100 ${
            i === frame ? "opacity-100" : "opacity-0"
          }`}
          style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.45))" }}
        />
      ))}
    </div>
  );
}
