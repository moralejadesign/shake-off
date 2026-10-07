"use client";

import { motion, type PanInfo } from "motion/react";
import { AnswerOverlay } from "@/components/AnswerOverlay/AnswerOverlay";
import { INTRO } from "@/components/Scene/introTimeline";
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

export function BallPair({ shake, answer, onShake }: BallPairProps) {
  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    const speed = Math.hypot(info.velocity.x, info.velocity.y);
    if (speed > FLICK_SPEED) onShake(Math.min(1, Math.max(0.4, speed / 2500)));
  };

  return (
    // The wrapper ignores pointers so only the balls themselves start a tap or drag.
    <motion.div
      className="pointer-events-none absolute inset-0"
      drag
      dragSnapToOrigin
      dragElastic={0.35}
      onTap={() => onShake(0.6)}
      onDragEnd={handleDragEnd}
    >
      <Ball
        src="/magicball-back.png"
        delay={INTRO.ballBack}
        fromX={60}
        floatOffset={10}
        shake={shake}
        rattle={1}
        className="top-[14.5%] left-[40%] w-[49%]"
      >
        <AnswerOverlay answer={answer} />
      </Ball>
      <Ball
        src="/magicball-front.png"
        delay={INTRO.ballFront}
        fromX={-60}
        floatOffset={14}
        shake={shake}
        rattle={-1.2}
        className="top-0 left-[7.9%] w-[50.4%]"
      />
    </motion.div>
  );
}
