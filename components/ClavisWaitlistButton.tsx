"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// Shared NIXE FormSpark endpoint — submissions are distinguished by the
// `source` field ("clavis.waitlist" vs "courtsy.waitlist").
const FORMSPARK_URL = "https://submit-form.com/DlW1lIZCW";

interface ClavisWaitlistButtonProps {
  children?: ReactNode;
  /** "md" (default) = section CTA. "sm" = nav-pill size. */
  size?: "sm" | "md";
  /** "light" (default) = pearl bg / dark text (use on dark sections). "dark" = ink bg / pearl text (use on light bg). */
  variant?: "dark" | "light";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Filled "Request Early Access" button that opens an accessible modal with a
 * name + work email + hotel form. Submits to FormSpark via fetch so the user
 * stays on the page; success state is shown inline. Mirrors WaitlistButton but
 * is tuned for Clavis's B2B / pre-launch early-access motion.
 */
export function ClavisWaitlistButton({
  children = "Request Early Access",
  size = "md",
  variant = "light",
  className,
  style,
}: ClavisWaitlistButtonProps) {
  const [open, setOpen] = useState(false);
  // Portal only after mount so createPortal never runs during SSR (no document).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const sizeCls = size === "sm" ? "h-[36px] px-4" : "h-[48px] px-7";
  const isDark = variant === "dark";
  const bg = isDark ? "var(--color-nixe-ink)" : "var(--color-nixe-pearl)";
  const fg = isDark ? "var(--color-nixe-pearl)" : "var(--color-nixe-ink)";
  const hoverShadow = isDark
    ? "0 14px 32px rgba(10,10,10,0.22)"
    : "0 14px 32px rgba(245,244,239,0.28)";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-cursor-hover
        className={`group/btn relative inline-flex ${sizeCls} items-center justify-center ${className ?? ""}`}
        style={{
          background: bg,
          color: fg,
          transition: "transform 0.35s cubic-bezier(0.25,0,0.25,1), box-shadow 0.35s",
          ...style,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = hoverShadow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <span className="mono-label" style={{ color: fg }}>
          {children}
        </span>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && <EarlyAccessModal onClose={() => setOpen(false)} />}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function EarlyAccessModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hotel, setHotel] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const firstInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = setTimeout(() => firstInputRef.current?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Trap Tab within the dialog — aria-modal promises the background is inert.
      if (e.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;
        const focusables = Array.from(
          root.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null || el === document.activeElement);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !root.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else if (active === last || !root.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus?.();
    };
  }, [onClose]);

  // When the form succeeds it unmounts (with the focused submit button), so pull
  // focus back into the dialog rather than dropping it to <body>.
  useEffect(() => {
    if (status === "success") closeBtnRef.current?.focus();
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    // Client-side validation — the form is noValidate, and FormSpark accepts
    // arbitrary payloads, so guard against empty / malformed submissions here.
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!trimmedName || !emailOk) {
      setStatus("error");
      setErrorMsg(!trimmedName ? "Please enter your name." : "Please enter a valid work email.");
      (trimmedName ? emailInputRef : firstInputRef).current?.focus();
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const params = new URLSearchParams();
      params.append("name", trimmedName);
      params.append("email", trimmedEmail);
      params.append("hotel", hotel.trim());
      params.append("source", "clavis.waitlist");

      const res = await fetch(FORMSPARK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: params.toString(),
      });

      const text = await res.text();
      let parsed: { success?: boolean; message?: string } | null = null;
      try {
        parsed = text ? JSON.parse(text) : null;
      } catch {
        /* non-JSON body */
      }

      if (!res.ok || parsed?.success === false) {
        const msg =
          parsed?.message ||
          (text && text.length < 240 ? text : `Submission failed (HTTP ${res.status}).`);
        throw new Error(msg);
      }

      setStatus("success");
    } catch (err) {
      console.error("[ClavisWaitlistButton] submission failed:", err);
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Try again, or email nixe.cxt@gmail.com."
      );
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clavis-access-title"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-5"
      style={{
        background: "rgba(10,10,10,0.55)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        className="w-full max-w-[480px] relative"
        style={{
          background: "var(--color-nixe-paper)",
          borderRadius: 18,
          padding: "44px 36px 36px",
          boxShadow: "0 32px 80px rgba(10,10,10,0.35), 0 0 0 1px rgba(10,10,10,0.06)",
        }}
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.32, ease: [0.25, 0, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          type="button"
          aria-label="Close"
          data-cursor-hover
          onClick={onClose}
          className="absolute top-4 right-4 size-9 flex items-center justify-center rounded-full transition-colors"
          style={{ color: "rgba(10,10,10,0.55)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(10,10,10,0.06)";
            e.currentTarget.style.color = "rgba(10,10,10,0.9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(10,10,10,0.55)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        {status === "success" ? (
          <SuccessState email={email} onClose={onClose} />
        ) : (
          <>
            <div className="mono-label mb-3" style={{ color: "rgba(10,10,10,0.55)" }}>
              CLAVIS · EARLY ACCESS
            </div>
            <h2
              id="clavis-access-title"
              className="mb-3"
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: "clamp(1.85rem, 3vw, 2.4rem)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                color: "var(--color-nixe-ink)",
              }}
            >
              Run your first pilot.
            </h2>
            <p
              className="mb-8"
              style={{
                fontSize: "0.98rem",
                lineHeight: 1.6,
                color: "rgba(10,10,10,0.65)",
              }}
            >
              We&apos;re onboarding a small set of hotels before launch. Tell us where
              you run, and we&apos;ll reach out to set up your early-access pilot.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              <Field
                id="clavis-name"
                ref={firstInputRef}
                label="NAME"
                type="text"
                value={name}
                onChange={setName}
                required
                disabled={status === "loading"}
                autoComplete="name"
              />
              <Field
                id="clavis-email"
                ref={emailInputRef}
                label="WORK EMAIL"
                type="email"
                value={email}
                onChange={setEmail}
                required
                disabled={status === "loading"}
                autoComplete="email"
              />
              <Field
                id="clavis-hotel"
                label="HOTEL / PROPERTY"
                type="text"
                value={hotel}
                onChange={setHotel}
                disabled={status === "loading"}
                autoComplete="organization"
              />

              <button
                type="submit"
                data-cursor-hover
                disabled={status === "loading"}
                className="mt-3 inline-flex h-[48px] items-center justify-center px-7 transition-all"
                style={{
                  background: "var(--color-nixe-ink)",
                  color: "var(--color-nixe-pearl)",
                  opacity: status === "loading" ? 0.6 : 1,
                  cursor: status === "loading" ? "wait" : undefined,
                }}
              >
                <span className="mono-label" style={{ color: "var(--color-nixe-pearl)" }}>
                  {status === "loading" ? "Sending…" : "Request Access"}
                </span>
              </button>

              {status === "error" && (
                <p
                  role="alert"
                  className="mono-label"
                  style={{
                    color: "#B0413E",
                    lineHeight: 1.5,
                    textTransform: "none",
                    letterSpacing: "0.02em",
                  }}
                >
                  {errorMsg}
                </p>
              )}

              <p className="text-xs leading-relaxed mt-1" style={{ color: "rgba(10,10,10,0.5)" }}>
                By requesting access you agree to be contacted about the Clavis pilot. See our{" "}
                <a
                  href="/clavis/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: "rgba(10,10,10,0.7)" }}
                  data-cursor-hover
                >
                  privacy policy
                </a>
                .
              </p>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Field primitive ─────────────────────────────────────────────────────────
const Field = ({
  ref,
  id,
  label,
  type,
  value,
  onChange,
  required,
  disabled,
  autoComplete,
}: {
  ref?: React.Ref<HTMLInputElement>;
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="mono-label" style={{ color: "rgba(10,10,10,0.6)" }}>
      {label}
    </label>
    <input
      ref={ref}
      id={id}
      type={type}
      value={value}
      required={required}
      disabled={disabled}
      autoComplete={autoComplete}
      onChange={(e) => onChange(e.target.value)}
      className="bg-transparent text-nixe-ink py-3 outline-none transition-colors duration-200"
      style={{
        borderBottom: "1px solid rgba(10,10,10,0.18)",
        fontSize: "1rem",
        fontFamily: "var(--font-jakarta), system-ui, sans-serif",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderBottomColor = "var(--color-nixe-ink)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderBottomColor = "rgba(10,10,10,0.18)";
      }}
    />
  </div>
);

// ─── Success state ───────────────────────────────────────────────────────────
function SuccessState({ email, onClose }: { email: string; onClose: () => void }) {
  return (
    <div className="text-center pt-2">
      <div
        className="mx-auto mb-6 size-12 flex items-center justify-center rounded-full"
        style={{ background: "rgba(31,170,90,0.12)" }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
          <path
            d="M5 11L9 15L17 7"
            stroke="#1FAA5A"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="mono-label mb-3" style={{ color: "rgba(10,10,10,0.55)" }}>
        REQUEST RECEIVED
      </div>
      <h2
        className="mb-4"
        style={{
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
          fontSize: "clamp(1.85rem, 3vw, 2.4rem)",
          fontWeight: 800,
          letterSpacing: "-0.025em",
          lineHeight: 1.05,
          color: "var(--color-nixe-ink)",
        }}
      >
        We&apos;ll be in touch.
      </h2>
      <p
        className="mb-8"
        style={{
          fontSize: "0.98rem",
          lineHeight: 1.6,
          color: "rgba(10,10,10,0.65)",
        }}
      >
        We&apos;ll reach out to{" "}
        <strong style={{ color: "var(--color-nixe-ink)" }}>{email}</strong>{" "}
        to set up your Clavis early-access pilot.
      </p>
      <button
        type="button"
        onClick={onClose}
        data-cursor-hover
        className="inline-flex h-[44px] items-center justify-center px-6"
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
          Close
        </span>
      </button>
    </div>
  );
}
