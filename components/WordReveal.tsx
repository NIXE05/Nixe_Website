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
}

export function WordReveal({
  children,
  delay = 0,
  stagger = 0.06,
  duration = 0.85,
  className,
  style,
  amount = 0.25,
}: WordRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const words = children.split(" ");

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
            overflow: "hidden",
            verticalAlign: "bottom",
            paddingBottom: "0.06em",
            marginRight: i < words.length - 1 ? "0.28em" : 0,
          }}
        >
          <motion.span
            style={{ display: "inline-block", willChange: "transform" }}
            initial={{ y: "115%" }}
            animate={inView ? { y: "0%" } : { y: "115%" }}
            transition={{
              duration,
              ease: [0.76, 0, 0.24, 1],
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
