"use client";

import { INTRO } from "@/components/Scene/introTimeline";
import { SpeechBubble } from "@/components/SpeechBubble/SpeechBubble";
import { Character } from "./Character";

// The sheep and the dalmatian in the bottom corners, each with its speech bubble.
export function Cast() {
  return (
    <>
      <Character
        src="/oveja.png"
        width={1092}
        height={1440}
        delay={INTRO.sheep}
        className="bottom-[30svh] left-[4vw] h-[20svh] md:bottom-[5svh] md:left-[7.5vw] md:h-[25svh]"
      >
        <SpeechBubble heading="Having a rough day?" delay={INTRO.sheepBubble} origin="left" className="top-[8%] left-[76%]">
          Shake the ball and it gives you a meme to lift your mood.
        </SpeechBubble>
      </Character>

      <Character
        src="/perro.png"
        width={1085}
        height={1450}
        delay={INTRO.dog}
        className="right-[-2vw] -bottom-[9svh] h-[30svh] md:right-[7.5vw] md:-bottom-[15svh] md:h-[35svh]"
      >
        <SpeechBubble
          delay={INTRO.dogBubble}
          origin="right"
          className="top-[4%] right-[80%] md:top-[-4%] md:right-[67%]"
        >
          Download it, share it, send it to someone who needs it.
        </SpeechBubble>
      </Character>
    </>
  );
}
