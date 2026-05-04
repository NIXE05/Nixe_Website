"use client";

import { HeroCanvas } from "@/components/HeroCanvas";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const HEADLINE = ["ENGINEERING", "TRUST INTO", "INTELLIGENT", "SYSTEMS"];

function CornerSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`size-[10px] transition-opacity duration-400 group-hover/btn:opacity-70 ${className}`}
      style={{ color: "rgba(10,10,10,0.3)" }}
      width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"
    >
      <path d="M0.5 0.2L0.5 9.2M0.2 0.5L9.2 0.5" stroke="currentColor" />
    </svg>
  );
}

function WQFButton({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="group/btn relative isolate inline-flex h-[44px] items-center justify-center px-6"
      data-cursor-hover
    >
      <div
        className="absolute left-0 size-[10px] -translate-x-6 rounded-sm opacity-0 blur-[20px] transition-all duration-400 group-hover/btn:-translate-x-[6px] group-hover/btn:opacity-100 group-hover/btn:blur-0"
        style={{ background: "rgba(10,10,10,0.7)" }}
      />
      <div className="relative isolate flex overflow-hidden -translate-x-[5px] transition-transform duration-400 group-hover/btn:translate-x-[5px]">
        <span className="mono-label text-nixe-ink transition-transform duration-400 group-hover/btn:-translate-y-full">
          {children}
        </span>
        <span className="mono-label text-nixe-ink absolute inset-0 translate-y-full transition-transform duration-400 group-hover/btn:translate-y-0" aria-hidden="true">
          {children}
        </span>
      </div>
      <CornerSVG className="absolute top-0 left-0" />
      <CornerSVG className="absolute top-0 right-0 rotate-90" />
      <CornerSVG className="absolute bottom-0 right-0 rotate-180" />
      <CornerSVG className="absolute bottom-0 left-0 -rotate-90" />
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
      className="relative flex h-dvh min-h-[550px] flex-col justify-between overflow-hidden bg-nixe-paper"
    >
      <HeroCanvas />

      <div className="grow" />

      {/* Headline — centered */}
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
            <div key={i} className="overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.35 + i * 0.1 }}
              >
                {line}
              </motion.span>
            </div>
          ))}
        </h1>
      </div>

      <div className="grow" />

      {/* Bottom bar */}
      <motion.div
        className="relative z-10 px-6 md:px-10 pb-7 md:pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.9 }}
      >
        <div
          className="flex flex-col-reverse gap-6 border-t pt-5 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: "rgba(10,10,10,0.1)" }}
        >
          <div className="flex items-center gap-6">
            <WQFButton href="#contact">Contact Us</WQFButton>
            <span className="mono-label" style={{ color: "rgba(10,10,10,0.3)" }}>
              {time || "—:—"} EDT
            </span>
          </div>
          <p className="mono-label max-w-[480px]" style={{ color: "rgba(10,10,10,0.4)" }}>
            Boutique cybersecurity, AI, and applied software consulting — Markham, Ontario
          </p>
        </div>
      </motion.div>
    </section>
  );
}
