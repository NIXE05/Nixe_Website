"use client";

import { motion } from "framer-motion";

const STEPS = [
  { num: "01", title: "DISCOVER", desc: "Understand context, threats, and ambitions." },
  { num: "02", title: "DESIGN",   desc: "Architect secure, intelligent solutions." },
  { num: "03", title: "BUILD",    desc: "Ship working software with precision." },
  { num: "04", title: "HARDEN",   desc: "Security review baked into delivery." },
];

export function Process() {
  return (
    <section
      id="process"
      style={{
        background: "#FAFAF7",
        borderTop: "1px solid rgba(10,10,10,0.07)",
        paddingTop: "clamp(80px,12vh,160px)",
        paddingBottom: "clamp(80px,12vh,160px)",
      }}
    >
      <div className="px-6 md:px-10 max-w-[1440px] mx-auto">
        <div className="mono-label mb-16 md:mb-24" style={{ color: "rgba(10,10,10,0.55)" }}>
          04 / PROCESS
        </div>

        <div className="relative">
          {/* Blueprint connecting line — desktop */}
          <motion.div
            className="hidden md:block absolute left-0 right-0 h-px pointer-events-none"
            style={{ top: "1.75rem", background: "rgba(10,10,10,0.1)", transformOrigin: "left center" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.5, ease: [0.25, 0, 0.25, 1] }}
          />

          {/* Step marker dots on the line */}
          <div
            className="hidden md:grid grid-cols-4 absolute left-0 right-0 pointer-events-none"
            style={{ top: "1.75rem" }}
          >
            {STEPS.map((_, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-start"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.7 + i * 0.18, type: "spring", stiffness: 500, damping: 22 }}
              >
                <div
                  className="w-[5px] h-[5px] rounded-full"
                  style={{ background: "rgba(10,10,10,0.32)", marginLeft: "-2.5px" }}
                />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, ease: [0.25, 0, 0.25, 1], delay: i * 0.09 }}
              >
                <div
                  className="font-bold mb-5 select-none"
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                    fontSize: "clamp(1.75rem, 3.5vw, 4rem)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: "rgba(10,10,10,0.08)",
                    fontWeight: 800,
                  }}
                >
                  {step.num}
                </div>
                <h3
                  className="text-nixe-ink font-bold mb-3"
                  style={{
                    fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                    fontSize: "clamp(0.9rem, 1.4vw, 1.25rem)",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(10,10,10,0.65)" }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
