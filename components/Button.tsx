"use client";

import type { CSSProperties, ReactNode } from "react";

type Variant = "solid" | "outline";

interface ButtonProps {
  href?: string;
  type?: "button" | "submit";
  variant?: Variant;
  /** Runs alongside navigation when `href` is also set — it does not block it. */
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Tone-aware action. Both variants are defined purely against the enclosing
 * plate's --tone-* variables, so a solid button is ink-on-paper inside a paper
 * plate and pearl-on-ink inside an ink one — same markup, no per-section
 * overrides.
 */
export function Button({
  href,
  type = "button",
  variant = "solid",
  onClick,
  className,
  style,
  children,
}: ButtonProps) {
  const base: CSSProperties = {
    height: 48,
    paddingInline: 28,
    transition:
      "transform 0.32s cubic-bezier(0.25,0,0.25,1), background-color 0.3s, border-color 0.3s, opacity 0.3s",
    ...style,
  };

  const skin: CSSProperties =
    variant === "solid"
      ? {
          background: "var(--tone-fg)",
          color: "var(--tone-bg)",
          border: "1px solid var(--tone-fg)",
        }
      : {
          background: "transparent",
          color: "var(--tone-fg)",
          border: "1px solid var(--tone-line)",
        };

  const hoverIn = (el: HTMLElement) => {
    el.style.transform = "translateY(-2px)";
    if (variant === "outline") {
      el.style.borderColor = "var(--tone-fg)";
      el.style.backgroundColor = "var(--tone-fill)";
    } else {
      el.style.opacity = "0.86";
    }
  };
  const hoverOut = (el: HTMLElement) => {
    el.style.transform = "translateY(0)";
    if (variant === "outline") {
      el.style.borderColor = "var(--tone-line)";
      el.style.backgroundColor = "transparent";
    } else {
      el.style.opacity = "1";
    }
  };

  const inner = (
    <span className="mono-label" style={{ color: "inherit" }}>
      {children}
    </span>
  );

  const shared = {
    className: `inline-flex items-center justify-center no-underline ${className ?? ""}`,
    style: { ...base, ...skin },
    onClick,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => hoverIn(e.currentTarget),
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => hoverOut(e.currentTarget),
  };

  if (href) {
    return (
      <a href={href} {...shared}>
        {inner}
      </a>
    );
  }

  return (
    <button type={type} {...shared}>
      {inner}
    </button>
  );
}
