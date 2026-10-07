"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { INTRO, enterTransition } from "@/components/Scene/introTimeline";

// The dalmatian on the start screen. Stands where the sheep will, and drops out
// when the start tap hands over to the sheep's intro.
export function DogGreeter() {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      className="absolute -bottom-[8svh] left-1/2 aspect-[1085/1450] h-[60svh] -translate-x-1/2 md:top-[22.95cqw] md:bottom-auto md:left-[36.5cqw] md:h-auto md:w-[31cqw] md:translate-x-0"
      initial={{ opacity: 0, y: "30%" }}
      animate={{ opacity: 1, y: "0%" }}
      exit={{ opacity: 0, y: "75%", transition: { duration: 0.45, ease: [0.55, 0, 1, 0.45] } }}
      transition={enterTransition(INTRO.dog, reduced)}
    >
      <Image src="/dog-ball.png" alt="" fill preload sizes="(min-width: 768px) 31vw, 46svh" className="object-contain" />
    </motion.div>
  );
}
