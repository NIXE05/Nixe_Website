"use client";

import { useEffect, useRef, useState } from "react";

export function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    let mx = -300, my = -300;
    let dx = -300, dy = -300;
    let rx = -300, ry = -300;
    let rafId: number;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    const tick = () => {
      dx += (mx - dx) * 0.55;
      dy += (my - dy) * 0.55;
      rx += (mx - rx) * 0.38;
      ry += (my - ry) * 0.38;
      dotRef.current?.style.setProperty("transform",  `translate(${dx}px,${dy}px)`);
      ringRef.current?.style.setProperty("transform", `translate(${rx}px,${ry}px)`);
      rafId = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    const enter = () => {
      if (!ringRef.current) return;
      ringRef.current.style.width  = "44px";
      ringRef.current.style.height = "44px";
      ringRef.current.style.marginLeft = "-22px";
      ringRef.current.style.marginTop  = "-22px";
    };
    const leave = () => {
      if (!ringRef.current) return;
      ringRef.current.style.width  = "24px";
      ringRef.current.style.height = "24px";
      ringRef.current.style.marginLeft = "-12px";
      ringRef.current.style.marginTop  = "-12px";
    };

    const bind = () => {
      document.querySelectorAll("a, button, [data-cursor-hover]").forEach(el => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
      });
    };

    bind();
    const obs = new MutationObserver(bind);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      obs.disconnect();
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* White dot + difference = always contrasts with bg */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full bg-white"
        style={{ width: 7, height: 7, marginLeft: -3.5, marginTop: -3.5, mixBlendMode: "difference" }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full border border-white"
        style={{
          width: 24,
          height: 24,
          marginLeft: -12,
          marginTop: -12,
          mixBlendMode: "difference",
          transition: "width 0.18s ease, height 0.18s ease, margin 0.18s ease",
        }}
      />
    </>
  );
}
