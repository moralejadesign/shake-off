import type { Transition } from "motion/react";

// Start times in seconds from page load: the scene, the title, the dog, then the start button.
export const INTRO = {
  background: 0,
  labels: 0.3,
  title: 0.5,
  dog: 1.1,
  startButton: 1.8,
} as const;

// Start times in seconds from the start tap: the sheep, then its speech bubble.
export const TALK = {
  sheep: 0.35,
  bubble: 1.05,
  skip: 1.5,
} as const;

// Start times in seconds for the shake stage, counted from when the sheep leaves.
export const SHAKE_STAGE = {
  ballBack: 0.35,
  ballFront: 0.5,
  idle: 1.6,
  shakeButton: 1.1,
} as const;

// With reduced motion the sequence keeps its order but plays as quick fades.
export function enterTransition(delay: number, reduced: boolean): Transition {
  if (reduced) return { duration: 0.3, delay: delay * 0.25 };
  return { type: "spring", stiffness: 140, damping: 15, delay };
}
