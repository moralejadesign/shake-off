"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { enterTransition } from "@/components/Scene/introTimeline";

type SpeechBubbleProps = {
  heading?: string;
  children: ReactNode;
  delay: number;
  // Side the bubble grows from, toward its character.
  origin: "left" | "right";
  className: string;
};

export function SpeechBubble({ heading, children, delay, origin, className }: SpeechBubbleProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      className={`absolute w-max max-w-[min(62vw,22em)] rounded-[0.6em] border-[1.5px] border-white bg-black/10 text-center text-[clamp(10px,0.78vw,16px)] leading-snug font-bold tracking-[0.06em] uppercase backdrop-blur-[2px] ${className}`}
      style={{ transformOrigin: origin === "left" ? "0% 50%" : "100% 50%" }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={enterTransition(delay, reduced)}
    >
      {heading && (
        <p className="border-b-[1.5px] border-white/80 px-[1.4em] py-[0.55em] text-[1.1em] tracking-[0.18em]">
          {heading}
        </p>
      )}
      <p className="px-[1.4em] py-[0.6em]">{children}</p>
    </motion.div>
  );
}
