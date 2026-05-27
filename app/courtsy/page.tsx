"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { WaitlistButton } from "@/components/WaitlistButton";
import { WordReveal } from "@/components/WordReveal";

// ─── Content ──────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    num: "01",
    title: "Stats that mean something to your group",
    desc: "Win rate, streaks, formats — and the parts you actually argue about: best partner, biggest rival, head-to-head.",
  },
  {
    num: "02",
    title: "Tap a score. Done.",
    desc: "Singles, doubles, mixed — pick your sport, players, score. Results auto-update everyone's stats and leaderboards.",
  },
  {
    num: "03",
    title: "Settle the court fee in seconds",
    desc: "Equal, unequal, percentage, shares. Pay-by counts, balances roll up across every session.",
  },
  {
    num: "04",
    title: "RSVP-driven sessions",
    desc: "Recurring bookings, max-player caps, waitlist. Everyone sees who's in before they pack the gear.",
  },
  {
    num: "05",
    title: "Best partners, worst rivals",
    desc: "The kind of social context only your group's data can reveal — see your wins together, head-to-heads, and edge.",
  },
  {
    num: "06",
    title: "Streaks that travel with you",
    desc: "Track your longest run, the matches that broke it, and the day you got it back. Plus your home court — calculated.",
  },
];

const STEPS = [
  { num: "01", title: "CREATE", desc: "Spin up a group. Invite your regulars by email — they get a join code, they're in." },
  { num: "02", title: "PLAN",   desc: "Schedule a session. Pick the court, set the cap, RSVP. Recurring bookings are one tap." },
  { num: "03", title: "PLAY",   desc: "Log the match. Singles, doubles, mixed. Tap winners and scores while you're catching breath." },
  { num: "04", title: "SETTLE", desc: "Split & settle. The fee splits how you want. Balances net out across the season." },
];

const META_ITEMS = [
  { label: "3 SPORTS",     value: "Badminton · Tennis · Squash" },
  { label: "4 SPLIT TYPES", value: "Equal · Shares · % · Custom" },
  { label: "FREE IN BETA", value: "No credit card" },
];

// ─── Top nav: simple back-link + Courtsy wordmark ────────────────────────────
function CourtsyNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between"
      style={{
        padding: scrolled ? "14px 16px" : "28px 40px",
        transition: "padding 0.5s cubic-bezier(0.76,0,0.24,1)",
      }}
    >
      <div
        className="flex w-full items-center justify-between transition-all duration-500"
        style={scrolled ? {
          background: "rgba(250,250,247,0.92)",
          backdropFilter: "blur(16px)",
          borderRadius: "10px",
          padding: "8px 16px",
          border: "1px solid rgba(10,10,10,0.08)",
          boxShadow: "0 2px 20px rgba(10,10,10,0.06)",
        } : {}}
      >
        <Link href="/" data-cursor-hover className="group/back inline-flex items-center gap-3" aria-label="Back to NIXE">
          <span
            className="mono-label transition-colors duration-200"
            style={{ color: "rgba(10,10,10,0.55)" }}
          >
            ← NIXE
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="relative" style={{ width: 132, height: 32 }}>
            <Image
              src="/apps/courtsy/wordmark.png"
              alt="Courtsy"
              fill
              priority
              className="object-contain"
              sizes="132px"
            />
          </div>
        </div>

        <WaitlistButton size="sm" variant="dark">
          Join Waitlist
        </WaitlistButton>
      </div>
    </nav>
  );
}

// ─── iPhone screenshot frame ─────────────────────────────────────────────────
function PhoneFrame({
  src,
  alt,
  width = 188,
  offsetY = 0,
}: {
  src: string;
  alt: string;
  width?: number;
  offsetY?: number;
}) {
  return (
    <motion.div
      className="relative shrink-0 overflow-hidden"
      style={{
        width,
        aspectRatio: "9 / 19.5",
        marginTop: offsetY,
        borderRadius: width >= 280 ? 44 : 28,
        boxShadow:
          "0 28px 64px rgba(10,10,10,0.16), 0 0 0 1px rgba(10,10,10,0.08), 0 0 0 6px rgba(10,10,10,0.04)",
        background: "#0A0A0A",
      }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.25, 0, 0.25, 1] }}
      data-cursor-hover
    >
      <Image src={src} alt={alt} fill className="object-cover object-top" sizes={`${width}px`} />
    </motion.div>
  );
}

