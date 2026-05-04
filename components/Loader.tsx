"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const LETTERS = ["N", "I", "X", "E"];

export function Loader() {
  const [show, setShow] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("nixe:visited");
    if (!hasVisited) {
      setShow(true);
      const t = setTimeout(() => {
        setExit(true);
        sessionStorage.setItem("nixe:visited", "1");
      }, 2400);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && !exit && (
        <motion.div
          className="fixed inset-0 z-[99999] bg-nixe-paper flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative flex items-center justify-center">
            <svg className="absolute" width={240} height={240} viewBox="0 0 160 160" aria-hidden="true">
              <motion.circle
                cx={80} cy={80} r={70}
                fill="none"
                stroke="rgba(10,10,10,0.12)"
                strokeWidth={1}
                strokeLinecap="round"
                pathLength={1}
                initial={{ pathLength: 0, rotate: -90 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
                style={{ transformOrigin: "80px 80px" }}
              />
            </svg>
            <div className="relative flex gap-1">
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={letter}
                  className="display-l text-nixe-ink tracking-[0.1em]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 0, 0.25, 1], delay: i * 0.1 }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
