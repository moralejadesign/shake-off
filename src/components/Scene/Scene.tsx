"use client";

import { MotionConfig } from "motion/react";
import { BallPair } from "@/components/Ball/BallPair";
import { Cast } from "@/components/Characters/Cast";
import { ResultDialog } from "@/components/ResultCard/ResultDialog";
import { ShakeButton } from "@/components/ShakeButton/ShakeButton";
import { useShake } from "@/hooks/useShake";
import { useShakeFlow } from "@/hooks/useShakeFlow";
import { answers } from "@/lib/answers";
import { Background } from "./Background";
import { CornerLabels } from "./CornerLabels";
import { HeroTitle } from "./HeroTitle";

// Button and click shakes use a fixed medium intensity.
const BUTTON_INTENSITY = 0.7;

export function Scene() {
  const flow = useShakeFlow(answers);
  const sensor = useShake(flow.trigger);
  const revealed = flow.phase === "revealing" || flow.phase === "card";

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative h-svh w-full overflow-hidden">
        <Background />
        <CornerLabels />

        {/* Balls and title share one box so they keep the reference composition at any size. */}
        <div className="absolute top-[30%] left-1/2 aspect-[1210/740] w-[min(94vw,62svh)] -translate-1/2 md:top-[47%] md:w-[min(60.5vw,107svh)]">
          <BallPair shake={flow.shake} answer={revealed ? flow.answer : null} onShake={flow.trigger} />
          <HeroTitle dimmed={revealed} />
        </div>

        <Cast />

        <ShakeButton
          onShake={() => flow.trigger(BUTTON_INTENSITY)}
          disabled={flow.busy}
          sensorStatus={sensor.status}
          onEnableSensor={sensor.enable}
        />

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
