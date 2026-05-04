"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const CREDENTIALS = [
  "Master's, Cybersecurity",
  "iOS / Swift / SwiftUI",
  "Threat Modeling",
  "AI Strategy",
  "AWS / Cloud Security",
  "Apache Iceberg / Trino",
];

export function Ethos() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 40%"],
  });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0 100% 0 0 round 20px 20px 0 0)", "inset(0 0% 0 0 round 20px 20px 0 0)"]
  );

  return (
    <motion.section
      ref={sectionRef}
      id="ethos"
      className="relative overflow-hidden"
      style={{
        background: "#F0EFEA",
        color: "#0A0A0A",
        clipPath,
        paddingTop: "clamp(80px,12vh,160px)",
        paddingBottom: "clamp(80px,12vh,160px)",
      }}
    >
      <div className="px-6 md:px-10 max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-5 mb-14 md:mb-20 md:flex-row md:items-end md:justify-between">
          <span className="mono-label" style={{ color: "rgba(10,10,10,0.55)" }}>03 / ABOUT</span>
          <h2
            className="uppercase font-bold leading-none"
            style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif", fontSize: "clamp(1.6rem, 3.5vw, 3.2rem)", letterSpacing: "-0.03em", color: "#0A0A0A" }}
          >
            Vision matters.<br />Precision wins.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.25, 0, 0.25, 1] }}
          >
            <p
              className="leading-relaxed mb-7 border-t pt-5"
              style={{ fontSize: "1.05rem", color: "rgba(10,10,10,0.75)", borderColor: "rgba(10,10,10,0.12)" }}
            >
              NIXE is led by a Master&apos;s graduate in Cybersecurity from
              Markham, Ontario, working at the intersection of secure
              infrastructure and intelligent software.
            </p>
            <p className="leading-relaxed mb-12" style={{ fontSize: "1.05rem", color: "rgba(10,10,10,0.68)" }}>
              We take on a small number of engagements per quarter — depth over volume.
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {CREDENTIALS.map((c, i) => (
                <motion.span
                  key={c}
                  className="mono-label block"
                  style={{ color: "rgba(10,10,10,0.65)" }}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                >
                  {c}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0, 0.25, 1], delay: 0.15 }}
          >
            <a
              href="#contact"
              className="group/btn relative isolate inline-flex h-[52px] items-center justify-center px-8 self-start"
              data-cursor-hover
              style={{ border: "1px solid rgba(10,10,10,0.2)" }}
            >
              <div className="absolute left-0 size-[8px] -translate-x-6 rounded-sm opacity-0 blur-[12px] transition-all duration-400 group-hover/btn:-translate-x-[5px] group-hover/btn:opacity-100 group-hover/btn:blur-0" style={{ background: "rgba(10,10,10,0.6)" }} />
              <div className="relative isolate flex overflow-hidden -translate-x-[4px] transition-transform duration-400 group-hover/btn:translate-x-[4px]">
                <span className="mono-label transition-transform duration-400 group-hover/btn:-translate-y-full" style={{ color: "rgba(10,10,10,0.75)" }}>Work With Us</span>
                <span className="mono-label absolute inset-0 translate-y-full transition-transform duration-400 group-hover/btn:translate-y-0" style={{ color: "rgba(10,10,10,0.75)" }} aria-hidden="true">Work With Us</span>
              </div>
              {(["top-0 left-0","top-0 right-0 rotate-90","bottom-0 right-0 rotate-180","bottom-0 left-0 -rotate-90"] as const).map(pos => (
                <svg key={pos} className={`absolute size-[9px] ${pos}`} style={{ color: "rgba(10,10,10,0.25)" }} width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M0.5 0.2L0.5 9.2M0.2 0.5L9.2 0.5" stroke="currentColor"/>
                </svg>
              ))}
            </a>
            <p className="mt-8 text-sm leading-relaxed max-w-[40ch]" style={{ color: "rgba(10,10,10,0.62)" }}>
              Based in Markham, Ontario. Available for remote engagements worldwide.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
