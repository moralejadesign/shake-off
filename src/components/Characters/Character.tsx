"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { enterTransition } from "@/components/Scene/introTimeline";

type CharacterProps = {
  src: string;
  width: number;
  height: number;
  delay: number;
  // Position and height classes. Width follows from the image ratio.
  className: string;
  children?: ReactNode;
};

export function Character({ src, width, height, delay, className, children }: CharacterProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      className={`absolute z-20 ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
      initial={{ opacity: 0, y: "35%" }}
      animate={{ opacity: 1, y: 0 }}
      transition={enterTransition(delay, reduced)}
    >
      <Image src={src} alt="" fill sizes="(min-width: 768px) 27vh, 23vh" className="object-contain" />
      {children}
    </motion.div>
  );
}
