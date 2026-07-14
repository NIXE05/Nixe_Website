"use client";

import { useEffect, useRef, useState } from "react";

import { useRevealed } from "@/lib/reveal";

const links = [
  { label: "Work",     href: "#work"     },
  { label: "Apps",     href: "/courtsy"  },
  { label: "Services", href: "#services" },
  { label: "About",    href: "#about"    },
  { label: "Contact",  href: "#contact"  },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden]     = useState(false);
  const revealed = useRevealed();
  const lastScrollY = useRef(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const THRESHOLD   = 50;

  useEffect(() => {
    const vh = window.innerHeight;
    const onScroll = () => {
      const y     = window.scrollY;
      const delta = y - lastScrollY.current;
      setScrolled(y > vh / 4);
      // Journey progress hairline along the pill's bottom edge (ref write —
      // no re-render per scroll frame).
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progressRef.current?.style.setProperty("transform", `scaleX(${Math.min(1, y / max)})`);
      if (y > vh) {
        if (delta >  THRESHOLD) setHidden(true);
        if (delta < -THRESHOLD) setHidden(false);
      } else {
        setHidden(false);
      }
      if (Math.abs(delta) > THRESHOLD) lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between"
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        // links ease in while the loader dissolves
        opacity: revealed ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.76,0,0.24,1), padding 0.5s cubic-bezier(0.76,0,0.24,1), opacity 0.5s ease 0.15s",
        padding: scrolled ? "14px 16px" : "28px 40px",
      }}
    >
      <div
        className="relative flex w-full items-center justify-between transition-all duration-500"
        style={scrolled ? {
          background: "rgba(250,250,247,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: "10px",
          padding: "6px 14px",
          border: "1px solid rgba(10,10,10,0.08)",
          boxShadow: "0 2px 20px rgba(10,10,10,0.06)",
        } : {}}
      >
        {/* Journey progress hairline — only visible once the pill condenses */}
        <div
          ref={progressRef}
          aria-hidden="true"
          className="absolute bottom-0 left-[14px] right-[14px] h-px origin-left pointer-events-none"
          style={{
            background: "rgba(10,10,10,0.28)",
            transform: "scaleX(0)",
            opacity: scrolled ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />
        {/* Wordmark */}
        <a href="#" aria-label="NIXE home" data-cursor-hover>
          <span
            data-nav-wordmark
            className="text-nixe-ink select-none tracking-[0.12em] inline-block"
            style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: scrolled ? "1.05rem" : "1.25rem",
              fontWeight: 800,
              // crossfades in as the loader's wordmark lands on this spot
              opacity: revealed ? 1 : 0,
              transition: "font-size 0.5s cubic-bezier(0.76,0,0.24,1), opacity 0.25s ease 0.72s",
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
                data-cursor-hover
              >
                {/* Glowing dot */}
                <div
                  className="absolute left-0 size-[8px] -translate-x-5 rounded-sm opacity-0 blur-[12px] transition-all duration-400 group-hover/link:-translate-x-[4px] group-hover/link:opacity-100 group-hover/link:blur-0"
                  style={{ background: "rgba(10,10,10,0.6)" }}
                />
                {/* Text */}
                <div className="relative isolate flex overflow-hidden -translate-x-[4px] transition-transform duration-400 group-hover/link:translate-x-[4px]">
                  <span className="mono-label text-nixe-ink/70 transition-transform duration-400 group-hover/link:-translate-y-full">
                    {label}
                  </span>
                  <span
                    className="mono-label text-nixe-ink/70 absolute inset-0 translate-y-full transition-transform duration-400 group-hover/link:translate-y-0"
                    aria-hidden="true"
                  >
                    {label}
                  </span>
                </div>
                {/* Corner accents */}
                {(["top-0 left-0","top-0 right-0 rotate-90","bottom-0 right-0 rotate-180","bottom-0 left-0 -rotate-90"] as const).map(pos => (
                  <svg key={pos} className={`absolute size-[9px] opacity-0 group-hover/link:opacity-55 transition-opacity duration-300 ${pos}`} style={{ color: "rgba(10,10,10,0.5)" }} width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M0.5 0.2L0.5 9.2M0.2 0.5L9.2 0.5" stroke="currentColor"/>
                  </svg>
                ))}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile */}
        <a
          href="#contact"
          className="md:hidden mono-label text-nixe-ink/70 border px-4 py-2"
          style={{ borderColor: "rgba(10,10,10,0.12)" }}
          data-cursor-hover
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
