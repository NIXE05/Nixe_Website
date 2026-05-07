"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { SectionMorph } from "@/components/SectionMorph";
import { WordReveal } from "@/components/WordReveal";

const CREDENTIALS = [
  "Master's, Cybersecurity",
  "iOS / Swift / SwiftUI",
  "Threat Modeling",
  "AI Strategy",
  "AWS / Cloud Security",
  "Apache Iceberg / Trino",
];

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const blobY = useTransform(scrollYProgress, [0, 1], ["-12%", "22%"]);
  const blobScale = useTransform(scrollYProgress, [0, 1], [0.95, 1.15]);

  return (
    <SectionMorph
      id="about"
      bg="#F0EFEA"
      style={{
        paddingTop: "clamp(96px, 14vh, 180px)",
        paddingBottom: "clamp(96px, 14vh, 180px)",
      }}
    >
      <div ref={sectionRef} className="relative">
        {/* Parallax blob */}
        <motion.div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: "5%",
            right: "-8%",
            width: "55%",
            height: "70%",
            background:
              "radial-gradient(circle at 50% 50%, rgba(10,10,10,0.045), transparent 70%)",
            borderRadius: "50%",
            y: blobY,
            scale: blobScale,
          }}
        />

        {/* Faint blueprint dot grid */}
        <div className="absolute inset-0 blueprint-dot pointer-events-none opacity-60" />

        <div className="relative z-10 px-6 md:px-10 max-w-[1440px] mx-auto">
          <div className="mono-label mb-12 md:mb-20" style={{ color: "rgba(10,10,10,0.55)" }}>
            04 / ABOUT NIXE
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.2fr] gap-14 lg:gap-24 items-start">
            {/* Left — headline */}
            <div>
              <h2
                className="text-nixe-ink uppercase mb-10"
                style={{
                  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                  fontSize: "clamp(2.2rem, 4.5vw, 5rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  lineHeight: 0.95,
                }}
              >
                <WordReveal>Boutique</WordReveal>
                <WordReveal delay={0.18}>consulting,</WordReveal>
                <WordReveal delay={0.36}>engineered.</WordReveal>
              </h2>

              <motion.p
                className="text-sm leading-relaxed max-w-[36ch]"
                style={{ color: "rgba(10,10,10,0.62)" }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                Founded 2024 · Available for remote engagements worldwide.
              </motion.p>
            </div>

            {/* Right — body */}
            <div className="flex flex-col gap-7">
              <motion.p
                className="leading-relaxed border-t pt-7"
                style={{
                  fontSize: "1.2rem",
                  color: "rgba(10,10,10,0.78)",
                  borderColor: "rgba(10,10,10,0.12)",
                }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: [0.25, 0, 0.25, 1] }}
              >
                We engineer trust into intelligent systems. From security
                architecture to AI deployment, we help teams build software
                that works — responsibly, reliably, at scale.
              </motion.p>

              <motion.p
                className="leading-relaxed"
                style={{
                  fontSize: "1.05rem",
                  color: "rgba(10,10,10,0.65)",
                }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: [0.25, 0, 0.25, 1], delay: 0.12 }}
              >
                We&apos;re not here to check boxes — we&apos;re here to
                understand your system, identify what matters, and build
                solutions that last.
              </motion.p>

              {/* Credentials grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-8 pt-8 border-t" style={{ borderColor: "rgba(10,10,10,0.1)" }}>
                {CREDENTIALS.map((c, i) => (
                  <motion.div
                    key={c}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: 0.25 + i * 0.06 }}
                  >
                    <span
                      className="size-1 rounded-full shrink-0"
                      style={{ background: "rgba(10,10,10,0.4)" }}
                    />
                    <span
                      className="mono-label"
                      style={{ color: "rgba(10,10,10,0.65)" }}
                    >
                      {c}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionMorph>
  );
}
