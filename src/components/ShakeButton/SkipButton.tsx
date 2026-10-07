"use client";

import { motion, useReducedMotion } from "motion/react";
import { INTRO } from "@/components/Scene/introTimeline";
import { glassBar, glassButton } from "@/lib/buttonClasses";

// Lets people jump past the sheep's intro straight to shaking.
export function SkipButton({ onSkip }: { onSkip: () => void }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      className={`absolute bottom-[8svh] left-1/2 z-30 -translate-x-1/2 md:bottom-[6svh] ${glassBar}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12, transition: { duration: 0.25 } }}
      transition={{ duration: 0.5, delay: reduced ? 0.5 : INTRO.skip }}
    >
      <button type="button" onClick={onSkip} className={glassButton}>
        Skip
      </button>
    </motion.div>
  );
}
