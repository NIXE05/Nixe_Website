"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Illustrative Regia UI, drawn in code.
 *
 * Regia has no screenshots and no deployed URL, and its only live install is a
 * client's production database with real customer names and bookings in it.
 * These are built from the documented feature set instead: the numbers are
 * invented, the structure is not. Marked aria-hidden throughout — they are
 * decoration, and the surrounding copy carries the meaning.
 */

const INK = "#0A0A0A";
const dim = (a: number) => `rgba(10,10,10,${a})`;

export function BrowserFrame({
  label,
  children,
  className,
  style,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={`overflow-hidden rounded-[14px] ${className ?? ""}`}
      style={{
        background: "#FFFFFF",
        border: `1px solid ${dim(0.1)}`,
        boxShadow: "0 24px 60px rgba(10,10,10,0.16), 0 4px 12px rgba(10,10,10,0.07)",
        ...style,
      }}
    >
      <div
        className="flex items-center px-4"
        style={{
          height: 34,
          borderBottom: `1px solid ${dim(0.07)}`,
          background: "linear-gradient(180deg, #FBFBF9 0%, #F2F1EC 100%)",
        }}
      >
        <div className="flex items-center gap-[6px]" style={{ width: 44 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{ width: 9, height: 9, borderRadius: "50%", background: dim(0.14) }}
            />
          ))}
        </div>
        <div className="flex flex-1 justify-center">
          <span
            className="mono-label"
            style={{ color: dim(0.4), fontSize: "0.55rem", letterSpacing: "0.1em" }}
          >
            {label}
          </span>
        </div>
        <div style={{ width: 44 }} />
      </div>
      <div style={{ background: "#FFFFFF" }}>{children}</div>
    </div>
  );
}

/* ─── Booking ledger: an itemised bill with advances netted off ─── */

const BILL_LINES = [
  ["Hall rent", "₹ 85,000"],
  ["Air conditioning", "₹ 12,000"],
  ["Generator", "₹ 6,500"],
  ["Cleaning", "₹ 4,000"],
  ["EB and water", "₹ 3,200"],
] as const;

export function BookingLedger({ compact = false }: { compact?: boolean }) {
  return (
    <BrowserFrame label="Booking · 14 Nov 2026">
      <div className={compact ? "p-5" : "p-6"}>
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <div className="mono-label mb-1.5" style={{ color: dim(0.42), fontSize: "0.52rem" }}>
              Reception · Main hall
            </div>
            <div
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: compact ? "1rem" : "1.15rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: INK,
              }}
            >
              Balance ₹ 47,700
            </div>
          </div>
          <span
            className="mono-label px-2 py-1"
            style={{ fontSize: "0.5rem", color: dim(0.55), border: `1px solid ${dim(0.14)}` }}
          >
            Upcoming
          </span>
        </div>

        <div className="flex flex-col">
          {BILL_LINES.slice(0, compact ? 4 : 5).map(([label, amount], i) => (
            <motion.div
              key={label}
              className="flex items-center justify-between py-2.5"
              style={{ borderTop: `1px solid ${dim(0.07)}` }}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
            >
              <span style={{ fontSize: "0.82rem", color: dim(0.7) }}>{label}</span>
              <span className="mono-label" style={{ fontSize: "0.6rem", color: dim(0.85) }}>
                {amount}
              </span>
            </motion.div>
          ))}
          <div
            className="flex items-center justify-between py-3 mt-1"
            style={{ borderTop: `1px solid ${dim(0.18)}` }}
          >
            <span className="mono-label" style={{ fontSize: "0.55rem", color: dim(0.5) }}>
              Less advances
            </span>
            <span className="mono-label" style={{ fontSize: "0.6rem", color: dim(0.5) }}>
              ₹ 63,000
            </span>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* ─── Dashboard: KPIs, a monthly revenue chart, upcoming events ─── */

const KPIS = [
  ["Revenue", "₹ 12.4L"],
  ["Expenses", "₹ 3.1L"],
  ["Net profit", "₹ 9.3L"],
  ["Bookings", "34"],
] as const;

const BARS = [42, 58, 35, 71, 64, 88, 52, 76, 61, 94, 70, 46];

const UPCOMING = [
  ["14 Nov", "Reception · Main hall"],
  ["21 Nov", "Wedding · Full day"],
  ["03 Dec", "Reception · Main hall"],
] as const;

export function RegiaDashboard() {
  return (
    <BrowserFrame label="Dashboard · 2026">
      <div className="p-6">
        {/* KPI row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {KPIS.map(([k, v], i) => (
            <motion.div
              key={k}
              className="px-3 py-3"
              style={{ border: `1px solid ${dim(0.08)}`, borderRadius: 8 }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.08 * i }}
            >
              <div className="mono-label mb-1.5" style={{ color: dim(0.4), fontSize: "0.46rem" }}>
                {k}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: INK,
                }}
              >
                {v}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Monthly revenue */}
        <div className="mb-6">
          <div className="mono-label mb-3" style={{ color: dim(0.4), fontSize: "0.46rem" }}>
            Monthly revenue
          </div>
          <div className="flex items-end gap-[6px]" style={{ height: 74 }}>
            {BARS.map((h, i) => (
              <motion.span
                key={i}
                className="flex-1 block"
                style={{ background: dim(i === 9 ? 0.78 : 0.16), borderRadius: 2 }}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.035, ease: [0.25, 0, 0.25, 1] }}
              />
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div className="mono-label mb-2" style={{ color: dim(0.4), fontSize: "0.46rem" }}>
          Upcoming
        </div>
        <div className="flex flex-col">
          {UPCOMING.map(([date, what]) => (
            <div
              key={date + what}
              className="flex items-center justify-between py-2"
              style={{ borderTop: `1px solid ${dim(0.07)}` }}
            >
              <span className="mono-label" style={{ fontSize: "0.55rem", color: dim(0.75) }}>
                {date}
              </span>
              <span style={{ fontSize: "0.78rem", color: dim(0.6) }}>{what}</span>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

/* ─── Calendar: the month, with held dates marked ─── */

const BOOKED = new Set([3, 9, 14, 15, 21, 27]);
const HELD = new Set([6, 18]);

export function RegiaCalendar() {
  return (
    <BrowserFrame label="Calendar · Nov 2026">
      <div className="p-5">
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <div
              key={i}
              className="mono-label text-center"
              style={{ color: dim(0.32), fontSize: "0.46rem" }}
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const booked = BOOKED.has(day);
            const held = HELD.has(day);
            return (
              <motion.div
                key={day}
                className="flex items-center justify-center"
                style={{
                  aspectRatio: "1 / 1",
                  borderRadius: 5,
                  background: booked ? INK : held ? dim(0.09) : "transparent",
                  border: booked ? "none" : `1px solid ${dim(0.07)}`,
                  color: booked ? "#F5F4EF" : dim(0.5),
                  fontSize: "0.6rem",
                  fontWeight: booked ? 700 : 400,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, delay: 0.008 * day }}
              >
                {day}
              </motion.div>
            );
          })}
        </div>
        <div className="flex items-center gap-5 mt-4 pt-3" style={{ borderTop: `1px solid ${dim(0.07)}` }}>
          {[
            ["Booked", INK],
            ["Held", dim(0.18)],
          ].map(([label, colour]) => (
            <span key={label} className="flex items-center gap-2">
              <span style={{ width: 8, height: 8, borderRadius: 2, background: colour }} />
              <span className="mono-label" style={{ fontSize: "0.46rem", color: dim(0.5) }}>
                {label}
              </span>
            </span>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}
