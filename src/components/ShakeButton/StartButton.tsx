"use client";

import { motion, useReducedMotion } from "motion/react";
import { INTRO } from "@/components/Scene/introTimeline";
import { glassBar, glassButtonActive } from "@/lib/buttonClasses";
import { startAudio } from "@/lib/sound";

// The first tap. Browsers only allow sound after one, so it unlocks the music
// and effects, then hands over to the sheep's intro.
export function StartButton({ onStart }: { onStart: () => void }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      className={`absolute bottom-[8svh] left-1/2 z-30 -translate-x-1/2 md:bottom-[6svh] ${glassBar}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12, transition: { duration: 0.25 } }}
      transition={{ duration: 0.5, delay: reduced ? 0.4 : INTRO.startButton }}
    >
      <button
        type="button"
        autoFocus
        onClick={() => {
          startAudio();
          onStart();
        }}
        className={glassButtonActive}
      >
        Tap to start
      </button>
    </motion.div>
  );
}
