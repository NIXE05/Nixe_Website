"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { Plate, PlateInner, SectionHead } from "@/components/Plate";

type Project = {
  id: string;
  name: string;
  year: string;
  category: string;
  description: string;
  link?: string;
  comingSoon?: boolean;
  iconSrc?: string;
  /** URL shown in the browser chrome when iconKind === "browser". */
  url?: string;
  /**
   * "app"      → square iOS-app-icon styling (white rounded square + shadow). Default.
   * "wordmark" → horizontal logo rendered centered on the card bg, no container.
   * "browser"  → logo framed inside a browser window (for multiplatform web apps).
   */
  iconKind?: "app" | "wordmark" | "browser";
};

const PROJECTS: Project[] = [
  {
    id: "courtsy",
    name: "Courtsy",
    year: "2026",
    category: "iOS App",
    description:
      "Match tracking and performance analytics for racquet sports. Live scoring, player insights, and match history.",
    link: "/courtsy",
    iconSrc: "/apps/courtsy/icon.png",
  },
  {
    id: "clavis",
    name: "Clavis",
    year: "TBA",
    category: "Hospitality PMS",
    description:
      "AI-native hotel property management with WhatsApp guest comms, automated billing, and multi-tenant support from day one. In private development.",
    comingSoon: true,
    link: "/clavis",
    iconSrc: "/apps/clavis/wordmark-hd.png",
    iconKind: "browser",
    url: "clavis.app",
  },
];

