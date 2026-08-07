"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/Button";
import { Plate, PlateInner, SectionHead } from "@/components/Plate";
import { BookingLedger, RegiaDashboard } from "@/components/RegiaScreens";

const SCREENSHOTS = [
  "/apps/courtsy/screen-1.png",
  "/apps/courtsy/screen-2.png",
  "/apps/courtsy/screen-3.png",
  "/apps/courtsy/screen-4.png",
  "/apps/courtsy/screen-5.png",
];

const AUTOPLAY_MS = 7000;

/* ─── Shared slide furniture ─── */

function SlideCopy({
  name,
  meta,
  blurb,
  specs,
  children,
}: {
  name: string;
  meta: string;
  blurb: string;
  specs: ReadonlyArray<readonly [string, string]>;
  children: React.ReactNode;
}) {
  return (
    <div>
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
        {name}
      </h3>
      <div className="mono-label mb-7" style={{ color: "var(--tone-fg-3)" }}>
        {meta}
      </div>

      <p className="mb-9 leading-relaxed max-w-[48ch]" style={{ fontSize: "1rem", color: "var(--tone-fg-2)" }}>
        {blurb}
      </p>

      <dl
        className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10 pt-7"
        style={{ borderTop: "1px solid var(--tone-line)" }}
      >
        {specs.map(([k, v]) => (
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

      <div className="flex gap-4 items-center flex-wrap">{children}</div>
    </div>
  );
}

/* ─── Courtsy ─── */

const COURTSY_SPECS = [
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
        width: 172,
        aspectRatio: "9 / 19.5",
        marginTop: offsetY,
        boxShadow: "0 24px 64px rgba(10,10,10,0.14), 0 0 0 1px rgba(10,10,10,0.06)",
      }}
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
    >
      <Image src={src} alt={alt} fill className="object-cover object-top" sizes="172px" />
    </motion.div>
  );
}

function CourtsySlide({ onOpenLightbox }: { onOpenLightbox: (i: number) => void }) {
  const phonesRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: phonesRef,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [26, -26]);
  const y2 = useTransform(scrollYProgress, [0, 1], [64, -8]);
  const y3 = useTransform(scrollYProgress, [0, 1], [42, -18]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-14 lg:gap-20 items-center">
      <div
        ref={phonesRef}
        className="flex gap-4 md:gap-5 items-start justify-center lg:justify-start"
      >
        <motion.div style={{ y: y1 }}>
          <AppScreenshot src={SCREENSHOTS[0]} alt="Courtsy home" onClick={() => onOpenLightbox(0)} />
        </motion.div>
        <motion.div style={{ y: y2 }}>
          <AppScreenshot src={SCREENSHOTS[1]} alt="Courtsy matches" offsetY={48} onClick={() => onOpenLightbox(1)} />
        </motion.div>
        <motion.div style={{ y: y3 }}>
          <AppScreenshot src={SCREENSHOTS[2]} alt="Courtsy stats" offsetY={18} onClick={() => onOpenLightbox(2)} />
        </motion.div>
      </div>

      <SlideCopy
        name="Courtsy"
        meta="Sports · iOS · 2026"
        blurb="Match tracking and performance analytics for racquet sports. Live scoring, player insights, expense splitting, and match history. Built for competitive players who want to level up."
        specs={COURTSY_SPECS}
      >
        <Button href="/courtsy">Visit Courtsy Site →</Button>
        <Button variant="outline" onClick={() => onOpenLightbox(0)}>
          View Screenshots
        </Button>
      </SlideCopy>
    </div>
  );
}

/* ─── Regia ─── */

const REGIA_SPECS = [
  ["Platform", "Web, iOS, Android"],
  ["Status", "Live at its first venue"],
  ["Sector", "Marriage halls"],
  ["Region", "Tamil Nadu"],
] as const;

