"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─── Tunables ─────────────────────────────────────────────────────────────────
const POINT_COUNT          = 380;     // dots — pattern state
const SPHERE_RADIUS        = 4.6;     // sphere fills most of section area
const SPHERE_THRESHOLD     = 1.45;    // sphere wireframe connection distance
const NIXE_THRESHOLD       = 0.55;    // letter scaffold connection distance
const NIXE_WIDTH           = 9.0;     // dots converge toward letter positions of this span
const NIXE_HEIGHT          = 5.0;
const NIXE_LETTER_GAP      = 0.18;
const Z_JITTER             = 0.4;

// Dots stay small + faint throughout — they're the "alive" backdrop, not the readable letters.
const DOT_SIZE             = 0.06;
const DOT_ALPHA            = 0.45;

const SPHERE_LINE_OPACITY  = 0.06;    // sphere wireframe lines
const NIXE_LINE_OPACITY    = 0.05;    // brief network scaffold during morph midpoint
const BLOCK_MAX_OPACITY    = 1.0;     // HTML block overlay's peak (its color carries the visual alpha)
const TILT_DAMP            = 0.04;

// Morph timing — explicit dwells at each extreme + slow lerp between them
const MORPH_PERIOD_SEC     = 24;
const SPHERE_DWELL_FRAC    = 0.13;    // 0.00 → 0.13   (~3.1s of cycle)
const MORPH_IN_FRAC        = 0.32;    // 0.13 → 0.45   (~7.7s morph in)
const NIXE_DWELL_FRAC      = 0.28;    // 0.45 → 0.73   (~6.7s hold at NIXE)
// 0.73 → 1.00   (~6.5s morph back)

// ─── Letter shapes — rectangles or diagonal bands in unit-square coords ──────
type Shape =
  | { kind: "rect"; x: number; y: number; w: number; h: number }
  | { kind: "band"; ax: number; ay: number; bx: number; by: number; thickness: number };

const T = 0.22;            // bar thickness in unit-square coords (the "weight" of each letter)
const DIAG_T = T * 1.2;    // diagonals slightly thicker so they read as bold

const LETTER_SHAPES: Record<"N" | "I" | "X" | "E", Shape[]> = {
  N: [
    { kind: "rect", x: 0,        y: 0, w: T, h: 1 },
    { kind: "band", ax: 0,       ay: 1, bx: 1, by: 0, thickness: DIAG_T },
    { kind: "rect", x: 1 - T,    y: 0, w: T, h: 1 },
  ],
  I: [
    { kind: "rect", x: 0.5 - T / 2, y: 0, w: T, h: 1 },
  ],
  X: [
    { kind: "band", ax: 0, ay: 0, bx: 1, by: 1, thickness: DIAG_T },
    { kind: "band", ax: 0, ay: 1, bx: 1, by: 0, thickness: DIAG_T },
  ],
  E: [
    { kind: "rect", x: 0,    y: 0,            w: T,         h: 1 },        // left vertical
    { kind: "rect", x: T,    y: 1 - T,        w: 1 - T,     h: T },        // top
    { kind: "rect", x: T,    y: 0.5 - T / 2,  w: 0.7 - T,   h: T },        // middle (shorter)
    { kind: "rect", x: T,    y: 0,            w: 1 - T,     h: T },        // bottom
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shapeArea(s: Shape): number {
  if (s.kind === "rect") return s.w * s.h;
  const dx = s.bx - s.ax, dy = s.by - s.ay;
  return Math.sqrt(dx * dx + dy * dy) * s.thickness;
}

/** Sample one point uniformly inside a shape, returning local [x, y] in unit-square coords. */
function sampleShape(s: Shape): [number, number] {
  if (s.kind === "rect") {
    return [s.x + Math.random() * s.w, s.y + Math.random() * s.h];
  }
  const t = Math.random();
  const u = Math.random() - 0.5;
  const dx = s.bx - s.ax, dy = s.by - s.ay;
  const L  = Math.sqrt(dx * dx + dy * dy);
  const px = -dy / L, py = dx / L;            // perpendicular unit vector
  return [
    s.ax + t * dx + u * s.thickness * px,
    s.ay + t * dy + u * s.thickness * py,
  ];
}

function buildSphereTargets(count: number): THREE.Vector3[] {
  const out: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = SPHERE_RADIUS * (0.55 + Math.random() * 0.45);
    out.push(new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi),
    ));
  }
  return out;
}

