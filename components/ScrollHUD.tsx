"use client";

import { useEffect, useRef, useState } from "react";

const CHAPTERS = [
  { id: "hero", label: "ORIGIN" },
  { id: "work", label: "WORK" },
  { id: "services", label: "SERVICES" },
  { id: "shipped", label: "SHIPPED" },
  { id: "about", label: "ABOUT" },
  { id: "contact", label: "CONTACT" },
] as const;

const TRIGGER_FRAC = 0.55;

/**
 * Persistent chapter readout. Rendered white through `mix-blend-mode:
 * difference`, so it inverts itself against whichever plate is behind it —
 * dark over paper, light over ink — with no tone tracking of its own.
 */
export function ScrollHUD() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(false);
  const depthRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const trigger = window.innerHeight * TRIGGER_FRAC;
      let idx = 0;
      for (let i = 0; i < CHAPTERS.length; i++) {
        const sec = document.getElementById(CHAPTERS[i].id);
        if (!sec) continue;
        const rect = sec.getBoundingClientRect();
        if (rect.top - 1 < trigger && rect.bottom > 0) idx = i;
      }
      setActive(idx);

      // Depth telemetry writes through a ref — no re-render churn per frame.
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const pct = Math.min(
        100,
        Math.max(0, Math.round((window.scrollY / max) * 100)),
      );
      if (depthRef.current) depthRef.current.textContent = String(pct).padStart(3, "0");

      // Hidden over the hero (which carries its own readouts in this corner)
      // and again over the footer, whose wordmark occupies the same spot.
      setShown(idx > 0 && pct < 96);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-7 left-6 md:left-10 z-[900] hidden md:block pointer-events-none"
      style={{
        mixBlendMode: "difference",
        // Hidden during the hero chapter — it has its own readouts in the same
        // corner — then fades in as the journey begins.
        opacity: shown ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      <div className="flex items-center gap-[6px] mb-3">
        {CHAPTERS.map((c, i) => (
          <div
            key={c.id}
            className="h-[2px] bg-white"
            style={{
              width: i === active ? 26 : 11,
              opacity: i === active ? 0.9 : 0.32,
              transition:
                "width 0.45s cubic-bezier(0.25,0,0.25,1), opacity 0.45s",
            }}
          />
        ))}
      </div>
      <div
        className="mono-label text-white flex items-baseline gap-4"
        style={{ opacity: 0.75, fontSize: "0.58rem" }}
      >
        <span key={active} className="hud-label-swap" style={{ display: "inline-block" }}>
          {String(active + 1).padStart(2, "0")} · {CHAPTERS[active].label}
        </span>
        <span style={{ opacity: 0.5 }}>
          DEPTH <span ref={depthRef}>000</span>%
        </span>
      </div>
    </div>
  );
}
