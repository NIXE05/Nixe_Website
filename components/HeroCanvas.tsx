"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─── Tunables ─────────────────────────────────────────────────────────────────
const POINT_COUNT          = 12000;
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

// Constant subtle per-particle scale pulse
const SUBTLE_PULSE_AMP     = 0.07;
const SUBTLE_PULSE_SPEED   = 0.5;

// Big-bang reveal
const BIG_BANG_VEL_MULT    = 5.5;

// Magnetic repel from cursor
const REPEL_RADIUS         = 25;
const REPEL_FORCE          = 700;
const SPRING_K             = 9;
const DAMPING              = 5;
const CURSOR_PLANE_Z       = 0;

// Particle color — black with subtle grayscale variation
const HUE                  = 0;
const SAT_BASE             = 0;
const LIT_BASE             = 0.07;
const LIT_VAR              = 0.09;
const TETRA_OPACITY        = 0.62;

// Network layer
const HUB_COUNT            = 400;
const HUB_NEIGHBORS        = 3;
const PULSE_SPEED          = 1.4;
const EDGE_PHASE_DELTA     = Math.PI / 3.5;
const LINE_BASE_OPACITY    = 0.48;
const LINE_COLOR_R         = 0.22;
const LINE_COLOR_G         = 0.22;
const LINE_COLOR_B         = 0.24;
const LINE_PULSE_FLOOR     = 0.45;
const HUB_MAX_EDGE_DIST    = 22;

// Camera
const CAMERA_FOV           = 60;
const CAMERA_Z             = 130;

// Depth fog
const FOG_NEAR             = 110;
const FOG_FAR              = 200;

// Auto-rotation
const AUTO_ROTATE_SPEED    = 0.05;

// Boot-up reveal
const NETWORK_REVEAL_AT     = 2.0;
const NETWORK_REVEAL_DURATION = 1.6;

// Canvas-edge soft fade
const CANVAS_MASK =
  "radial-gradient(ellipse 80% 82% at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 96%)";

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

function pickHubIndices(total: number, count: number): number[] {
  const set = new Set<number>();
  while (set.size < count) {
    set.add(Math.floor(Math.random() * total));
  }
  return Array.from(set);
}

