"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/Button";
import { Plate, PlateInner, SectionHead } from "@/components/Plate";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WordReveal } from "@/components/WordReveal";

/* ─────────────────────────────────────────────────────────────
   Regia. Built on the venue-management system already running at
   a marriage hall in Tamil Nadu (the client is deliberately not
   named). Uses the homepage plate/tone system rather than the
   older bespoke styling on /clavis and /courtsy.
   ───────────────────────────────────────────────────────────── */

const DEMO_HREF = "/?intent=regia#contact";

const MODULES = [
  {
    num: "01",
    title: "Bookings",
    body: "Every date, held in one calendar. Customer, hall rent, notes and status on the record, with up to three advance payments tracked per booking in cash, cheque or online.",
    points: ["Calendar view", "Upcoming / completed / cancelled", "Advance payments"],
  },
  {
    num: "02",
    title: "Billing",
    body: "Itemised bills built from your own categories: GST, cleaning, EB, water, gas, AC, room rent, generator. Per-unit rates where they apply. Export the finished bill as a PDF.",
    points: ["Configurable categories", "Per-unit billing", "PDF export"],
  },
  {
    num: "03",
    title: "Expenses and deposits",
    body: "Log what each event actually cost against your own expense heads, and record bank deposits against the account they landed in. The margin on a booking stops being a guess.",
    points: ["Per-booking expenses", "Bank deposits", "Multiple accounts"],
  },
  {
    num: "04",
    title: "Dashboard",
    body: "Revenue, expenses, net profit and booking counts at a glance, a monthly revenue chart with a year selector, and the upcoming events list the office actually works from.",
    points: ["Live KPIs", "Monthly charts", "Upcoming events"],
  },
  {
    num: "05",
    title: "Reports",
    body: "Consolidated financials across bookings and date ranges, so closing a month is a review rather than a rebuild from receipts and a notebook.",
    points: ["Date-range reports", "Cross-booking totals"],
  },
  {
    num: "06",
    title: "Roles and access",
    body: "Admin, staff and viewer roles enforced in the database itself through row-level security, not just hidden in the interface. Staff run the day. Owners see the money.",
    points: ["Admin / staff / viewer", "Row-level security"],
  },
] as const;

const NEXT_UP = [
  {
    num: "01",
    title: "White-label per venue",
    body: "Each venue on its own isolated project with its own branding, provisioned from one canonical set of migrations. Physical separation, so a cross-venue data leak is not possible.",
  },
  {
    num: "02",
    title: "Native iOS and Android",
    body: "The Capacitor shell is scaffolded. Push notifications for new bookings and advance reminders, biometric lock on resume, and a separately listed app per venue.",
  },
  {
    num: "03",
    title: "Self-serve onboarding",
    body: "Venues provision themselves instead of being set up by hand, so Regia can take on halls faster than we can visit them.",
  },
] as const;

const FACTS = [
  ["Status", "Live at its first venue"],
  ["Sector", "Marriage halls, event venues"],
  ["Region", "Tamil Nadu, India"],
  ["Stack", "Vue 3, Supabase, Postgres"],
] as const;

function RegiaWordmark({ size = 1.15 }: { size?: number }) {
  return (
    <span
      className="select-none inline-block"
      style={{
        fontFamily: "var(--font-jakarta), system-ui, sans-serif",
        fontSize: `${size}rem`,
        fontWeight: 800,
        letterSpacing: "0.14em",
        color: "var(--tone-fg)",
      }}
    >
      REGIA
    </span>
  );
}

function StatusChip() {
  return (
    <span
      className="mono-label inline-flex items-center gap-2 px-3 py-1.5"
      style={{
        border: "1px solid var(--tone-line)",
        color: "var(--tone-fg-2)",
        fontSize: "0.58rem",
      }}
    >
      <span
        aria-hidden
        className="size-[5px] rounded-full shrink-0"
        style={{
          background: "var(--tone-fg)",
          animation: "blipPulse 2.6s ease-in-out infinite",
        }}
      />
      Live at its first venue
    </span>
  );
}

/* ─── A booking record, drawn as the app would show it ─── */

const BILL_LINES = [
  ["Hall rent", "₹ 85,000"],
  ["Air conditioning", "₹ 12,000"],
  ["Generator", "₹ 6,500"],
  ["Cleaning", "₹ 4,000"],
  ["EB and water", "₹ 3,200"],
] as const;

