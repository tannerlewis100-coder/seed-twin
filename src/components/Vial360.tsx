import { useEffect } from "react";
import vial1 from "@/assets/vial/vial-1.png";
import vial2 from "@/assets/vial/vial-2.png";
import vial3 from "@/assets/vial/vial-3.png";
import vial4 from "@/assets/vial/vial-4.png";

// Order: front -> right 3/4 -> back -> left 3/4 (continuous spin)
const FRAMES = [vial1, vial2, vial3, vial4];

type Props = {
  size?: "sm" | "md" | "lg" | "xl";
  /** Animation duration in ms for one full 360° */
  duration?: number;
  /**
   * Tailwind "group/<name>" hover scope that controls play state.
   * Defaults to the component's own hover (group/vial).
   */
  hoverGroup?: string;
  className?: string;
};

const sizeClasses: Record<NonNullable<Props["size"]>, string> = {
  sm: "w-40 h-56",
  md: "w-56 h-72",
  lg: "w-72 h-96",
  xl: "w-80 h-[26rem]",
};

export default function Vial360({
  size = "md",
  duration = 3200,
  hoverGroup = "vial",
  className = "",
}: Props) {
  // Preload remaining frames so the first hover doesn't pop
  useEffect(() => {
    FRAMES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Tailwind v4 supports arbitrary variants like group-hover/<name>
  const playClass = `[animation-play-state:paused] group-hover/${hoverGroup}:[animation-play-state:running]`;

  return (
    <div className={`group/vial relative ${sizeClasses[size]} ${className}`}>
      {FRAMES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          draggable={false}
          className={`absolute inset-0 w-full h-full object-contain select-none ${playClass}`}
          style={{
            opacity: i === 0 ? 1 : 0,
            animation: `vial-spin ${duration}ms linear infinite`,
            animationDelay: `${(i * duration) / FRAMES.length}ms`,
            filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.55))",
          }}
        />
      ))}
    </div>
  );
}