function computeHubEdges(
  hubs: number[],
  hx: Float32Array,
  hy: Float32Array,
  hz: Float32Array,
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
      const dx = hx[a] - hx[b];
      const dy = hy[a] - hy[b];
      const dz = hz[a] - hz[b];
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
export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xFAFAF7, FOG_NEAR, FOG_FAR);

    const camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      el.clientWidth / el.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = CAMERA_Z;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

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
    mesh.rotation.y = INITIAL_ROT_Y;
    scene.add(mesh);

    // ── Build the land mask, then seed particle homes via rejection sampling ──
    const landMask = buildLandMask();

    const homeX  = new Float32Array(POINT_COUNT);
    const homeY  = new Float32Array(POINT_COUNT);
    const homeZ  = new Float32Array(POINT_COUNT);
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

    const tmpPoint = { x: 0, y: 0, z: 0 };
    for (let i = 0; i < POINT_COUNT; i++) {
      sampleSpherePoint(landMask, SPHERE_RADIUS, tmpPoint);
      homeX[i] = tmpPoint.x;
      homeY[i] = tmpPoint.y;
      homeZ[i] = tmpPoint.z;
      phaseX[i] = Math.random() * Math.PI * 2;
      phaseY[i] = Math.random() * Math.PI * 2;
      phaseZ[i] = Math.random() * Math.PI * 2;
      colorJitter[i] = Math.random();
    }

    // Big-bang: all start at origin, kick outward toward their home
    for (let i = 0; i < POINT_COUNT; i++) {
      posX[i] = 0;
      posY[i] = 0;
      posZ[i] = 0;
      velX[i] = homeX[i] * BIG_BANG_VEL_MULT;
      velY[i] = homeY[i] * BIG_BANG_VEL_MULT;
      velZ[i] = homeZ[i] * BIG_BANG_VEL_MULT;
    }

    // Per-particle color
    const tmpColor = new THREE.Color();
    for (let i = 0; i < POINT_COUNT; i++) {
      const j = colorJitter[i];
      const lit = LIT_BASE + (j - 0.5) * LIT_VAR;
      tmpColor.setHSL(HUE, SAT_BASE, Math.min(1, Math.max(0, lit)));
      mesh.setColorAt(i, tmpColor);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // ── Hub network ──
    const hubIndices = pickHubIndices(POINT_COUNT, HUB_COUNT);
    const edges = computeHubEdges(hubIndices, homeX, homeY, homeZ, HUB_NEIGHBORS, HUB_MAX_EDGE_DIST);

    const edgePhase = new Float32Array(edges.length);
    for (let i = 0; i < edges.length; i++) edgePhase[i] = Math.random() * Math.PI * 2;

    const linePositions = new Float32Array(edges.length * 6);
    const lineColors    = new Float32Array(edges.length * 6);
    const lineGeo       = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      fog: true,
    });
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    lineMesh.rotation.y = INITIAL_ROT_Y;
    scene.add(lineMesh);

    // ── Cursor projection ──
    let cursorWorldX = 1e6;
    let cursorWorldY = 1e6;
    let cursorActive = false;

    let halfH = 1, halfW = 1;
    const updateScreenToWorld = () => {
      halfH = Math.tan((CAMERA_FOV * Math.PI) / 180 / 2) * (camera.position.z - CURSOR_PLANE_Z);
      halfW = halfH * camera.aspect;
    };
    updateScreenToWorld();

    const updateCursorFromEvent = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((clientY - rect.top) / rect.height) * 2 - 1);
      cursorWorldX = ndcX * halfW;
      cursorWorldY = ndcY * halfH;
    };

    const onMove = (e: MouseEvent) => { cursorActive = true; updateCursorFromEvent(e.clientX, e.clientY); };
    const onLeave = () => { cursorActive = false; cursorWorldX = 1e6; cursorWorldY = 1e6; };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]; if (!t) return;
      cursorActive = true; updateCursorFromEvent(t.clientX, t.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onLeave);

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
      updateScreenToWorld();
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ──
    const dummy = new THREE.Object3D();
    let rafId = 0;
    let last = performance.now();
    const startTime = last;
    let autoRotY = INITIAL_ROT_Y;

    const tick = () => {
      rafId = requestAnimationFrame(tick);

      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const time = now / 1000;
      const elapsed = (now - startTime) / 1000;

      const repelR2 = REPEL_RADIUS * REPEL_RADIUS;
      const dampMul = Math.exp(-DAMPING * dt);

      for (let i = 0; i < POINT_COUNT; i++) {
        const drx = Math.sin(time * SURFACE_DRIFT_SPEED + phaseX[i]) * SURFACE_DRIFT_AMP;
        const dry = Math.cos(time * SURFACE_DRIFT_SPEED * 1.13 + phaseY[i]) * SURFACE_DRIFT_AMP;
        const drz = Math.sin(time * SURFACE_DRIFT_SPEED * 0.91 + phaseZ[i]) * SURFACE_DRIFT_AMP;

        const targetX = homeX[i] + drx;
        const targetY = homeY[i] + dry;
        const targetZ = homeZ[i] + drz;

        velX[i] += (targetX - posX[i]) * SPRING_K * dt;
        velY[i] += (targetY - posY[i]) * SPRING_K * dt;
        velZ[i] += (targetZ - posZ[i]) * SPRING_K * dt;

        if (cursorActive) {
          const rx = posX[i] - cursorWorldX;
          const ry = posY[i] - cursorWorldY;
          const d2 = rx * rx + ry * ry;
          if (d2 < repelR2) {
            const d = Math.sqrt(d2) || 0.0001;
            const falloff = 1 - d / REPEL_RADIUS;
            const force = falloff * falloff * REPEL_FORCE;
            velX[i] += (rx / d) * force * dt;
            velY[i] += (ry / d) * force * dt;
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
          phaseX[i] + time * 0.18,
          phaseY[i] + time * 0.13,
          phaseZ[i] + time * 0.09,
        );
        const pulse = 1 + Math.sin(time * SUBTLE_PULSE_SPEED + phaseY[i]) * SUBTLE_PULSE_AMP;
        dummy.scale.setScalar(pulse);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;

      for (let e = 0; e < edges.length; e++) {
        const [a, b] = edges[e];
        const o = e * 6;
        linePositions[o]     = posX[a];
        linePositions[o + 1] = posY[a];
        linePositions[o + 2] = posZ[a];
        linePositions[o + 3] = posX[b];
        linePositions[o + 4] = posY[b];
        linePositions[o + 5] = posZ[b];

        const ph = edgePhase[e];
        const v1 = LINE_PULSE_FLOOR + (1 - LINE_PULSE_FLOOR) * (0.5 + 0.5 * Math.sin(time * PULSE_SPEED + ph));
        const v2 = LINE_PULSE_FLOOR + (1 - LINE_PULSE_FLOOR) * (0.5 + 0.5 * Math.sin(time * PULSE_SPEED + ph + EDGE_PHASE_DELTA));
        lineColors[o]     = LINE_COLOR_R * v1;
        lineColors[o + 1] = LINE_COLOR_G * v1;
        lineColors[o + 2] = LINE_COLOR_B * v1;
        lineColors[o + 3] = LINE_COLOR_R * v2;
        lineColors[o + 4] = LINE_COLOR_G * v2;
        lineColors[o + 5] = LINE_COLOR_B * v2;
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;
      lineMat.opacity = LINE_BASE_OPACITY * clamp01((elapsed - NETWORK_REVEAL_AT) / NETWORK_REVEAL_DURATION);

      autoRotY += AUTO_ROTATE_SPEED * dt;
      mesh.rotation.y = autoRotY;
      lineMesh.rotation.y = autoRotY;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onLeave);
      window.removeEventListener("resize", onResize);
      tetraGeo.dispose();
      tetraMat.dispose();
      mesh.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0"
      style={{
        maskImage: CANVAS_MASK,
        WebkitMaskImage: CANVAS_MASK,
      }}
    />
  );
}
