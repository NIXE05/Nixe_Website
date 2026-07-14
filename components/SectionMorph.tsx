"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type CSSProperties, type ReactNode } from "react";

interface SectionMorphProps {
  id?: string;
  bg: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Sections blend instead of stacking: content eases in while the section
 * enters, drifts gently while in view, and eases away as it leaves, so
 * adjacent chapters visibly hand off to each other. Sections stay
 * transparent — the page color lives on <html> (BackgroundMorph) so the
 * fixed WorldCanvas shows through everywhere.
 *
 * NOTE: children render inside a transformed wrapper, so position:fixed
 * descendants (modals, lightboxes) must escape through a portal.
 */
export function SectionMorph({
  id,
  bg,
  className,
  style,
  children,
}: SectionMorphProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.16, 0.8, 1], [0.15, 1, 1, 0.1]);
  const y = useTransform(scrollYProgress, [0, 1], [46, -46]);
  // Depth cue: content arrives fractionally "further away" and settles to
  // full size while read — the same travel grammar as the camera's dolly.
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.984, 1, 1, 0.992]);

  return (
    <section
      ref={ref}
      id={id}
      data-bg-color={bg}
      className={`relative ${className ?? ""}`}
      style={style}
    >
      <motion.div style={{ opacity, y, scale }}>{children}</motion.div>
    </section>
  );
}
