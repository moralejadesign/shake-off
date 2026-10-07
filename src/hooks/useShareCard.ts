"use client";

import { useEffect, useState } from "react";
import { renderCardPng } from "@/lib/renderCardPng";

export type ExportStatus = "preparing" | "ready" | "error";

function downloadFile(file: File) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function canShareFile(file: File) {
  return typeof navigator.canShare === "function" && navigator.canShare({ files: [file] });
}

// Renders the card PNG as soon as the card opens, so Share can call
// navigator.share() straight from the tap. iOS rejects it after a long await.
// Mount with a new `key` per meme so each one renders fresh.
export function useShareCard(fileName: string) {
  // The export node is kept in state and set through a callback ref, so rendering starts once it exists.
  const [node, setExportNode] = useState<HTMLDivElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!node) return;
    let cancelled = false;
    renderCardPng(node)
      .then((blob) => {
        if (!cancelled) setFile(new File([blob], fileName, { type: "image/png" }));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [node, fileName]);

  const status: ExportStatus = failed ? "error" : file ? "ready" : "preparing";

  const download = () => {
    if (file) downloadFile(file);
  };

  // Uses the native share sheet when it accepts files, otherwise downloads.
  const share = async () => {
    if (!file) return;
    if (!canShareFile(file)) {
      downloadFile(file);
      return;
    }
    try {
      await navigator.share({ files: [file], title: "Shake Off" });
    } catch (error) {
      // AbortError means the user closed the share sheet, which is fine.
      if (!(error instanceof DOMException && error.name === "AbortError")) downloadFile(file);
    }
  };

  return { setExportNode, status, download, share };
}
