"use client";

import { motion, type PanInfo } from "motion/react";
import { AnswerOverlay } from "@/components/AnswerOverlay/AnswerOverlay";
import { SHAKE_STAGE } from "@/components/Scene/introTimeline";
import type { ShakeSignal } from "@/hooks/useShakeFlow";
import type { Answer } from "@/lib/types";
import { Ball } from "./Ball";

type BallPairProps = {
  shake: ShakeSignal;
  // The meme shown in the back ball's window, or null.
  answer: Answer | null;
  onShake: (intensity: number) => void;
};

// A flick faster than this (px/s) counts as a shake.
const FLICK_SPEED = 400;

// Positions follow the owner's shake screen reference: the "8" ball large on the
// left, the back ball behind it on the right. On reveal the "8" ball slides away
// so the back ball can come forward and show the meme in its window.
export function BallPair({ shake, answer, onShake }: BallPairProps) {
  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    const speed = Math.hypot(info.velocity.x, info.velocity.y);
    if (speed > FLICK_SPEED) onShake(Math.min(1, Math.max(0.4, speed / 2500)));
  };
  const revealed = answer !== null;

  return (
    // The wrapper ignores pointers so only the balls themselves start a tap or drag.
    <motion.div
      className="pointer-events-none absolute inset-0 z-10"
      drag
      dragSnapToOrigin
      dragElastic={0.35}
      onTap={() => onShake(0.7)}
      onDragEnd={handleDragEnd}
    >
      <Ball
        src="/magicball-back.png"
        delay={SHAKE_STAGE.ballBack}
        side={1}
        floatOffset={16}
        shake={shake}
        rattle={1}
        revealed={revealed}
        reveal={{ opacity: 1, x: "-22%", y: "-6%", scale: 1.12, rotate: 0 }}
        className="top-[33svh] left-[38vw] w-[56vw] md:top-[16.7cqw] md:left-[43.75cqw] md:w-[30.5cqw]"
      >
        <AnswerOverlay answer={answer} />
      </Ball>
      <Ball
        src="/magicball-front.png"
        delay={SHAKE_STAGE.ballFront}
        side={-1}
        floatOffset={22}
        shake={shake}
        rattle={-1.2}
        revealed={revealed}
        reveal={{ opacity: 1, x: "-48%", y: "10%", scale: 0.82, rotate: -18 }}
        className="top-[26svh] left-[4vw] w-[68vw] md:top-[8.75cqw] md:left-[25.55cqw] md:w-[36.6cqw]"
      />
    </motion.div>
  );
}
