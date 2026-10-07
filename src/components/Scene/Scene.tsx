"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import { useState } from "react";
import { BallPair } from "@/components/Ball/BallPair";
import { SheepHost } from "@/components/Characters/SheepHost";
import { ResultDialog } from "@/components/ResultCard/ResultDialog";
import { ShakeButton } from "@/components/ShakeButton/ShakeButton";
import { SkipButton } from "@/components/ShakeButton/SkipButton";
import { useShake } from "@/hooks/useShake";
import { useShakeFlow } from "@/hooks/useShakeFlow";
import { answers } from "@/lib/answers";
import { Background } from "./Background";
import { CornerLabels } from "./CornerLabels";
import { HeroTitle } from "./HeroTitle";

// Button and click shakes use a fixed medium intensity.
const BUTTON_INTENSITY = 0.7;

// Two stages: the sheep introduces the app, then it leaves and the balls arrive to be shaken.
export function Scene() {
  const [stage, setStage] = useState<"intro" | "shake">("intro");
  const flow = useShakeFlow(answers);
  const startShaking = () => setStage("shake");
  // Shaking the phone during the intro skips straight to the balls.
  const sensor = useShake((intensity) => (stage === "intro" ? startShaking() : flow.trigger(intensity)));
  const revealed = flow.phase === "revealing" || flow.phase === "card";

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative h-svh w-full overflow-hidden">
        <Background />
        <CornerLabels />

        {/* Phones use the full screen. Desktop uses a 16:9 frame anchored to the bottom,
            so positions measured from the 2000x1125 references hold at any size. */}
        <div className="@container absolute inset-0 md:top-auto md:right-auto md:left-1/2 md:aspect-video md:w-[min(100vw,177.78svh)] md:-translate-x-1/2">
          <HeroTitle stage={stage} dimmed={revealed} />
          <AnimatePresence>
            {stage === "intro" ? (
              <SheepHost key="sheep" onDone={startShaking} />
            ) : (
              <BallPair key="balls" shake={flow.shake} answer={revealed ? flow.answer : null} onShake={flow.trigger} />
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {stage === "intro" ? (
            <SkipButton key="skip" onSkip={startShaking} />
          ) : (
            <ShakeButton
              key="shake"
              onShake={() => flow.trigger(BUTTON_INTENSITY)}
              disabled={flow.busy}
              sensorStatus={sensor.status}
              onEnableSensor={sensor.enable}
            />
          )}
        </AnimatePresence>

        <p aria-live="polite" className="sr-only">
          {flow.phase === "card" && flow.answer ? `Your meme: ${flow.answer.alt}` : ""}
        </p>
      </main>

      {flow.phase === "card" && flow.answer && (
        <ResultDialog
          key={flow.answer.id}
          answer={flow.answer}
          onShakeAgain={() => flow.trigger(BUTTON_INTENSITY)}
          onClose={flow.close}
        />
      )}
    </MotionConfig>
  );
}
