"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Shipped", href: "#shipped" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/** Vertical point on screen the nav samples to decide what it's sitting over. */
const PROBE_Y = 42;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [onInk, setOnInk] = useState(false);
  const lastScrollY = useRef(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const THRESHOLD = 50;

  useEffect(() => {
    const plates = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-tone]"));

    const onScroll = () => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      const delta = y - lastScrollY.current;

      setScrolled(y > vh / 4);

      // Journey progress hairline along the pill's bottom edge (ref write — no
      // re-render per scroll frame).
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      progressRef.current?.style.setProperty(
        "transform",
        `scaleX(${Math.min(1, y / max)})`,
      );

      // Which plate is under the nav right now? Plates are opaque and hard-
      // edged, so the nav has to invert to stay legible over the ink ones.
      let ink = false;
      for (const el of plates()) {
        const r = el.getBoundingClientRect();
        if (r.top <= PROBE_Y && r.bottom > PROBE_Y) ink = el.dataset.tone === "ink";
      }
      setOnInk((prev) => (prev === ink ? prev : ink));

      if (y > vh) {
        if (delta > THRESHOLD) setHidden(true);
        if (delta < -THRESHOLD) setHidden(false);
      } else {
        setHidden(false);
      }
      if (Math.abs(delta) > THRESHOLD) lastScrollY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const fg = onInk ? "#F5F4EF" : "#0A0A0A";
  const fgDim = onInk ? "rgba(245,244,239,0.72)" : "rgba(10,10,10,0.72)";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between"
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition:
          "transform 0.4s cubic-bezier(0.76,0,0.24,1), padding 0.5s cubic-bezier(0.76,0,0.24,1)",
        padding: scrolled ? "14px 16px" : "28px 40px",
      }}
    >
      <div
        className="relative flex w-full items-center justify-between transition-all duration-500"
        style={
          scrolled
            ? {
                background: onInk ? "rgba(10,10,10,0.72)" : "rgba(250,250,247,0.92)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderRadius: "10px",
                padding: "6px 14px",
                border: `1px solid ${
                  onInk ? "rgba(245,244,239,0.14)" : "rgba(10,10,10,0.08)"
                }`,
                boxShadow: onInk ? "none" : "0 2px 20px rgba(10,10,10,0.06)",
              }
            : {}
        }
      >
        {/* Journey progress hairline — only visible once the pill condenses */}
        <div
          ref={progressRef}
          aria-hidden="true"
          className="absolute bottom-0 left-[14px] right-[14px] h-px origin-left pointer-events-none"
          style={{
            background: fgDim,
            transform: "scaleX(0)",
            opacity: scrolled ? 0.5 : 0,
            transition: "opacity 0.5s ease, background-color 0.4s ease",
          }}
        />

        {/* Wordmark */}
        <a href="#" aria-label="NIXE home">
          <span
            data-nav-wordmark
            className="select-none tracking-[0.12em] inline-block"
            style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: scrolled ? "1.05rem" : "1.25rem",
              fontWeight: 800,
              color: fg,
              transition:
                "font-size 0.5s cubic-bezier(0.76,0,0.24,1), color 0.4s ease",
            }}
          >
            NIXE
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center list-none gap-1">
          {links.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="group/link relative isolate flex h-[40px] items-center px-5"
              >
                <div className="relative isolate flex overflow-hidden -translate-x-[4px] transition-transform duration-400 group-hover/link:translate-x-[4px]">
                  <span
                    className="mono-label transition-transform duration-400 group-hover/link:-translate-y-full"
                    style={{ color: fgDim, transitionProperty: "transform, color" }}
                  >
                    {label}
                  </span>
                  <span
                    className="mono-label absolute inset-0 translate-y-full transition-transform duration-400 group-hover/link:translate-y-0"
                    style={{ color: fg }}
                    aria-hidden="true"
                  >
                    {label}
                  </span>
                </div>
                {/* Corner accents */}
                {(
                  [
                    "top-0 left-0",
                    "top-0 right-0 rotate-90",
                    "bottom-0 right-0 rotate-180",
                    "bottom-0 left-0 -rotate-90",
                  ] as const
                ).map((pos) => (
                  <svg
                    key={pos}
                    className={`absolute size-[9px] opacity-0 group-hover/link:opacity-55 transition-opacity duration-300 ${pos}`}
                    style={{ color: fg }}
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M0.5 0.2L0.5 9.2M0.2 0.5L9.2 0.5" stroke="currentColor" />
                  </svg>
                ))}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile */}
        <a
          href="#contact"
          className="md:hidden mono-label px-4 py-2"
          style={{
            color: fgDim,
            border: `1px solid ${onInk ? "rgba(245,244,239,0.2)" : "rgba(10,10,10,0.12)"}`,
            transition: "color 0.4s ease, border-color 0.4s ease",
          }}
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
