"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SQRT_5000 = Math.sqrt(5000);

const defaultTestimonials = [
  {
    tempId: 0,
    testimonial:
      "I can verify the exact batch I received against the actual Eurofins report. That alone was worth switching vendors.",
    by: "Dr. M. Reyes, Independent Researcher",
    imgSrc: "https://i.pravatar.cc/150?img=12",
  },
  {
    tempId: 1,
    testimonial:
      "Clean documentation, traceable batches, accreditation that holds up. We've standardized on Clarum for our reference work.",
    by: "K. Larsen, Lab Director",
    imgSrc: "https://i.pravatar.cc/150?img=15",
  },
  {
    tempId: 2,
    testimonial:
      "Consistent purity across batches and COAs that read like real lab reports. Exactly what an analytical workflow needs.",
    by: "S. Whitfield, Bench Scientist",
    imgSrc: "https://i.pravatar.cc/150?img=5",
  },
  {
    tempId: 3,
    testimonial:
      "Scanned the QR on the vial and pulled the actual chromatogram from a lab I can google. That should not feel novel, but it does.",
    by: "Dr. A. Petrov, Principal Investigator",
    imgSrc: "https://i.pravatar.cc/150?img=33",
  },
  {
    tempId: 4,
    testimonial:
      "GHK-Cu arrived Tuesday. The COA was already published before the box hit my desk. Endotoxin under 1 EU/mg. Clean.",
    by: "J. Okafor, Analytical Chemist",
    imgSrc: "https://i.pravatar.cc/150?img=52",
  },
  {
    tempId: 5,
    testimonial:
      "Three batches of BPC-157 over four months, HPLC traces within a hair of each other. Reproducibility starts here.",
    by: "Prof. L. Tanaka, University Lab",
    imgSrc: "https://i.pravatar.cc/150?img=47",
  },
  {
    tempId: 6,
    testimonial:
      "The public COA library was the deciding factor. Transparency before the sale tells me how they'll behave after it.",
    by: "R. Almeida, Research Coordinator",
    imgSrc: "https://i.pravatar.cc/150?img=68",
  },
];

interface Testimonial {
  tempId: number;
  testimonial: string;
  by: string;
  imgSrc: string;
}

interface TestimonialCardProps {
  position: number;
  testimonial: Testimonial;
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize,
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter
          ? "z-10 bg-brand-gold text-brand-forest-deep border-brand-gold"
          : "z-0 bg-zinc-950 text-foreground border-white/10 hover:border-brand-gold/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px hsl(var(--border))" : "none",
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-white/10"
        style={{ right: -2, top: 48, width: SQRT_5000, height: 2 }}
      />
      <img
        src={testimonial.imgSrc}
        alt={testimonial.by.split(",")[0]}
        className="mb-4 h-14 w-12 bg-muted object-cover object-top"
        style={{ boxShadow: "3px 3px 0px hsl(var(--background))" }}
      />
      <h3
        className={cn(
          "text-base sm:text-lg font-medium leading-snug",
          isCenter ? "text-brand-forest-deep" : "text-foreground"
        )}
      >
        "{testimonial.testimonial}"
      </h3>
      <p
        className={cn(
          "absolute bottom-8 left-8 right-8 mt-2 text-sm italic",
          isCenter ? "text-brand-forest-deep/75" : "text-foreground/55"
        )}
      >
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC<{ items?: Testimonial[] }> = ({
  items = defaultTestimonials,
}) => {
  const [cardSize, setCardSize] = useState(300);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(items);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 300 : 240);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 460 }}>
      {testimonialsList.map((testimonial, index) => {
        const position =
          testimonialsList.length % 2
            ? index - (testimonialsList.length + 1) / 2
            : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-11 w-11 items-center justify-center text-xl transition-colors",
            "bg-background border-2 border-white/10 text-foreground hover:bg-brand-gold hover:text-brand-forest-deep hover:border-brand-gold",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-11 w-11 items-center justify-center text-xl transition-colors",
            "bg-background border-2 border-white/10 text-foreground hover:bg-brand-gold hover:text-brand-forest-deep hover:border-brand-gold",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
