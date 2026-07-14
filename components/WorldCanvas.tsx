"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { markCanvasReady } from "@/lib/reveal";

// ─── Tunables ─────────────────────────────────────────────────────────────────
const TETRA_SIZE           = 0.30;

// Globe: particles arranged on the surface of a sphere, biased toward continents
const SPHERE_RADIUS        = 55;
const OCEAN_KEEP_PROB      = 0.04;   // % of ocean hits accepted (rest become land particles)
const LAND_MASK_W          = 720;
const LAND_MASK_H          = 360;
const INITIAL_ROT_Y        = Math.PI * 0.55;

// Surface settling
const SURFACE_DRIFT_AMP    = 0.45;
const SURFACE_DRIFT_SPEED  = 0.22;

const SUBTLE_PULSE_SPEED   = 0.5;

// Magnetic repel from cursor (flips to a gentle attract over [data-cursor-hover])
const REPEL_RADIUS         = 25;
const REPEL_FORCE          = 700;
const ATTRACT_MULT         = -0.32;  // force multiplier when fully in attract mode
const SPRING_K             = 9;
const DAMPING              = 5;

// Particle color — black with subtle grayscale variation
const LIT_BASE             = 0.07;
const LIT_VAR              = 0.09;
const TETRA_OPACITY        = 0.62;

// Network layer
const HUB_NEIGHBORS        = 3;
const PULSE_SPEED          = 1.4;
const EDGE_PHASE_DELTA     = Math.PI / 3.5;
const LINE_OPACITY         = 0.6;
const LINE_DARK_VAL        = 0.18;   // grey value when a line is fully "on" (lower = darker)
const LINE_PULSE_FLOOR     = 0.5;

const HUB_MAX_EDGE_DIST    = 22;

// Travelling data pulses
const PULSE_DOT_COUNT      = 160;
const PULSE_DOT_SIZE       = 2.6;
const PULSE_DOT_OPACITY    = 0.55;

// Blueprint grid backdrop (hero chapter only)
const GRID_Z               = -42;
const GRID_HALF            = 96;
const GRID_LINES           = 13;
const GRID_SEG             = 6;
const GRID_DARK_VAL        = 0.82;
const GRID_OPACITY         = 0.5;

const CAMERA_FOV           = 60;

// ── Corridor: each chapter's formation lives at its own depth station and the
// camera flies between them, so scrolling reads as travel through one world.
const STATION_SPACING      = 240;    // world units between chapter stations
const MORPH_STAGGER        = 0.3;    // per-particle morph offset (0..1 of the window)
const FLIGHT_BILLOW        = 12;     // sideways swell mid-flight
const NEAR_FADE_START      = 34;     // particles closer than this to the lens shrink…
const NEAR_FADE_END        = 7;      // …and are gone by this distance

// Dust: motionless motes filling the corridor between stations. They are the
// depth reference — when the camera travels, dust streaming past IS the speed.
const DUST_COUNT_DESKTOP   = 1100;
const DUST_COUNT_MOBILE    = 420;
const DUST_SIZE            = 1.15;
const DUST_R_MIN           = 26;     // hollow corridor — dust never crosses the lens axis
const DUST_R_MAX           = 130;

// Mouse camera parallax (desktop, fine pointers only)
const PARALLAX_X           = 4.5;
const PARALLAX_Y           = 3.0;
const PARALLAX_SMOOTH      = 3.0;

// Scroll energy: ripple through the formation + a slight FOV kick
const SCROLL_RIPPLE_AMP    = 4.2;
const SCROLL_RIPPLE_MAXV   = 2600;
const SCROLL_DECAY         = 3.2;
const FOV_KICK             = 3.5;

// Content clearings: particles part around [data-world-clear] elements so the
// world weaves through the UI instead of sitting behind it.
const CLEAR_FORCE          = 680;    // outward push inside a clearing
const CLEAR_SOFT           = 8;      // world units over which the push ramps up
const CLEAR_MARGIN         = 5;      // world-unit halo so particles rim the content
const CLEAR_MAX_ACTIVE     = 4;      // clearings considered per frame

// Auto-rotation
const AUTO_ROTATE_SPEED    = 0.05;

// ─── Scroll chapters ──────────────────────────────────────────────────────────
// One formation per homepage section; the camera flies station to station.
const SECTION_IDS = ["hero", "work", "services", "shipped", "about", "contact"] as const;

type ChapterParams = {
  camDist: number;  // viewing distance from the chapter's station
  camX: number;     // composition shift (scene appears opposite the camera offset)
  lineV: number;    // network line intensity 0..1
  gridV: number;    // blueprint grid intensity 0..1
  opacity: number;  // particle opacity multiplier 0..1
  pulseAmp: number; // per-particle scale breathing
  rotW: number;     // rotation-angle weight — screen-designed poses (bands,
                    // horizon) use 0 so accumulated spin never scrambles them
  clearW: number;   // content-clearing force weight — the about/contact poses
                    // are content-safe by construction, so the push stands
                    // down instead of evacuating them (the old streak bug)
};

const CHAPTERS: ChapterParams[] = [
  { camDist: 130, camX:   0, lineV: 1.0,  gridV: 1, opacity: 1.0,  pulseAmp: 0.07, rotW: 1, clearW: 1 },   // hero — globe
  { camDist: 175, camX:   0, lineV: 0.18, gridV: 0, opacity: 0.5,  pulseAmp: 0.07, rotW: 1, clearW: 1 },   // work — open shell
  { camDist: 150, camX:   0, lineV: 0.12, gridV: 0, opacity: 0.55, pulseAmp: 0.06, rotW: 1, clearW: 1 },   // services — orbit disc
  { camDist: 135, camX:  25, lineV: 0.4,  gridV: 0, opacity: 0.5,  pulseAmp: 0.08, rotW: 1, clearW: 1 },   // shipped — gyroscope rings
  { camDist: 165, camX:   0, lineV: 0.55, gridV: 0, opacity: 0.75, pulseAmp: 0.08, rotW: 0, clearW: 0.4 }, // about — constellation bands
  { camDist: 125, camX: -20, lineV: 0.0,  gridV: 0, opacity: 0.7,  pulseAmp: 0.14, rotW: 0, clearW: 0 },   // contact — horizon field
];

