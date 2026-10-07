"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function Background() {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0, scale: 1.06 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image
        src="/shakeoff-background2.png"
        alt=""
        fill
        preload
        quality={90}
        sizes="100vw"
        className="object-cover object-[60%_center]"
      />
    </motion.div>
  );
}
