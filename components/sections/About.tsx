"use client";

import { motion } from "framer-motion";

import { Plate, PlateInner, SectionHead } from "@/components/Plate";

const CAPABILITIES = [
  ["Security", ["Master's, Cybersecurity", "Threat Modeling", "AWS / Cloud Security"]],
  ["Intelligence", ["AI Strategy", "LLM Integration", "Apache Iceberg / Trino"]],
  ["Product", ["iOS / Swift / SwiftUI", "Product Engineering", "Concept to App Store"]],
] as const;

const FACTS = [
  ["Founded", "2024"],
  ["Base", "Markham, Ontario"],
  ["Engagements", "Remote, worldwide"],
] as const;

export function About() {
  return (
    <Plate id="about" tone="bone" index="04">
      <div className="absolute inset-0 blueprint-dot pointer-events-none opacity-60" />

      <PlateInner className="relative z-10">
        <SectionHead
          index="04"
          label="About NIXE"
          headline={["Boutique", "consulting,", "engineered."]}
          kicker="We're not here to check boxes. We're here to understand your system, identify what matters, and build solutions that last."
          className="mb-16 md:mb-24"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-24 items-start">
          {/* Statement */}
          <div className="flex flex-col gap-7">
            <motion.p
              className="leading-relaxed"
              style={{ fontSize: "clamp(1.15rem, 1.7vw, 1.5rem)", color: "var(--tone-fg)" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.25, 0, 0.25, 1] }}
            >
              We engineer trust into intelligent systems. From security architecture to AI
              deployment, we help teams build software that works responsibly, reliably
              and at scale.
            </motion.p>

            <motion.p
              className="leading-relaxed max-w-[52ch]"
              style={{ fontSize: "1rem", color: "var(--tone-fg-2)" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.25, 0, 0.25, 1], delay: 0.12 }}
            >
              Small by design. Every engagement is run by the people who do the work, which
              is why we take on a handful at a time rather than a pipeline of them.
            </motion.p>

            {/* Facts ledger */}
            <dl
              className="grid grid-cols-1 sm:grid-cols-3 gap-y-5 gap-x-8 mt-6 pt-8"
              style={{ borderTop: "1px solid var(--tone-line)" }}
            >
              {FACTS.map(([k, v], i) => (
                <motion.div
                  key={k}
                  className="flex flex-col gap-1.5"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                >
                  <dt
                    className="mono-label"
                    style={{ color: "var(--tone-fg-4)", fontSize: "0.58rem" }}
                  >
                    {k}
                  </dt>
                  <dd className="m-0" style={{ fontSize: "0.95rem", color: "var(--tone-fg)" }}>
                    {v}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>

          {/* Capability index */}
          <div className="flex flex-col">
            {CAPABILITIES.map(([group, items], gi) => (
              <motion.div
                key={group}
                className="py-7"
                style={{ borderTop: "1px solid var(--tone-line)" }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: gi * 0.1, ease: [0.25, 0, 0.25, 1] }}
              >
                <div
                  className="mono-label mb-4"
                  style={{ color: "var(--tone-fg-4)", fontSize: "0.58rem" }}
                >
                  {String(gi + 1).padStart(2, "0")} / {group}
                </div>
                <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="block h-px w-4 shrink-0"
                        style={{ background: "var(--tone-fg-4)" }}
                      />
                      <span style={{ fontSize: "0.95rem", color: "var(--tone-fg-2)" }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </PlateInner>
    </Plate>
  );
}
