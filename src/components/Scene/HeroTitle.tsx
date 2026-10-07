"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { INTRO } from "./introTimeline";

type HeroTitleProps = {
  // The title sits high while the sheep talks and moves to the middle, behind the balls, for shaking.
  stage: "intro" | "shake";
  // Fades the title out so it does not compete with the meme in the ball window.
  dimmed: boolean;
};

export function HeroTitle({ stage, dimmed }: HeroTitleProps) {
  const reduced = useReducedMotion() ?? false;
  const position = stage === "intro" ? "top-[14svh] md:top-[12.75cqw]" : "top-[14svh] md:top-[20cqw]";

  return (
    <motion.h1
      className={`pointer-events-none absolute left-[4vw] w-[92vw] transition-[top,opacity] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] md:left-[7.5cqw] md:w-[85.75cqw] ${position}`}
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
        src="/shake-off-title.png"
        alt="Shake Off"
        width={1650}
        height={332}
        preload
        sizes="(min-width: 768px) 86vw, 92vw"
        className="h-auto w-full"
      />
    </motion.h1>
  );
}