function LedgerMockup() {
  return (
    <div
      className="overflow-hidden rounded-[14px] w-full"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(10,10,10,0.10)",
        boxShadow: "0 24px 60px rgba(10,10,10,0.16), 0 4px 12px rgba(10,10,10,0.07)",
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center px-4"
        style={{
          height: 36,
          borderBottom: "1px solid rgba(10,10,10,0.07)",
          background: "linear-gradient(180deg, #FBFBF9 0%, #F2F1EC 100%)",
        }}
      >
        <div className="flex items-center gap-[6px]" style={{ width: 44 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(10,10,10,0.14)" }}
            />
          ))}
        </div>
        <div className="flex flex-1 justify-center">
          <span
            className="mono-label"
            style={{ color: "rgba(10,10,10,0.4)", fontSize: "0.58rem", letterSpacing: "0.1em" }}
          >
            Booking · 14 Nov 2026
          </span>
        </div>
        <div style={{ width: 44 }} />
      </div>

      {/* Body */}
      <div className="p-6" style={{ background: "#FFFFFF" }}>
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <div
              className="mono-label mb-1.5"
              style={{ color: "rgba(10,10,10,0.42)", fontSize: "0.55rem" }}
            >
              Reception · Main hall
            </div>
            <div
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: "1.15rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#0A0A0A",
              }}
            >
              Balance ₹ 47,700
            </div>
          </div>
          <span
            className="mono-label px-2 py-1"
            style={{
              fontSize: "0.52rem",
              color: "rgba(10,10,10,0.55)",
              border: "1px solid rgba(10,10,10,0.14)",
            }}
          >
            Upcoming
          </span>
        </div>

        <div className="flex flex-col">
          {BILL_LINES.map(([label, amount], i) => (
            <motion.div
              key={label}
              className="flex items-center justify-between py-2.5"
              style={{ borderTop: "1px solid rgba(10,10,10,0.07)" }}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
            >
              <span style={{ fontSize: "0.85rem", color: "rgba(10,10,10,0.7)" }}>{label}</span>
              <span
                className="mono-label"
                style={{ fontSize: "0.62rem", color: "rgba(10,10,10,0.85)" }}
              >
                {amount}
              </span>
            </motion.div>
          ))}

          <div
            className="flex items-center justify-between py-3 mt-1"
            style={{ borderTop: "1px solid rgba(10,10,10,0.18)" }}
          >
            <span className="mono-label" style={{ fontSize: "0.58rem", color: "rgba(10,10,10,0.5)" }}>
              Less advances
            </span>
            <span className="mono-label" style={{ fontSize: "0.62rem", color: "rgba(10,10,10,0.5)" }}>
              ₹ 63,000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page chrome ─── */

function RegiaNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight / 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between"
      style={{
        transition: "padding 0.5s cubic-bezier(0.76,0,0.24,1)",
        padding: scrolled ? "14px 16px" : "26px 40px",
      }}
    >
      <div
        className="relative flex w-full items-center justify-between transition-all duration-500"
        style={
          scrolled
            ? {
                background: "rgba(250,250,247,0.92)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderRadius: "10px",
                padding: "8px 16px",
                border: "1px solid rgba(10,10,10,0.08)",
                boxShadow: "0 2px 20px rgba(10,10,10,0.06)",
              }
            : {}
        }
      >
        <Link href="/regia" aria-label="Regia home" className="no-underline">
          <RegiaWordmark size={scrolled ? 1 : 1.15} />
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="mono-label no-underline transition-opacity duration-200 hover:opacity-60"
            style={{ color: "var(--tone-fg-3)" }}
          >
            By NIXE
          </Link>
          <a
            href={DEMO_HREF}
            className="mono-label no-underline px-4 py-2.5 transition-opacity duration-200 hover:opacity-85"
            style={{ background: "var(--tone-fg)", color: "var(--tone-bg)" }}
          >
            Request a Demo
          </a>
        </div>
      </div>
    </nav>
  );
}

