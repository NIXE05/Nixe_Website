"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

import { ParallaxLayer } from "@/components/ParallaxLayer";
import { WordReveal } from "@/components/WordReveal";

export type Tone = "paper" | "bone" | "ink";

interface PlateProps {
  id?: string;
  tone: Tone;
  /**
   * Chapter number ("01"). When set, the plate gets its decorative depth layer:
   * a soft wash and an oversized watermark numeral that drift against the page
   * as it scrolls. Omit it for plates that supply their own (Services animates
   * a numeral per pinned panel).
   */
  index?: string;
  /** Skip the default vertical rhythm (the pinned Services plate sizes itself). */
  bare?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * A section is a PLATE: an opaque slab of colour with a hard edge against its
 * neighbours. This deliberately replaces the old SectionMorph/BackgroundMorph
 * pair, where every section was transparent over a shared 3D world and the page
 * colour was interpolated continuously — sections bled into one another by
 * design. Now each one paints its own background and stops dead at its border.
 *
 * `tone` publishes CSS variables (--tone-fg, --tone-line, …) that descendants
 * read instead of hard-coding ink colours, so the same markup stays legible
 * whether the plate is paper or near-black.
 *
 * Nothing here transforms its children — `position: sticky` inside a plate
 * works, which is what the pinned Services section relies on.
 */
export function Plate({
  id,
  tone,
  index,
  bare = false,
  className,
  style,
  children,
}: PlateProps) {
  return (
    <section
      id={id}
      data-tone={tone}
      className={`plate plate-${tone} ${className ?? ""}`}
      style={
        bare
          ? style
          : {
              paddingTop: "clamp(88px, 13vh, 168px)",
              paddingBottom: "clamp(88px, 13vh, 168px)",
              ...style,
            }
      }
    >
      {/* zIndex -1 keeps the decor above the plate's own background but beneath
          the in-flow content, so children need no wrapper or stacking fixes. */}
      {index && (
        <ParallaxLayer travel={54} style={{ zIndex: -1 }}>
          <div
            className="absolute"
            style={{
              right: "-8%",
              top: "8%",
              width: "60%",
              height: "70%",
              background:
                "radial-gradient(circle at 50% 50%, var(--tone-fill), transparent 70%)",
            }}
          />
          <span
            className="absolute select-none"
            style={{
              right: "1.5%",
              bottom: "4%",
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: "clamp(8rem, 19vw, 20rem)",
              fontWeight: 800,
              lineHeight: 0.78,
              letterSpacing: "-0.06em",
              color: "var(--tone-fg)",
              opacity: 0.035,
            }}
          >
            {index}
          </span>
        </ParallaxLayer>
      )}
      {children}
    </section>
  );
}

/** Standard inner width + gutters. Every plate uses the same measure. */
export function PlateInner({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={`px-6 md:px-10 max-w-[1440px] mx-auto ${className ?? ""}`}
      style={style}
    >
      {children}
    </div>
  );
}

interface SectionHeadProps {
  /** "01" */
  index: string;
  /** "SELECTED WORK" */
  label: string;
  /** One entry per headline line — each reveals on its own beat. */
  headline: string[];
  /** Short right-aligned note that sits opposite the headline. */
  kicker?: string;
  className?: string;
}

/**
 * The consistent chrome every plate opens with: a hairline rule carrying the
 * chapter index on the left and the chapter name on the right, then the
 * headline beneath it. Identical framing across sections is what lets the
 * *contents* differ wildly without the page falling apart.
 */
export function SectionHead({
  index,
  label,
  headline,
  kicker,
  className,
}: SectionHeadProps) {
  return (
    <div className={className}>
      {/* Index rail */}
      <motion.div
        className="flex items-baseline justify-between gap-6 pb-4"
        style={{ borderBottom: "1px solid var(--tone-line)" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="mono-label" style={{ color: "var(--tone-fg-3)" }}>
          {index} / {label}
        </span>
        <span
          className="mono-label"
          style={{ color: "var(--tone-fg-4)", fontSize: "0.58rem" }}
        >
          NIXE
        </span>
      </motion.div>

      {/* Headline + kicker */}
      <div className="flex flex-col gap-6 pt-10 md:pt-14 md:flex-row md:items-end md:justify-between">
        <h2
          className="display-xl uppercase"
          style={{ color: "var(--tone-fg)", lineHeight: 0.95 }}
        >
          {headline.map((line, i) => (
            <WordReveal key={line} delay={i * 0.16}>
              {line}
            </WordReveal>
          ))}
        </h2>

        {kicker && (
          <motion.p
            className="max-w-[34ch] text-sm leading-relaxed md:pb-3 md:text-right"
            style={{ color: "var(--tone-fg-3)" }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            {kicker}
          </motion.p>
        )}
      </div>
    </div>
  );
}
