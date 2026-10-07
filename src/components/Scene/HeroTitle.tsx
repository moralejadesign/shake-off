"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { INTRO } from "./introTimeline";

// `dimmed` fades the title out so it does not cover the meme in the ball window.
export function HeroTitle({ dimmed }: { dimmed: boolean }) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.h1
      className="pointer-events-none absolute top-[32.4%] left-0 z-10 w-full transition-opacity duration-500"
      style={{ opacity: dimmed ? 0 : 1 }}
      // Wipes left to right so the script reads as if it were being written.
      // Both paths end on the same state: the server renders the wipe's start before
      // the reduced motion preference is known, so the clip must always open.
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0% 0 0)" }}
      transition={
        reduced
          ? { duration: 0.3, delay: INTRO.title * 0.25 }
          : { duration: 1.1, delay: INTRO.title, ease: [0.65, 0, 0.35, 1] }
      }
    >
      <Image
        src="/shake-off.png"
        alt="Shake Off"
        width={1165}
        height={336}
        preload
        sizes="(min-width: 768px) 60vw, 94vw"
        className="h-auto w-full"
      />
    </motion.h1>
  );
}
