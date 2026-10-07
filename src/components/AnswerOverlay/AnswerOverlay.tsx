"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { Answer } from "@/lib/types";

// Floats the meme up inside the back ball's round window, like the die in a real eight ball.
// Position and size match the inner ring of magicball-back.png.
export function AnswerOverlay({ answer }: { answer: Answer | null }) {
  return (
    <AnimatePresence>
      {answer && (
        <motion.div
          key={answer.id}
          className="pointer-events-none absolute top-[49.8%] left-[51.4%] aspect-square w-[44%] -translate-1/2 overflow-hidden rounded-full"
          initial={{ opacity: 0, scale: 0.5, rotate: -25 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* The result card announces the meme, so this preview stays decorative. */}
          <Image src={answer.imageUrl} alt="" fill sizes="(min-width: 768px) 14vw, 21vw" className="object-cover" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.85)_100%)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