function RegiaSlide() {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start end", "end start"],
  });
  const yBack = useTransform(scrollYProgress, [0, 1], [40, -18]);
  const yFront = useTransform(scrollYProgress, [0, 1], [18, -40]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-14 lg:gap-20 items-center">
      {/* A composed product shot: the dashboard behind, a booking in front.
          Two windows, not three. A third crowded the column and covered the
          chart and the upcoming list, which are the point of the dashboard. */}
      <div ref={stackRef} className="relative" style={{ minHeight: 400 }}>
        <motion.div className="relative" style={{ y: yBack, width: "92%", marginLeft: "auto" }}>
          <RegiaDashboard />
        </motion.div>

        <motion.div
          className="absolute"
          style={{ y: yFront, left: 0, bottom: "-6%", width: "52%", zIndex: 2 }}
        >
          <BookingLedger compact />
        </motion.div>
      </div>

      <SlideCopy
        name="Regia"
        meta="Venue Management · Web · 2026"
        blurb="Venue management for marriage halls and event venues. Bookings and advances, itemised billing, the expenses against each event and the deposits that follow, with the books reconciled as you go."
        specs={REGIA_SPECS}
      >
        <Button href="/regia">Visit Regia Site →</Button>
        <Button href="/?intent=regia#contact" variant="outline">
          Request a Demo
        </Button>
      </SlideCopy>
    </div>
  );
}

/* ─── Lightbox (Courtsy only) ─── */

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

/* ─── Section ─── */

const SLIDES = ["Courtsy", "Regia"] as const;

export function Shipped() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const reduced = useReducedMotion();

  const openLightbox = (from: number) => {
    setStartIndex(from);
    setLightboxOpen(true);
  };
  const displayedImages = [...SCREENSHOTS.slice(startIndex), ...SCREENSHOTS.slice(0, startIndex)];

  const go = (next: number) => setActive((next + SLIDES.length) % SLIDES.length);

  // Auto-advance. Held while hovered or focused, while the lightbox is open,
  // while the section is off-screen, and entirely under reduced motion.
  useEffect(() => {
    if (reduced || paused || lightboxOpen || !inView) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % SLIDES.length), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, paused, lightboxOpen, inView, reduced]);

  return (
    <Plate id="shipped" tone="paper" index="03" className="overflow-hidden">
      <PlateInner>
        <SectionHead
          index="03"
          label="Shipped"
          headline={["Out in", "the world."]}
          kicker="One app heading for the App Store, one system already running a real business."
          className="mb-12 md:mb-16"
        />

        {/* Carousel controls */}
        <div
          className="flex items-center justify-between gap-6 mb-10 pb-4"
          style={{ borderBottom: "1px solid var(--tone-line-soft)" }}
        >
          <div className="flex items-center gap-2" role="tablist" aria-label="Shipped products">
            {SLIDES.map((name, i) => (
              <button
                key={name}
                role="tab"
                aria-selected={i === active}
                aria-controls={`shipped-panel-${i}`}
                onClick={() => go(i)}
                className="mono-label px-3 py-2 transition-colors duration-300"
                style={{
                  color: i === active ? "var(--tone-fg)" : "var(--tone-fg-4)",
                  borderBottom: `2px solid ${i === active ? "var(--tone-fg)" : "transparent"}`,
                }}
              >
                {String(i + 1).padStart(2, "0")} {name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {(["prev", "next"] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => go(dir === "prev" ? active - 1 : active + 1)}
                aria-label={dir === "prev" ? "Previous product" : "Next product"}
                className="flex items-center justify-center transition-colors duration-300"
                style={{
                  width: 38,
                  height: 38,
                  border: "1px solid var(--tone-line)",
                  color: "var(--tone-fg-2)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--tone-fg)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--tone-line)")}
              >
                {dir === "prev" ? "←" : "→"}
              </button>
            ))}
          </div>
        </div>

        {/* Stage */}
        <div
          ref={sectionRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          className="relative"
          style={{ minHeight: 470 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              id={`shipped-panel-${active}`}
              role="tabpanel"
              aria-label={SLIDES[active]}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.38, ease: [0.25, 0, 0.25, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.14}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70) go(active + 1);
                else if (info.offset.x > 70) go(active - 1);
              }}
            >
              {active === 0 ? <CourtsySlide onOpenLightbox={openLightbox} /> : <RegiaSlide />}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          className="mt-20 pt-8 text-center"
          style={{ borderTop: "1px solid var(--tone-line-soft)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p style={{ fontSize: "0.95rem", color: "var(--tone-fg-3)" }}>
            More in development.{" "}
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
          transformed ancestor (the slide wrapper is one). */}
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
