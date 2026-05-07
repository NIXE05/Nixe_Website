"use client";

import { useEffect } from "react";

const TRANSITION = "background-color 0.7s cubic-bezier(0.65, 0, 0.35, 1)";
// Section becomes "active" the moment its TOP crosses this many viewport-heights
// from the top of the viewport. 0.55 = roughly mid-screen — bg flips early so the
// curtain wipe finishes against the right color, no flash.
const TRIGGER_FRAC = 0.55;

export function BackgroundMorph() {
  useEffect(() => {
    const root = document.documentElement;
    const previousTransition = root.style.transition;
    root.style.transition = TRANSITION;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-bg-color]")
    );
    if (sections.length === 0) return;

    let lastColor = "";
    const update = () => {
      const trigger = window.innerHeight * TRIGGER_FRAC;
      // Active section = the LAST one whose top has crossed the trigger line.
      // (Sections in document order top-to-bottom; the deepest one above the
      // trigger is currently "in".)
      let active: HTMLElement | null = null;
      for (const s of sections) {
        const rect = s.getBoundingClientRect();
        if (rect.top - 1 < trigger && rect.bottom > 0) active = s;
      }
      if (active && active.dataset.bgColor && active.dataset.bgColor !== lastColor) {
        root.style.backgroundColor = active.dataset.bgColor;
        lastColor = active.dataset.bgColor;
      }
    };

    update();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      root.style.transition = previousTransition;
    };
  }, []);

  return null;
}
