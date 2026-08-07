"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";

import { Plate } from "@/components/Plate";
import {
  MotifAI,
  MotifApps,
  MotifSecurity,
} from "@/components/ServiceMotif";

const SERVICES = [
  {
    num: "01",
    title: "Cybersecurity",
    lede: "Security designed from the ground up, not bolted on after.",
    body: "We architect, audit, and harden systems for teams who ship without compromise. Threat models that reflect how your product actually works, and reviews that end in fixes rather than findings.",
    tags: ["Architecture Review", "Threat Modeling", "Cloud Audits"],
    Motif: MotifSecurity,
  },
  {
    num: "02",
    title: "AI Consulting",
    lede: "Intelligent systems built with intent.",
    body: "From strategy to hands-on LLM engineering: evaluation harnesses, retrieval that holds up, and guardrails that survive contact with real users. AI that works in production, responsibly.",
    tags: ["AI Strategy", "LLM Integration", "Responsible Deployment"],
    Motif: MotifAI,
  },
  {
    num: "03",
    title: "Applications",
    lede: "Native iOS apps built with precision.",
    body: "SwiftUI-first, performance-conscious, designed to feel inevitable. We take products from concept through App Store review, and stay for the version that matters.",
    tags: ["iOS / Swift", "SwiftUI", "Product Engineering"],
    Motif: MotifApps,
  },
] as const;

const COUNT = SERVICES.length;
/**
 * Panel visibility as a function of distance (in panel units) from its centre:
 * fully opaque within HOLD, gone by FADE_END. The two windows are complementary
 * rather than overlapping — both panels share the same left column, so any
 * simultaneous visibility renders two headlines on top of each other. Keeping
 * the ramp short (0.1 of a panel ≈ 90px of scroll) makes the handover read as a
 * cut rather than a gap.
 */
const HOLD = 0.4;
const FADE_END = 0.5;

type Service = (typeof SERVICES)[number];

/**
 * One pinned panel. Each computes its own scroll-driven opacity/offset from the
 * shared track progress, so the panels cut through the ink plate rather than
 * cross-dissolving into a muddy overlap: at the midpoint between two panels
 * both are at zero and the plate reads as empty for an instant.
 */