function buildNixeTargets(count: number): THREE.Vector3[] {
  const letters: Array<keyof typeof LETTER_SHAPES> = ["N", "I", "X", "E"];

  // Letter sizing — letters + gaps fit within NIXE_WIDTH
  const letterWidth = NIXE_WIDTH / (letters.length + (letters.length - 1) * NIXE_LETTER_GAP);
  const gap         = letterWidth * NIXE_LETTER_GAP;
  const totalSpan   = letters.length * letterWidth + (letters.length - 1) * gap;
  const startX      = -totalSpan / 2;

  // Compute total area across all letters (use local areas — uniform scaling means relative areas are fine)
  let totalArea = 0;
  const letterMeta: Array<{ letter: keyof typeof LETTER_SHAPES; xCenter: number; areaSum: number }> = [];
  for (let i = 0; i < letters.length; i++) {
    const xc = startX + letterWidth / 2 + i * (letterWidth + gap);
    let areaSum = 0;
    for (const s of LETTER_SHAPES[letters[i]]) areaSum += shapeArea(s);
    letterMeta.push({ letter: letters[i], xCenter: xc, areaSum });
    totalArea += areaSum;
  }

  // Allocate points per letter proportional to area, then per shape proportional within letter
  const targets: THREE.Vector3[] = [];
  for (const meta of letterMeta) {
    const nLetter = Math.round((meta.areaSum / totalArea) * count);
    for (const s of LETTER_SHAPES[meta.letter]) {
      const nShape = Math.max(2, Math.round((shapeArea(s) / meta.areaSum) * nLetter));
      for (let k = 0; k < nShape; k++) {
        const [lx, ly] = sampleShape(s);
        const x = meta.xCenter + (lx - 0.5) * letterWidth;
        const y = (ly - 0.5) * NIXE_HEIGHT;
        const z = (Math.random() - 0.5) * 2 * Z_JITTER;
        targets.push(new THREE.Vector3(x, y, z));
      }
    }
  }

  // Pad / trim to exactly `count`
  while (targets.length < count) {
    const src = targets[Math.floor(Math.random() * targets.length)];
    targets.push(src.clone().add(new THREE.Vector3(
      (Math.random() - 0.5) * 0.06,
      (Math.random() - 0.5) * 0.06,
      (Math.random() - 0.5) * 0.06,
    )));
  }
  if (targets.length > count) targets.length = count;

  return targets;
}

function computePairs(targets: THREE.Vector3[], threshold: number): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  const t2 = threshold * threshold;
  for (let i = 0; i < targets.length; i++) {
    for (let j = i + 1; j < targets.length; j++) {
      const dx = targets[i].x - targets[j].x;
      const dy = targets[i].y - targets[j].y;
      const dz = targets[i].z - targets[j].z;
      if (dx * dx + dy * dy + dz * dz < t2) pairs.push([i, j]);
    }
  }
  return pairs;
}

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Cycle phase 0..1 → morphT 0..1..0 with explicit dwell at each extreme. */
function cyclePhase(p: number): number {
  const a = SPHERE_DWELL_FRAC;
  const b = a + MORPH_IN_FRAC;
  const c = b + NIXE_DWELL_FRAC;
  if (p < a) return 0;
  if (p < b) return smoothstep((p - a) / MORPH_IN_FRAC);
  if (p < c) return 1;
  return smoothstep(1 - (p - c) / (1 - c));
}

