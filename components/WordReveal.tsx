"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type CSSProperties } from "react";

interface WordRevealProps {
  children: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  amount?: number;
  /** Extra gate (e.g. the loader's reveal moment). Defaults to open. */
  active?: boolean;
}

export function WordReveal({
  children,
  delay = 0,
  stagger = 0.06,
  duration = 0.85,
  className,
  style,
  amount = 0.25,
  active = true,
}: WordRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const words = children.split(" ");
  const show = inView && active;

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "block", ...style }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{
            display: "inline-block",
            verticalAlign: "bottom",
            paddingBottom: "0.06em",
            marginRight: i < words.length - 1 ? "0.28em" : 0,
          }}
        >
          <motion.span
            style={{ display: "inline-block", willChange: "opacity" }}
            initial={{ opacity: 0 }}
            animate={show ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration,
              ease: [0.25, 0, 0.25, 1],
              delay: delay + i * stagger,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
