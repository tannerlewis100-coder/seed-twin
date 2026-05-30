import * as React from "react";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

function GooeyTextDemo() {
  return (
    <div className="flex min-h-[220px] items-center justify-center overflow-visible px-6 py-10">
      <GooeyText
        texts={["CLARUM", "PURITY", "TESTED", "TRUSTED"]}
        className="min-h-[1.4em] w-full max-w-4xl"
        textClassName="font-display text-center !text-[clamp(3rem,10vw,7rem)] leading-[0.88]"
      />
    </div>
  );
}

export { GooeyTextDemo };