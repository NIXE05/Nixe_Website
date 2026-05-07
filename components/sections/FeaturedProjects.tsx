"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import { SectionMorph } from "@/components/SectionMorph";
import { WordReveal } from "@/components/WordReveal";

type Project = {
  id: string;
  name: string;
  year: string;
  category: string;
  description: string;
  link?: string;
  comingSoon?: boolean;
  iconSrc?: string;
};

const PROJECTS: Project[] = [
  {
    id: "courtly",
    name: "Courtly",
    year: "2026",
    category: "iOS App",
    description:
      "Match tracking and performance analytics for racquet sports. Live scoring, player insights, and match history.",
    link: "/courtly",
    iconSrc: "/apps/courtly/icon.png",
  },
  {
    id: "alpha",
    name: "Alpha Platform",
    year: "TBA",
    category: "AI System",
    description:
      "Enterprise LLM deployment platform with responsible-AI guardrails. Currently in private development.",
    comingSoon: true,
  },
  {
    id: "secureflow",
    name: "SecureFlow",
    year: "TBA",
    category: "Security Audit",
    description:
      "End-to-end SOC 2 compliance program for high-growth fintech. Deep architecture review in progress.",
    comingSoon: true,
  },
];

function VisualPlaceholder({ project, hovered }: { project: Project; hovered: boolean }) {
  return (
    <div
      className="relative aspect-[16/10] overflow-hidden border-b"
      style={{
        background: project.comingSoon
          ? "linear-gradient(135deg, #ECEBE5 0%, #DCDBD6 100%)"
          : "linear-gradient(135deg, #F4F3EE 0%, #DCDBD6 100%)",
        borderColor: "rgba(10,10,10,0.08)",
      }}
    >
      {/* Blueprint dots */}
      <div className="absolute inset-0 blueprint-dot pointer-events-none" />

      {/* Centered icon for Courtly, monogram for placeholders */}
      <div className="absolute inset-0 flex items-center justify-center">
        {project.iconSrc ? (
          <motion.div
            className="relative overflow-hidden"
            style={{
              width: 124,
              height: 124,
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
              sizes="124px"
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
          className="absolute top-4 left-4 mono-label px-2.5 py-1"
          style={{
            border: "1px solid rgba(10,10,10,0.2)",
            color: "rgba(10,10,10,0.55)",
            background: "rgba(250,250,247,0.7)",
            backdropFilter: "blur(6px)",
          }}
        >
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

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);
  const interactive = !project.comingSoon && project.link;

  const Wrapper = interactive ? motion.a : motion.div;
  const wrapperProps = interactive
    ? ({
        href: project.link,
        "data-cursor-hover": "true",
      } as Record<string, string>)
    : ({} as Record<string, string>);

  return (
    <Wrapper
      {...wrapperProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.25, 0, 0.25, 1] }}
      className="block overflow-hidden rounded-[20px] no-underline"
      style={{
        background: "#FAFAF7",
        border: "1px solid rgba(10,10,10,0.08)",
        color: "inherit",
        cursor: interactive ? "none" : "default",
        opacity: project.comingSoon && !hovered ? 0.92 : 1,
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
        <div
          className="mono-label mb-3"
          style={{ color: "rgba(10,10,10,0.5)" }}
        >
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

        <p
          className="leading-relaxed"
          style={{
            fontSize: "0.98rem",
            color: "rgba(10,10,10,0.65)",
          }}
        >
          {project.description}
        </p>

        <div
          className="mono-label mt-7 inline-flex items-center gap-2 transition-all duration-300"
          style={{
            color: project.comingSoon
              ? "rgba(10,10,10,0.35)"
              : "rgba(10,10,10,0.55)",
            transform:
              hovered && interactive ? "translateX(6px)" : "translateX(0)",
          }}
        >
          {project.comingSoon ? "In Development" : "View Project"}
          {!project.comingSoon && <span aria-hidden>→</span>}
        </div>
      </div>
    </Wrapper>
  );
}

export function FeaturedProjects() {
  return (
    <SectionMorph
      id="work"
      bg="#F4F3EE"
      style={{
        paddingTop: "clamp(96px, 14vh, 180px)",
        paddingBottom: "clamp(96px, 14vh, 180px)",
      }}
    >
      <div className="px-6 md:px-10 max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-14 md:mb-20">
          <div>
            <div
              className="mono-label mb-5"
              style={{ color: "rgba(10,10,10,0.55)" }}
            >
              02 / SELECTED WORK
            </div>
            <h2
              className="display-xl text-nixe-ink uppercase"
              style={{ lineHeight: 0.95 }}
            >
              <WordReveal>Projects we&apos;re</WordReveal>
              <WordReveal delay={0.18}>proud to ship.</WordReveal>
            </h2>
          </div>
          <p
            className="max-w-[34ch] text-sm leading-relaxed md:pb-2"
            style={{ color: "rgba(10,10,10,0.6)" }}
          >
            One shipped, two more compounding in private. We only ship things
            we&apos;d want to use ourselves.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-7 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </SectionMorph>
  );
}
