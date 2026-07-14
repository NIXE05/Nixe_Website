"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ClavisWaitlistButton } from "@/components/ClavisWaitlistButton";
import { WordReveal } from "@/components/WordReveal";

// Clavis brand amber (warm hospitality accent). Kept local so the page does not
// depend on a global token that may not exist after a reset.
const AMBER = "#F59E0B";

// ─── Content ──────────────────────────────────────────────────────────────────
type Feature = {
  num: string;
  title: string;
  desc: string;
  /** When set, the card is marked as a post-launch roadmap item. */
  roadmap?: string;
};

const FEATURES: Feature[] = [
  {
    num: "01",
    title: "An AI that runs the floor",
    desc: "Clavis drafts the replies, prices the rooms and closes the night audit. You approve with one tap — or let the agents run on their own.",
  },
  {
    num: "02",
    title: "One calendar. Every channel.",
    desc: "Booking.com, MakeMyTrip, Expedia, Agoda — rates and availability sync both ways, so there are no double bookings and no manual rate updates.",
    roadmap: "Coming after launch",
  },
  {
    num: "03",
    title: "Your front desk, on WhatsApp",
    desc: "Pre-arrival check-in, room service and express checkout — guests just text. In-room QR codes let them order without an app, and every charge lands straight on the folio.",
  },
  {
    num: "04",
    title: "Books that close themselves",
    desc: "Folios auto-post room, F&B and laundry. GST slabs, HSN codes and GSTR-1/3B exports are built in. The night audit runs itself at 1am.",
  },
  {
    num: "05",
    title: "Every room, in real time",
    desc: "Housekeeping queues the moment a guest checks out, supervisors assign on mobile, and Clavis flags the rooms with imminent arrivals first.",
  },
  {
    num: "06",
    title: "Every format, one screen",
    desc: "Multi-property from day one, with layouts that adapt to each kind of property — boutique, business, resort or homestay. Occupancy, revenue and guest history, consolidated across the group.",
  },
];

const STEPS = [
  { num: "01", title: "ONBOARD", desc: "Add your rooms, rates and team. No manual, no two-week setup — you're live the same day." },
  { num: "02", title: "CONNECT", desc: "Plug in your OTAs, WhatsApp and payments. Clavis pulls your bookings in and starts syncing." },
  { num: "03", title: "AUTOMATE", desc: "Switch on the agents — replies, pricing, night audit. Set the guardrails; approve what matters." },
  { num: "04", title: "RUN", desc: "Read your morning briefing, clear the few decisions that need you, and run the hotel from your phone." },
];

const META_ITEMS = [
  { label: "ALL-IN-ONE", value: "PMS · Channels · Finance · CRM" },
  { label: "WHATSAPP-FIRST", value: "Guests · Staff · Briefings" },
  { label: "BUILT FOR INDIA", value: "GST · Form C · UPI" },
];

// ─── Brand wordmark (amber dot + Clavis) ─────────────────────────────────────
function ClavisWordmark({ dark = false, size = 1.1 }: { dark?: boolean; size?: number }) {
  return (
    <span className="inline-flex items-center select-none" style={{ gap: `${size * 0.42}em` }}>
      <span
        style={{
          width: `${size * 0.5}em`,
          height: `${size * 0.5}em`,
          borderRadius: "50%",
          background: AMBER,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
          fontSize: `${size}rem`,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: dark ? "var(--color-nixe-pearl)" : "var(--color-nixe-ink)",
        }}
      >
        Clavis
      </span>
    </span>
  );
}

