"use client";

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      className="flex flex-col md:flex-row items-center justify-between gap-8 px-6 md:px-10 py-12"
      style={{ background: "#FAFAF7", borderTop: "1px solid rgba(10,10,10,0.07)" }}
    >
      <span
        className="text-nixe-ink select-none tracking-[0.12em]"
        style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif", fontSize: "1.2rem", fontWeight: 800 }}
      >
        NIXE
      </span>

      <div className="mono-label text-center space-y-1" style={{ color: "rgba(10,10,10,0.52)" }}>
        <p>© 2026 NIXE</p>
        <p>nixe.in · Markham, Ontario</p>
      </div>

      <button
        onClick={scrollToTop}
        className="group/btn relative isolate flex h-[40px] items-center px-5"
        data-cursor-hover
      >
        <div className="relative isolate flex overflow-hidden -translate-x-[4px] transition-transform duration-400 group-hover/btn:translate-x-[4px]">
          <span className="mono-label transition-transform duration-400 group-hover/btn:-translate-y-full" style={{ color: "rgba(10,10,10,0.58)" }}>↑ BACK TO TOP</span>
          <span className="mono-label absolute inset-0 translate-y-full transition-transform duration-400 group-hover/btn:translate-y-0" style={{ color: "rgba(10,10,10,0.4)" }} aria-hidden="true">↑ BACK TO TOP</span>
        </div>
      </button>
    </footer>
  );
}
