"use client";

import { motion } from "framer-motion";
import { type CSSProperties, type ReactNode } from "react";

interface SectionMorphProps {
  id?: string;
  bg: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Wraps a section with a clean fade + small upward slide as it enters viewport.
 * No clipPath wipe (was producing semi-transparent mid-states that read as janky).
 * Body bg morph still happens via BackgroundMorph picking up data-bg-color.
 */
export function SectionMorph({
  id,
  bg,
  className,
  style,
  children,
}: SectionMorphProps) {
  return (
    <motion.section
      id={id}
      data-bg-color={bg}
      className={`relative ${className ?? ""}`}
      style={{
        background: bg,
        ...style,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.9, ease: [0.25, 0, 0.25, 1] }}
    >
      {children}
    </motion.section>
  );
}
