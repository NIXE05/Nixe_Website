"use client";

import { WordReveal } from "@/components/WordReveal";
import { useRevealed } from "@/lib/reveal";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const HEADLINE = ["ENGINEERING TRUST", "INTO INTELLIGENT", "SYSTEMS."];

function ScreenCorner({ pos, active }: { pos: "tl" | "tr" | "bl" | "br"; active: boolean }) {
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
      width="18" height="18" viewBox="0 0 13 13" fill="none"
      style={{ color: "rgba(10,10,10,0.22)" }}
      initial={{ opacity: 0 }}
      animate={active ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay: 1.4 }}
      aria-hidden="true"
    >
      <path d={d} stroke="currentColor" strokeWidth="1.2" />
    </motion.svg>
  );
}

function PrimaryCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      data-cursor-hover
      className="group/btn relative inline-flex h-[46px] items-center justify-center px-7 overflow-hidden"
      style={{
        background: "var(--color-nixe-ink)",
        color: "var(--color-nixe-pearl)",
        transition: "transform 0.35s cubic-bezier(0.25,0,0.25,1), box-shadow 0.35s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 14px 32px rgba(10,10,10,0.22)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <span className="mono-label" style={{ color: "var(--color-nixe-pearl)" }}>
        {children}
      </span>
    </a>
  );
}

function SecondaryCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      data-cursor-hover
      className="group/btn relative inline-flex h-[46px] items-center justify-center px-7"
      style={{
        background: "transparent",
        color: "var(--color-nixe-ink)",
        border: "1px solid rgba(10,10,10,0.22)",
        transition: "border-color 0.3s, background-color 0.3s, transform 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(10,10,10,0.7)";
        e.currentTarget.style.backgroundColor = "rgba(10,10,10,0.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(10,10,10,0.22)";
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <span className="mono-label" style={{ color: "var(--color-nixe-ink)" }}>
        {children}
      </span>
    </a>
  );
}

export function Hero() {
  const [time, setTime] = useState("");
  const revealed = useRevealed();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-scrubbed exit: the hero recedes upward as the world morphs onward.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const headlineOpacity = useTransform(scrollYProgress, [0.1, 0.75], [1, 0]);
  const stripOpacity = useTransform(scrollYProgress, [0.05, 0.45], [1, 0]);

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleString("en-CA", {
          hour: "2-digit", minute: "2-digit", hour12: false,
          timeZone: "America/Toronto",
        })
      );
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-bg-color="#FAFAF7"
      className="relative flex h-dvh min-h-[550px] flex-col justify-between overflow-hidden"
    >
      {/* Blueprint dot grid */}
      <div className="absolute inset-0 pointer-events-none blueprint-dot" />

      {/* One-time scan line — fires when the loader lifts */}
      <motion.div
        className="absolute inset-x-0 h-px pointer-events-none z-20"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(10,10,10,0.14) 30%, rgba(10,10,10,0.24) 50%, rgba(10,10,10,0.14) 70%, transparent)",
        }}
        initial={{ top: 0, opacity: 0 }}
        animate={revealed ? { top: "100%", opacity: [0, 1, 1, 0] } : { top: 0, opacity: 0 }}
        transition={{ duration: 2.4, delay: 0.2, ease: "linear", times: [0, 0.04, 0.92, 1] }}
      />

      {/* Blueprint screen corners */}
      <ScreenCorner pos="tl" active={revealed} />
      <ScreenCorner pos="tr" active={revealed} />
      <ScreenCorner pos="bl" active={revealed} />
      <ScreenCorner pos="br" active={revealed} />

      {/* Coordinate labels */}
      <motion.div
        className="absolute z-10 flex w-full items-center justify-between px-6 md:px-10 pointer-events-none"
        style={{ top: "26px" }}
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <span
          className="mono-label"
          style={{ color: "rgba(10,10,10,0.28)", fontSize: "0.54rem", letterSpacing: "0.18em" }}
        >
          43.8561° N · 79.2673° W
        </span>
        <span
          className="mono-label"
          style={{ color: "rgba(10,10,10,0.28)", fontSize: "0.54rem", letterSpacing: "0.18em" }}
        >
          REF: NXE-001
        </span>
      </motion.div>

      {/* The globe owns the frame — content stays out of its way */}
      <div className="grow" />

      {/* Bottom-anchored composition: headline low-left, CTAs low-right,
          like a caption plate under the specimen. */}
      <motion.div
        className="relative z-10 px-6 md:px-10 pb-7 md:pb-9"
        style={{ y: headlineY, opacity: headlineOpacity }}
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h1
            className="uppercase text-nixe-ink"
            style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: "clamp(2rem, 4.3vw, 4.6rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 0.98,
            }}
          >
            {HEADLINE.map((line, i) => (
              <WordReveal
                key={line}
                active={revealed}
                delay={0.35 + i * 0.16}
                stagger={0.06}
                duration={1}
                amount={0.05}
                style={{ display: "block" }}
              >
                {line}
              </WordReveal>
            ))}
          </h1>

          <motion.div
            className="flex flex-wrap items-center gap-3 md:flex-col md:items-stretch md:gap-3 shrink-0 pb-1"
            initial={{ opacity: 0 }}
            animate={revealed ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease: [0.25, 0, 0.25, 1] }}
          >
            <PrimaryCTA href="#contact">Start a Project</PrimaryCTA>
            <SecondaryCTA href="#work">View Work</SecondaryCTA>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom strip */}
      <motion.div
        className="relative z-10 px-6 md:px-10 pb-7 md:pb-8"
        style={{ opacity: stripOpacity }}
      >
        <motion.div
          className="flex flex-col-reverse gap-3 border-t pt-5 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: "rgba(10,10,10,0.12)" }}
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 1.6 }}
        >
          <span className="mono-label" style={{ color: "rgba(10,10,10,0.52)" }}>
            {time || "—:—"} EDT
          </span>
          <span className="mono-label" style={{ color: "rgba(10,10,10,0.5)" }}>
            Cybersecurity · AI · Applications
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
