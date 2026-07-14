"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { CANVAS_READY_EVENT, isCanvasReady, markRevealed, resetReveal } from "@/lib/reveal";

const LETTERS = ["N", "I", "X", "E"];

// Weighted readiness signals — the counter reflects real loading.
const W_FONTS  = 0.3;
const W_CANVAS = 0.45;
const W_LOAD   = 0.25;

const MIN_RAMP_MS   = 2200; // time-based creep so the counter always moves
const FORCE_DONE_MS = 6000; // never hold the page hostage
const HOLD_AT_100_MS = 280; // beat of stillness before the morph
const MORPH_MS       = 1050; // wordmark flight + dissolve, then unmount

type Phase = "loading" | "morph" | "done";
type Flight = { x: number; y: number; scale: number };

/**
 * Loading gate that dissolves INTO the page instead of lifting away:
 * the paper background fades in place (it matches the page color), the
 * progress ring expands into the world's bloom, and the wordmark flies
 * into the nav's wordmark slot ([data-nav-wordmark]).
 */
export function Loader() {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [skipped, setSkipped] = useState(false);
  const [flight, setFlight] = useState<Flight | null>(null);

  const exitStarted = useRef(false);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  // Render-phase reset (before any sibling effects run) so a client-side
  // return to the homepage replays the reveal choreography.
  const didReset = useRef(false);
  if (!didReset.current && typeof window !== "undefined") {
    resetReveal();
    didReset.current = true;
  }

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markRevealed();
      setSkipped(true);
      return;
    }

    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const unlock = () => { root.style.overflow = prevOverflow; };

    const parts = { fonts: 0, canvas: 0, load: 0 };

    let fontsSettled = false;
    document.fonts.ready.then(() => { fontsSettled = true; });
    // Some browsers resolve fonts.ready late even when fonts are cached.
    const fontsFallback = window.setTimeout(() => { fontsSettled = true; }, 2500);

    if (isCanvasReady()) parts.canvas = 1;
    const onCanvas = () => { parts.canvas = 1; };
    window.addEventListener(CANVAS_READY_EVENT, onCanvas);

    if (document.readyState === "complete") parts.load = 1;
    const onLoad = () => { parts.load = 1; };
    window.addEventListener("load", onLoad);

    const start = performance.now();
    let disp = 0;
    let lastT = start;
    let raf = 0;
    let holdTimer = 0;
    let doneTimer = 0;

    const beginMorph = () => {
      unlock();
      markRevealed(); // world intro + hero text + lenis start as we dissolve

      // Wordmark flight: from its centered position to the nav slot.
      const src = wordmarkRef.current?.getBoundingClientRect();
      const tgt = document.querySelector("[data-nav-wordmark]")?.getBoundingClientRect();
      if (src && tgt && src.height > 0) {
        setFlight({
          x: tgt.left - src.left,
          y: tgt.top - src.top,
          scale: tgt.height / src.height,
        });
      }
      setPhase("morph");
      doneTimer = window.setTimeout(() => setPhase("done"), MORPH_MS);
    };

    const frame = (now: number) => {
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      const elapsed = now - start;

      if (fontsSettled) parts.fonts = 1;
      const assets = parts.fonts * W_FONTS + parts.canvas * W_CANVAS + parts.load * W_LOAD;
      const ramp = Math.min(0.9, (elapsed / MIN_RAMP_MS) * 0.9);
      let target = Math.max(assets, ramp);
      if (assets >= 0.999 || elapsed > FORCE_DONE_MS) target = 1;

      disp += (target - disp) * Math.min(1, 3.5 * dt);
      if (target === 1 && disp > 0.995) disp = 1;
      setPct(Math.round(disp * 100));

      if (disp === 1 && !exitStarted.current) {
        exitStarted.current = true;
        holdTimer = window.setTimeout(beginMorph, HOLD_AT_100_MS);
        return; // counter rests at 100
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(holdTimer);
      window.clearTimeout(doneTimer);
      window.clearTimeout(fontsFallback);
      window.removeEventListener(CANVAS_READY_EVENT, onCanvas);
      window.removeEventListener("load", onLoad);
      unlock();
    };
  }, []);

  if (skipped || phase === "done") return null;

  const morphing = phase === "morph";

  return (
    <div
      className="fixed inset-0 z-[99990] flex flex-col"
      style={{ pointerEvents: morphing ? "none" : "auto" }}
      role="status"
      aria-label="Loading"
    >
      {/* Paper layer — same color as the page, so fading it reveals the
          world in place with no visible "screen" coming off. */}
      <motion.div
        className="absolute inset-0 bg-nixe-paper"
        animate={{ opacity: morphing ? 0 : 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      />

      {/* Blueprint corner ticks — same grammar as the hero (which fades its
          own corners in as these fade out, in the same positions). */}
      {(["top-6 left-5 md:left-9", "top-6 right-5 md:right-9 rotate-90",
         "bottom-6 right-5 md:right-9 rotate-180", "bottom-6 left-5 md:left-9 -rotate-90"] as const).map(pos => (
        <motion.svg
          key={pos}
          className={`absolute pointer-events-none ${pos}`}
          width="18" height="18" viewBox="0 0 13 13" fill="none"
          style={{ color: "rgba(10,10,10,0.22)" }}
          animate={{ opacity: morphing ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          <path d="M1 11L1 1L11 1" stroke="currentColor" strokeWidth="1.2" />
        </motion.svg>
      ))}

      <div className="grow" />

      {/* Wordmark + live progress ring */}
      <div className="relative flex items-center justify-center">
        <motion.svg
          className="absolute"
          width={240} height={240} viewBox="0 0 160 160"
          aria-hidden="true"
          animate={morphing ? { scale: 1.6, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0, 0.25, 1] }}
        >
          <circle
            cx={80} cy={80} r={70}
            fill="none"
            stroke="rgba(10,10,10,0.07)"
            strokeWidth={1}
          />
          <motion.circle
            cx={80} cy={80} r={70}
            fill="none"
            stroke="rgba(10,10,10,0.3)"
            strokeWidth={1}
            strokeLinecap="round"
            pathLength={1}
            style={{ transformOrigin: "80px 80px", rotate: -90 }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: pct / 100 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </motion.svg>
        <motion.div
          ref={wordmarkRef}
          className="relative flex gap-1"
          style={{ transformOrigin: "top left" }}
          animate={
            morphing && flight
              ? { x: flight.x, y: flight.y, scale: flight.scale, opacity: 0 }
              : morphing
                ? { opacity: 0 }
                : { x: 0, y: 0, scale: 1, opacity: 1 }
          }
          transition={
            morphing && flight
              ? {
                  x: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
                  y: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
                  scale: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
                  // crossfades into the nav wordmark as it lands
                  opacity: { delay: 0.7, duration: 0.25 },
                }
              : { duration: 0.4 }
          }
        >
          {LETTERS.map((letter, i) => (
            <span key={letter} className="inline-block overflow-hidden">
              <motion.span
                className="display-l text-nixe-ink tracking-[0.1em] inline-block"
                initial={{ y: "115%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.15 + i * 0.08 }}
              >
                {letter}
              </motion.span>
            </span>
          ))}
        </motion.div>
      </div>

      <div className="grow" />

      {/* Bottom strip — progress hairline + readouts. Sits in the exact spot
          of the hero's bottom strip, which fades in as this fades out. */}
      <motion.div
        className="relative px-6 md:px-10 pb-7 md:pb-8"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: morphing ? 0 : 1 }}
        transition={morphing ? { duration: 0.4 } : { duration: 0.5, delay: 0.3 }}
      >
        <div className="relative h-px w-full" style={{ background: "rgba(10,10,10,0.1)" }}>
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${pct}%`,
              background: "rgba(10,10,10,0.55)",
              transition: "width 0.3s ease-out",
            }}
          />
        </div>
        <div className="flex items-center justify-between pt-5">
          <span className="mono-label" style={{ color: "rgba(10,10,10,0.45)" }}>
            NXE-001 · INITIALIZING WORLD
          </span>
          <span
            className="mono-label tabular-nums"
            style={{ color: "rgba(10,10,10,0.6)" }}
          >
            {String(pct).padStart(3, "0")} %
          </span>
        </div>
      </motion.div>
    </div>
  );
}
