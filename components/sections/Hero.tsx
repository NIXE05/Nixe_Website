"use client";

import { HeroCanvas } from "@/components/HeroCanvas";
import { WordReveal } from "@/components/WordReveal";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const HEADLINE = ["ENGINEERING", "TRUST INTO", "INTELLIGENT", "SYSTEMS"];

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
      width="18" height="18" viewBox="0 0 13 13" fill="none"
      style={{ color: "rgba(10,10,10,0.22)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
      id="hero"
      data-bg-color="#FAFAF7"
      className="relative flex h-dvh min-h-[550px] flex-col justify-between overflow-hidden bg-nixe-paper"
    >
      <HeroCanvas />

      {/* Blueprint dot grid */}
      <div className="absolute inset-0 pointer-events-none blueprint-dot" />

      {/* One-time scan line */}
      <motion.div
        className="absolute inset-x-0 h-px pointer-events-none z-20"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(10,10,10,0.14) 30%, rgba(10,10,10,0.24) 50%, rgba(10,10,10,0.14) 70%, transparent)",
        }}
        initial={{ top: 0, opacity: 0 }}
        animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.4, delay: 0.2, ease: "linear", times: [0, 0.04, 0.92, 1] }}
      />

      {/* Blueprint screen corners */}
      <ScreenCorner pos="tl" />
      <ScreenCorner pos="tr" />
      <ScreenCorner pos="bl" />
      <ScreenCorner pos="br" />

      {/* Coordinate labels */}
      <motion.div
        className="absolute z-10 flex w-full items-center justify-between px-6 md:px-10 pointer-events-none"
        style={{ top: "26px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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

      <div className="grow" />

      {/* Headline */}
      <div className="relative z-10 flex grow-0 justify-center px-6">
        <h1
          className="text-center uppercase text-nixe-ink leading-none"
          style={{
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize: "clamp(2.8rem, 8.5vw, 10rem)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
          }}
        >
          {HEADLINE.map((line, i) => (
            <WordReveal
              key={line}
              delay={0.35 + i * 0.18}
              stagger={0.07}
              duration={1}
              amount={0.05}
              style={{ display: "block" }}
            >
              {line}
            </WordReveal>
          ))}
        </h1>
      </div>

      {/* CTA pair (sits with the headline block) */}
      <motion.div
        className="relative z-10 flex flex-wrap items-center justify-center gap-3 px-6 mt-9 md:mt-12"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.4, ease: [0.25, 0, 0.25, 1] }}
      >
        <PrimaryCTA href="#contact">Start a Project</PrimaryCTA>
        <SecondaryCTA href="#work">View Work</SecondaryCTA>
      </motion.div>

      <div className="grow" />

      {/* Bottom strip */}
      <motion.div
        className="relative z-10 px-6 md:px-10 pb-7 md:pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.6 }}
      >
        <div
          className="flex flex-col-reverse gap-3 border-t pt-5 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: "rgba(10,10,10,0.12)" }}
        >
          <span className="mono-label" style={{ color: "rgba(10,10,10,0.52)" }}>
            {time || "—:—"} EDT
          </span>
          <span className="mono-label" style={{ color: "rgba(10,10,10,0.5)" }}>
            Cybersecurity · AI · Applications
          </span>
        </div>
      </motion.div>
    </section>
  );
}