// ─── Component ────────────────────────────────────────────────────────────────
export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // Two target states (built once)
    const sphereTargets = buildSphereTargets(POINT_COUNT);
    const nixeTargets   = buildNixeTargets(POINT_COUNT);

    // Pre-compute line topology for each state
    const spherePairs = computePairs(sphereTargets, SPHERE_THRESHOLD);
    const nixePairs   = computePairs(nixeTargets,   NIXE_THRESHOLD);

    // Live point buffer
    const ptArr = new Float32Array(POINT_COUNT * 3);
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.BufferAttribute(ptArr, 3));
    const ptMat = new THREE.PointsMaterial({
      size: DOT_SIZE,
      color: 0x0A0A0A,
      transparent: true,
      opacity: DOT_ALPHA,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const ptsMesh = new THREE.Points(ptGeo, ptMat);

    // Sphere line mesh
    const sphereLineArr = new Float32Array(spherePairs.length * 6);
    const sphereLineGeo = new THREE.BufferGeometry();
    sphereLineGeo.setAttribute("position", new THREE.BufferAttribute(sphereLineArr, 3));
    const sphereLineMat = new THREE.LineBasicMaterial({
      color: 0x0A0A0A, transparent: true, opacity: SPHERE_LINE_OPACITY,
    });
    const sphereLines = new THREE.LineSegments(sphereLineGeo, sphereLineMat);

    // NIXE line mesh
    const nixeLineArr = new Float32Array(nixePairs.length * 6);
    const nixeLineGeo = new THREE.BufferGeometry();
    nixeLineGeo.setAttribute("position", new THREE.BufferAttribute(nixeLineArr, 3));
    const nixeLineMat = new THREE.LineBasicMaterial({
      color: 0x0A0A0A, transparent: true, opacity: 0,
    });
    const nixeLines = new THREE.LineSegments(nixeLineGeo, nixeLineMat);

    const group = new THREE.Group();
    group.add(ptsMesh, sphereLines, nixeLines);
    scene.add(group);

    // Mouse-driven tilt only (no continuous rotation per user choice)
    let targetTiltX = 0, targetTiltY = 0;
    const onMove = (e: MouseEvent) => {
      targetTiltX = (e.clientY / window.innerHeight - 0.5) * 0.18;
      targetTiltY = (e.clientX / window.innerWidth  - 0.5) * 0.28;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const startTime = performance.now();
    let rafId = 0;

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      const elapsed = (performance.now() - startTime) / 1000;
      const p = (elapsed % MORPH_PERIOD_SEC) / MORPH_PERIOD_SEC;
      const morphT = cyclePhase(p);

      // Lerp every point: sphere → NIXE
      for (let i = 0; i < POINT_COUNT; i++) {
        const sx = sphereTargets[i].x, sy = sphereTargets[i].y, sz = sphereTargets[i].z;
        const nx = nixeTargets[i].x,   ny = nixeTargets[i].y,   nz = nixeTargets[i].z;
        ptArr[i * 3]     = sx + (nx - sx) * morphT;
        ptArr[i * 3 + 1] = sy + (ny - sy) * morphT;
        ptArr[i * 3 + 2] = sz + (nz - sz) * morphT;
      }
      ptGeo.attributes.position.needsUpdate = true;

      // Sphere lines follow current point positions; cross-fade alpha
      for (let k = 0; k < spherePairs.length; k++) {
        const [a, b] = spherePairs[k];
        const o = k * 6;
        sphereLineArr[o]     = ptArr[a * 3];
        sphereLineArr[o + 1] = ptArr[a * 3 + 1];
        sphereLineArr[o + 2] = ptArr[a * 3 + 2];
        sphereLineArr[o + 3] = ptArr[b * 3];
        sphereLineArr[o + 4] = ptArr[b * 3 + 1];
        sphereLineArr[o + 5] = ptArr[b * 3 + 2];
      }
      sphereLineGeo.attributes.position.needsUpdate = true;

      // NIXE scaffold lines follow current point positions
      for (let k = 0; k < nixePairs.length; k++) {
        const [a, b] = nixePairs[k];
        const o = k * 6;
        nixeLineArr[o]     = ptArr[a * 3];
        nixeLineArr[o + 1] = ptArr[a * 3 + 1];
        nixeLineArr[o + 2] = ptArr[a * 3 + 2];
        nixeLineArr[o + 3] = ptArr[b * 3];
        nixeLineArr[o + 4] = ptArr[b * 3 + 1];
        nixeLineArr[o + 5] = ptArr[b * 3 + 2];
      }
      nixeLineGeo.attributes.position.needsUpdate = true;

      // ── Choreography ──
      // Dots stay small + faint. They travel from sphere → letter positions,
      // dimming as they approach NIXE so the HTML block can take over readability.
      const dotsAlpha = Math.max(0, 1 - morphT / 0.85);
      ptMat.opacity         = DOT_ALPHA * dotsAlpha;
      sphereLineMat.opacity = SPHERE_LINE_OPACITY * dotsAlpha;
      // NIXE scaffold lines: brief network "skeleton" peaking at morph midpoint
      nixeLineMat.opacity   = Math.sin(morphT * Math.PI) * NIXE_LINE_OPACITY;
      // Solid HTML block: starts at morphT=0.35, fully visible by morphT=0.9
      const blockT     = Math.max(0, Math.min(1, (morphT - 0.35) / 0.55));
      const blockAlpha = blockT * blockT * (3 - 2 * blockT);
      if (blockRef.current) {
        blockRef.current.style.opacity = String(blockAlpha * BLOCK_MAX_OPACITY);
      }

      // Damped tilt — never fully rotates, letters stay legible
      group.rotation.y += (targetTiltY - group.rotation.y) * TILT_DAMP;
      group.rotation.x += (targetTiltX - group.rotation.x) * TILT_DAMP;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      ptGeo.dispose(); ptMat.dispose();
      sphereLineGeo.dispose(); sphereLineMat.dispose();
      nixeLineGeo.dispose(); nixeLineMat.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div ref={mountRef} className="absolute inset-0" />
      <div
        ref={blockRef}
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ opacity: 0 }}
      >
        <span
          style={{
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize: "clamp(8rem, 32vw, 30rem)",
            fontWeight: 800,
            letterSpacing: "-0.05em",
            color: "rgba(10,10,10,0.13)",
            lineHeight: 0.85,
            whiteSpace: "nowrap",
          }}
        >
          NIXE
        </span>
      </div>
    </>
  );
}