function RegiaFooter() {
  return (
    <footer data-tone="ink" className="plate plate-ink relative">
      <div className="px-6 md:px-10 max-w-[1440px] mx-auto">
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-8 py-12"
          style={{ borderTop: "1px solid var(--tone-line)" }}
        >
          <RegiaWordmark size={1.15} />
          <div className="mono-label text-center space-y-1" style={{ color: "var(--tone-fg-3)" }}>
            <p>A NIXE product</p>
            <p>© 2026 NIXE · nixe.in</p>
          </div>
          <Link
            href="/"
            className="mono-label no-underline transition-opacity duration-200 hover:opacity-60"
            style={{ color: "var(--tone-fg-3)" }}
          >
            ← Back to NIXE
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ─── Sections ─── */

function RegiaHero() {
  return (
    <section
      data-tone="paper"
      className="plate plate-paper relative flex min-h-[92vh] flex-col justify-center overflow-hidden"
      style={{ paddingTop: "clamp(140px, 18vh, 210px)", paddingBottom: "clamp(80px, 10vh, 120px)" }}
    >
      <div className="absolute inset-0 blueprint-dot pointer-events-none" />

      <PlateInner className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-20 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-8"
            >
              <StatusChip />
            </motion.div>

            <h1
              className="uppercase mb-8"
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: "clamp(2.4rem, 5.6vw, 5.4rem)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 0.94,
                color: "var(--tone-fg)",
              }}
            >
              <WordReveal delay={0.15}>Run the venue,</WordReveal>
              <WordReveal delay={0.3}>not the paperwork.</WordReveal>
            </h1>

            <motion.p
              className="max-w-[46ch] leading-relaxed mb-10"
              style={{ fontSize: "1.08rem", color: "var(--tone-fg-2)" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
            >
              Regia is the system a marriage hall actually runs on. Bookings and advances,
              itemised bills, the expenses against each event and the deposits that follow,
              all in one place, with the books reconciled as you go.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Button href={DEMO_HREF}>Request a Demo</Button>
              <Button href="#modules" variant="outline">
                What it runs
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0, 0.25, 1] }}
          >
            <LedgerMockup />
          </motion.div>
        </div>
      </PlateInner>
    </section>
  );
}

