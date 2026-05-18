import vial1 from "@/assets/vial/vial-1.png";

// True turntable rotation isn't possible from 4 still photos without
// faking it via crossfade/morph. Per product direction, we render the
// front frame as a clean static PNG until a real frame sequence or 3D
// asset is available.
type Props = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeClasses: Record<NonNullable<Props["size"]>, string> = {
  sm: "w-44 h-44",
  md: "w-60 h-60",
  lg: "w-72 h-72",
  xl: "w-80 h-80",
};

export default function Vial360({ size = "md", className = "" }: Props) {
  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <img
        src={vial1}
        alt=""
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain select-none"
        style={{ filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))" }}
      />
    </div>
  );
}
