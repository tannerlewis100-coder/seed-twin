"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
  textClassName?: string;
}

export function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className,
  textClassName,
}: GooeyTextProps) {
  const filterId = React.useId().replace(/:/g, "");
  const text1Ref = React.useRef<HTMLSpanElement>(null);
  const text2Ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (texts.length === 0) {
      return;
    }

    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;
    let rafId = 0;

    const setMorph = (fraction: number) => {
      if (text1Ref.current && text2Ref.current) {
        const safeFraction = Math.max(fraction, 0.0001);

        text2Ref.current.style.filter = `blur(${Math.min(8 / safeFraction - 8, 100)}px)`;
        text2Ref.current.style.opacity = `${Math.pow(safeFraction, 0.4) * 100}%`;

        const inverseFraction = Math.max(1 - fraction, 0.0001);
        text1Ref.current.style.filter = `blur(${Math.min(8 / inverseFraction - 8, 100)}px)`;
        text1Ref.current.style.opacity = `${Math.pow(inverseFraction, 0.4) * 100}%`;
      }
    };

    const doCooldown = () => {
      morph = 0;
      if (text1Ref.current && text2Ref.current) {
        text2Ref.current.style.filter = "";
        text2Ref.current.style.opacity = "100%";
        text1Ref.current.style.filter = "";
        text1Ref.current.style.opacity = "0%";
      }
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    };

    if (text1Ref.current && text2Ref.current) {
      text1Ref.current.textContent = texts[textIndex % texts.length];
      text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
    }

    function animate() {
      rafId = requestAnimationFrame(animate);
      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex = (textIndex + 1) % texts.length;
          if (text1Ref.current && text2Ref.current) {
            text1Ref.current.textContent = texts[textIndex % texts.length];
            text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
          }
        }
        doMorph();
      } else {
        doCooldown();
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [texts, morphTime, cooldownTime]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-visible px-[0.16em] py-[0.32em]",
        className,
      )}
    >
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter
            id={filterId}
            x="-35%"
            y="-90%"
            width="170%"
            height="280%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="grid min-h-[1.2em] w-full place-items-center overflow-visible"
        style={{ filter: `url(#${filterId})` }}
      >
        <span
          ref={text1Ref}
          className={cn(
            "col-start-1 row-start-1 inline-block whitespace-nowrap px-[0.12em] text-center text-6xl leading-[0.88] text-foreground transition-opacity md:text-[60pt]",
            textClassName,
          )}
        />
        <span
          ref={text2Ref}
          className={cn(
            "col-start-1 row-start-1 inline-block whitespace-nowrap px-[0.12em] text-center text-6xl leading-[0.88] text-foreground md:text-[60pt]",
            textClassName,
          )}
        />
      </div>
    </div>
  );
}
