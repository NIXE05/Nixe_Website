"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/Button";
import { HeroField } from "@/components/HeroField";
import { WordReveal } from "@/components/WordReveal";
import { requestIntent } from "@/lib/intent";

const HEADLINE = ["ENGINEERING TRUST", "INTO INTELLIGENT", "SYSTEMS."];

function ScreenCorner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const d = {
    tl: "M1 11L1 1L11 1",
    tr: "M1 1L11 1L11 11",
    br: "M11 1L11 11L1 11",
    bl: "M11 11L1 11L1 1",
  }[pos];
  const cls = {
    tl: "top-6 left-5 md:left-9",
    tr: "top-6 right-5 md:right-9",
    bl: "bottom-6 left-5 md:left-9",
    br: "bottom-6 right-5 md:right-9",
  }[pos];
  return (
    <motion.svg
      className={`absolute pointer-events-none z-10 ${cls}`}
      width="18"
      height="18"
      viewBox="0 0 13 13"
      fill="none"
      style={{ color: "var(--tone-fg-4)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      aria-hidden="true"
    >
      <path d={d} stroke="currentColor" strokeWidth="1.2" />
    </motion.svg>
  );
}

export function Hero() {
  const [time, setTime] = useState("");
  const sectionRef = useRef<HTMLElement>(null);

  // The hero recedes as the Work plate rises over it.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0.15, 0.8], [1, 0]);
  // The lattice lags the page, so it sits behind the headline rather than
  // travelling with it. Overscan is unnecessary — the exposed strip is always
  // above the viewport by the time the drift is large enough to matter.
  const fieldY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleString("en-CA", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "America/Toronto",
        }),
      );
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-tone="paper"
      className="plate plate-paper relative flex h-dvh min-h-[620px] flex-col overflow-hidden"
    >
      <motion.div className="absolute inset-0" style={{ y: fieldY }}>
        <HeroField />
      </motion.div>

      {/* The clearing: the lattice dims behind the headline so type stays crisp */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(64% 52% at 30% 52%, #FAFAF7 0%, rgba(250,250,247,0.82) 46%, rgba(250,250,247,0) 76%)",
        }}
      />

      <ScreenCorner pos="tl" />
      <ScreenCorner pos="tr" />
      <ScreenCorner pos="bl" />
      <ScreenCorner pos="br" />

      {/* Coordinate readouts, tucked under the nav */}
      <motion.div
        className="absolute z-10 flex w-full items-center justify-between px-6 md:px-10 pointer-events-none"
        style={{ top: "26px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <span
          className="mono-label"
          style={{ color: "var(--tone-fg-4)", fontSize: "0.54rem" }}
        >
          43.8561° N · 79.2673° W
        </span>
        <span
          className="mono-label"
          style={{ color: "var(--tone-fg-4)", fontSize: "0.54rem" }}
        >
          REF: NXE-001
        </span>
      </motion.div>

      {/* Centre stage */}
      <motion.div
        className="relative z-10 flex flex-1 items-center px-6 md:px-10"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="w-full max-w-[1440px] mx-auto">
          <h1
            className="uppercase"
            style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: "clamp(2.6rem, 6.6vw, 7.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 0.92,
              color: "var(--tone-fg)",
            }}
          >
            {HEADLINE.map((line, i) => (
              <WordReveal
                key={line}
                delay={0.2 + i * 0.14}
                stagger={0.06}
                duration={1}
                amount={0.05}
                style={{ display: "block" }}
              >
                {line}
              </WordReveal>
            ))}
          </h1>

          <motion.p
            className="mt-9 max-w-[42ch] leading-relaxed"
            style={{ fontSize: "1.05rem", color: "var(--tone-fg-2)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: [0.25, 0, 0.25, 1] }}
          >
            Boutique cybersecurity, AI, and applied software consulting for
            teams who&apos;d rather build it right the first time.
          </motion.p>

          <motion.div
            className="mt-11 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.92, ease: [0.25, 0, 0.25, 1] }}
          >
            <Button
              href="#contact"
              onClick={() => requestIntent("consultation")}
            >
              Request a Consultation
            </Button>
            <Button href="#work" variant="outline">
              View Work
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Base rail */}
      <motion.div
        className="relative z-10 px-6 md:px-10 pb-7 md:pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.4 }}
      >
        <div className="max-w-[1440px] mx-auto">
          <div
            className="flex flex-col-reverse gap-3 pt-5 md:flex-row md:items-center md:justify-between"
            style={{ borderTop: "1px solid var(--tone-line)" }}
          >
            <span className="mono-label" style={{ color: "var(--tone-fg-3)" }}>
              {time || "··:··"} EDT
            </span>

            <div className="flex items-center gap-6">
              <span
                className="mono-label hidden sm:inline"
                style={{ color: "var(--tone-fg-3)" }}
              >
                Cybersecurity · AI · Applications
              </span>
              <span
                aria-hidden
                className="hidden md:flex items-center gap-2"
                style={{ color: "var(--tone-fg-4)" }}
              >
                <span className="mono-label" style={{ fontSize: "0.54rem" }}>
                  SCROLL
                </span>
                <span
                  className="block w-6 h-px"
                  style={{ background: "currentColor" }}
                />
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
