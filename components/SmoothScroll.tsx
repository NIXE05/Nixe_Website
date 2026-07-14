"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { isRevealed, REVEAL_EVENT } from "@/lib/reveal";

/**
 * Inertial smooth scrolling (igloo.inc-style weighty glide).
 * Native scroll position still moves, so window scroll listeners,
 * Framer Motion useScroll, and BackgroundMorph all keep working.
 * Held stopped while the Loader gates the page.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      anchors: true,
      autoRaf: true,
    });

    const onReveal = () => lenis.start();
    if (!isRevealed()) {
      lenis.stop();
      window.addEventListener(REVEAL_EVENT, onReveal, { once: true });
    }

    return () => {
      window.removeEventListener(REVEAL_EVENT, onReveal);
      lenis.destroy();
    };
  }, []);

  return null;
}
