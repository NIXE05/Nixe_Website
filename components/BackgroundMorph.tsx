"use client";

import { useEffect } from "react";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Hold 30% → morph 40% → hold 30% — the same curve WorldCanvas uses for
 * formation blending, so page color and particle world shift as one. */
const plateau = (u: number) => clamp01((u - 0.3) / 0.4);

function parseHex(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const v = parseInt(m[1], 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

/** Document-space top via the offsetParent chain — ignores the scrubbed
 * transforms SectionMorph applies, which getBoundingClientRect would not. */
function docTop(el: HTMLElement): number {
  let t = 0;
  let n: HTMLElement | null = el;
  while (n) {
    t += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return t;
}

/**
 * Continuously interpolates the <html> background between each section's
 * data-bg-color as you scroll — no trigger-line flip, no hard boundaries.
 * Each color is anchored to the scroll position where its section is
 * centered in the viewport.
 */
export function BackgroundMorph() {
  useEffect(() => {
    const root = document.documentElement;
    const prevBg = root.style.backgroundColor;

    // The mobile browser chrome (status bar, tab strip) morphs in lockstep
    // with the page — the device frame becomes part of the continuous world.
    let themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement("meta");
      themeMeta.name = "theme-color";
      document.head.appendChild(themeMeta);
    }
    const prevTheme = themeMeta.content;

    let anchors: number[] = [];
    let colors: Array<[number, number, number]> = [];

    const measure = () => {
      const vh = window.innerHeight;
      const nextA: number[] = [];
      const nextC: Array<[number, number, number]> = [];
      document.querySelectorAll<HTMLElement>("[data-bg-color]").forEach((el) => {
        const rgb = parseHex(el.dataset.bgColor ?? "");
        if (!rgb) return;
        nextA.push(Math.max(0, docTop(el) + el.offsetHeight * 0.5 - vh * 0.5));
        nextC.push(rgb);
      });
      anchors = nextA;
      colors = nextC;
    };

    let last = "";
    const update = () => {
      if (!anchors.length) return;
      const y = window.scrollY;
      let k = anchors.length - 1;
      let t = 0;
      if (y <= anchors[0]) {
        k = 0;
      } else {
        for (let i = 0; i < anchors.length - 1; i++) {
          if (y < anchors[i + 1]) {
            const span = Math.max(1, anchors[i + 1] - anchors[i]);
            k = i;
            t = plateau((y - anchors[i]) / span);
            break;
          }
        }
      }
      const a = colors[k];
      const b = colors[Math.min(k + 1, colors.length - 1)];
      const css = `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(
        a[1] + (b[1] - a[1]) * t,
      )}, ${Math.round(a[2] + (b[2] - a[2]) * t)})`;
      if (css !== last) {
        root.style.backgroundColor = css;
        themeMeta.content = css;
        last = css;
      }
    };

    measure();
    update();
    const remeasureT = window.setTimeout(() => {
      measure();
      update();
    }, 1000);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };
    const onResize = () => {
      measure();
      update();
    };

    const ro = new ResizeObserver(() => {
      measure();
      update();
    });
    ro.observe(document.body);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(remeasureT);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      root.style.backgroundColor = prevBg;
      themeMeta.content = prevTheme || "#FAFAF7";
    };
  }, []);

  return null;
}
