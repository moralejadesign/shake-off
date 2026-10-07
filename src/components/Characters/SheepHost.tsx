"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useEffectEvent, useState } from "react";
import { INTRO, enterTransition } from "@/components/Scene/introTimeline";
import { TalkBubble } from "@/components/SpeechBubble/TalkBubble";

const LINES = [
  "Having a rough day?",
  "Shake the ball and get a good meme.",
  "Share it and send it to someone who needs it.",
] as const;

const TYPE_MS = 38;
const HOLD_MS = 1700;
const LAST_HOLD_MS = 2400;

// The sheep that opens the app. It types out each line in its speech bubble,
// bobbing while it "talks", then calls onDone so the shake stage can start.
export function SheepHost({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion() ?? false;
  const [started, setStarted] = useState(false);
  const [line, setLine] = useState(0);
  const [typed, setTyped] = useState(0);
  const finish = useEffectEvent(onDone);

  const text = LINES[line];
  const shown = reduced ? text.length : typed;
  const talking = started && shown < text.length && !reduced;

  useEffect(() => {
    const timer = window.setTimeout(() => setStarted(true), INTRO.bubble * (reduced ? 250 : 1000));
    return () => window.clearTimeout(timer);
  }, [reduced]);

  useEffect(() => {
    if (!started) return;
    if (shown < text.length) {
      const timer = window.setTimeout(() => setTyped((count) => count + 1), TYPE_MS);
      return () => window.clearTimeout(timer);
    }
    const last = line === LINES.length - 1;
    const timer = window.setTimeout(
      () => {
        if (last) finish();
        else {
          setLine((current) => current + 1);
          setTyped(0);
        }
      },
      last ? LAST_HOLD_MS : HOLD_MS,
    );
    return () => window.clearTimeout(timer);
  }, [started, shown, text.length, line]);

  return (
    <motion.div
      className="absolute -bottom-[8svh] left-1/2 aspect-[1092/1440] h-[60svh] -translate-x-[45%] md:top-[22.95cqw] md:bottom-auto md:left-[36.5cqw] md:h-auto md:w-[31cqw] md:translate-x-0"
      initial={{ opacity: 0, y: "30%" }}
      animate={{ opacity: 1, y: "0%" }}
      exit={{ opacity: 0, y: "75%", transition: { duration: 0.55, ease: [0.55, 0, 1, 0.45] } }}
      transition={enterTransition(INTRO.sheep, reduced)}
    >
      <motion.div
        className="relative size-full"
        animate={talking ? { y: ["0%", "-1.2%", "0%"], rotate: [0, -1.2, 0] } : { y: "0%", rotate: 0 }}
        transition={talking ? { duration: 0.34, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
      >
        {/* Mirrored so the ball is on the bubble's side, as in the reference. */}
        <Image
          src="/sheep-ball.png"
          alt=""
          fill
          preload
          sizes="(min-width: 768px) 31vw, 46svh"
          className="-scale-x-100 object-contain"
        />
      </motion.div>

      {started && <TalkBubble text={text} shown={shown} lineKey={line} />}
      <p aria-live="polite" className="sr-only">
        {started ? text : ""}
      </p>
    </motion.div>
  );
}