function VisualPlaceholder({ project, hovered }: { project: Project; hovered: boolean }) {
  return (
    <div
      className="relative aspect-[16/9] overflow-hidden"
      style={{
        background: project.comingSoon
          ? "linear-gradient(135deg, #ECEBE5 0%, #DCDBD6 100%)"
          : "linear-gradient(135deg, #F4F3EE 0%, #DCDBD6 100%)",
        borderBottom: "1px solid rgba(10,10,10,0.08)",
      }}
    >
      {/* Blueprint dots */}
      <div className="absolute inset-0 blueprint-dot pointer-events-none" />

      {/* Centered icon — browser window for web apps, iOS app-icon for square assets, wordmark for horizontal logos, monogram fallback */}
      <div className="absolute inset-0 flex items-center justify-center">
        {project.iconSrc && project.iconKind === "browser" ? (
          <motion.div
            className="relative w-[62%] max-w-[400px]"
            animate={{ y: hovered ? -5 : 0, scale: hovered ? 1.03 : 1 }}
            transition={{ duration: 0.45, ease: [0.25, 0, 0.25, 1] }}
          >
            <div
              className="overflow-hidden rounded-[12px]"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(10,10,10,0.10)",
                boxShadow:
                  "0 20px 44px rgba(10,10,10,0.16), 0 4px 12px rgba(10,10,10,0.07), inset 0 0 0 1px rgba(255,255,255,0.6)",
              }}
            >
              {/* Title bar */}
              <div
                className="flex items-center px-3.5"
                style={{
                  height: 34,
                  borderBottom: "1px solid rgba(10,10,10,0.07)",
                  background: "linear-gradient(180deg, #FBFBF9 0%, #F2F1EC 100%)",
                }}
              >
                {/* Traffic-light dots */}
                <div className="flex items-center gap-[6px]" style={{ width: 40 }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(10,10,10,0.14)" }} />
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(10,10,10,0.14)" }} />
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(10,10,10,0.14)" }} />
                </div>
                {/* URL pill */}
                <div className="flex flex-1 justify-center">
                  <div
                    className="mono-label inline-flex items-center gap-1.5"
                    style={{
                      height: 19,
                      padding: "0 11px",
                      borderRadius: 999,
                      background: "rgba(10,10,10,0.045)",
                      border: "1px solid rgba(10,10,10,0.06)",
                      color: "rgba(10,10,10,0.42)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.02em",
                    }}
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>{project.url ?? "app"}</span>
                  </div>
                </div>
                {/* Spacer to balance the dots */}
                <div style={{ width: 40 }} />
              </div>

              {/* Viewport */}
              <div
                className="flex items-center justify-center"
                style={{ aspectRatio: "16 / 9", background: "#FFFFFF" }}
              >
                <div
                  className="relative"
                  style={{ width: "62%", aspectRatio: "1947 / 808" }}
                >
                  <Image
                    src={project.iconSrc}
                    alt={`${project.name} logo`}
                    fill
                    className="object-contain"
                    sizes="240px"
                    priority={false}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : project.iconSrc && project.iconKind === "wordmark" ? (
          <motion.div
            className="relative"
            style={{ width: 220, height: 70 }}
            animate={{ y: hovered ? -4 : 0, scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.45, ease: [0.25, 0, 0.25, 1] }}
          >
            <Image
              src={project.iconSrc}
              alt={`${project.name} logo`}
              fill
              className="object-contain"
              sizes="220px"
              priority={false}
            />
          </motion.div>
        ) : project.iconSrc ? (
          <motion.div
            className="relative overflow-hidden"
            style={{
              width: 164,
              height: 164,
              borderRadius: "26%",
              background: "#FFFFFF",
              boxShadow:
                "0 18px 40px rgba(10,10,10,0.18), 0 4px 10px rgba(10,10,10,0.08), inset 0 0 0 1px rgba(10,10,10,0.04)",
            }}
            animate={{ y: hovered ? -6 : 0, scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.45, ease: [0.25, 0, 0.25, 1] }}
          >
            <Image
              src={project.iconSrc}
              alt={`${project.name} icon`}
              fill
              className="object-cover"
              sizes="164px"
            />
          </motion.div>
        ) : (
          <motion.div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 110,
              height: 110,
              border: "1px solid rgba(10,10,10,0.18)",
              background: "rgba(250,250,247,0.55)",
              backdropFilter: "blur(4px)",
            }}
            animate={{ rotate: hovered ? 8 : 0, scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0, 0.25, 1] }}
          >
            <span
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: "1.85rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "rgba(10,10,10,0.55)",
              }}
            >
              {project.name.charAt(0)}
            </span>
          </motion.div>
        )}
      </div>

      {/* Coming soon ribbon */}
      {project.comingSoon && (
        <div
          className="absolute top-4 left-4 mono-label inline-flex items-center gap-2 px-2.5 py-1"
          style={{
            border: "1px solid rgba(10,10,10,0.2)",
            color: "rgba(10,10,10,0.55)",
            background: "rgba(250,250,247,0.7)",
            backdropFilter: "blur(6px)",
          }}
        >
          <span
            aria-hidden
            className="size-[5px] rounded-full shrink-0"
            style={{ background: "rgba(10,10,10,0.5)", animation: "blipPulse 2.6s ease-in-out infinite" }}
          />
          Coming Soon
        </div>
      )}

      {/* Hover sheen */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const interactive = !!project.link;

  const Wrapper = interactive ? motion.a : motion.div;
  const wrapperProps = interactive
    ? ({ href: project.link } as Record<string, string>)
    : ({} as Record<string, string>);

  return (
    <Wrapper
      {...wrapperProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.25, 0, 0.25, 1] }}
      className="block overflow-hidden rounded-[20px] no-underline"
      style={{
        background: "var(--tone-raise)",
        border: "1px solid var(--tone-line-soft)",
        color: "inherit",
        opacity: project.comingSoon && !hovered ? 0.94 : 1,
        transform: hovered && interactive ? "translateY(-8px)" : "translateY(0)",
        boxShadow:
          hovered && interactive
            ? "0 24px 64px rgba(10,10,10,0.12), 0 0 0 1px rgba(10,10,10,0.06)"
            : "0 2px 10px rgba(10,10,10,0.04)",
        transition:
          "transform 0.4s cubic-bezier(0.25, 0, 0.25, 1), box-shadow 0.4s, opacity 0.3s",
      }}
    >
      <VisualPlaceholder project={project} hovered={hovered} />

      <div className="p-7 md:p-8">
        <div className="mono-label mb-3" style={{ color: "var(--tone-fg-3)" }}>
          {project.category} · {project.year}
        </div>

        <h3
          className="font-bold mb-3"
          style={{
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize: "clamp(1.65rem, 2.6vw, 2.1rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          {project.name}
        </h3>

        <p className="leading-relaxed" style={{ fontSize: "0.98rem", color: "var(--tone-fg-2)" }}>
          {project.description}
        </p>

        <div
          className="mono-label mt-7 inline-flex items-center gap-2 transition-all duration-300"
          style={{
            color: interactive ? "var(--tone-fg-3)" : "var(--tone-fg-4)",
            transform: hovered && interactive ? "translateX(6px)" : "translateX(0)",
          }}
        >
          {interactive ? "View Project" : "In Development"}
          {interactive && <span aria-hidden>→</span>}
        </div>
      </div>
    </Wrapper>
  );
}

export function FeaturedProjects() {
  return (
    <Plate id="work" tone="bone" index="01">
      <PlateInner>
        <SectionHead
          index="01"
          label="Selected Work"
          headline={["Projects we're", "proud to ship."]}
          kicker="One shipped, one more compounding in private. We only ship things we'd want to use ourselves."
          className="mb-14 md:mb-20"
        />

        {/* Cards sit on a shared baseline. The second card used to carry a
            scroll-scrubbed drift; with two equal full-width cards that just
            read as a misalignment, so it's gone. */}
        <div className="grid gap-7 md:gap-10 grid-cols-1 sm:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </PlateInner>
    </Plate>
  );
}
