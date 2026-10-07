"use client";

import { motion } from "motion/react";
import { useEffect, useRef, type MouseEvent } from "react";
import { useShareCard } from "@/hooks/useShareCard";
import { glassBar, glassButton, glassButtonActive, glassIconButton } from "@/lib/buttonClasses";
import type { Answer } from "@/lib/types";
import { ResultCard } from "./ResultCard";

type ResultDialogProps = {
  answer: Answer;
  onShakeAgain: () => void;
  onClose: () => void;
};

const STATUS_TEXT = {
  preparing: "Preparing your image",
  ready: "Your image is ready",
  error: "The image could not be created. Try shaking again.",
} as const;

// Native modal dialog: traps focus and closes on Escape.
export function ResultDialog({ answer, onShakeAgain, onClose }: ResultDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const { setExportNode, status, download, share } = useShareCard(`shake-off-${answer.id}.png`);
  const notReady = status !== "ready";

  useEffect(() => {
    const dialog = ref.current;
    // React removes the dialog before this cleanup runs, which skips the browser's
    // own focus restore, so put focus back on the element that opened it.
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      dialog?.close();
      opener?.focus();
    };
  }, []);

  // A click on the dialog element itself is a click on the backdrop.
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <dialog
      ref={ref}
      aria-label="Your meme"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={handleBackdropClick}
      className="m-auto max-h-none max-w-none overflow-visible bg-transparent p-0 text-white backdrop:bg-black/55 backdrop:backdrop-blur-sm"
    >
      <motion.div
        className="flex w-[min(88vw,42svh)] flex-col items-center gap-4"
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 170, damping: 18 }}
      >
        <ResultCard answer={answer} />
        {/* One row on every screen. Close is an icon so the row fits a phone. */}
        <div className={glassBar}>
          <button type="button" onClick={share} aria-disabled={notReady} className={glassButtonActive}>
            Share
          </button>
          <button type="button" onClick={download} aria-disabled={notReady} className={glassButton}>
            Download
          </button>
          <button type="button" autoFocus onClick={onShakeAgain} className={glassButton}>
            Shake again
          </button>
          <button type="button" onClick={onClose} aria-label="Close" className={glassIconButton}>
            <svg aria-hidden viewBox="0 0 16 16" className="size-[1.1em]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
            </svg>
          </button>
        </div>
        <p role="status" className={status === "error" ? "text-xs" : "sr-only"}>
          {STATUS_TEXT[status]}
        </p>
      </motion.div>

      {/* Full-size copy that becomes the PNG. Kept off screen, outside the animated
          wrapper, so its fixed position is relative to the viewport. */}
      <div aria-hidden inert className="pointer-events-none fixed top-0 left-0 w-[1080px] -translate-x-[110%]">
        <div ref={setExportNode}>
          <ResultCard answer={answer} forExport />
        </div>
      </div>
    </dialog>
  );
}