// ─── Browser chrome wrapper ──────────────────────────────────────────────────
function BrowserChrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden w-full"
      style={{
        background: "#FFFFFF",
        borderRadius: 14,
        border: "1px solid rgba(10,10,10,0.10)",
        boxShadow:
          "0 28px 64px rgba(10,10,10,0.16), 0 6px 16px rgba(10,10,10,0.07), inset 0 0 0 1px rgba(255,255,255,0.6)",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center px-4"
        style={{
          height: 38,
          borderBottom: "1px solid rgba(10,10,10,0.07)",
          background: "linear-gradient(180deg, #FBFBF9 0%, #F2F1EC 100%)",
        }}
      >
        <div className="flex items-center gap-[7px]" style={{ width: 52 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(10,10,10,0.14)" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(10,10,10,0.14)" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(10,10,10,0.14)" }} />
        </div>
        <div className="flex flex-1 justify-center">
          <div
            className="mono-label inline-flex items-center gap-1.5"
            style={{
              height: 21,
              padding: "0 12px",
              borderRadius: 999,
              background: "rgba(10,10,10,0.045)",
              border: "1px solid rgba(10,10,10,0.06)",
              color: "rgba(10,10,10,0.42)",
              fontSize: "0.62rem",
              letterSpacing: "0.02em",
            }}
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>{url}</span>
          </div>
        </div>
        <div style={{ width: 52 }} />
      </div>
      {children}
    </div>
  );
}

// ─── Faux dashboard (hero centrepiece) ───────────────────────────────────────
const ROOM_STATUS = [
  "occ", "occ", "avail", "dirty", "clean", "occ", "avail", "occ",
  "maint", "occ", "clean", "avail", "occ", "dirty", "occ", "avail",
  "clean", "occ", "occ", "avail", "dirty", "occ", "clean", "occ",
];
const ROOM_COLORS: Record<string, string> = {
  occ: "#334155", // occupied — calm slate
  avail: "#22C55E", // available
  dirty: AMBER, // needs cleaning
  clean: "#3B82F6", // clean / inspected
  maint: "#94A3B8", // maintenance
};

function DashboardMockup() {
  const kpis = [
    { label: "OCCUPANCY", value: "87%", delta: "▲ 4%" },
    { label: "ADR", value: "₹4,250", delta: "" },
    { label: "REVPAR", value: "₹3,698", delta: "▲ 6%" },
    { label: "ARRIVALS", value: "12", delta: "" },
  ];
  const feed = [
    { agent: "Revenue Agent", text: "Sat rate raised ₹4,250 → ₹4,900 — demand +18%", chip: "APPROVED", chipColor: "#22C55E" },
    { agent: "Front-Office Agent", text: "Pre-arrival check-in sent to 6 guests", chip: "SENT", chipColor: "#3B82F6" },
    { agent: "Housekeeping", text: "Rooms 301–303 prioritised for 2pm arrivals", chip: "RUNNING", chipColor: AMBER },
  ];

  return (
    <BrowserChrome url="clavis.app">
      <div style={{ background: "#FAFAFA", padding: "16px 16px 18px" }}>
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="mono-label" style={{ color: "rgba(10,10,10,0.4)", fontSize: "0.55rem" }}>
              GRAND MARINA · TODAY
            </div>
            <div
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontWeight: 800,
                fontSize: "0.95rem",
                letterSpacing: "-0.02em",
                color: "#0F172A",
              }}
            >
              Good morning, Aarav
            </div>
          </div>
          <div
            className="inline-flex items-center gap-1.5"
            style={{
              padding: "3px 9px",
              borderRadius: 999,
              background: "rgba(34,197,94,0.1)",
              fontSize: "0.55rem",
              fontWeight: 600,
              color: "#15803D",
              letterSpacing: "0.08em",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
            LIVE
          </div>
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {kpis.map((k) => (
            <div
              key={k.label}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(10,10,10,0.07)",
                borderRadius: 9,
                padding: "9px 10px",
              }}
            >
              <div className="mono-label" style={{ color: "rgba(10,10,10,0.4)", fontSize: "0.5rem" }}>
                {k.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  letterSpacing: "-0.02em",
                  color: "#0F172A",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1.1,
                  marginTop: 2,
                }}
              >
                {k.value}
              </div>
              {k.delta && (
                <div style={{ fontSize: "0.5rem", fontWeight: 600, color: "#15803D", marginTop: 1 }}>
                  {k.delta}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Two columns: room map + agent feed */}
        <div className="grid grid-cols-[1fr_1.05fr] gap-2.5">
          {/* Room status */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(10,10,10,0.07)",
              borderRadius: 9,
              padding: "10px",
            }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="mono-label" style={{ color: "rgba(10,10,10,0.45)", fontSize: "0.5rem" }}>
                ROOM STATUS
              </div>
              <div className="mono-label" style={{ color: "rgba(10,10,10,0.3)", fontSize: "0.5rem" }}>
                24 RMS
              </div>
            </div>
            <div className="grid grid-cols-8 gap-[5px] mb-3">
              {ROOM_STATUS.map((s, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: "1 / 1",
                    borderRadius: 3,
                    background: ROOM_COLORS[s],
                    opacity: s === "occ" ? 0.92 : 1,
                  }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-2.5 gap-y-1">
              {[
                ["Available", "#22C55E"],
                ["Occupied", "#334155"],
                ["Dirty", AMBER],
                ["Clean", "#3B82F6"],
              ].map(([label, color]) => (
                <div key={label} className="inline-flex items-center gap-1">
                  <span style={{ width: 6, height: 6, borderRadius: 2, background: color }} />
                  <span style={{ fontSize: "0.5rem", color: "rgba(10,10,10,0.5)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agent feed (glass + amber border = AI output) */}
          <div
            style={{
              background: "rgba(245,158,11,0.05)",
              border: "1px solid rgba(245,158,11,0.22)",
              borderLeft: `2.5px solid ${AMBER}`,
              borderRadius: 9,
              padding: "10px",
              backdropFilter: "blur(6px)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-2.5">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: AMBER }} />
              <div className="mono-label" style={{ color: "rgba(10,10,10,0.55)", fontSize: "0.5rem" }}>
                AGENT FEED
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {feed.map((f) => (
                <div key={f.text}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                      className="mono-label"
                      style={{ color: "rgba(10,10,10,0.45)", fontSize: "0.46rem" }}
                    >
                      {f.agent}
                    </span>
                    <span
                      style={{
                        fontSize: "0.42rem",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        color: f.chipColor,
                      }}
                    >
                      {f.chip}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.6rem", lineHeight: 1.35, color: "#1E293B" }}>
                    {f.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BrowserChrome>
  );
}

// ─── WhatsApp conversation mockup ────────────────────────────────────────────
function WhatsAppMockup() {
  return (
    <div
      className="overflow-hidden w-full max-w-[380px]"
      style={{
        borderRadius: 20,
        boxShadow: "0 28px 64px rgba(10,10,10,0.18), 0 0 0 1px rgba(10,10,10,0.06)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4" style={{ height: 58, background: "#075E54" }}>
        <div
          className="flex items-center justify-center shrink-0"
          style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFFFFF" }}
        >
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: AMBER }} />
        </div>
        <div className="flex-1">
          <div style={{ color: "#FFFFFF", fontWeight: 600, fontSize: "0.88rem", lineHeight: 1.2 }}>
            Clavis · Grand Marina
          </div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.7rem" }}>online</div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)" aria-hidden>
          <path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
      </div>

      {/* Body */}
      <div
        className="flex flex-col gap-2.5 px-3.5 py-4"
        style={{ background: "#E5DDD4", minHeight: 300 }}
      >
        <Bubble side="in">
          Hi! Can I check in early? Reaching by 11.
          <Time>10:42</Time>
        </Bubble>
        <Bubble side="out">
          Welcome, Mr. Sharma 👋 Room 204 will be ready by 11 — I&apos;ve flagged early
          check-in with housekeeping.
          <Time out>10:42 ✓✓</Time>
        </Bubble>
        <Bubble side="in">
          Amazing, thank you!
          <Time>10:43</Time>
        </Bubble>
        <Bubble side="out">
          Anytime. I&apos;ll send your invoice on WhatsApp at checkout — no front-desk
          queue. 🔑
          <Time out>10:43 ✓✓</Time>
        </Bubble>
      </div>

      {/* Footer caption */}
      <div
        className="flex items-center gap-2 px-4"
        style={{ height: 42, background: "#F0F0F0" }}
      >
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: AMBER }} />
        <span className="mono-label" style={{ color: "rgba(10,10,10,0.5)", fontSize: "0.55rem" }}>
          CLAVIS AI · REPLIED IN 4S
        </span>
      </div>
    </div>
  );
}

function Bubble({ side, children }: { side: "in" | "out"; children: React.ReactNode }) {
  const out = side === "out";
  return (
    <div
      style={{
        alignSelf: out ? "flex-end" : "flex-start",
        maxWidth: "82%",
        background: out ? "#DCF8C6" : "#FFFFFF",
        borderRadius: 9,
        borderTopRightRadius: out ? 2 : 9,
        borderTopLeftRadius: out ? 9 : 2,
        padding: "7px 10px 5px",
        fontSize: "0.82rem",
        lineHeight: 1.4,
        color: "#0F172A",
        boxShadow: "0 1px 1px rgba(10,10,10,0.08)",
      }}
    >
      {children}
    </div>
  );
}

function Time({ children, out }: { children: React.ReactNode; out?: boolean }) {
  return (
    <span
      style={{
        display: "block",
        textAlign: "right",
        fontSize: "0.6rem",
        marginTop: 2,
        color: out ? "rgba(15,23,42,0.45)" : "rgba(15,23,42,0.4)",
      }}
    >
      {children}
    </span>
  );
}

// ─── Morning Briefing AI card ────────────────────────────────────────────────
function BriefingCard() {
  const lines = [
    { label: "OVERNIGHT", text: "All 14 in-house guests settled. ₹48,200 collected. Night audit closed clean." },
    { label: "TODAY", text: "12 arrivals, 8 departures. 2 VIPs — Mr. Rao (anniversary), Ms. Khan (late checkout)." },
    { label: "THE NUMBERS", text: "Occupancy 87% · ADR ₹4,250 · RevPAR ₹3,698." },
    { label: "NEEDS YOU", text: "Rooms 301–303 won't be ready before their 2pm check-ins. Reassign housekeeping?" },
  ];
  return (
    <div
      className="w-full max-w-[440px]"
      style={{
        background: "rgba(255,255,255,0.72)",
        border: "1px solid rgba(245,158,11,0.28)",
        borderLeft: `3px solid ${AMBER}`,
        borderRadius: 16,
        padding: "22px 24px 24px",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: `0 24px 60px rgba(10,10,10,0.10), 0 0 40px rgba(245,158,11,0.07)`,
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: AMBER }} />
        <span className="mono-label" style={{ color: "rgba(10,10,10,0.55)", fontSize: "0.6rem" }}>
          MORNING BRIEFING · 8:00 AM
        </span>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        {lines.map((l) => (
          <div key={l.label} className="grid grid-cols-[88px_1fr] gap-3 items-start">
            <span
              className="mono-label"
              style={{ color: l.label === "NEEDS YOU" ? "#B45309" : "rgba(10,10,10,0.4)", fontSize: "0.55rem", paddingTop: 2 }}
            >
              {l.label}
            </span>
            <span style={{ fontSize: "0.92rem", lineHeight: 1.45, color: "#1E293B" }}>{l.text}</span>
          </div>
        ))}
      </div>

      {/* Illustrative only — not real controls, so kept out of the tab/AT tree. */}
      <div className="flex items-center gap-2.5" aria-hidden="true">
        <span
          className="inline-flex h-[34px] items-center justify-center px-4"
          style={{ background: AMBER, borderRadius: 8 }}
        >
          <span className="mono-label" style={{ color: "#fff", fontSize: "0.58rem" }}>
            Reassign
          </span>
        </span>
        <span
          className="inline-flex h-[34px] items-center justify-center px-4"
          style={{ border: "1px solid rgba(10,10,10,0.18)", borderRadius: 8 }}
        >
          <span className="mono-label" style={{ color: "rgba(10,10,10,0.6)", fontSize: "0.58rem" }}>
            Ask Clavis
          </span>
        </span>
      </div>
    </div>
  );
}

// ─── Top nav ─────────────────────────────────────────────────────────────────
function ClavisNav() {
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
        style={
          scrolled
            ? {
                background: "rgba(250,250,247,0.92)",
                backdropFilter: "blur(16px)",
                borderRadius: "10px",
                padding: "8px 16px",
                border: "1px solid rgba(10,10,10,0.08)",
                boxShadow: "0 2px 20px rgba(10,10,10,0.06)",
              }
            : {}
        }
      >
        <Link href="/" data-cursor-hover className="inline-flex items-center gap-3" aria-label="Back to NIXE">
          <span className="mono-label" style={{ color: "rgba(10,10,10,0.55)" }}>
            ← NIXE
          </span>
        </Link>

        <ClavisWaitlistButton size="sm" variant="dark">
          Request Access
        </ClavisWaitlistButton>
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function ClavisHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "var(--color-nixe-paper)",
        paddingTop: "calc(140px + env(safe-area-inset-top, 0))",
        paddingBottom: "clamp(80px, 12vh, 140px)",
      }}
    >
      <div className="absolute inset-0 blueprint-dot pointer-events-none" />

      <div className="relative z-10 px-6 md:px-10 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <motion.div
              className="flex flex-wrap items-center gap-4 mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0, 0.25, 1] }}
            >
              <ClavisWordmark size={1.5} />
              <div className="flex flex-wrap gap-2">
                <span
                  className="mono-label px-2.5 py-1 inline-flex"
                  style={{ border: "1px solid rgba(10,10,10,0.18)", color: "rgba(10,10,10,0.65)" }}
                >
                  Hospitality PMS · Pre-launch
                </span>
                <span
                  className="mono-label px-2.5 py-1 inline-flex"
                  style={{ border: "1px solid rgba(10,10,10,0.18)", color: "rgba(10,10,10,0.65)" }}
                >
                  AI-native
                </span>
                <span
                  className="mono-label px-2.5 py-1 inline-flex"
                  style={{ border: "1px solid rgba(10,10,10,0.18)", color: "rgba(10,10,10,0.65)" }}
                >
                  Cloud-based
                </span>
              </div>
            </motion.div>

            <h1
              className="text-nixe-ink mb-7"
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: "clamp(2.4rem, 5vw, 4.7rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.98,
              }}
            >
              <WordReveal className="uppercase" delay={0.2}>The Key to</WordReveal>
              <WordReveal className="uppercase" delay={0.36}>running it all,</WordReveal>
              <WordReveal
                delay={0.54}
                style={{ fontStyle: "italic", fontWeight: 700, letterSpacing: "-0.025em" }}
              >
                Intelligently
              </WordReveal>
            </h1>

            <motion.p
              className="leading-relaxed max-w-[54ch] mb-10"
              style={{ fontSize: "1.18rem", color: "rgba(10,10,10,0.7)" }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Clavis is an AI-native hotel operating system. It runs reservations, billing,
              housekeeping and guest messaging across web, mobile and WhatsApp — and only
              interrupts you when a decision needs a human.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-3 mb-12"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
            >
              <ClavisWaitlistButton variant="dark">Request Early Access</ClavisWaitlistButton>

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
                  See how it works
                </span>
              </a>
            </motion.div>

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
                  <div style={{ fontSize: "0.95rem", color: "rgba(10,10,10,0.78)" }}>{m.value}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: dashboard mockup */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0, 0.25, 1] }}
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Features ────────────────────────────────────────────────────────────────
function ClavisFeatures() {
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
            01 / WHAT IT DOES
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
            <WordReveal>Everything your</WordReveal>
            <WordReveal delay={0.18}>hotel runs on.</WordReveal>
          </h2>
          <p className="leading-relaxed" style={{ fontSize: "1.1rem", color: "rgba(10,10,10,0.65)" }}>
            One cloud platform replaces the whole stack — PMS, channel manager, revenue,
            reviews, accounting, payroll and WhatsApp — with every module wired to the next.
            Throw the rest away.
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
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="mono-label" style={{ color: AMBER }}>
                  {f.num}
                </span>
                {f.roadmap && (
                  <span
                    className="mono-label inline-flex items-center gap-1.5 px-2 py-1"
                    style={{
                      borderRadius: 999,
                      background: "rgba(245,158,11,0.1)",
                      border: "1px solid rgba(245,158,11,0.28)",
                      color: "#B45309",
                      fontSize: "0.56rem",
                      letterSpacing: "0.08em",
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: AMBER }} />
                    {f.roadmap}
                  </span>
                )}
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
              <p className="leading-relaxed" style={{ fontSize: "0.98rem", color: "rgba(10,10,10,0.65)" }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// ─── See it work (mockup showcase) ───────────────────────────────────────────
function ClavisShowcase() {
  return (
    <motion.section
      id="showcase"
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
      <div className="absolute inset-0 blueprint-dot pointer-events-none" style={{ opacity: 0.6 }} />
      <div className="relative z-10 px-6 md:px-10 max-w-[1280px] mx-auto">
        <div className="flex flex-col gap-5 mb-16 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[58ch]">
            <div className="mono-label mb-5" style={{ color: "rgba(10,10,10,0.55)" }}>
              04 / SEE IT WORK
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
              <WordReveal>The calmest thing</WordReveal>
              <WordReveal delay={0.18}>in the building.</WordReveal>
            </h2>
          </div>
          <p className="max-w-[34ch] text-sm leading-relaxed md:pb-3" style={{ color: "rgba(10,10,10,0.6)" }}>
            A hotel is already chaotic. The software should be the quietest thing in the
            room — facts where you need them, the AI&apos;s suggestions clearly marked.
          </p>
        </div>

        {/* Block 1 — WhatsApp */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 md:mb-32">
          <div>
            <div className="mono-label mb-4" style={{ color: AMBER }}>
              GUEST EXPERIENCE
            </div>
            <h3
              className="text-nixe-ink mb-5"
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              Guests text. Clavis replies.
            </h3>
            <p className="leading-relaxed max-w-[46ch]" style={{ fontSize: "1.05rem", color: "rgba(10,10,10,0.68)" }}>
              No app to download, no portal to log into. Pre-arrival check-in, room service,
              housekeeping requests and express checkout all happen in the one place every
              guest already lives — WhatsApp. Clavis answers in seconds and only pulls you in
              when a request needs a human call.
            </p>

            <div
              className="flex items-start gap-4 mt-8 p-4"
              style={{
                background: "rgba(245,158,11,0.05)",
                border: "1px solid rgba(245,158,11,0.22)",
                borderRadius: 14,
              }}
            >
              <div
                className="shrink-0 grid grid-cols-3 gap-[3px] p-2"
                aria-hidden="true"
                style={{ background: "#fff", borderRadius: 8, border: "1px solid rgba(10,10,10,0.08)" }}
              >
                {[1, 0, 1, 0, 1, 0, 1, 1, 1].map((on, i) => (
                  <span
                    key={i}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 1.5,
                      background: on ? "var(--color-nixe-ink)" : "transparent",
                    }}
                  />
                ))}
              </div>
              <div>
                <div className="mono-label mb-1.5" style={{ color: AMBER }}>
                  IN-ROOM QR
                </div>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.5, color: "rgba(10,10,10,0.7)" }}>
                  A code on the desk. Guests scan, order food or service, and the charge posts
                  itself to their room folio — no call, no paper chit, no front-desk relay.
                </p>
              </div>
            </div>
          </div>
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.25, 0, 0.25, 1] }}
          >
            <WhatsAppMockup />
          </motion.div>
        </div>

        {/* Block 2 — Morning Briefing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            className="order-2 lg:order-1 flex justify-center lg:justify-start"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.25, 0, 0.25, 1] }}
          >
            <BriefingCard />
          </motion.div>
          <div className="order-1 lg:order-2">
            <div className="mono-label mb-4" style={{ color: AMBER }}>
              THE MORNING BRIEFING
            </div>
            <h3
              className="text-nixe-ink mb-5"
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              Never walk in blind again.
            </h3>
            <p className="leading-relaxed max-w-[46ch]" style={{ fontSize: "1.05rem", color: "rgba(10,10,10,0.68)" }}>
              Every morning, Clavis reads the last 24 hours for you and writes it in plain
              English: what happened overnight, what&apos;s happening today, the numbers, and
              the handful of things that actually need your decision. No dashboards to dig
              through — just the read, and a tap to act.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ─── How it works ────────────────────────────────────────────────────────────
function ClavisHowItWorks() {
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
            06 / HOW IT WORKS
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
            <WordReveal>From spreadsheets</WordReveal>
            <WordReveal delay={0.18}>to autopilot.</WordReveal>
          </h2>
          <p className="leading-relaxed" style={{ fontSize: "1.1rem", color: "rgba(10,10,10,0.65)" }}>
            No migration project, no consultant. Most hotels are live the same day they sign
            up — and running on autopilot within the week.
          </p>
        </div>

        <div className="relative">
          <motion.div
            className="hidden md:block absolute left-0 right-0 h-px pointer-events-none"
            style={{ top: "1.75rem", background: "rgba(10,10,10,0.1)", transformOrigin: "left center" }}
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
                <p className="leading-relaxed" style={{ fontSize: "0.95rem", color: "rgba(10,10,10,0.65)" }}>
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

// ─── Closing CTA ─────────────────────────────────────────────────────────────
function ClavisCTA() {
  return (
    <motion.section
      id="early-access"
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
        <div className="max-w-[60ch]">
          <div className="mono-label mb-5" style={{ color: "rgba(245,244,239,0.55)" }}>
            07 / EARLY ACCESS
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
            <WordReveal>Run your first</WordReveal>
            <WordReveal delay={0.18}>pilot with us.</WordReveal>
          </h2>

          <p className="leading-relaxed max-w-[52ch] mb-10" style={{ fontSize: "1.1rem", color: "rgba(245,244,239,0.7)" }}>
            We&apos;re onboarding a handful of hotels before launch. No setup fee, no lock-in —
            just your property, running on Clavis, with us beside you the whole way.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <ClavisWaitlistButton>Request Early Access</ClavisWaitlistButton>

            <a
              href="mailto:nixe.cxt@gmail.com"
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
                nixe.cxt@gmail.com
              </span>
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function ClavisFooter() {
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
        <ClavisWordmark dark size={1.15} />
        <span className="mono-label" style={{ color: "rgba(245,244,239,0.4)" }}>
          By NIXE · Hospitality PMS
        </span>
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/clavis/privacy"
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

// ─── One system (cloud + seamless) ───────────────────────────────────────────
const MODULES = [
  "Reservations",
  "Front desk",
  "Housekeeping",
  "Finance",
  "Payroll",
  "Channels",
  "Guest CRM",
  "Reports",
];

const PLATFORM_POINTS = [
  {
    title: "Cloud-native",
    desc: "Nothing to install, nothing to back up. Open Clavis from the front desk, your phone or home — it's the same live property, always current.",
  },
  {
    title: "Always in sync",
    desc: "A booking, a checkout or a rate change writes once and every module moves with it. No re-keying between systems, no month-end reconciliations that don't match.",
  },
  {
    title: "One data core",
    desc: "Reservations, billing, housekeeping and guest history share a single source of truth — so the number on your dashboard is the number in your books.",
  },
];

function ClavisPlatform() {
  return (
    <motion.section
      id="platform"
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
        <div className="mb-12 md:mb-16 max-w-[58ch]">
          <div className="mono-label mb-5" style={{ color: "rgba(10,10,10,0.55)" }}>
            02 / ONE SYSTEM
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
            <WordReveal>Every module,</WordReveal>
            <WordReveal delay={0.18}>one live core.</WordReveal>
          </h2>
          <p className="leading-relaxed" style={{ fontSize: "1.1rem", color: "rgba(10,10,10,0.65)" }}>
            Most hotels run six disconnected tools that never quite agree. Clavis is a single
            cloud system where reservations, billing, housekeeping, payroll and guest messaging
            all read and write to the same core — live, and in step with each other.
          </p>
        </div>

        {/* Connected modules */}
        <div className="flex flex-wrap gap-2.5 mb-14 md:mb-20">
          {MODULES.map((m) => (
            <span
              key={m}
              className="inline-flex items-center gap-2 px-3.5 py-2"
              style={{
                border: "1px solid rgba(10,10,10,0.12)",
                borderRadius: 999,
                background: "rgba(255,255,255,0.5)",
                fontSize: "0.9rem",
                color: "rgba(10,10,10,0.72)",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: AMBER }} />
              {m}
            </span>
          ))}
        </div>

        <div
          className="grid gap-8 md:gap-10 sm:grid-cols-3 border-t pt-10 md:pt-12"
          style={{ borderColor: "rgba(10,10,10,0.1)" }}
        >
          {PLATFORM_POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.25, 0, 0.25, 1], delay: i * 0.08 }}
            >
              <h3
                className="text-nixe-ink font-bold mb-3"
                style={{
                  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                  fontSize: "clamp(1.15rem, 1.5vw, 1.4rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                }}
              >
                {p.title}
              </h3>
              <p className="leading-relaxed" style={{ fontSize: "0.98rem", color: "rgba(10,10,10,0.65)" }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// ─── Finance & payroll deep-dive ─────────────────────────────────────────────
const FINANCE_POINTS = [
  "Folios that auto-post room, F&B, laundry and mini-bar as the charges happen",
  "GST-ready: HSN codes, tax slabs and one-click GSTR-1 / 3B exports",
  "UPI and card payments, with split, advance and city-ledger billing",
  "Invoicing, day-book, P&L and outstanding reports on tap",
  "A night audit that closes the day by itself",
];

const PAYROLL_POINTS = [
  "Staff attendance and shift rosters, from the same app",
  "Salary runs with digital payslips",
  "Statutory built in — PF, ESI and TDS",
  "Tips and service charge, pooled and distributed fairly",
];

function LedgerCard({
  label,
  title,
  lead,
  points,
}: {
  label: string;
  title: string;
  lead: string;
  points: string[];
}) {
  return (
    <motion.div
      className="p-8 md:p-10"
      style={{
        background: "var(--color-nixe-paper)",
        border: "1px solid rgba(10,10,10,0.08)",
        borderRadius: 20,
      }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.25, 0, 0.25, 1] }}
    >
      <div className="mono-label mb-4" style={{ color: AMBER }}>
        {label}
      </div>
      <h3
        className="text-nixe-ink mb-4"
        style={{
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
          fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)",
          fontWeight: 800,
          letterSpacing: "-0.025em",
          lineHeight: 1.1,
        }}
      >
        {title}
      </h3>
      <p className="leading-relaxed mb-7 max-w-[42ch]" style={{ fontSize: "1.02rem", color: "rgba(10,10,10,0.68)" }}>
        {lead}
      </p>
      <ul className="flex flex-col gap-3.5">
        {points.map((pt) => (
          <li key={pt} className="flex items-start gap-3">
            <svg
              width="15"
              height="15"
              viewBox="0 0 22 22"
              fill="none"
              aria-hidden
              className="shrink-0"
              style={{ marginTop: 4 }}
            >
              <path
                d="M5 11L9 15L17 7"
                stroke={AMBER}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ fontSize: "0.98rem", lineHeight: 1.5, color: "rgba(10,10,10,0.75)" }}>{pt}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function ClavisFinance() {
  return (
    <motion.section
      id="finance"
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
            03 / FINANCE &amp; PAYROLL
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
            <WordReveal>The money side,</WordReveal>
            <WordReveal delay={0.18}>handled.</WordReveal>
          </h2>
          <p className="leading-relaxed" style={{ fontSize: "1.1rem", color: "rgba(10,10,10,0.65)" }}>
            No separate accountant&apos;s tool, no payroll spreadsheet. Because billing and staff
            live inside Clavis, the books and the payslips build themselves from what already
            happened on the floor.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 md:gap-8">
          <LedgerCard
            label="FINANCE"
            title="Books that keep themselves."
            lead="Every charge and payment flows straight into a GST-compliant ledger — so closing the month is a review, not a rebuild."
            points={FINANCE_POINTS}
          />
          <LedgerCard
            label="PAYROLL"
            title="Payday without the paperwork."
            lead="Attendance from the floor becomes salaries, payslips and statutory filings — all in one place, all reconciled."
            points={PAYROLL_POINTS}
          />
        </div>
      </div>
    </motion.section>
  );
}

// ─── Built for your property (templates) ─────────────────────────────────────
const PROPERTY_TYPES = [
  { name: "Boutique & heritage", note: "Character over count — rich guest profiles, curated rates and personal touches." },
  { name: "Business & city", note: "Fast check-in and checkout, corporate billing, GST invoices and city-ledger accounts." },
  { name: "Resorts & villas", note: "Packages, activities and multiple F&B outlets that all post back to one folio." },
  { name: "Homestays & B&Bs", note: "Lightweight and WhatsApp-first — run the whole place from a phone." },
  { name: "Serviced apartments", note: "Long-stay rates, monthly billing and recurring housekeeping schedules." },
  { name: "Hostels & groups", note: "Bed-level inventory, shared spaces and group bookings handled cleanly." },
];

function ClavisTemplates() {
  return (
    <motion.section
      id="templates"
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
            05 / BUILT FOR YOUR PROPERTY
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
            <WordReveal>Not one rigid</WordReveal>
            <WordReveal delay={0.18}>layout.</WordReveal>
          </h2>
          <p className="leading-relaxed" style={{ fontSize: "1.1rem", color: "rgba(10,10,10,0.65)" }}>
            A city business hotel and a hillside homestay don&apos;t run the same way, so they
            shouldn&apos;t use the same screens. Clavis starts from a template built for your
            kind of property — then bends to how you actually work.
          </p>
        </div>

        <div className="grid gap-7 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {PROPERTY_TYPES.map((t, i) => (
            <motion.div
              key={t.name}
              className="p-7 md:p-8"
              style={{
                background: "var(--color-nixe-paper)",
                border: "1px solid rgba(10,10,10,0.08)",
                borderRadius: 20,
              }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.25, 0, 0.25, 1], delay: i * 0.06 }}
            >
              <h3
                className="text-nixe-ink font-bold mb-3"
                style={{
                  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                  fontSize: "clamp(1.15rem, 1.5vw, 1.4rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.015em",
                  lineHeight: 1.2,
                }}
              >
                {t.name}
              </h3>
              <p className="leading-relaxed" style={{ fontSize: "0.96rem", color: "rgba(10,10,10,0.65)" }}>
                {t.note}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// ─── Page export ─────────────────────────────────────────────────────────────
export default function ClavisPage() {
  return (
    <>
      <ClavisNav />
      <main>
        <ClavisHero />
        <ClavisFeatures />
        <ClavisPlatform />
        <ClavisFinance />
        <ClavisShowcase />
        <ClavisTemplates />
        <ClavisHowItWorks />
        <ClavisCTA />
      </main>
      <ClavisFooter />
    </>
  );
}
