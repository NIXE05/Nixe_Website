"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/Button";
import { Plate, PlateInner, SectionHead } from "@/components/Plate";

const SCREENSHOTS = [
  "/apps/courtsy/screen-1.png",
  "/apps/courtsy/screen-2.png",
  "/apps/courtsy/screen-3.png",
  "/apps/courtsy/screen-4.png",
  "/apps/courtsy/screen-5.png",
];

const SPECS = [
  ["Platform", "iOS 26+"],
  ["Price", "Free"],
  ["Status", "Coming Soon"],
  ["Category", "Sports"],
] as const;

function AppScreenshot({
  src,
  alt,
  offsetY = 0,
  onClick,
}: {
  src: string;
  alt: string;
  offsetY?: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="relative shrink-0 cursor-pointer overflow-hidden rounded-[24px]"
      style={{
        width: 188,
        aspectRatio: "9 / 19.5",
        marginTop: offsetY,
        boxShadow: "0 24px 64px rgba(10,10,10,0.14), 0 0 0 1px rgba(10,10,10,0.06)",
      }}
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
    >
      <Image src={src} alt={alt} fill className="object-cover object-top" sizes="188px" />
    </motion.div>
  );
}

function Lightbox({ images, onClose }: { images: string[]; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-10 overflow-y-auto"
      style={{ background: "rgba(250,250,247,0.97)", backdropFilter: "blur(20px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="fixed top-10 right-10 w-12 h-12 flex items-center justify-center text-nixe-ink/40 hover:text-nixe-ink transition-colors duration-200 border"
          style={{ borderColor: "rgba(10,10,10,0.1)" }}
          aria-label="Close"
        >
          ✕
        </button>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 pt-8">
          {images.map((src, i) => (
            <motion.div
              key={src}
              className="relative rounded-[20px] overflow-hidden"
              style={{ aspectRatio: "9/19.5", boxShadow: "0 8px 32px rgba(10,10,10,0.1)" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Image
                src={src}
                alt={`Courtsy screenshot ${i + 1}`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 45vw, 20vw"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Shipped() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const openLightbox = (from: number) => {
    setStartIndex(from);
    setLightboxOpen(true);
  };
  const displayedImages = [...SCREENSHOTS.slice(startIndex), ...SCREENSHOTS.slice(0, startIndex)];

  // Scrubbed parallax — each phone drifts at its own rate as the section passes.
  const phonesRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: phonesRef,
    offset: ["start end", "end start"],
  });
  const phoneY1 = useTransform(scrollYProgress, [0, 1], [26, -26]);
  const phoneY2 = useTransform(scrollYProgress, [0, 1], [64, -8]);
  const phoneY3 = useTransform(scrollYProgress, [0, 1], [42, -18]);

  return (
    <Plate id="shipped" tone="paper" index="03" className="overflow-hidden">
      <PlateInner>
        <SectionHead
          index="03"
          label="Shipped"
          headline={["The first", "one's out."]}
          kicker="A closer look at Courtsy: match tracking and analytics for racquet sports."
          className="mb-14 md:mb-20"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-14 lg:gap-24 items-center">
          <motion.div
            ref={phonesRef}
            className="flex gap-4 md:gap-5 items-start justify-center lg:justify-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.25, 0, 0.25, 1] }}
          >
            <motion.div style={{ y: phoneY1 }}>
              <AppScreenshot src={SCREENSHOTS[0]} alt="Courtsy home" offsetY={0} onClick={() => openLightbox(0)} />
            </motion.div>
            <motion.div style={{ y: phoneY2 }}>
              <AppScreenshot src={SCREENSHOTS[1]} alt="Courtsy matches" offsetY={52} onClick={() => openLightbox(1)} />
            </motion.div>
            <motion.div style={{ y: phoneY3 }}>
              <AppScreenshot src={SCREENSHOTS[2]} alt="Courtsy stats" offsetY={20} onClick={() => openLightbox(2)} />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.25, 0, 0.25, 1], delay: 0.1 }}
          >
            <div
              className="relative mb-8 overflow-hidden"
              style={{
                width: 92,
                height: 92,
                borderRadius: "26%",
                background: "#FFFFFF",
                boxShadow:
                  "0 18px 40px rgba(10,10,10,0.18), 0 4px 10px rgba(10,10,10,0.08), inset 0 0 0 1px rgba(10,10,10,0.04)",
              }}
            >
              <Image src="/apps/courtsy/icon.png" alt="Courtsy" fill className="object-cover" sizes="92px" />
            </div>

            <h3
              className="font-bold mb-2"
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: "clamp(1.5rem, 2.5vw, 2.75rem)",
                letterSpacing: "-0.02em",
                fontWeight: 800,
                color: "var(--tone-fg)",
              }}
            >
              Courtsy
            </h3>
            <div className="mono-label mb-7" style={{ color: "var(--tone-fg-3)" }}>
              Sports · iOS · 2026
            </div>

            <p
              className="mb-9 leading-relaxed max-w-[48ch]"
              style={{ fontSize: "1rem", color: "var(--tone-fg-2)" }}
            >
              Match tracking and performance analytics for racquet sports. Live scoring, player
              insights, expense splitting, and match history. Built for competitive players who
              want to level up.
            </p>

            {/* Spec table — reads as a product datasheet rather than marketing copy */}
            <dl
              className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10 pt-7"
              style={{ borderTop: "1px solid var(--tone-line)" }}
            >
              {SPECS.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1">
                  <dt className="mono-label" style={{ color: "var(--tone-fg-4)", fontSize: "0.58rem" }}>
                    {k}
                  </dt>
                  <dd className="mono-label m-0" style={{ color: "var(--tone-fg-2)" }}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex gap-4 items-center flex-wrap">
              <Button href="/courtsy">Visit Courtsy Site →</Button>
              <Button variant="outline" onClick={() => openLightbox(0)}>
                View Screenshots
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-24 pt-8 text-center"
          style={{ borderTop: "1px solid var(--tone-line-soft)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p style={{ fontSize: "0.95rem", color: "var(--tone-fg-3)" }}>
            More apps in development.{" "}
            <a
              href="#contact"
              className="transition-opacity duration-200 hover:opacity-60"
              style={{ color: "var(--tone-fg)" }}
            >
              Have an idea? →
            </a>
          </p>
        </motion.div>
      </PlateInner>

      {/* Portal: the lightbox is position:fixed and must not be trapped by any
          transformed ancestor. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {lightboxOpen && (
              <Lightbox images={displayedImages} onClose={() => setLightboxOpen(false)} />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </Plate>
  );
}