// Network lines fade out beyond this length so cross-cluster edges can never
// streak across content (formation-native edges are ≤ ~22 units).
const LINE_LEN_FADE_START = 35;
const LINE_LEN_FADE_END   = 70;

// ─── Continent polygons (rough lon/lat outlines) ─────────────────────────────
type LatLon = readonly [number, number];

const CONTINENTS: ReadonlyArray<ReadonlyArray<LatLon>> = [
  // North America
  [
    [-165, 60], [-160, 68], [-145, 70], [-130, 72], [-115, 75], [-95, 80],
    [-78, 78], [-65, 72], [-55, 60], [-58, 50], [-65, 45], [-70, 41],
    [-77, 35], [-82, 30], [-90, 28], [-92, 22], [-97, 18], [-103, 22],
    [-108, 25], [-115, 30], [-122, 36], [-125, 45], [-130, 55], [-140, 60],
    [-155, 58],
  ],
  // South America
  [
    [-80, 12], [-72, 11], [-60, 8], [-50, 0], [-43, -5], [-38, -10],
    [-35, -20], [-42, -25], [-52, -33], [-58, -38], [-66, -48], [-72, -54],
    [-75, -50], [-77, -38], [-79, -25], [-80, -10], [-81, 0],
  ],
  // Africa
  [
    [-17, 28], [-10, 33], [0, 36], [10, 37], [22, 33], [32, 32],
    [38, 18], [44, 12], [50, 11], [51, 4], [47, -2], [42, -10],
    [40, -20], [33, -30], [25, -35], [18, -34], [13, -28], [10, -15],
    [8, -5], [0, 4], [-8, 5], [-13, 12], [-17, 18],
  ],
  // Eurasia
  [
    [-9, 36], [-5, 43], [0, 48], [3, 52], [8, 58], [15, 68], [25, 71],
    [40, 73], [60, 75], [85, 76], [115, 76], [140, 70], [155, 68],
    [165, 65], [160, 58], [150, 52], [140, 47], [135, 40], [130, 32],
    [122, 28], [115, 20], [108, 14], [100, 10], [98, 16], [90, 22],
    [82, 25], [72, 22], [65, 26], [58, 26], [52, 25], [46, 30], [40, 32],
    [32, 32], [25, 36], [18, 40], [10, 41], [3, 39], [-6, 36],
  ],
  // India
  [
    [68, 24], [72, 22], [75, 18], [78, 12], [82, 9], [86, 12], [89, 18],
    [88, 23], [85, 26], [78, 25], [72, 26],
  ],
  // Australia
  [
    [113, -22], [118, -18], [125, -14], [132, -12], [138, -14], [145, -18],
    [152, -28], [148, -36], [140, -39], [128, -38], [118, -34], [114, -28],
  ],
  // Antarctica
  [
    [-180, -60], [-120, -68], [-60, -65], [0, -70], [60, -68], [120, -67],
    [180, -65], [180, -90], [-180, -90],
  ],
  // Greenland
  [
    [-50, 60], [-42, 70], [-30, 80], [-22, 82], [-15, 78], [-18, 70],
    [-30, 62], [-45, 60],
  ],
  // Madagascar
  [
    [43, -12], [48, -17], [50, -22], [49, -25], [46, -24], [43, -18],
  ],
  // Indonesia
  [
    [95, 5], [105, 5], [115, 0], [125, -5], [135, -8], [140, -4],
    [140, 2], [130, 4], [115, 6], [100, 8],
  ],
  // British Isles
  [
    [-10, 50], [-5, 52], [-2, 55], [-3, 58], [-6, 57], [-10, 54],
  ],
  // Japan
  [
    [130, 32], [134, 34], [138, 36], [142, 40], [144, 44], [141, 45],
    [137, 41], [133, 36],
  ],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
type Edge = readonly [number, number];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Soft radial sprite (dark centre → transparent edge) — for the pulses. */
function makeSoftDotTexture(): THREE.Texture {
  const S = 64;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, "rgba(10,10,10,1)");
  g.addColorStop(0.35, "rgba(10,10,10,0.55)");
  g.addColorStop(1, "rgba(10,10,10,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Radial sprite for MULTIPLY blending (grey centre → white edge). White
 * multiplies to a no-op, so a fog-whitened mote is invisible instead of
 * painting a pale blob over darker particles behind it.
 */
function makeMultiplyDotTexture(centre: number): THREE.Texture {
  const S = 64;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, `rgb(${centre},${centre},${centre})`);
  g.addColorStop(0.5, `rgb(${Math.round(255 - (255 - centre) * 0.35)},${Math.round(255 - (255 - centre) * 0.35)},${Math.round(255 - (255 - centre) * 0.35)})`);
  g.addColorStop(1, "rgb(255,255,255)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function buildLandMask(): Uint8ClampedArray {
  const canvas = document.createElement("canvas");
  canvas.width = LAND_MASK_W;
  canvas.height = LAND_MASK_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new Uint8ClampedArray(LAND_MASK_W * LAND_MASK_H * 4).fill(255);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, LAND_MASK_W, LAND_MASK_H);
  ctx.fillStyle = "#000000";
  for (const continent of CONTINENTS) {
    ctx.beginPath();
    for (let i = 0; i < continent.length; i++) {
      const [lon, lat] = continent[i];
      const x = ((lon + 180) / 360) * LAND_MASK_W;
      const y = ((90 - lat) / 180) * LAND_MASK_H;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }
  return ctx.getImageData(0, 0, LAND_MASK_W, LAND_MASK_H).data;
}

function sampleSpherePoint(
  mask: Uint8ClampedArray,
  R: number,
  out: { x: number; y: number; z: number },
): void {
  for (let attempt = 0; attempt < 200; attempt++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const theta = 2 * Math.PI * u1;
    const phi = Math.acos(1 - 2 * u2);

    const cx = Math.min(LAND_MASK_W - 1, Math.floor((theta / (2 * Math.PI)) * LAND_MASK_W));
    const cy = Math.min(LAND_MASK_H - 1, Math.floor((phi / Math.PI) * LAND_MASK_H));
    const idx = (cy * LAND_MASK_W + cx) * 4;
    const isLand = mask[idx] < 128;

    if (isLand || Math.random() < OCEAN_KEEP_PROB) {
      out.x = R * Math.sin(phi) * Math.cos(theta);
      out.y = R * Math.cos(phi);
      out.z = R * Math.sin(phi) * Math.sin(theta);
      return;
    }
  }
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos(2 * Math.random() - 1);
  out.x = R * Math.sin(phi) * Math.cos(theta);
  out.y = R * Math.cos(phi);
  out.z = R * Math.sin(phi) * Math.sin(theta);
}

// ─── Formation generators ─────────────────────────────────────────────────────
// All are LOCAL to their station (centered near the origin); the per-chapter
// station offset is applied at simulation time. Rotating poses tolerate the
// slow Y auto-rotation; the about/contact poses are Y-rotation-invariant bands.

/** 0 · hero — the particle globe (continent-biased). */
function makeGlobe(n: number): Float32Array {
  const mask = buildLandMask();
  const out = new Float32Array(n * 3);
  const p = { x: 0, y: 0, z: 0 };
  for (let i = 0; i < n; i++) {
    sampleSpherePoint(mask, SPHERE_RADIUS, p);
    out[i * 3] = p.x;
    out[i * 3 + 1] = p.y;
    out[i * 3 + 2] = p.z;
  }
  return out;
}

/** 1 · work — the globe exhales into a vast sparse shell; space opens up. */
function makeShell(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 95 + Math.random() * 45;
    out[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    out[i * 3 + 1] = r * Math.cos(phi) * 0.72; // squash vertically — widescreen space
    out[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return out;
}

/** 2 · services — a slow orbital disc (echo of igloo's top-down spiral). */
function makeDisc(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const R1 = 42, R2 = 112;
  for (let i = 0; i < n; i++) {
    const u = Math.pow(Math.random(), 1.25); // bias density inward
    const r = Math.sqrt(R1 * R1 + (R2 * R2 - R1 * R1) * u);
    const theta = Math.random() * 2 * Math.PI;
    // gentle warp so the disc reads as a surface, not a flat sheet
    const y = -22 + Math.sin(theta * 2 + r * 0.05) * 3 + (Math.random() - 0.5) * 5;
    out[i * 3] = r * Math.cos(theta);
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = r * Math.sin(theta);
  }
  return out;
}

/** 3 · shipped — three tilted gyroscope rings. */
function makeRings(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const RADII = [48, 62, 78];
  // [rotX, rotZ] per ring — mutually tilted
  const TILTS: ReadonlyArray<readonly [number, number]> = [
    [1.1, 0],
    [-0.35, 0.7],
    [0.5, -0.9],
  ];
  for (let i = 0; i < n; i++) {
    const ring = i % 3;
    const R = RADII[ring];
    const theta = Math.random() * 2 * Math.PI;
    // point on ring + tube noise
    let x = R * Math.cos(theta) + (Math.random() - 0.5) * 5;
    let y = (Math.random() - 0.5) * 5;
    let z = R * Math.sin(theta) + (Math.random() - 0.5) * 5;
    const [ax, az] = TILTS[ring];
    // rotate about X
    const y1 = y * Math.cos(ax) - z * Math.sin(ax);
    const z1 = y * Math.sin(ax) + z * Math.cos(ax);
    y = y1; z = z1;
    // rotate about Z
    const x2 = x * Math.cos(az) - y * Math.sin(az);
    const y2 = x * Math.sin(az) + y * Math.cos(az);
    x = x2; y = y2;
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

/**
 * 4 · about — constellation bands. Clusters strung along a wide upper and
 * lower band, leaving the middle of the frame (where the text lives) open.
 * Clusters are assigned by globe longitude/latitude buckets so the hub-edge
 * network (built on globe adjacency) stays short and legible here.
 */
function makeConstellation(n: number, globe: Float32Array): Float32Array {
  const out = new Float32Array(n * 3);
  const CLUSTERS = 10;
  const centers: number[][] = [];
  for (let c = 0; c < CLUSTERS; c++) {
    const isTop = c % 2 === 1; // matches the gy>0 assignment below
    const u = Math.floor(c / 2) / 4; // 0..1 across the band
    centers.push([
      -150 + u * 300 + Math.sin(c * 3.7) * 16,
      isTop ? 58 + Math.sin(c * 2.1) * 12 : -66 + Math.cos(c * 1.7) * 10,
      Math.sin(c * 5.3) * 16, // shallow depth so every cluster stays crisp
    ]);
  }
  for (let i = 0; i < n; i++) {
    const gx = globe[i * 3], gy = globe[i * 3 + 1], gz = globe[i * 3 + 2];
    const lonBucket = Math.min(4, Math.floor(((Math.atan2(gz, gx) + Math.PI) / (2 * Math.PI)) * 5));
    const cluster = lonBucket * 2 + (gy > 0 ? 1 : 0);
    const [cx, cy, cz] = centers[cluster];
    out[i * 3] = cx + (Math.random() - 0.5) * 34;
    out[i * 3 + 1] = cy + (Math.random() - 0.5) * 20;
    out[i * 3 + 2] = cz + (Math.random() - 0.5) * 34;
  }
  return out;
}

/**
 * 5 · contact — a calm horizon field: an undulating plain of particles low
 * across the frame with a soft mound at the centre, breathing under the form.
 * Y-rotation-invariant by construction, so the (nearly frozen) spin is safe.
 */
function makeHorizon(n: number): Float32Array {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    // Density biased toward the frame edges so the plain reads as landscape
    // while the middle (under the form) stays quiet.
    const x = Math.sign(Math.random() - 0.5) * 150 * Math.pow(Math.random(), 0.55);
    const z = (Math.random() * 2 - 1) * 60;
    const swell =
      Math.sin(x * 0.045) * 2.6 +
      Math.cos(z * 0.06 + x * 0.01) * 2.2 +
      (Math.random() - 0.5) * 2.4;
    const mound = Math.exp(-(x * x + z * z) / (2 * 30 * 30)) * 9;
    out[i * 3] = x;
    out[i * 3 + 1] = -44 + swell + mound + (z > 0 ? -z * 0.06 : -z * 0.03);
    out[i * 3 + 2] = z;
  }
  return out;
}

function pickHubIndices(total: number, count: number): number[] {
  const set = new Set<number>();
  while (set.size < count) {
    set.add(Math.floor(Math.random() * total));
  }
  return Array.from(set);
}

function computeHubEdges(
  hubs: number[],
  homes: Float32Array,
  k: number,
  maxDist: number,
): Edge[] {
  const edges: Edge[] = [];
  const seen = new Set<string>();
  const maxD2 = maxDist * maxDist;
  const candIdx: number[] = new Array(hubs.length);
  const candDist: number[] = new Array(hubs.length);

  for (let i = 0; i < hubs.length; i++) {
    const a = hubs[i];
    let n = 0;
    for (let j = 0; j < hubs.length; j++) {
      if (j === i) continue;
      const b = hubs[j];
      const dx = homes[a * 3] - homes[b * 3];
      const dy = homes[a * 3 + 1] - homes[b * 3 + 1];
      const dz = homes[a * 3 + 2] - homes[b * 3 + 2];
      candIdx[n] = b;
      candDist[n] = dx * dx + dy * dy + dz * dz;
      n++;
    }
    for (let s = 0; s < Math.min(k, n); s++) {
      let minIdx = s;
      for (let t = s + 1; t < n; t++) {
        if (candDist[t] < candDist[minIdx]) minIdx = t;
      }
      [candDist[s], candDist[minIdx]] = [candDist[minIdx], candDist[s]];
      [candIdx[s], candIdx[minIdx]] = [candIdx[minIdx], candIdx[s]];
      if (candDist[s] > maxD2) continue;
      const b = candIdx[s];
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([a, b]);
      }
    }
  }
  return edges;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function WorldCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const finePointer =
      window.matchMedia?.("(pointer: fine)").matches ?? false;
    const isMobile = window.innerWidth < 768;

    const POINT_COUNT = isMobile ? 5200 : 12000;
    const HUB_COUNT = isMobile ? 220 : 400;
    const DUST_COUNT = isMobile ? DUST_COUNT_MOBILE : DUST_COUNT_DESKTOP;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xfafaf7, 110, 220);

    const camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      el.clientWidth / el.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = CHAPTERS[0].camDist;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const softDot = makeSoftDotTexture();

    // ── Stations: chapter i's formation is parked at z = -i * SPACING ──
    const stationZ = (i: number) => -i * STATION_SPACING;

    // ── Formations (local space) ──
    const globe = makeGlobe(POINT_COUNT);
    const forms: Float32Array[] = [
      globe,
      makeShell(POINT_COUNT),
      makeDisc(POINT_COUNT),
      makeRings(POINT_COUNT),
      makeConstellation(POINT_COUNT, globe),
      makeHorizon(POINT_COUNT),
    ];

    // ── Swarm ──
    const tetraGeo = new THREE.TetrahedronGeometry(TETRA_SIZE);
    const tetraMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: TETRA_OPACITY,
      fog: true,
    });
    const mesh = new THREE.InstancedMesh(tetraGeo, tetraMat, POINT_COUNT);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(POINT_COUNT * 3), 3);
    scene.add(mesh);

    // Physics state lives in WORLD space (station offsets + rotation applied
    // to the spring targets, so the swarm chases its rotating, travelling home).
    const posX   = new Float32Array(POINT_COUNT);
    const posY   = new Float32Array(POINT_COUNT);
    const posZ   = new Float32Array(POINT_COUNT);
    const velX   = new Float32Array(POINT_COUNT);
    const velY   = new Float32Array(POINT_COUNT);
    const velZ   = new Float32Array(POINT_COUNT);
    const phaseX = new Float32Array(POINT_COUNT);
    const phaseY = new Float32Array(POINT_COUNT);
    const phaseZ = new Float32Array(POINT_COUNT);
    const colorJitter = new Float32Array(POINT_COUNT);
    const radialDist  = new Float32Array(POINT_COUNT); // ripple phase (globe pose)

    const cosR0 = Math.cos(INITIAL_ROT_Y);
    const sinR0 = Math.sin(INITIAL_ROT_Y);

    for (let i = 0; i < POINT_COUNT; i++) {
      const gx = globe[i * 3], gy = globe[i * 3 + 1], gz = globe[i * 3 + 2];
      phaseX[i] = Math.random() * Math.PI * 2;
      phaseY[i] = Math.random() * Math.PI * 2;
      phaseZ[i] = Math.random() * Math.PI * 2;
      colorJitter[i] = Math.random();
      radialDist[i] = Math.hypot(gx * cosR0 + gz * sinR0, gy);
      posX[i] = gx * cosR0 + gz * sinR0;
      posY[i] = gy;
      posZ[i] = -gx * sinR0 + gz * cosR0;
    }

    // Per-particle color
    const tmpColor = new THREE.Color();
    for (let i = 0; i < POINT_COUNT; i++) {
      const lit = LIT_BASE + (colorJitter[i] - 0.5) * LIT_VAR;
      tmpColor.setHSL(0, 0, Math.min(1, Math.max(0, lit)));
      mesh.setColorAt(i, tmpColor);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // ── Hub network (adjacency from the globe pose; follows every formation) ──
    const hubIndices = pickHubIndices(POINT_COUNT, HUB_COUNT);
    const edges = computeHubEdges(hubIndices, globe, HUB_NEIGHBORS, HUB_MAX_EDGE_DIST);

    const edgePhase = new Float32Array(edges.length);
    const edgeFade  = new Float32Array(edges.length); // 1 = full, 0 = too long
    for (let i = 0; i < edges.length; i++) {
      edgePhase[i] = Math.random() * Math.PI * 2;
      edgeFade[i] = 1;
    }

    const linePositions = new Float32Array(edges.length * 6);
    const lineColors    = new Float32Array(edges.length * 6);
    const lineGeo       = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: LINE_OPACITY,
      fog: true,
    });
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    lineMesh.frustumCulled = false;
    scene.add(lineMesh);

    // ── Travelling data pulses ──
    const pulseEdge  = new Int32Array(PULSE_DOT_COUNT);
    const pulseSpeed = new Float32Array(PULSE_DOT_COUNT);
    const pulsePhase = new Float32Array(PULSE_DOT_COUNT);
    const pulsePos   = new Float32Array(PULSE_DOT_COUNT * 3);
    for (let i = 0; i < PULSE_DOT_COUNT; i++) {
      pulseEdge[i] = edges.length ? Math.floor(Math.random() * edges.length) : 0;
      pulseSpeed[i] = 0.25 + Math.random() * 0.5;
      pulsePhase[i] = Math.random();
    }
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePos, 3));
    const pulseMat = new THREE.PointsMaterial({
      size: PULSE_DOT_SIZE,
      map: softDot,
      color: 0x0a0a0a,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      sizeAttenuation: true,
      // fog would whiten far dots and make them paint pale blobs over the
      // darker particles behind them — keep them ink at every depth instead.
      fog: false,
    });
    const pulsePoints = new THREE.Points(pulseGeo, pulseMat);
    pulsePoints.frustumCulled = false;
    if (edges.length) scene.add(pulsePoints);

    // ── Corridor dust: the depth reference the camera flies through ──
    const dustPos = new Float32Array(DUST_COUNT * 3);
    const corridorEnd = stationZ(CHAPTERS.length - 1) - 140;
    for (let i = 0; i < DUST_COUNT; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = DUST_R_MIN + Math.pow(Math.random(), 0.7) * (DUST_R_MAX - DUST_R_MIN);
      dustPos[i * 3]     = Math.cos(ang) * r * 1.35; // wider than tall — widescreen
      dustPos[i * 3 + 1] = Math.sin(ang) * r * 0.8;
      dustPos[i * 3 + 2] = 140 + Math.random() * (corridorEnd - 140);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustDot = makeMultiplyDotTexture(178); // ~30% darkening at the core
    const dustMat = new THREE.PointsMaterial({
      size: DUST_SIZE,
      map: dustDot,
      color: 0xffffff,
      transparent: true,
      blending: THREE.MultiplyBlending, // fog → white → multiplies to no-op
      premultipliedAlpha: true,         // required by MultiplyBlending
      depthWrite: false,
      sizeAttenuation: true,
      fog: true,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    dust.frustumCulled = false;
    scene.add(dust);

    // ── Blueprint grid backdrop (hero chapter only) ──
    const gridPts: number[] = [];
    const addSeg = (x1: number, y1: number, x2: number, y2: number) => {
      gridPts.push(x1, y1, GRID_Z, x2, y2, GRID_Z);
    };
    const step = (GRID_HALF * 2) / (GRID_LINES - 1);
    for (let i = 0; i < GRID_LINES; i++) {
      const c = -GRID_HALF + i * step;
      for (let y = -GRID_HALF; y < GRID_HALF; y += GRID_SEG) {
        addSeg(c, y, c, Math.min(y + GRID_SEG, GRID_HALF));
      }
      for (let x = -GRID_HALF; x < GRID_HALF; x += GRID_SEG) {
        addSeg(x, c, Math.min(x + GRID_SEG, GRID_HALF), c);
      }
    }
    const gridVertCount = gridPts.length / 3;
    const gridPositions = new Float32Array(gridPts);
    const gridColors = new Float32Array(gridVertCount * 3);
    const gridDist = new Float32Array(gridVertCount);
    for (let v = 0; v < gridVertCount; v++) {
      gridDist[v] = Math.hypot(gridPositions[v * 3], gridPositions[v * 3 + 1]);
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute("position", new THREE.BufferAttribute(gridPositions, 3));
    gridGeo.setAttribute("color", new THREE.BufferAttribute(gridColors, 3));
    const gridMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: GRID_OPACITY,
      fog: true,
    });
    const gridMesh = new THREE.LineSegments(gridGeo, gridMat);
    scene.add(gridMesh);

    // ── Scroll chapters ──
    // Each formation is anchored to the scroll position where its section is
    // centered in the viewport; the camera's flight between stations plays in
    // the middle of the travel between anchors (hold 30% → fly 40% → hold 30%).
    // Positions come from the offsetParent chain (layout space) because
    // SectionMorph scrubs transforms that getBoundingClientRect would include.
    const docPos = (node: HTMLElement) => {
      let t = 0, l = 0;
      let n: HTMLElement | null = node;
      while (n) {
        t += n.offsetTop;
        l += n.offsetLeft;
        n = n.offsetParent as HTMLElement | null;
      }
      return { t, l };
    };

    let anchors: number[] = [0];
    let clearRects: Array<{ l: number; r: number; t: number; b: number }> = [];
    const measure = () => {
      const vh = window.innerHeight;
      const next: number[] = [];
      for (const id of SECTION_IDS) {
        const sec = document.getElementById(id);
        if (!sec) continue;
        const { t } = docPos(sec);
        next.push(Math.max(0, t + sec.offsetHeight * 0.5 - vh * 0.5));
      }
      if (next.length) anchors = next;

      const rects: Array<{ l: number; r: number; t: number; b: number }> = [];
      document.querySelectorAll<HTMLElement>("[data-world-clear]").forEach((node) => {
        const { t, l } = docPos(node);
        rects.push({ l, r: l + node.offsetWidth, t, b: t + node.offsetHeight });
      });
      clearRects = rects;
    };
    measure();
    const remeasureT = window.setTimeout(measure, 1000);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    /** Continuous chapter coordinate: 0..CHAPTERS-1 with hold plateaus. */
    const chapterCoord = (y: number): number => {
      const n = Math.min(anchors.length, CHAPTERS.length);
      if (n <= 1) return 0;
      if (y <= anchors[0]) return 0;
      for (let k = 0; k < n - 1; k++) {
        if (y < anchors[k + 1]) {
          const span = Math.max(1, anchors[k + 1] - anchors[k]);
          const u = (y - anchors[k]) / span;
          return k + clamp01((u - 0.3) / 0.4);
        }
      }
      return n - 1;
    };

    let sSm = 0; // smoothed chapter coordinate

    // ── Cursor projection + camera parallax ──
    // Store NDC; the world-space point is derived per frame so it stays
    // consistent with the camera as it flies between stations.
    let cursorNdcX = 0;
    let cursorNdcY = 0;
    let cursorActive = false;
    let halfH = 1, halfW = 1;
    let camDistCur = CHAPTERS[0].camDist;
    let parX = 0, parY = 0; // smoothed parallax offsets

    const updateScreenToWorld = () => {
      halfH = Math.tan((CAMERA_FOV * Math.PI) / 180 / 2) * camDistCur;
      halfW = halfH * camera.aspect;
    };
    updateScreenToWorld();

    const updateCursorFromEvent = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      cursorNdcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      cursorNdcY = -(((clientY - rect.top) / rect.height) * 2 - 1);
    };

    // CTA magnetism: over [data-cursor-hover] targets the repel flips to a
    // gentle attract, so the world leans toward what the visitor considers.
    let attractTarget = 0;
    let attractSm = 0;
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      attractTarget = t && t.closest?.("[data-cursor-hover]") ? 1 : 0;
    };

    const onMove = (e: MouseEvent) => { cursorActive = true; updateCursorFromEvent(e.clientX, e.clientY); };
    const onLeave = () => { cursorActive = false; attractTarget = 0; };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]; if (!t) return;
      cursorActive = true; updateCursorFromEvent(t.clientX, t.clientY);
    };
    if (!reduceMotion) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseover", onOver, { passive: true });
      window.addEventListener("mouseleave", onLeave);
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onLeave);
    }

    // ── Scroll energy (ripple + FOV kick) ──
    let scrollEnergy = 0;
    let lastScrollY = window.scrollY;
    let lastScrollT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max((now - lastScrollT) / 1000, 1e-3);
      const v = Math.abs(window.scrollY - lastScrollY) / dt;
      lastScrollY = window.scrollY;
      lastScrollT = now;
      scrollEnergy = Math.min(1, scrollEnergy + Math.min(1, v / SCROLL_RIPPLE_MAXV));
    };
    if (!reduceMotion) window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
      updateScreenToWorld();
      measure();
    };
    window.addEventListener("resize", onResize);

    // ── Fog color tracks the page background (BackgroundMorph writes it) ──
    const fogColor = scene.fog!.color;
    let lastBgStr = "";
    const syncFog = () => {
      const bg = document.documentElement.style.backgroundColor;
      if (!bg || bg === lastBgStr) return;
      lastBgStr = bg;
      const m = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(bg);
      if (m) fogColor.setRGB(+m[1] / 255, +m[2] / 255, +m[3] / 255);
    };

    // ── Animation loop ──
    const dummy = new THREE.Object3D();
    const clearWorld = new Float32Array(CLEAR_MAX_ACTIVE * 4); // minX,maxX,minY,maxY
    let rafId = 0;
    let last = performance.now();
    let rotAngle = INITIAL_ROT_Y; // integrated so per-chapter rotMul never "unwinds"
    let fovCur = CAMERA_FOV;
    let signaledReady = false;

    // Motion multipliers — under prefers-reduced-motion the world holds a
    // still pose: no spin, no drift, no breathing, no pulses. The camera still
    // travels with scroll (user-initiated) and formations still morph.
    const driftAmp = reduceMotion ? 0 : SURFACE_DRIFT_AMP;
    const pulseMul = reduceMotion ? 0 : 1;
    const rotSpeedMul = reduceMotion ? 0 : 1;

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const time = now / 1000;

      // Chapter blending
      const s = chapterCoord(window.scrollY);
      sSm += (s - sSm) * Math.min(1, 2.5 * dt);
      const ia = Math.min(CHAPTERS.length - 1, Math.max(0, Math.floor(sSm)));
      const ib = Math.min(CHAPTERS.length - 1, ia + 1);
      const rawT = clamp01(sSm - ia);
      const tEase = easeInOut(rawT);
      const A = CHAPTERS[ia], B = CHAPTERS[ib];
      const formA = forms[ia], formB = forms[ib];
      const stA = stationZ(ia), stB = stationZ(ib);

      // Narrow aspect makes formations fill the frame — pull back and soften.
      const camDist = lerp(A.camDist, B.camDist, tEase) * (isMobile ? 1.22 : 1);
      const camX = lerp(A.camX, B.camX, tEase);
      const lineV = lerp(A.lineV, B.lineV, tEase) * (isMobile ? 0.75 : 1);
      const gridV = lerp(A.gridV, B.gridV, tEase);
      const opacityV = lerp(A.opacity, B.opacity, tEase);
      const pulseAmp = lerp(A.pulseAmp, B.pulseAmp, tEase) * pulseMul;
      const clearW = lerp(A.clearW, B.clearW, tEase);
      const stationCam = lerp(stA, stB, tEase);

      camDistCur = camDist;

      // Scroll energy decay
      if (scrollEnergy > 0) scrollEnergy = Math.max(0, scrollEnergy - SCROLL_DECAY * dt * scrollEnergy - 0.0008);

      // Mouse parallax (fine pointers only) + velocity FOV kick
      const parTX = finePointer && cursorActive ? cursorNdcX * PARALLAX_X : 0;
      const parTY = finePointer && cursorActive ? cursorNdcY * PARALLAX_Y : 0;
      const parEase = Math.min(1, PARALLAX_SMOOTH * dt);
      parX += (parTX - parX) * parEase;
      parY += (parTY - parY) * parEase;

      const camZAbs = stationCam + camDist;
      camera.position.set(camX + parX, parY, camZAbs);
      camera.lookAt(camX + parX * 0.5, parY * 0.5, stationCam);

      const fovT = CAMERA_FOV + (reduceMotion ? 0 : scrollEnergy * FOV_KICK);
      if (Math.abs(fovT - fovCur) > 0.02) {
        fovCur += (fovT - fovCur) * Math.min(1, 4 * dt);
        camera.fov = fovCur;
        camera.updateProjectionMatrix();
      }

      updateScreenToWorld();
      (scene.fog as THREE.Fog).near = camDist - 25;
      (scene.fog as THREE.Fog).far = camDist + 95;
      syncFog();
      tetraMat.opacity = TETRA_OPACITY * opacityV;

      // "Hidden" line/grid grey tracks the live page color, so an off-state
      // line is invisible on every section background — not just paper.
      const hiddenV = (fogColor.r + fogColor.g + fogColor.b) / 3;

      // Each chapter rotates its home pose by its own weighted angle; the
      // morph lerps between the two rotated poses per particle, so arriving at
      // a static (rotW: 0) pose reads as travel, never as a snap or unwind.
      rotAngle += AUTO_ROTATE_SPEED * dt * rotSpeedMul;
      const angA = rotAngle * A.rotW;
      const angB = rotAngle * B.rotW;
      const cosA = Math.cos(angA), sinA = Math.sin(angA);
      const cosB = Math.cos(angB), sinB = Math.sin(angB);

      // Cursor attract smoothing
      attractSm += (attractTarget - attractSm) * Math.min(1, 5 * dt);
      const cursorForce = REPEL_FORCE * lerp(1, ATTRACT_MULT, attractSm);

      const repelR2 = REPEL_RADIUS * REPEL_RADIUS;
      const dampMul = Math.exp(-DAMPING * dt);
      const invR = 1 / SPHERE_RADIUS;

      // Cursor on the current station plane in world space.
      const cursorWorldX = camera.position.x + cursorNdcX * halfW;
      const cursorWorldY = camera.position.y + cursorNdcY * halfH;

      // Project the visible content clearings onto the station plane.
      const vwPx = el.clientWidth, vhPx = el.clientHeight;
      const scrollNow = window.scrollY;
      let clearCount = 0;
      for (let c = 0; clearW > 0.02 && c < clearRects.length && clearCount < CLEAR_MAX_ACTIVE; c++) {
        const rct = clearRects[c];
        const vt = rct.t - scrollNow;
        const vb = rct.b - scrollNow;
        if (vb < -60 || vt > vhPx + 60) continue;
        const o = clearCount * 4;
        clearWorld[o]     = camX + ((rct.l / vwPx) * 2 - 1) * halfW - CLEAR_MARGIN;
        clearWorld[o + 1] = camX + ((rct.r / vwPx) * 2 - 1) * halfW + CLEAR_MARGIN;
        clearWorld[o + 2] = (1 - (vb / vhPx) * 2) * halfH - CLEAR_MARGIN;
        clearWorld[o + 3] = (1 - (vt / vhPx) * 2) * halfH + CLEAR_MARGIN;
        clearCount++;
      }

      const rippleOn = scrollEnergy > 0.001;
      const morphing = rawT > 0.0001 && rawT < 0.9999 && ia !== ib;

      for (let i = 0; i < POINT_COUNT; i++) {
        const i3 = i * 3;

        // Per-particle staggered morph — the swarm streams between stations
        // like a flock instead of translating as a block.
        let tI = tEase;
        if (morphing) {
          const u = clamp01((rawT - colorJitter[i] * MORPH_STAGGER) / (1 - MORPH_STAGGER));
          tI = easeInOut(u);
        }
        const sz = stA + (stB - stA) * tI;

        // Rotate each chapter's home by its own weighted angle, then lerp the
        // two rotated poses and park the result at the travelling station z.
        const axl = formA[i3], ayl = formA[i3 + 1], azl = formA[i3 + 2];
        const bxl = formB[i3], byl = formB[i3 + 1], bzl = formB[i3 + 2];
        const arx = axl * cosA + azl * sinA;
        const arz = -axl * sinA + azl * cosA;
        const brx = bxl * cosB + bzl * sinB;
        const brz = -bxl * sinB + bzl * cosB;
        const lx = arx + (brx - arx) * tI;
        const ly = ayl + (byl - ayl) * tI;
        const lz = arz + (brz - arz) * tI;
        let hx = lx;
        let hy = ly;
        let hz = lz + sz;

        // Mid-flight billow: paths swell outward so travel reads organic.
        if (morphing) {
          const bil = Math.sin(tI * Math.PI) * FLIGHT_BILLOW;
          hx += bil * Math.sin(phaseX[i]);
          hy += bil * 0.5 * Math.cos(phaseY[i]);
        }

        const drx = Math.sin(time * SURFACE_DRIFT_SPEED + phaseX[i]) * driftAmp;
        const dry = Math.cos(time * SURFACE_DRIFT_SPEED * 1.13 + phaseY[i]) * driftAmp;
        const drz = Math.sin(time * SURFACE_DRIFT_SPEED * 0.91 + phaseZ[i]) * driftAmp;

        let targetX = hx + drx;
        let targetY = hy + dry;
        let targetZ = hz + drz;

        // Scroll ripple: radial wave travelling across the formation
        if (rippleOn) {
          const ripple = scrollEnergy * SCROLL_RIPPLE_AMP *
            Math.sin(radialDist[i] * 0.16 - time * 7.0);
          targetX += lx * invR * ripple;
          targetY += ly * invR * ripple;
          targetZ += lz * invR * ripple;
        }

        velX[i] += (targetX - posX[i]) * SPRING_K * dt;
        velY[i] += (targetY - posY[i]) * SPRING_K * dt;
        velZ[i] += (targetZ - posZ[i]) * SPRING_K * dt;

        if (cursorActive || clearCount > 0) {
          const wx = posX[i];
          const wy = posY[i];

          if (cursorActive) {
            const rx = wx - cursorWorldX;
            const ry = wy - cursorWorldY;
            const d2 = rx * rx + ry * ry;
            if (d2 < repelR2) {
              const d = Math.sqrt(d2) || 0.0001;
              const falloff = 1 - d / REPEL_RADIUS;
              const force = falloff * falloff * cursorForce;
              velX[i] += (rx / d) * force * dt;
              velY[i] += (ry / d) * force * dt;
            }
          }

          // Part around content: push out of any clearing along the nearest
          // edge, ramping up with depth so particles rim the content softly.
          for (let c = 0; c < clearCount; c++) {
            const o = c * 4;
            if (wx > clearWorld[o] && wx < clearWorld[o + 1] && wy > clearWorld[o + 2] && wy < clearWorld[o + 3]) {
              const dL = wx - clearWorld[o];
              const dR = clearWorld[o + 1] - wx;
              const dB = wy - clearWorld[o + 2];
              const dT = clearWorld[o + 3] - wy;
              const m = Math.min(dL, dR, dB, dT);
              const f = CLEAR_FORCE * clearW * Math.min(1, m / CLEAR_SOFT) * dt;
              if (m === dL) velX[i] -= f;
              else if (m === dR) velX[i] += f;
              else if (m === dB) velY[i] -= f;
              else velY[i] += f;
              break;
            }
          }
        }

        velX[i] *= dampMul;
        velY[i] *= dampMul;
        velZ[i] *= dampMul;

        posX[i] += velX[i] * dt;
        posY[i] += velY[i] * dt;
        posZ[i] += velZ[i] * dt;

        dummy.position.set(posX[i], posY[i], posZ[i]);
        dummy.rotation.set(
          phaseX[i] + time * 0.18 * pulseMul,
          phaseY[i] + time * 0.13 * pulseMul,
          phaseZ[i] + time * 0.09 * pulseMul,
        );

        // Shrink particles as they sweep past the lens so nothing smears it.
        const dzCam = camZAbs - posZ[i];
        const nearFade = clamp01((dzCam - NEAR_FADE_END) / (NEAR_FADE_START - NEAR_FADE_END));
        const pulse = 1 + Math.sin(time * SUBTLE_PULSE_SPEED + phaseY[i]) * pulseAmp;
        dummy.scale.setScalar(pulse * nearFade);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;

      // ── Network lines ──
      lineMesh.visible = lineV > 0.01;
      if (lineMesh.visible) {
        for (let e = 0; e < edges.length; e++) {
          const [a, b] = edges[e];
          const o = e * 6;
          linePositions[o]     = posX[a];
          linePositions[o + 1] = posY[a];
          linePositions[o + 2] = posZ[a];
          linePositions[o + 3] = posX[b];
          linePositions[o + 4] = posY[b];
          linePositions[o + 5] = posZ[b];

          // Fade over-stretched edges so no line ever streaks across content.
          const ex = posX[b] - posX[a];
          const ey = posY[b] - posY[a];
          const ez = posZ[b] - posZ[a];
          const len = Math.sqrt(ex * ex + ey * ey + ez * ez);
          const lenFade = clamp01(1 - (len - LINE_LEN_FADE_START) / (LINE_LEN_FADE_END - LINE_LEN_FADE_START));
          edgeFade[e] = lenFade;

          const ph = edgePhase[e];
          const pls1 = reduceMotion
            ? 0.8
            : LINE_PULSE_FLOOR + (1 - LINE_PULSE_FLOOR) * (0.5 + 0.5 * Math.sin(time * PULSE_SPEED + ph));
          const pls2 = reduceMotion
            ? 0.8
            : LINE_PULSE_FLOOR + (1 - LINE_PULSE_FLOOR) * (0.5 + 0.5 * Math.sin(time * PULSE_SPEED + ph + EDGE_PHASE_DELTA));

          const i1 = clamp01(pls1) * lineV * lenFade;
          const i2 = clamp01(pls2) * lineV * lenFade;
          const g1 = hiddenV + (LINE_DARK_VAL - hiddenV) * i1;
          const g2 = hiddenV + (LINE_DARK_VAL - hiddenV) * i2;
          lineColors[o]     = g1; lineColors[o + 1] = g1; lineColors[o + 2] = g1 * 1.04;
          lineColors[o + 3] = g2; lineColors[o + 4] = g2; lineColors[o + 5] = g2 * 1.04;
        }
        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.color.needsUpdate = true;
      }

      // ── Travelling pulses ──
      if (edges.length) {
        const pOp = (reduceMotion ? 0 : PULSE_DOT_OPACITY) * lineV;
        pulseMat.opacity = pOp;
        pulsePoints.visible = pOp > 0.001;
        if (pulsePoints.visible) {
          for (let i = 0; i < PULSE_DOT_COUNT; i++) {
            // Dots vacate faded (over-stretched) edges — hop until settled.
            if (edgeFade[pulseEdge[i]] < 0.4) {
              pulseEdge[i] = (pulseEdge[i] + 1) % edges.length;
            }
            const [a, b] = edges[pulseEdge[i]];
            let f = (time * pulseSpeed[i] + pulsePhase[i]) % 1;
            if (f < 0) f += 1;
            const o = i * 3;
            pulsePos[o]     = posX[a] + (posX[b] - posX[a]) * f;
            pulsePos[o + 1] = posY[a] + (posY[b] - posY[a]) * f;
            pulsePos[o + 2] = posZ[a] + (posZ[b] - posZ[a]) * f;
          }
          pulseGeo.attributes.position.needsUpdate = true;
        }
      }

      // ── Grid backdrop (hero only) ──
      gridMesh.visible = gridV > 0.01;
      if (gridMesh.visible) {
        for (let v = 0; v < gridVertCount; v++) {
          const centreFade = clamp01((gridDist[v] - 16) / 30);
          const vis = centreFade * gridV;
          const gval = hiddenV + (GRID_DARK_VAL - hiddenV) * vis;
          const c = v * 3;
          gridColors[c] = gval; gridColors[c + 1] = gval; gridColors[c + 2] = gval * 1.03;
        }
        gridGeo.attributes.color.needsUpdate = true;
      }

      renderer.render(scene, camera);

      if (!signaledReady) {
        signaledReady = true;
        markCanvasReady();
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(remeasureT);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      tetraGeo.dispose();
      tetraMat.dispose();
      mesh.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      dustDot.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      softDot.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
