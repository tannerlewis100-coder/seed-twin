import { useEffect } from "react";
import vial1 from "@/assets/vial/vial-1.png";
import vial2 from "@/assets/vial/vial-2.png";
import vial3 from "@/assets/vial/vial-3.png";
import vial4 from "@/assets/vial/vial-4.png";

// Normalized turntable: 0°, 90°, 180°, 270°. Same vial height, same center,
// true alpha. Crossfade between the four so there's no zoom or wobble.
const FRAMES = [vial1, vial2, vial3, vial4];

type Props = {
  size?: "sm" | "md" | "lg" | "xl";
  /** Full 360° duration in ms */
  duration?: number;
  className?: string;
};

const sizeClasses: Record<NonNullable<Props["size"]>, string> = {
  sm: "w-44 h-44",
  md: "w-60 h-60",
  lg: "w-72 h-72",
  xl: "w-80 h-80",
};

/**
 * Spins only while a parent with `group/card` is hovered.
 */
export default function Vial360({ size = "md", duration = 4800, className = "" }: Props) {
  useEffect(() => {
    FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {FRAMES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain select-none [animation-play-state:paused] group-hover/card:[animation-play-state:running]"
          style={{
            opacity: i === 0 ? 1 : 0,
            animation: `vial-spin ${duration}ms linear infinite`,
            animationDelay: `${-((FRAMES.length - i) * (duration / FRAMES.length))}ms`,
            filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))",
          }}
        />
      ))}
    </div>
  );
}