function RegiaModules() {
  return (
    <Plate id="modules" tone="bone" index="01">
      <PlateInner>
        <SectionHead
          index="01"
          label="What it runs"
          headline={["Every event,", "end to end."]}
          kicker="Six modules covering the whole life of a booking, from the date being held to the month being closed."
          className="mb-14 md:mb-20"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {MODULES.map((m, i) => (
            <motion.div
              key={m.num}
              className="pt-7"
              style={{ borderTop: "1px solid var(--tone-line)" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.25, 0, 0.25, 1] }}
            >
              <div className="mono-label mb-5" style={{ color: "var(--tone-fg-4)", fontSize: "0.58rem" }}>
                {m.num} / Module
              </div>
              <h3
                className="mb-4"
                style={{
                  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                  fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "var(--tone-fg)",
                }}
              >
                {m.title}
              </h3>
              <p
                className="mb-6 leading-relaxed"
                style={{ fontSize: "0.95rem", color: "var(--tone-fg-2)" }}
              >
                {m.body}
              </p>
              <ul className="list-none p-0 m-0 flex flex-wrap gap-2">
                {m.points.map((pt) => (
                  <li
                    key={pt}
                    className="mono-label px-2.5 py-1.5"
                    style={{
                      fontSize: "0.55rem",
                      color: "var(--tone-fg-3)",
                      border: "1px solid var(--tone-line)",
                    }}
                  >
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </PlateInner>
    </Plate>
  );
}

function RegiaProof() {
  return (
    <Plate id="production" tone="ink" index="02">
      <div className="absolute inset-0 blueprint-dot pointer-events-none" />
      <PlateInner className="relative z-10">
        <SectionHead
          index="02"
          label="In production"
          headline={["Not a demo.", "A working office."]}
          kicker="Regia was not designed in the abstract. It was built against a real hall, and changed by the people who use it every week."
          className="mb-14 md:mb-20"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-24 items-start">
          <div className="flex flex-col gap-7">
            <p
              className="leading-relaxed"
              style={{ fontSize: "clamp(1.15rem, 1.7vw, 1.5rem)", color: "var(--tone-fg)" }}
            >
              A marriage hall in Tamil Nadu has been running its bookings, billing and accounts
              on Regia since 2026. Real dates, real money, real month-ends.
            </p>
            <p
              className="leading-relaxed max-w-[54ch]"
              style={{ fontSize: "1rem", color: "var(--tone-fg-2)" }}
            >
              That is where the unglamorous parts came from: per-unit billing on the items that
              vary, advances set as a share of hall rent, an afternoon slot alongside the evening
              one, money fields that step in thousands rather than ones. None of it was on the
              first spec. All of it came back from the owner.
            </p>

            <dl
              className="grid grid-cols-2 gap-y-6 gap-x-8 mt-4 pt-8"
              style={{ borderTop: "1px solid var(--tone-line)" }}
            >
              {FACTS.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1.5">
                  <dt className="mono-label" style={{ color: "var(--tone-fg-4)", fontSize: "0.55rem" }}>
                    {k}
                  </dt>
                  <dd className="m-0" style={{ fontSize: "0.95rem", color: "var(--tone-fg)" }}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <motion.blockquote
            className="m-0 p-8"
            style={{ border: "1px solid var(--tone-line)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="mono-label mb-6" style={{ color: "var(--tone-fg-4)", fontSize: "0.55rem" }}>
              What changed
            </div>
            <ul className="list-none p-0 m-0 flex flex-col gap-5">
              {[
                "Bills that used to live in a notebook now close with the booking.",
                "The margin on an event is visible before the next one is booked.",
                "Staff enter the day's work. Owners see the month without asking.",
              ].map((line) => (
                <li key={line} className="flex gap-4">
                  <span
                    aria-hidden
                    className="block h-px w-5 shrink-0"
                    style={{ background: "var(--tone-fg-4)", marginTop: "0.7em" }}
                  />
                  <span style={{ fontSize: "0.98rem", color: "var(--tone-fg-2)", lineHeight: 1.6 }}>
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </motion.blockquote>
        </div>
      </PlateInner>
    </Plate>
  );
}

function RegiaNext() {
  return (
    <Plate id="next" tone="paper" index="03">
      <PlateInner>
        <SectionHead
          index="03"
          label="What's next"
          headline={["One hall proved it.", "Now it scales."]}
          kicker="Regia is being taken from a system that runs one venue to a product that runs many."
          className="mb-14 md:mb-20"
        />

        <div className="flex flex-col">
          {NEXT_UP.map((n, i) => (
            <motion.div
              key={n.num}
              className="grid grid-cols-1 md:grid-cols-[auto_1fr_1.4fr] gap-6 md:gap-12 py-9 items-baseline"
              style={{ borderTop: "1px solid var(--tone-line)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.09, ease: [0.25, 0, 0.25, 1] }}
            >
              <span className="mono-label" style={{ color: "var(--tone-fg-4)", fontSize: "0.58rem" }}>
                {n.num}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                  fontSize: "clamp(1.3rem, 2.2vw, 2rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                  color: "var(--tone-fg)",
                }}
              >
                {n.title}
              </h3>
              <p className="leading-relaxed" style={{ fontSize: "0.98rem", color: "var(--tone-fg-2)" }}>
                {n.body}
              </p>
            </motion.div>
          ))}
          <div style={{ borderTop: "1px solid var(--tone-line)" }} />
        </div>
      </PlateInner>
    </Plate>
  );
}

function RegiaCTA() {
  return (
    <Plate id="demo" tone="ink" index="04">
      <div className="absolute inset-0 blueprint-dot pointer-events-none" />
      <PlateInner className="relative z-10">
        <div className="max-w-[46ch]">
          <div className="mono-label mb-8" style={{ color: "var(--tone-fg-3)" }}>
            04 / Request a demo
          </div>
          <h2
            className="uppercase mb-8"
            style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: "clamp(2rem, 4.6vw, 4.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 0.95,
              color: "var(--tone-fg)",
            }}
          >
            <WordReveal>See it on</WordReveal>
            <WordReveal delay={0.16}>your own dates.</WordReveal>
          </h2>
          <p
            className="leading-relaxed mb-11"
            style={{ fontSize: "1.05rem", color: "var(--tone-fg-2)" }}
          >
            Tell us how your hall runs today and we will walk you through Regia against your
            own bookings and your own bill heads. No obligation, and no setup on your side.
          </p>
          <Button href={DEMO_HREF}>Request a Demo</Button>
        </div>
      </PlateInner>
    </Plate>
  );
}

export default function RegiaPage() {
  return (
    <>
      <SmoothScroll />
      <RegiaNav />
      <main className="relative">
        <RegiaHero />
        <RegiaModules />
        <RegiaProof />
        <RegiaNext />
        <RegiaCTA />
      </main>
      <RegiaFooter />
    </>
  );
}