// ─── iOS app-icon ────────────────────────────────────────────────────────────
function AppIcon({ size = 124 }: { size?: number }) {
  return (
    <div
      className="relative overflow-hidden shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: "26%",
        background: "#FFFFFF",
        boxShadow:
          "0 18px 40px rgba(10,10,10,0.18), 0 4px 10px rgba(10,10,10,0.08), inset 0 0 0 1px rgba(10,10,10,0.04)",
      }}
    >
      <Image
        src="/apps/courtsy/icon.png"
        alt="Courtsy app icon"
        fill
        className="object-cover"
        sizes={`${size}px`}
      />
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function CourtsyHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "var(--color-nixe-paper)",
        paddingTop: "calc(140px + env(safe-area-inset-top, 0))",
        paddingBottom: "clamp(80px, 12vh, 140px)",
      }}
    >
      {/* Blueprint dots */}
      <div className="absolute inset-0 blueprint-dot pointer-events-none" />

      <div className="relative z-10 px-6 md:px-10 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-20 items-center">
          {/* Left: copy block */}
          <div>
            {/* Top tags + icon row */}
            <motion.div
              className="flex items-center gap-5 mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0, 0.25, 1] }}
            >
              <AppIcon size={80} />
              <div className="flex flex-wrap gap-2">
                <span
                  className="mono-label px-2.5 py-1 inline-flex"
                  style={{
                    border: "1px solid rgba(10,10,10,0.18)",
                    color: "rgba(10,10,10,0.65)",
                  }}
                >
                  iOS · Free in beta
                </span>
                <span
                  className="mono-label px-2.5 py-1 inline-flex"
                  style={{
                    border: "1px solid rgba(10,10,10,0.18)",
                    color: "rgba(10,10,10,0.65)",
                  }}
                >
                  v1.4 · Sessions update
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <h1
              className="text-nixe-ink uppercase mb-7"
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: "clamp(2.6rem, 7vw, 6.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
              }}
            >
              <WordReveal delay={0.2}>Game on.</WordReveal>
              <WordReveal delay={0.42}>Tabs settled.</WordReveal>
            </h1>

            <motion.p
              className="leading-relaxed max-w-[52ch] mb-10"
              style={{
                fontSize: "1.18rem",
                color: "rgba(10,10,10,0.7)",
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Courtsy is the iOS companion for court sports — log every match, split the
              booking, and watch your win rate, streak, and rivalries grow with your crew.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap items-center gap-3 mb-12"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
            >
              <WaitlistButton variant="dark">Join the Waitlist</WaitlistButton>

              <a
                href="#features"
                data-cursor-hover
                className="inline-flex h-[48px] items-center justify-center px-7"
                style={{
                  border: "1px solid rgba(10,10,10,0.22)",
                  color: "var(--color-nixe-ink)",
                  transition: "border-color 0.3s, background-color 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(10,10,10,0.7)";
                  e.currentTarget.style.backgroundColor = "rgba(10,10,10,0.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(10,10,10,0.22)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span className="mono-label" style={{ color: "var(--color-nixe-ink)" }}>
                  See features
                </span>
              </a>
            </motion.div>

            {/* Meta strip */}
            <motion.div
              className="grid gap-6 sm:grid-cols-3 border-t pt-8"
              style={{ borderColor: "rgba(10,10,10,0.1)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.4 }}
            >
              {META_ITEMS.map((m) => (
                <div key={m.label}>
                  <div className="mono-label mb-2" style={{ color: "rgba(10,10,10,0.5)" }}>
                    {m.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.95rem",
                      color: "rgba(10,10,10,0.78)",
                    }}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: featured phone screenshot */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0, 0.25, 1] }}
          >
            <PhoneFrame src="/apps/courtsy/sim-1.png" alt="Courtsy home screen" width={300} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Features grid ───────────────────────────────────────────────────────────
function CourtsyFeatures() {
  return (
    <motion.section
      id="features"
      className="relative"
      style={{
        background: "var(--color-nixe-bone)",
        paddingTop: "clamp(96px, 14vh, 180px)",
        paddingBottom: "clamp(96px, 14vh, 180px)",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.9, ease: [0.25, 0, 0.25, 1] }}
    >
      <div className="px-6 md:px-10 max-w-[1280px] mx-auto">
        <div className="mb-14 md:mb-20 max-w-[58ch]">
          <div className="mono-label mb-5" style={{ color: "rgba(10,10,10,0.55)" }}>
            01 / FEATURES
          </div>
          <h2
            className="text-nixe-ink uppercase mb-6"
            style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: "clamp(2.4rem, 5vw, 5.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 0.95,
            }}
          >
            <WordReveal>Everything after</WordReveal>
            <WordReveal delay={0.18}>the match.</WordReveal>
          </h2>
          <p
            className="leading-relaxed"
            style={{
              fontSize: "1.1rem",
              color: "rgba(10,10,10,0.65)",
            }}
          >
            Built around what actually happens on court day: sign up your crew, hit the
            courts, tap the score, split the bill, repeat next week.
          </p>
        </div>

        <div className="grid gap-7 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.num}
              className="p-7 md:p-8"
              style={{
                background: "var(--color-nixe-paper)",
                border: "1px solid rgba(10,10,10,0.08)",
                borderRadius: 20,
              }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.25, 0, 0.25, 1], delay: i * 0.06 }}
            >
              <div className="mono-label mb-5" style={{ color: "rgba(10,10,10,0.45)" }}>
                {f.num}
              </div>
              <h3
                className="font-bold mb-3"
                style={{
                  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                  fontSize: "clamp(1.25rem, 1.6vw, 1.55rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  lineHeight: 1.2,
                  color: "var(--color-nixe-ink)",
                }}
              >
                {f.title}
              </h3>
              <p
                className="leading-relaxed"
                style={{
                  fontSize: "0.98rem",
                  color: "rgba(10,10,10,0.65)",
                }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// ─── In the app — staggered phone gallery ───────────────────────────────────
function CourtsyScreenshots() {
  const screens: { src: string; alt: string; offsetY: number }[] = [
    { src: "/apps/courtsy/sim-1.png", alt: "Performance dashboard with win rate and streaks", offsetY: 0 },
    { src: "/apps/courtsy/sim-2.png", alt: "Match history list",                                offsetY: 60 },
    { src: "/apps/courtsy/sim-3.png", alt: "Tap-a-score match entry",                            offsetY: 24 },
    { src: "/apps/courtsy/sim-4.png", alt: "Expense splitting and balances",                     offsetY: 80 },
    { src: "/apps/courtsy/sim-5.png", alt: "RSVP-driven sessions",                               offsetY: 12 },
  ];

  return (
    <motion.section
      id="screens"
      className="relative overflow-hidden"
      style={{
        background: "var(--color-nixe-paper)",
        paddingTop: "clamp(96px, 14vh, 180px)",
        paddingBottom: "clamp(96px, 14vh, 180px)",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.9, ease: [0.25, 0, 0.25, 1] }}
    >
      <div className="px-6 md:px-10 max-w-[1280px] mx-auto">
        <div className="flex flex-col gap-5 mb-14 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[58ch]">
            <div className="mono-label mb-5" style={{ color: "rgba(10,10,10,0.55)" }}>
              02 / IN THE APP
            </div>
            <h2
              className="text-nixe-ink uppercase"
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: "clamp(2.4rem, 5vw, 5.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 0.95,
              }}
            >
              <WordReveal>Five taps to</WordReveal>
              <WordReveal delay={0.18}>match day.</WordReveal>
            </h2>
          </div>
          <p
            className="max-w-[34ch] text-sm leading-relaxed md:pb-3"
            style={{ color: "rgba(10,10,10,0.6)" }}
          >
            Performance dashboard, match history, score entry, expense splitting,
            session planning — every screen built for one-handed use mid-rally.
          </p>
        </div>

        {/* Scrollable phone strip on small screens, horizontal stagger on wide */}
        <div className="relative -mx-6 md:mx-0">
          <div
            className="flex gap-4 md:gap-6 items-start justify-start md:justify-center px-6 md:px-0 overflow-x-auto md:overflow-visible scrollbar-hide pb-6"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {screens.map((s) => (
              <div key={s.src} style={{ scrollSnapAlign: "center" }}>
                <PhoneFrame src={s.src} alt={s.alt} width={196} offsetY={s.offsetY} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ─── How it works ────────────────────────────────────────────────────────────
function CourtsyHowItWorks() {
  return (
    <motion.section
      id="how"
      className="relative"
      style={{
        background: "var(--color-nixe-paper)",
        paddingTop: "clamp(96px, 14vh, 180px)",
        paddingBottom: "clamp(96px, 14vh, 180px)",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.9, ease: [0.25, 0, 0.25, 1] }}
    >
      <div className="px-6 md:px-10 max-w-[1280px] mx-auto">
        <div className="mb-14 md:mb-20 max-w-[58ch]">
          <div className="mono-label mb-5" style={{ color: "rgba(10,10,10,0.55)" }}>
            03 / HOW IT WORKS
          </div>
          <h2
            className="text-nixe-ink uppercase mb-6"
            style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: "clamp(2.4rem, 5vw, 5.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 0.95,
            }}
          >
            <WordReveal>From booking to</WordReveal>
            <WordReveal delay={0.18}>bragging rights.</WordReveal>
          </h2>
          <p
            className="leading-relaxed"
            style={{
              fontSize: "1.1rem",
              color: "rgba(10,10,10,0.65)",
            }}
          >
            No setup spreadsheet. No Venmo round-up. Just the thing you already do, finally
            tracked.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line — desktop only */}
          <motion.div
            className="hidden md:block absolute left-0 right-0 h-px pointer-events-none"
            style={{
              top: "1.75rem",
              background: "rgba(10,10,10,0.1)",
              transformOrigin: "left center",
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.4, ease: [0.25, 0, 0.25, 1] }}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: [0.25, 0, 0.25, 1], delay: i * 0.09 }}
              >
                <div
                  className="font-bold mb-5 select-none"
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                    fontSize: "clamp(1.75rem, 3.5vw, 4rem)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: "rgba(10,10,10,0.08)",
                    fontWeight: 800,
                  }}
                >
                  {step.num}
                </div>
                <h3
                  className="text-nixe-ink font-bold mb-3"
                  style={{
                    fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                    fontSize: "clamp(0.95rem, 1.4vw, 1.25rem)",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{
                    fontSize: "0.95rem",
                    color: "rgba(10,10,10,0.65)",
                  }}
                >
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ─── Download / closing CTA ──────────────────────────────────────────────────
function CourtsyDownload() {
  return (
    <motion.section
      id="download"
      className="relative overflow-hidden"
      style={{
        background: "var(--color-nixe-ink)",
        color: "var(--color-nixe-pearl)",
        paddingTop: "clamp(96px, 14vh, 180px)",
        paddingBottom: "clamp(96px, 14vh, 180px)",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.9, ease: [0.25, 0, 0.25, 1] }}
    >
      <div className="px-6 md:px-10 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 items-center">
          <AppIcon size={132} />

          <div>
            <div className="mono-label mb-5" style={{ color: "rgba(245,244,239,0.55)" }}>
              04 / DOWNLOAD
            </div>
            <h2
              className="uppercase mb-6"
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: "clamp(2.4rem, 5vw, 5.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 0.95,
              }}
            >
              <WordReveal>Get Courtsy</WordReveal>
              <WordReveal delay={0.18}>for iOS.</WordReveal>
            </h2>

            <p
              className="leading-relaxed max-w-[52ch] mb-10"
              style={{
                fontSize: "1.1rem",
                color: "rgba(245,244,239,0.7)",
              }}
            >
              Free during beta. iOS 26+. We&apos;ll keep core match logging free; group
              sessions and advanced stats land in a paid tier under $5/mo.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <WaitlistButton>Join the Waitlist</WaitlistButton>

              <a
                href="mailto:hi@courtsy.app"
                data-cursor-hover
                className="inline-flex h-[48px] items-center justify-center px-7"
                style={{
                  border: "1px solid rgba(245,244,239,0.25)",
                  color: "var(--color-nixe-pearl)",
                  transition: "border-color 0.3s, background-color 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(245,244,239,0.6)";
                  e.currentTarget.style.backgroundColor = "rgba(245,244,239,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(245,244,239,0.25)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span className="mono-label" style={{ color: "var(--color-nixe-pearl)" }}>
                  hi@courtsy.app
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function CourtsyFooter() {
  return (
    <footer
      className="flex flex-col md:flex-row items-center justify-between gap-6 px-6 md:px-10 py-12"
      style={{
        background: "var(--color-nixe-graphite)",
        color: "var(--color-nixe-pearl)",
        borderTop: "1px solid rgba(245,244,239,0.08)",
      }}
    >
      <div className="flex items-center gap-4">
        <span
          className="select-none tracking-[0.12em]"
          style={{
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize: "1.1rem",
            fontWeight: 800,
          }}
        >
          COURTSY
        </span>
        <span className="mono-label" style={{ color: "rgba(245,244,239,0.4)" }}>
          By NIXE · iOS 26+
        </span>
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/courtsy/privacy"
          data-cursor-hover
          className="mono-label transition-colors duration-200"
          style={{ color: "rgba(245,244,239,0.5)" }}
        >
          Privacy
        </Link>
        <Link
          href="/"
          data-cursor-hover
          className="mono-label transition-colors duration-200"
          style={{ color: "rgba(245,244,239,0.5)" }}
        >
          ← Back to NIXE
        </Link>
      </div>
    </footer>
  );
}

// ─── Page export ─────────────────────────────────────────────────────────────
export default function CourtsyPage() {
  return (
    <>
      <CourtsyNav />
      <main>
        <CourtsyHero />
        <CourtsyFeatures />
        <CourtsyScreenshots />
        <CourtsyHowItWorks />
        <CourtsyDownload />
      </main>
      <CourtsyFooter />
    </>
  );
}
