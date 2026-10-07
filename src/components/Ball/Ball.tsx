"use client";

import Image from "next/image";
import { motion, useAnimate, useReducedMotion, type TargetAndTransition } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { SHAKE_STAGE, enterTransition } from "@/components/Scene/introTimeline";
import { SHAKE_TIMING, type ShakeSignal } from "@/hooks/useShakeFlow";

type BallProps = {
  src: string;
  delay: number;
  // Position and width classes.
  className: string;
  // Side the ball flies in from: 1 for right, -1 for left.
  side: 1 | -1;
  floatOffset: number;
  shake: ShakeSignal;
  // Scale and direction of this ball's rattle. Opposite signs make the pair knock together.
  rattle: number;
  revealed: boolean;
  // Where the ball moves while a meme is revealed.
  reveal: TargetAndTransition;
  children?: ReactNode;
};

const REST = { opacity: 1, x: "0%", y: "0%", scale: 1, rotate: 0 };

export function Ball({ src, delay, className, side, floatOffset, shake, rattle, revealed, reveal, children }: BallProps) {
  const reduced = useReducedMotion() ?? false;
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (shake.id === 0) return;
    const k = shake.intensity * rattle * (reduced ? 0.2 : 1);
    animate(
      scope.current,
      {
        x: [0, -64 * k, 54 * k, -40 * k, 26 * k, -12 * k, 4 * k, 0],
        y: [0, 24 * k, -30 * k, 18 * k, -10 * k, 5 * k, -2 * k, 0],
        rotate: [0, -30 * k, 24 * k, -17 * k, 10 * k, -4 * k, 1 * k, 0],
        scale: reduced ? 1 : [1, 1.1, 0.94, 1.06, 0.97, 1.02, 1, 1],
      },
      { duration: (reduced ? SHAKE_TIMING.reducedSettleMs : SHAKE_TIMING.settleMs) / 1000, ease: "easeInOut" },
    );
  }, [shake, rattle, reduced, animate, scope]);

  return (
    <motion.div
      className={`pointer-events-auto absolute cursor-grab touch-none active:cursor-grabbing ${className}`}
      initial={{ opacity: 0, x: `${side * 30}%`, y: "45%", scale: 0.5, rotate: side * 25 }}
      animate={revealed && !reduced ? reveal : REST}
      transition={
        entered ? { type: "spring", stiffness: 120, damping: 16 } : enterTransition(delay, reduced)
      }
      onAnimationComplete={() => setEntered(true)}
    >
      {/* Idle float once the balls have landed. */}
      <motion.div
        animate={reduced ? undefined : { y: [0, -floatOffset, 0], rotate: [0, 3 * side, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: SHAKE_STAGE.idle + delay * 0.5 }}
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
            sizes="(min-width: 768px) 37vw, 68vw"
            className="h-auto w-full select-none"
          />
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
