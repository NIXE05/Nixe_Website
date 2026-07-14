"use client";

import { useEffect } from "react";

import { markRevealed } from "@/lib/reveal";

/**
 * With the loading splash removed, nothing gates the page any more, so we fire
 * the reveal signal immediately on mount. Nav, ScrollHUD, Hero and SmoothScroll
 * all key their entrance off this moment; WorldCanvas now starts fully settled
 * regardless, so the world simply appears in place with no intro.
 *
 * Placed first in the tree so its effect runs before SmoothScroll's — which
 * reads the reveal flag on mount to decide whether to start lenis immediately.
 */
export function RevealOnMount() {
  useEffect(() => {
    markRevealed();
  }, []);

  return null;
}