function Panel({
  service,
  index,
  progress,
  isActive,
}: {
  service: Service;
  index: number;
  progress: MotionValue<number>;
  isActive: boolean;
}) {
  const span = COUNT - 1;
  const opacity = useTransform(
    progress,
    [
      (index - FADE_END) / span,
      (index - HOLD) / span,
      (index + HOLD) / span,
      (index + FADE_END) / span,
    ],
    [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    [(index - 1) / span, (index + 1) / span],
    [80, -80],
  );

  const { Motif } = service;

  return (
    <motion.div
      className="absolute inset-0 flex items-center"
      style={{ opacity, y, pointerEvents: isActive ? "auto" : "none" }}
      aria-hidden={!isActive}
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 xl:gap-20 items-center">
        {/* Copy */}
        <div>
          <div
            className="mono-label mb-6"
            style={{ color: "var(--tone-fg-3)" }}
          >
            {service.num} / Practice
          </div>

          <h3
            className="uppercase mb-7"
            style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: "clamp(2.4rem, 5.2vw, 5.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 0.94,
              color: "var(--tone-fg)",
            }}
          >
            {service.title}
          </h3>

          <p
            className="mb-5 max-w-[34ch]"
            style={{
              fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)",
              lineHeight: 1.45,
              color: "var(--tone-fg)",
            }}
          >
            {service.lede}
          </p>

          <p
            className="mb-10 max-w-[46ch] leading-relaxed"
            style={{ fontSize: "0.98rem", color: "var(--tone-fg-2)" }}
          >
            {service.body}
          </p>

          <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
            {service.tags.map((tag) => (
              <li
                key={tag}
                className="mono-label px-3 py-2"
                style={{
                  color: "var(--tone-fg-2)",
                  border: "1px solid var(--tone-line)",
                }}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {/* Motif */}
        <div className="hidden lg:flex items-center justify-center">
          <div
            className="relative w-full"
            style={{ maxWidth: 440, aspectRatio: "1 / 1" }}
          >
            <Motif />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Services() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(
      COUNT - 1,
      Math.max(0, Math.round(p * (COUNT - 1))),
    );
    setActive((prev) => (prev === next ? prev : next));
  });

  // Rail fill mirrors travel through the pinned track.
  const railScale = useTransform(scrollYProgress, [0, 1], [1 / COUNT, 1]);

  return (
    <Plate id="services" tone="ink" bare>
      <div className="blueprint-dot absolute inset-0 pointer-events-none opacity-70" />

      {/* ── Desktop: the plate pins and the panels advance ── */}
      <div
        ref={trackRef}
        className="hidden md:block relative"
        style={{ height: `${COUNT * 100}vh` }}
      >
        <div className="sticky top-0 h-dvh overflow-hidden flex flex-col">
          {/* Header rail — persists across every panel */}
          <div className="px-6 md:px-10 pt-28 shrink-0">
            <div className="max-w-[1440px] mx-auto">
              <div
                className="flex items-baseline justify-between gap-6 pb-4"
                style={{ borderBottom: "1px solid var(--tone-line)" }}
              >
                <span
                  className="mono-label"
                  style={{ color: "var(--tone-fg-3)" }}
                >
                  02 / Services
                </span>
                <span
                  className="mono-label hidden lg:block"
                  style={{ color: "var(--tone-fg-4)" }}
                >
                  A small number of engagements per quarter. Depth over volume.
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {SERVICES.map((s, i) => (
                    <span
                      key={s.num}
                      className="block h-[2px]"
                      style={{
                        width: i === active ? 28 : 12,
                        background:
                          i === active ? "var(--tone-fg)" : "var(--tone-fg-4)",
                        transition:
                          "width 0.45s cubic-bezier(0.25,0,0.25,1), background-color 0.45s",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Panel stage */}
          <div className="relative flex-1 px-6 md:px-10">
            <div className="relative h-full max-w-[1440px] mx-auto">
              {/* Ghost numeral behind the stage */}
              <div
                aria-hidden
                className="absolute pointer-events-none select-none"
                style={{
                  right: "-1.5%",
                  bottom: "-8%",
                  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                  fontSize: "clamp(12rem, 26vw, 28rem)",
                  fontWeight: 800,
                  lineHeight: 0.8,
                  letterSpacing: "-0.06em",
                  color: "var(--tone-fg)",
                  opacity: 0.035,
                }}
              >
                {SERVICES[active].num}
              </div>

              {SERVICES.map((s, i) => (
                <Panel
                  key={s.num}
                  service={s}
                  index={i}
                  progress={scrollYProgress}
                  isActive={active === i}
                />
              ))}
            </div>
          </div>

          {/* Footer rail */}
          <div className="px-6 md:px-10 pb-10 shrink-0">
            <div className="max-w-[1440px] mx-auto">
              <div
                className="flex items-center justify-between gap-6 pt-5"
                style={{ borderTop: "1px solid var(--tone-line)" }}
              >
                <div
                  className="relative h-[2px] flex-1 max-w-[240px]"
                  style={{ background: "var(--tone-line)" }}
                >
                  <motion.span
                    className="absolute inset-y-0 left-0 w-full origin-left block"
                    style={{ background: "var(--tone-fg)", scaleX: railScale }}
                  />
                </div>
                <span
                  className="mono-label"
                  style={{ color: "var(--tone-fg-3)" }}
                >
                  {active < COUNT - 1
                    ? `Next: ${SERVICES[active + 1].title}`
                    : "Keep scrolling"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile: no pinning; the panels simply stack ── */}
      <div className="md:hidden px-6 py-24">
        <div
          className="flex items-baseline justify-between gap-6 pb-4"
          style={{ borderBottom: "1px solid var(--tone-line)" }}
        >
          <span className="mono-label" style={{ color: "var(--tone-fg-3)" }}>
            02 / Services
          </span>
          <span className="mono-label" style={{ color: "var(--tone-fg-4)" }}>
            NIXE
          </span>
        </div>

        <p
          className="mt-8 mb-14 max-w-[34ch]"
          style={{ fontSize: "1.05rem", color: "var(--tone-fg-2)" }}
        >
          A small number of engagements per quarter. Depth over volume.
        </p>

        <div className="flex flex-col gap-16">
          {SERVICES.map((s) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.25, 0, 0.25, 1] }}
              style={{ borderTop: "1px solid var(--tone-line)" }}
              className="pt-8"
            >
              <div
                className="mono-label mb-5"
                style={{ color: "var(--tone-fg-3)" }}
              >
                {s.num} / Practice
              </div>
              <h3
                className="uppercase mb-5"
                style={{
                  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                  fontSize: "clamp(2rem, 11vw, 3rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  lineHeight: 0.95,
                  color: "var(--tone-fg)",
                }}
              >
                {s.title}
              </h3>
              <p
                className="mb-4"
                style={{ fontSize: "1.05rem", color: "var(--tone-fg)" }}
              >
                {s.lede}
              </p>
              <p
                className="mb-7 leading-relaxed"
                style={{ fontSize: "0.95rem", color: "var(--tone-fg-2)" }}
              >
                {s.body}
              </p>
              <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                {s.tags.map((tag) => (
                  <li
                    key={tag}
                    className="mono-label px-3 py-2"
                    style={{
                      color: "var(--tone-fg-2)",
                      border: "1px solid var(--tone-line)",
                    }}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </Plate>
  );
}
