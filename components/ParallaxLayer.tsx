"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Decorative depth. Children drift vertically against the page while the plate
 * scrolls past, so backgrounds sit visibly "behind" the copy.
 *
 * This is for DECORATION ONLY — washes, watermarks, motifs. Never wrap headlines,
 * cards or buttons in it: peer content drifting at different rates is what made
 * the two project cards read as misaligned.
 *
 * The inner layer is overscanned by `travel` on both edges so the drift can never
 * expose a gap, and the whole thing is inert under prefers-reduced-motion.
 */
export function ParallaxLayer({
  travel = 48,
  className,
  style,
  children,
}: {
  /** Peak offset in px. Total differential travel is 2×. */
  travel?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const t = reduced ? 0 : travel;
  const y = useTransform(scrollYProgress, [0, 1], [-t, t]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className ?? ""}`}
      style={style}
    >
      <motion.div
        className="absolute inset-x-0"
        style={{ top: -t, bottom: -t, y, willChange: "transform" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
