"use client";

/**
 * The footer continues the Contact plate's ink rather than cutting to paper, so
 * the page closes on one heavy block instead of a thin light strip.
 */
export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer data-tone="ink" className="plate plate-ink relative z-[1]">
      <div className="px-6 md:px-10 max-w-[1440px] mx-auto">
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-8 py-12"
          style={{ borderTop: "1px solid var(--tone-line)" }}
        >
          <span
            className="select-none tracking-[0.12em]"
            style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "var(--tone-fg)",
            }}
          >
            NIXE
          </span>

          <div
            className="mono-label text-center space-y-1"
            style={{ color: "var(--tone-fg-3)" }}
          >
            <p>© 2026 NIXE</p>
            <p>nixe.in · Markham, Ontario</p>
          </div>

          <button
            onClick={scrollToTop}
            className="group/btn relative isolate flex h-[40px] items-center px-5"
          >
            <div className="relative isolate flex overflow-hidden -translate-x-[4px] transition-transform duration-400 group-hover/btn:translate-x-[4px]">
              <span
                className="mono-label transition-transform duration-400 group-hover/btn:-translate-y-full"
                style={{ color: "var(--tone-fg-3)" }}
              >
                ↑ BACK TO TOP
              </span>
              <span
                className="mono-label absolute inset-0 translate-y-full transition-transform duration-400 group-hover/btn:translate-y-0"
                style={{ color: "var(--tone-fg)" }}
                aria-hidden="true"
              >
                ↑ BACK TO TOP
              </span>
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
