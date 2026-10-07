import type { Transition } from "motion/react";

// Start times in seconds. Every element enters first, then the speech bubbles.
export const INTRO = {
  background: 0,
  labels: 0.3,
  ballBack: 0.5,
  ballFront: 0.75,
  title: 1.15,
  sheep: 1.9,
  dog: 2.15,
  sheepBubble: 2.8,
  dogBubble: 3.4,
  shakeButton: 3.9,
  idle: 3.0,
} as const;

// With reduced motion the sequence keeps its order but plays as quick fades.
export function enterTransition(delay: number, reduced: boolean): Transition {
  if (reduced) return { duration: 0.3, delay: delay * 0.25 };
  return { type: "spring", stiffness: 140, damping: 15, delay };
}
