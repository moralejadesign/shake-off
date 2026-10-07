"use client";

import { useSyncExternalStore } from "react";
import { glassBar, glassIconButton } from "@/lib/buttonClasses";
import { isMuted, setMuted, subscribeMuted } from "@/lib/sound";

// Speaker button that mutes music and effects. CornerLabels places it bottom right.
export function SoundToggle() {
  const muted = useSyncExternalStore(subscribeMuted, isMuted, () => false);

  return (
    <div className={glassBar}>
      <button
        type="button"
        onClick={() => setMuted(!muted)}
        aria-label={muted ? "Turn sound on" : "Turn sound off"}
        className={glassIconButton}
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-[1.4em]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
          {muted ? (
            <path d="M16 9.5l5 5M21 9.5l-5 5" />
          ) : (
            <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.3 6.5a8 8 0 0 1 0 11" />
          )}
        </svg>
      </button>
    </div>
  );
}
