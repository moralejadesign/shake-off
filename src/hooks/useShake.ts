"use client";

import { useEffect, useEffectEvent, useState, useSyncExternalStore } from "react";

export type ShakeStatus = "unsupported" | "needs-permission" | "enabled" | "denied";

type Support = "unsupported" | "needs-permission" | "available";
type MotionPermission = { requestPermission?: () => Promise<"granted" | "denied"> };

// Sum of per-axis acceleration change between two samples that counts as a shake.
// Tune on a real phone.
const THRESHOLD = 18;
const COOLDOWN_MS = 1200;

const subscribe = () => () => {};

function getSupport(): Support {
  if (typeof window === "undefined" || !("DeviceMotionEvent" in window)) return "unsupported";
  const motionEvent = window.DeviceMotionEvent as unknown as MotionPermission;
  // iOS only delivers motion events after requestPermission() is called from a tap.
  // Desktop Chrome exposes the same method, so only ask on touch devices.
  const needsPermission =
    typeof motionEvent.requestPermission === "function" && window.matchMedia("(pointer: coarse)").matches;
  return needsPermission ? "needs-permission" : "available";
}

export function useShake(onShake: (intensity: number) => void) {
  const support = useSyncExternalStore<Support>(subscribe, getSupport, () => "unsupported");
  const [permission, setPermission] = useState<"unknown" | "granted" | "denied">("unknown");
  const listening = support === "available" || permission === "granted";
  const fire = useEffectEvent(onShake);

  useEffect(() => {
    if (!listening) return;
    let last: { x: number; y: number; z: number } | null = null;
    let lastShakeAt = -Infinity;

    const handleMotion = (event: DeviceMotionEvent) => {
      const a = event.accelerationIncludingGravity;
      if (!a || a.x === null || a.y === null || a.z === null) return;
      if (last) {
        const delta = Math.abs(a.x - last.x) + Math.abs(a.y - last.y) + Math.abs(a.z - last.z);
        if (delta > THRESHOLD && event.timeStamp - lastShakeAt > COOLDOWN_MS) {
          lastShakeAt = event.timeStamp;
          fire(Math.min(1, 0.4 + (delta - THRESHOLD) / 40));
        }
      }
      last = { x: a.x, y: a.y, z: a.z };
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [listening]);

  const enable = async () => {
    const motionEvent = window.DeviceMotionEvent as unknown as MotionPermission;
    if (!motionEvent.requestPermission) return;
    try {
      setPermission((await motionEvent.requestPermission()) === "granted" ? "granted" : "denied");
    } catch {
      setPermission("denied");
    }
  };

  let status: ShakeStatus = "unsupported";
  if (support === "available" || permission === "granted") status = "enabled";
  else if (support === "needs-permission") status = permission === "denied" ? "denied" : "needs-permission";

  return { status, enable };
}
