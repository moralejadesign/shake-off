"use client";

import { motion } from "motion/react";
import { INTRO } from "./introTimeline";

const label = "absolute z-30 text-[clamp(10px,0.75vw,15px)] font-medium tracking-[0.25em] uppercase";

export function CornerLabels() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: INTRO.labels }}
    >
      <p className={`${label} top-[clamp(16px,4.4svh,50px)] left-[clamp(16px,2vw,40px)]`}>Shake Off</p>
      {/* Opens in a new tab so the current meme is not lost. */}
      <a
        href="https://moraleja.co/"
        target="_blank"
        rel="noopener"
        className={`${label} top-[clamp(16px,4.4svh,50px)] right-[clamp(16px,2.25vw,45px)] underline-offset-4 transition hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`}
      >
        Build by moraleja.co
      </a>
      <p className={`${label} right-[clamp(16px,2.25vw,45px)] bottom-[clamp(16px,4svh,45px)]`}>
        V 0.1 // 2026
      </p>
    </motion.div>
  );
}
