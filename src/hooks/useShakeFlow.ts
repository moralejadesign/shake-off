"use client";

import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { pickAnswer } from "@/lib/pickAnswer";
import type { Answer } from "@/lib/types";

// idle -> shaking (balls rattle) -> revealing (meme in the ball window) -> card
export type ShakePhase = "idle" | "shaking" | "revealing" | "card";

// Each shake bumps `id`, which is what the balls react to.
export type ShakeSignal = { id: number; intensity: number };

export const SHAKE_TIMING = {
  settleMs: 1000,
  holdMs: 1100,
  reducedSettleMs: 300,
  reducedHoldMs: 500,
} as const;

export function useShakeFlow(answers: readonly Answer[]) {
  const reduced = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<ShakePhase>("idle");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [shake, setShake] = useState<ShakeSignal>({ id: 0, intensity: 0 });
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const busy = phase === "shaking" || phase === "revealing";

  const trigger = useCallback(
    (intensity: number) => {
      if (busy) return;
      clearTimers();
      const settle = reduced ? SHAKE_TIMING.reducedSettleMs : SHAKE_TIMING.settleMs;
      const hold = reduced ? SHAKE_TIMING.reducedHoldMs : SHAKE_TIMING.holdMs;

      setAnswer((last) => pickAnswer(answers, last?.id ?? null));
      setShake((last) => ({ id: last.id + 1, intensity }));
      setPhase("shaking");
      timers.current = [
        window.setTimeout(() => setPhase("revealing"), settle),
        window.setTimeout(() => setPhase("card"), settle + hold),
      ];
    },
    [answers, busy, reduced],
  );

  const close = useCallback(() => {
    clearTimers();
    setPhase("idle");
  }, []);

  return { phase, answer, shake, busy, trigger, close };
}
