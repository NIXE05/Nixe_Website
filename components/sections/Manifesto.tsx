"use client";

import { motion } from "framer-motion";

export function Manifesto() {
  return (
    <section
      id="manifesto"
      style={{
        background: "#FAFAF7",
        borderTop: "1px solid rgba(10,10,10,0.07)",
        paddingTop: "clamp(80px,14vh,180px)",
        paddingBottom: "clamp(80px,14vh,180px)",
      }}
    >
      <div className="px-6 md:px-10 max-w-[920px] mx-auto text-center">
        <motion.p
          className="mono-label mb-8"
          style={{ color: "rgba(10,10,10,0.3)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          WHAT WE BELIEVE
        </motion.p>
        <motion.h2
          className="manifesto-headline text-nixe-ink"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.25, 0, 0.25, 1], delay: 0.1 }}
        >
          Security, intelligence, and craft — treated as one discipline, not
          three departments.
        </motion.h2>
      </div>
    </section>
  );
}
