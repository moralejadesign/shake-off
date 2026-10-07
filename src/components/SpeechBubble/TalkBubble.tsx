"use client";

import { motion } from "motion/react";

type TalkBubbleProps = {
  text: string;
  // How many characters have been typed so far.
  shown: number;
  // Changes per line, so each new line pops in.
  lineKey: number;
};

// The sheep's speech bubble. Sits above the head on phones (tail down) and beside
// the mouth on desktop (tail left). The full line is laid out invisibly underneath
// the typed text, so the bubble keeps its size while the line types out.
export function TalkBubble({ text, shown, lineKey }: TalkBubbleProps) {
  return (
    <motion.div
      key={lineKey}
      aria-hidden
      className="absolute bottom-full left-[57%] mb-[1em] w-max max-w-[78vw] -translate-x-1/2 origin-bottom text-[clamp(12px,3.4vw,16px)] md:top-[27.6%] md:bottom-auto md:left-[70%] md:mb-0 md:max-w-none md:translate-x-0 md:whitespace-nowrap md:origin-left md:text-[1.1cqw]"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <div className="relative rounded-[0.5em] bg-paper px-[1em] py-[0.65em] leading-snug font-bold tracking-[0.08em] text-ink uppercase shadow-[0_0.25em_0.8em_rgba(0,0,0,0.18)]">
        <span className="grid">
          <span className="invisible col-start-1 row-start-1">{text}</span>
          <span className="col-start-1 row-start-1">{text.slice(0, shown)}</span>
        </span>
        <span className="absolute -bottom-[0.3em] left-1/2 size-[0.7em] -translate-x-1/2 rotate-45 bg-paper md:top-1/2 md:bottom-auto md:-left-[0.3em] md:translate-x-0 md:-translate-y-1/2" />
      </div>
    </motion.div>
  );
}
