"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Inertial smooth scrolling. Native scroll position still moves, so window
 * scroll listeners and Framer Motion's useScroll (the pinned Services track,
 * the nav tone probe, the HUD) all keep working. Disabled outright under
 * prefers-reduced-motion.
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

    return () => lenis.destroy();
  }, []);

  return null;
}
