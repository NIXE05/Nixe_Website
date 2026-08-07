"use client";

import { useEffect, useRef } from "react";

/**
 * Two families of hairlines crossing at shallow opposing angles, drifting
 * perpendicular to themselves so the moiré between them breathes. A sweep
 * travels along the normal axis and brightens the lines it crosses; a second,
 * slower scan crosses horizontally. Everything is 2D canvas — no WebGL, no
 * geometry, no particle system.
 *
 * Cost is ~70 strokes a frame. It parks itself when the tab is hidden, when the
 * hero scrolls out of view, and renders exactly one static frame under
 * `prefers-reduced-motion`.
 */

type Family = {
  angle: number;
  spacing: number;
  /** Normal-axis drift, px/second. Sign sets direction. */
  drift: number;
  alpha: number;
  width: number;
};

const FAMILIES: Family[] = [
  { angle: 0.42, spacing: 78, drift: 5.5, alpha: 0.075, width: 1 },
  { angle: -0.30, spacing: 124, drift: -3.4, alpha: 0.06, width: 1 },
  { angle: 1.5708, spacing: 216, drift: 2.1, alpha: 0.042, width: 1 },
];

/** Seconds for the sweep to cross the field once, per family. */
const SWEEP_PERIOD = [7.5, 11.5, 17];
const SWEEP_SIGMA = 92;
const SWEEP_BOOST = 0.2;

export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let onscreen = true;

    // Pointer parallax — the lattice leans a few pixels toward the cursor.
    let px = 0;
    let py = 0;
    let sx = 0;
    let sy = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = wrap.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawFamily = (f: Family, phase: number, sweep: number) => {
      const cx = w / 2;
      const cy = h / 2;
      const dx = Math.cos(f.angle);
      const dy = Math.sin(f.angle);
      const nx = -Math.sin(f.angle);
      const ny = Math.cos(f.angle);
      const L = Math.hypot(w, h);
      // Half-extent of the field measured along this family's normal.
      const reach = (Math.abs(w * nx) + Math.abs(h * ny)) / 2 + f.spacing;

      ctx.lineWidth = f.width;
      const first = -Math.ceil(reach / f.spacing) * f.spacing;

      for (let d = first; d <= reach; d += f.spacing) {
        // Wrap the drift into a single spacing so lines never run out.
        const off = d + phase;
        if (off < -reach || off > reach) continue;

        const k = (off - sweep) / SWEEP_SIGMA;
        const glow = Math.exp(-0.5 * k * k);

        ctx.globalAlpha = f.alpha + SWEEP_BOOST * glow;
        const ox = cx + nx * off;
        const oy = cy + ny * off;
        ctx.beginPath();
        ctx.moveTo(ox - dx * L, oy - dy * L);
        ctx.lineTo(ox + dx * L, oy + dy * L);
        ctx.stroke();
      }
    };

    const render = (tMs: number) => {
      const t = tMs / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "#0A0A0A";
      ctx.lineCap = "butt";

      FAMILIES.forEach((f, i) => {
        const phase = ((t * f.drift) % f.spacing + f.spacing) % f.spacing;
        const nx = -Math.sin(f.angle);
        const ny = Math.cos(f.angle);
        const reach = (Math.abs(w * nx) + Math.abs(h * ny)) / 2 + f.spacing;
        // Sweep runs edge to edge, then restarts from the far side.
        const u = (t / SWEEP_PERIOD[i]) % 1;
        drawFamily(f, phase, -reach + u * reach * 2);
      });

      ctx.globalAlpha = 1;
    };

    const loop = (tMs: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || !onscreen) return;

      if (finePointer) {
        sx += (px - sx) * 0.055;
        sy += (py - sy) * 0.055;
        canvas.style.transform = `translate3d(${sx.toFixed(2)}px, ${sy.toFixed(2)}px, 0)`;
      }
      render(tMs);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      px = ((e.clientX - rect.left) / rect.width - 0.5) * -22;
      py = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    };
    const onLeave = () => {
      px = 0;
      py = 0;
    };
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };

    resize();

    if (reduced) {
      render(0);
      return () => {};
    }

    const ro = new ResizeObserver(() => {
      resize();
      render(performance.now());
    });
    ro.observe(wrap);

    // Stop drawing entirely once the hero has scrolled past.
    const io = new IntersectionObserver(
      ([entry]) => {
        onscreen = entry.isIntersecting;
      },
      { rootMargin: "120px" },
    );
    io.observe(wrap);

    document.addEventListener("visibilitychange", onVisibility);
    if (finePointer) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ willChange: "transform" }}
      />
      {/* Edge falloff — the lattice never reaches the plate border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(115% 95% at 50% 45%, transparent 42%, #FAFAF7 96%)",
        }}
      />
    </div>
  );
}
