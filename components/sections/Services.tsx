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
          <span className="mono-label" style={{ color: "rgba(10,10,10,0.55)" }}>01 / SERVICES</span>
          <p className="hidden md:block text-sm" style={{ color: "rgba(10,10,10,0.55)" }}>
            A small number of engagements per quarter — depth over volume.
          </p>
        </div>

        {/* Cards */}
        <ul className="flex flex-col gap-4 md:flex-row md:gap-4 md:h-[540px]">
          {SERVICES.map((svc, i) => (
            <motion.li
              key={svc.num}
              className="overflow-hidden rounded-[20px] shrink-0 cursor-pointer"
              style={{ background: svc.bg, minHeight: "320px" }}
              animate={{
                flex: active === null ? 1 : active === i ? 2.8 : 0.45,
              }}
              transition={{ duration: 0.55, ease: [0.25, 0, 0.25, 1] }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              data-cursor-hover
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
            >
              <div className="flex h-full flex-col p-7 md:p-8">

                {/* Top: number + description (revealed on expand) */}
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="flex-1 transition-all duration-500"
                    style={{
                      opacity: active === i ? 1 : 0,
                      transform: active === i ? "translateY(0)" : "translateY(8px)",
                      pointerEvents: active === i ? "auto" : "none",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.88rem",
                        color: "rgba(245,244,239,0.85)",
                        maxWidth: "38ch",
                        lineHeight: 1.7,
                      }}
                    >
                      {svc.description}
                    </p>
                  </div>

                  <span
                    className="mono-label shrink-0 self-start"
                    style={{ color: "rgba(245,244,239,0.45)", marginTop: "2px" }}
                  >
                    {svc.num}
                  </span>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Bottom: title + tags + arrow */}
                <div>
                  {/* Title — small in default, large when expanded */}
                  <div className="overflow-hidden mb-4">
                    <motion.h3
                      className="font-bold uppercase leading-none whitespace-nowrap"
                      style={{
                        fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                        letterSpacing: "-0.04em",
                        color: "#F5F4EF",
                        opacity: active !== null && active !== i ? 0.38 : 1,
                        transition: "opacity 0.35s ease",
                      }}
                      animate={{
                        fontSize:
                          active === i
                            ? "clamp(3rem, 5.8vw, 7rem)"
                            : "clamp(1.5rem, 2vw, 2.2rem)",
                      }}
                      transition={{ duration: 0.55, ease: [0.25, 0, 0.25, 1] }}
                    >
                      {svc.title}
                    </motion.h3>
                  </div>

                  {/* Tags — visible in default + expanded, hidden when contracted */}
                  <div
                    className="flex flex-wrap gap-2 mb-5 transition-all duration-400"
                    style={{
                      opacity: active !== null && active !== i ? 0 : 1,
                      transform: active !== null && active !== i ? "translateY(4px)" : "translateY(0)",
                    }}
                  >
                    {svc.tags.map(tag => (
                      <span
                        key={tag}
                        className="mono-label px-2.5 py-1 border"
                        style={{
                          color: "rgba(245,244,239,0.62)",
                          borderColor: "rgba(245,244,239,0.18)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div
                    className="mono-label transition-all duration-400"
                    style={{
                      color: active === i
                        ? "rgba(245,244,239,0.85)"
                        : "rgba(245,244,239,0.4)",
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
