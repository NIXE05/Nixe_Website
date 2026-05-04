"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const SCREENSHOTS = [
  "/apps/courtly/screen-1.png",
  "/apps/courtly/screen-2.png",
  "/apps/courtly/screen-3.png",
  "/apps/courtly/screen-4.png",
  "/apps/courtly/screen-5.png",
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
              <Image src={src} alt={`Courtly screenshot ${i + 1}`} fill className="object-cover object-top" sizes="(max-width: 768px) 45vw, 20vw" />
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
    <section
      id="shipped"
      style={{
        background: "#FAFAF7",
        borderTop: "1px solid rgba(10,10,10,0.07)",
        paddingTop: "clamp(80px,12vh,160px)",
        paddingBottom: "clamp(80px,12vh,160px)",
      }}
    >
      <div className="px-6 md:px-10 max-w-[1440px] mx-auto">
        <div className="mono-label mb-16 md:mb-24" style={{ color: "rgba(10,10,10,0.35)" }}>
          02 / SHIPPED
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-14 lg:gap-24 items-center">
          <motion.div
            className="flex gap-4 md:gap-5 items-start justify-center lg:justify-start"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.25, 0, 0.25, 1] }}
          >
            <AppScreenshot src={SCREENSHOTS[0]} alt="Courtly home"    offsetY={0}  onClick={() => openLightbox(0)} />
            <AppScreenshot src={SCREENSHOTS[1]} alt="Courtly matches" offsetY={52} onClick={() => openLightbox(1)} />
            <AppScreenshot src={SCREENSHOTS[2]} alt="Courtly stats"   offsetY={20} onClick={() => openLightbox(2)} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.25, 0, 0.25, 1], delay: 0.1 }}
          >
            <div
              className="relative mb-8 overflow-hidden rounded-[22%] bg-nixe-stone/30"
              style={{ width: 80, height: 80, boxShadow: "0 8px 32px rgba(10,10,10,0.1), 0 0 0 1px rgba(10,10,10,0.05)" }}
            >
              <Image src="/apps/courtly/icon.png" alt="Courtly" fill className="object-contain p-2" sizes="80px" />
            </div>

            <h2
              className="text-nixe-ink font-bold mb-2"
              style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif", fontSize: "clamp(1.5rem, 2.5vw, 2.75rem)", letterSpacing: "-0.02em", fontWeight: 800 }}
            >
              Courtly
            </h2>
            <div className="mono-label mb-7" style={{ color: "rgba(10,10,10,0.35)" }}>Sports · iOS · 2026</div>

            <p className="mb-8 leading-relaxed max-w-[48ch]" style={{ fontSize: "1rem", color: "rgba(10,10,10,0.55)" }}>
              Match tracking and performance analytics for racquet sports. Live
              scoring, player insights, expense splitting, and match history —
              built for competitive players who want to level up.
            </p>

            <div className="mono-label mb-9" style={{ fontSize: "0.6rem", color: "rgba(10,10,10,0.28)" }}>
              ★ COMING SOON · iOS 17+ · FREE
            </div>

            <div className="flex gap-6 items-center flex-wrap">
              <div
                className="inline-flex items-center px-5 py-3 cursor-not-allowed select-none border"
                style={{ borderColor: "rgba(10,10,10,0.1)" }}
                title="Coming soon"
              >
                <span className="mono-label" style={{ color: "rgba(10,10,10,0.28)" }}>App Store — Coming Soon</span>
              </div>
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
          <p style={{ fontSize: "0.95rem", color: "rgba(10,10,10,0.4)" }}>
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
    </section>
  );
}
