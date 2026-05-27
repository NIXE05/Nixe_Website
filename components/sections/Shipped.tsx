"use client";

import { WordReveal } from "@/components/WordReveal";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const SCREENSHOTS = [
  "/apps/courtsy/screen-1.png",
  "/apps/courtsy/screen-2.png",
  "/apps/courtsy/screen-3.png",
  "/apps/courtsy/screen-4.png",
  "/apps/courtsy/screen-5.png",
];

function AppScreenshot({ src, alt, offsetY = 0, onClick }: {
  src: string; alt: string; offsetY?: number; onClick: () => void;
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
      data-cursor-hover
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
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="fixed top-10 right-10 w-12 h-12 flex items-center justify-center text-nixe-ink/40 hover:text-nixe-ink transition-colors duration-200 border"
          style={{ borderColor: "rgba(10,10,10,0.1)" }}
          data-cursor-hover aria-label="Close"
        >✕</button>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 pt-8">
          {images.map((src, i) => (
            <motion.div
              key={src}
              className="relative rounded-[20px] overflow-hidden"
              style={{ aspectRatio: "9/19.5", boxShadow: "0 8px 32px rgba(10,10,10,0.1)" }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Image src={src} alt={`Courtsy screenshot ${i + 1}`} fill className="object-cover object-top" sizes="(max-width: 768px) 45vw, 20vw" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Shipped() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [startIndex, setStartIndex]     = useState(0);

  const openLightbox = (from: number) => { setStartIndex(from); setLightboxOpen(true); };
  const displayedImages = [...SCREENSHOTS.slice(startIndex), ...SCREENSHOTS.slice(0, startIndex)];

  return (
    <motion.section
      id="shipped"
      data-bg-color="#FAFAF7"
      className="relative overflow-hidden"
      style={{
        background: "#FAFAF7",
        paddingTop: "clamp(96px, 14vh, 180px)",
        paddingBottom: "clamp(96px, 14vh, 180px)",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.9, ease: [0.25, 0, 0.25, 1] }}
    >
      <div className="px-6 md:px-10 max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-5 mb-14 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mono-label mb-5" style={{ color: "rgba(10,10,10,0.55)" }}>
              03 / SHIPPED
            </div>
            <h2 className="display-xl text-nixe-ink uppercase" style={{ lineHeight: 0.95 }}>
              <WordReveal>The first</WordReveal>
              <WordReveal delay={0.18}>one&apos;s out.</WordReveal>
            </h2>
          </div>
          <p className="hidden md:block text-sm max-w-[34ch] md:pb-3" style={{ color: "rgba(10,10,10,0.6)" }}>
            A closer look at Courtsy — match tracking and analytics for racquet sports.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-14 lg:gap-24 items-center">
          <motion.div
            className="flex gap-4 md:gap-5 items-start justify-center lg:justify-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.25, 0, 0.25, 1] }}
          >
            <AppScreenshot src={SCREENSHOTS[0]} alt="Courtsy home"    offsetY={0}  onClick={() => openLightbox(0)} />
            <AppScreenshot src={SCREENSHOTS[1]} alt="Courtsy matches" offsetY={52} onClick={() => openLightbox(1)} />
            <AppScreenshot src={SCREENSHOTS[2]} alt="Courtsy stats"   offsetY={20} onClick={() => openLightbox(2)} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.25, 0, 0.25, 1], delay: 0.1 }}
          >
            <div className="relative mb-8" style={{ width: 220, height: 60 }}>
              <Image
                src="/apps/courtsy/wordmark.png"
                alt="Courtsy"
                fill
                className="object-contain object-left"
                sizes="220px"
              />
            </div>
            <div className="mono-label mb-7" style={{ color: "rgba(10,10,10,0.55)" }}>Sports · iOS · 2026</div>

            <p className="mb-8 leading-relaxed max-w-[48ch]" style={{ fontSize: "1rem", color: "rgba(10,10,10,0.72)" }}>
              Match tracking and performance analytics for racquet sports. Live
              scoring, player insights, expense splitting, and match history —
              built for competitive players who want to level up.
            </p>

            <div className="mono-label mb-9" style={{ fontSize: "0.6rem", color: "rgba(10,10,10,0.5)" }}>
              ★ COMING SOON · iOS 26+ · FREE
            </div>

            <div className="flex gap-6 items-center flex-wrap">
              <a
                href="/courtsy"
                data-cursor-hover
                className="group/btn inline-flex items-center h-[46px] px-7 transition-all duration-300"
                style={{
                  background: "var(--color-nixe-ink)",
                  color: "var(--color-nixe-pearl)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 14px 32px rgba(10,10,10,0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span className="mono-label" style={{ color: "var(--color-nixe-pearl)" }}>
                  Visit Courtsy Site →
                </span>
              </a>
              <button
                onClick={() => openLightbox(0)}
                className="mono-label transition-colors duration-200 hover:text-nixe-ink"
                style={{ color: "rgba(10,10,10,0.45)" }}
                data-cursor-hover
              >
                View screenshots →
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-28 pt-10 border-t text-center"
          style={{ borderColor: "rgba(10,10,10,0.07)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p style={{ fontSize: "0.95rem", color: "rgba(10,10,10,0.62)" }}>
            More apps in development.{" "}
            <a href="#contact" className="hover:text-nixe-ink transition-colors duration-200" style={{ color: "rgba(10,10,10,0.6)" }} data-cursor-hover>
              Have an idea? →
            </a>
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightboxOpen && <Lightbox images={displayedImages} onClose={() => setLightboxOpen(false)} />}
      </AnimatePresence>
    </motion.section>
  );
}
