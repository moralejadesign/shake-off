"use client";

import { motion, useReducedMotion } from "motion/react";
import { INTRO } from "@/components/Scene/introTimeline";
import type { ShakeStatus } from "@/hooks/useShake";
import { glassBar, glassButton, glassButtonActive } from "@/lib/buttonClasses";

type ShakeButtonProps = {
  onShake: () => void;
  disabled: boolean;
  sensorStatus: ShakeStatus;
  onEnableSensor: () => void;
};

// The always-visible alternative to shaking the phone. On iOS it also offers
// "Enable shake", since motion access must be requested from a tap.
export function ShakeButton({ onShake, disabled, sensorStatus, onEnableSensor }: ShakeButtonProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      className={`absolute top-[46svh] left-1/2 z-30 -translate-x-1/2 md:top-auto md:bottom-[6svh] ${glassBar}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: reduced ? 1 : INTRO.shakeButton }}
    >
      {sensorStatus === "needs-permission" && (
        <button type="button" onClick={onEnableSensor} className={glassButton}>
          Enable shake
        </button>
      )}
      {/* aria-disabled instead of disabled keeps focus here while the balls shake. */}
      <button type="button" onClick={onShake} aria-disabled={disabled} className={glassButtonActive}>
        Shake
      </button>
    </motion.div>
  );
}
