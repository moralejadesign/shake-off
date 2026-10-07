"use client";

import Image from "next/image";
import { motion, useAnimate, useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { INTRO, enterTransition } from "@/components/Scene/introTimeline";
import { SHAKE_TIMING, type ShakeSignal } from "@/hooks/useShakeFlow";

type BallProps = {
  src: string;
  delay: number;
  className: string;
  // Direction the ball drifts in from, in px.
  fromX: number;
  floatOffset: number;
  shake: ShakeSignal;
  // Scale and direction of this ball's rattle. Opposite signs make the pair knock together.
  rattle: number;
  children?: ReactNode;
};

export function Ball({ src, delay, className, fromX, floatOffset, shake, rattle, children }: BallProps) {
  const reduced = useReducedMotion() ?? false;
  const [scope, animate] = useAnimate<HTMLDivElement>();

  useEffect(() => {
    if (shake.id === 0) return;
    const k = shake.intensity * rattle * (reduced ? 0.25 : 1);
    animate(
      scope.current,
      {
        x: [0, -26 * k, 22 * k, -15 * k, 9 * k, -4 * k, 0],
        y: [0, 10 * k, -12 * k, 8 * k, -5 * k, 2 * k, 0],
        rotate: [0, -14 * k, 11 * k, -8 * k, 5 * k, -2 * k, 0],
      },
      { duration: (reduced ? SHAKE_TIMING.reducedSettleMs : SHAKE_TIMING.settleMs) / 1000, ease: "easeInOut" },
    );
  }, [shake, rattle, reduced, animate, scope]);

  return (
    <motion.div
      className={`pointer-events-auto absolute cursor-grab touch-none active:cursor-grabbing ${className}`}
      initial={{ opacity: 0, x: fromX, y: 40, scale: 0.8, rotate: fromX > 0 ? 12 : -12 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
      transition={enterTransition(delay, reduced)}
    >
      {/* Gentle idle bob once the intro has played. */}
      <motion.div
        animate={reduced ? undefined : { y: [0, -floatOffset, 0], rotate: [0, 1.5, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: INTRO.idle + delay * 0.5,
        }}
      >
        <div ref={scope} className="relative">
          <Image
            src={src}
            alt=""
            width={769}
            height={793}
            preload
            quality={90}
            draggable={false}
            sizes="(min-width: 768px) 31vw, 47vw"
            className="h-auto w-full select-none"
          />
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
