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
      <p className={`${label} top-[clamp(16px,4.4svh,50px)] right-[clamp(16px,2.25vw,45px)]`}>
        Build by moraleja.co
      </p>
      <p className={`${label} right-[clamp(16px,2.25vw,45px)] bottom-[clamp(16px,4svh,45px)]`}>
        V 0.1 // 2026
      </p>
    </motion.div>
  );
}
