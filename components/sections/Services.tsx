"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

const SERVICES = [
  {
    num: "01",
    title: "CYBERSECURITY",
    tags: ["Architecture Review", "Threat Modeling", "Cloud Audits"],
    description:
      "Security designed from the ground up — not bolted on after. We architect, audit, and harden systems for teams who ship without compromise.",
    bg: "#0A0A0A",
  },
  {
    num: "02",
    title: "AI CONSULTING",
    tags: ["AI Strategy", "LLM Integration", "Responsible Deployment"],
    description:
      "Intelligent systems built with intent. From strategy to hands-on LLM engineering — AI that works in production, responsibly.",
    bg: "#0B1525",
  },
  {
    num: "03",
    title: "APPLICATIONS",
    tags: ["iOS / Swift", "SwiftUI", "Product Engineering"],
    description:
      "Native iOS apps built with precision. SwiftUI-first, performance-conscious, designed to feel inevitable. Concept to App Store.",
    bg: "#111111",
  },
];

export function Services() {
  const [active, setActive] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 35%"],
  });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0 100% 0 0 round 20px 20px 0 0)", "inset(0 0% 0 0 round 20px 20px 0 0)"]
  );

  return (
    <motion.section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden"
      style={{
        background: "#F0EFEA",
        clipPath,
        paddingTop: "clamp(64px,10vh,140px)",
        paddingBottom: "clamp(64px,10vh,140px)",
      }}
    >
      <div className="px-6 md:px-10 max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10 md:mb-14">
          <span className="mono-label" style={{ color: "rgba(10,10,10,0.4)" }}>01 / SERVICES</span>
          <p className="hidden md:block text-sm" style={{ color: "rgba(10,10,10,0.4)" }}>
            A small number of engagements per quarter — depth over volume.
          </p>
        </div>

        {/* Cards */}
        <ul className="flex flex-col gap-4 md:flex-row md:gap-4 md:h-[520px]">
          {SERVICES.map((svc, i) => (
            <motion.li
              key={svc.num}
              className="overflow-hidden rounded-[20px] shrink-0 cursor-pointer"
              style={{ background: svc.bg, minHeight: "320px" }}
              animate={{
                flex: active === null ? 1 : active === i ? 2.6 : 0.55,
              }}
              transition={{ duration: 0.55, ease: [0.25, 0, 0.25, 1] }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              data-cursor-hover
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
            >
              <div className="flex h-full flex-col p-7 md:p-9">

                {/* Top: number + description (revealed on expand) */}
                <div className="flex items-start justify-between gap-4">
                  {/* Description — fades in when active */}
                  <div
                    className="flex-1 transition-all duration-500"
                    style={{
                      opacity: active === i ? 1 : 0,
                      transform: active === i ? "translateY(0)" : "translateY(8px)",
                      pointerEvents: active === i ? "auto" : "none",
                    }}
                  >
                    <p
                      className="leading-relaxed mb-6"
                      style={{
                        fontSize: "0.9rem",
                        color: "rgba(245,244,239,0.6)",
                        maxWidth: "36ch",
                        lineHeight: 1.65,
                      }}
                    >
                      {svc.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {svc.tags.map(tag => (
                        <span
                          key={tag}
                          className="mono-label px-2.5 py-1 border"
                          style={{ color: "rgba(245,244,239,0.35)", borderColor: "rgba(245,244,239,0.1)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Number — always visible, top-right */}
                  <span
                    className="mono-label shrink-0 self-start"
                    style={{ color: "rgba(245,244,239,0.25)", marginTop: "2px" }}
                  >
                    {svc.num}
                  </span>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Bottom: large title (clips when contracted) + arrow */}
                <div>
                  <h3
                    className="font-bold uppercase whitespace-nowrap leading-none"
                    style={{
                      fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                      /* Large enough to fill the expanded card width */
                      fontSize: "clamp(3rem, 7vw, 8rem)",
                      letterSpacing: "-0.04em",
                      color: "#F5F4EF",
                      marginBottom: "1.25rem",
                      /* Slight fade on inactive cards */
                      opacity: active !== null && active !== i ? 0.35 : 1,
                      transition: "opacity 0.35s ease",
                    }}
                  >
                    {svc.title}
                  </h3>

                  <div
                    className="mono-label transition-all duration-400"
                    style={{
                      color: active === i
                        ? "rgba(245,244,239,0.8)"
                        : "rgba(245,244,239,0.25)",
                      transform: active === i ? "translateX(6px)" : "translateX(0)",
                    }}
                  >
                    →
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
