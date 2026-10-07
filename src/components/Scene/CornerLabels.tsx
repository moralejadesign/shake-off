"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { SoundToggle } from "@/components/SoundToggle/SoundToggle";
import { INTRO } from "./introTimeline";

const label = "text-[clamp(10px,0.75vw,15px)] font-medium uppercase";
const link =
  "rounded-sm transition hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
const top = "top-[clamp(16px,4.4svh,50px)]";
const left = "left-[clamp(16px,2.75vw,55px)]";
const right = "right-[clamp(16px,2vw,40px)]";
const bottom = "bottom-[clamp(14px,3.5svh,40px)]";

// Corner credits, after the owner's reference. Desktop: "Shake Off" top left, the IAF
// symbol top center, the sessions link top right, the for human x moraleja.co logos
// bottom left, the version and sound button bottom right. Phones drop the "Shake Off"
// label (the title already says it) and move the IAF symbol to the top left so the row fits.
export function CornerLabels() {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-30 [&_a]:pointer-events-auto [&_button]:pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: INTRO.labels }}
    >
      <p className={`${label} absolute hidden tracking-[0.25em] md:block ${top} ${left}`}>Shake Off</p>

      <Image
        src="/iaf-symbol.png"
        alt="IAF"
        width={730}
        height={218}
        className={`absolute top-[clamp(12px,3svh,30px)] h-[clamp(22px,3.6svh,40px)] w-auto ${left} md:left-1/2 md:-translate-x-1/2`}
      />

      <a
        href="https://sessions.forhuman.studio/"
        target="_blank"
        rel="noopener"
        className={`${label} ${link} absolute tracking-[0.12em] md:tracking-[0.18em] ${top} ${right}`}
      >
        → sessions.forhuman.studio/
      </a>

      <div className={`absolute flex items-center gap-[clamp(8px,0.9vw,16px)] ${bottom} ${left}`}>
        <a href="http://forhuman.studio/" target="_blank" rel="noopener" className={link}>
          <Image src="/forhuman-logo.svg" alt="for human" width={211} height={35} unoptimized className="h-[clamp(16px,2.8svh,32px)] w-auto" />
        </a>
        <span aria-hidden className="text-[clamp(9px,0.7vw,13px)]">
          x
        </span>
        <a href="https://moraleja.co/" target="_blank" rel="noopener" className={link}>
          <Image src="/moraleja-logo.svg" alt="moraleja.co" width={151} height={32} unoptimized className="h-[clamp(16px,2.8svh,32px)] w-auto" />
        </a>
      </div>

      <div className={`absolute flex items-center gap-[clamp(10px,1vw,18px)] ${bottom} ${right}`}>
        <p className={`${label} hidden tracking-[0.25em] md:block`}>V 0.1 // 2026</p>
        <SoundToggle />
      </div>
    </motion.div>
  );
}
