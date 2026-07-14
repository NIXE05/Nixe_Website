"use client";

import { useEffect, useState } from "react";

/**
 * Coordination between the Loader gate, the WorldCanvas, and section
 * entrance animations. The loader holds the page until the canvas has
 * painted its first frame, then dispatches REVEAL_EVENT; everything that
 * plays an entrance animation keys off that moment instead of mount.
 */
export const REVEAL_EVENT = "nixe:reveal";
export const CANVAS_READY_EVENT = "nixe:canvas-ready";

declare global {
  interface Window {
    __nixeRevealed?: boolean;
    __nixeCanvasReady?: boolean;
  }
}

/**
 * Clears both flags. The Loader calls this during its first render so a
 * client-side return to the homepage replays the full choreography (flags
 * on window survive App Router navigations).
 */
export function resetReveal(): void {
  if (typeof window === "undefined") return;
  window.__nixeRevealed = false;
  window.__nixeCanvasReady = false;
}

export function markCanvasReady(): void {
  if (typeof window === "undefined" || window.__nixeCanvasReady) return;
  window.__nixeCanvasReady = true;
  window.dispatchEvent(new CustomEvent(CANVAS_READY_EVENT));
}

export function isCanvasReady(): boolean {
  return typeof window !== "undefined" && !!window.__nixeCanvasReady;
}

export function markRevealed(): void {
  if (typeof window === "undefined" || window.__nixeRevealed) return;
  window.__nixeRevealed = true;
  window.dispatchEvent(new CustomEvent(REVEAL_EVENT));
}

export function isRevealed(): boolean {
  return typeof window !== "undefined" && !!window.__nixeRevealed;
}

/** True once the loader has lifted. Initializes correctly on late mounts. */
export function useRevealed(): boolean {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (isRevealed()) {
      setRevealed(true);
      return;
    }
    const on = () => setRevealed(true);
    window.addEventListener(REVEAL_EVENT, on);
    return () => window.removeEventListener(REVEAL_EVENT, on);
  }, []);

  return revealed;
}
