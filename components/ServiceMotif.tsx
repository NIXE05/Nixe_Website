"use client";

/**
 * Line-art diagrams that sit opposite each Services panel. Deliberately
 * schematic rather than decorative — a hardened perimeter, a weighted network,
 * a device under construction. All animation is CSS (see the motif-* keyframes
 * in globals.css) so nothing costs JS while the section is pinned.
 */

const STROKE = "currentColor";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 340 340"
      fill="none"
      className="w-full h-full"
      style={{ color: "var(--tone-fg)" }}
      aria-hidden="true"
    >
      {/* Registration ticks — the same drafting language as the hero corners */}
      <g opacity="0.2" stroke={STROKE} strokeWidth="1">
        <path d="M6 22V6h16M318 6h16v16M334 318v16h-16M22 334H6v-16" />
      </g>
      {children}
    </svg>
  );
}

/** 01 — Cybersecurity: a layered perimeter under continuous scan. */
export function MotifSecurity() {
  return (
    <Frame>
      {/* Nested perimeters */}
      <g stroke={STROKE} strokeWidth="1">
        <rect x="42" y="42" width="256" height="256" rx="20" opacity="0.16" strokeDasharray="5 7" />
        <rect x="74" y="74" width="192" height="192" rx="16" opacity="0.26" />
        <rect x="106" y="106" width="128" height="128" rx="12" opacity="0.4" />
      </g>

      {/* Rotating tick ring */}
      <g className="motif-spin" opacity="0.34">
        <circle cx="170" cy="170" r="112" stroke={STROKE} strokeWidth="1" strokeDasharray="2 16" />
      </g>
      <g className="motif-spin-back" opacity="0.22">
        <circle cx="170" cy="170" r="86" stroke={STROKE} strokeWidth="1" strokeDasharray="24 10" />
      </g>

      {/* Core */}
      <g stroke={STROKE} strokeWidth="1.2" opacity="0.75">
        <path d="M170 138l30 15v28c0 20-13 34-30 41-17-7-30-21-30-41v-28l30-15z" />
      </g>
      <circle cx="170" cy="180" r="4.5" fill={STROKE} opacity="0.85" />
      <path d="M170 184v12" stroke={STROKE} strokeWidth="1.2" opacity="0.85" />

      {/* Perimeter sensors */}
      {[
        [170, 42],
        [298, 170],
        [170, 298],
        [42, 170],
      ].map(([cx, cy], i) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="3"
          fill={STROKE}
          className="motif-blip"
          style={{ animationDelay: `${i * 0.65}s` }}
        />
      ))}

      {/* Scan bar */}
      <g className="motif-sweep">
        <rect x="42" y="168" width="256" height="1" fill={STROKE} opacity="0.55" />
        <rect x="42" y="162" width="256" height="13" fill="url(#scanGlow)" opacity="0.28" />
      </g>
      <defs>
        <linearGradient id="scanGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={STROKE} stopOpacity="0" />
          <stop offset="50%" stopColor={STROKE} stopOpacity="1" />
          <stop offset="100%" stopColor={STROKE} stopOpacity="0" />
        </linearGradient>
      </defs>
    </Frame>
  );
}

/** 02 — AI: a weighted network with one path lighting up through it. */
export function MotifAI() {
  const cols = [
    { x: 68, ys: [110, 170, 230] },
    { x: 170, ys: [80, 140, 200, 260] },
    { x: 272, ys: [140, 200] },
  ];

  const edges: Array<[number, number, number, number]> = [];
  for (let c = 0; c < cols.length - 1; c++) {
    for (const y0 of cols[c].ys) {
      for (const y1 of cols[c + 1].ys) {
        edges.push([cols[c].x, y0, cols[c + 1].x, y1]);
      }
    }
  }

  return (
    <Frame>
      {/* Mesh */}
      <g stroke={STROKE} strokeWidth="1" opacity="0.13">
        {edges.map(([x0, y0, x1, y1]) => (
          <line key={`${x0}-${y0}-${x1}-${y1}`} x1={x0} y1={y0} x2={x1} y2={y1} />
        ))}
      </g>

      {/* The activated path */}
      <g stroke={STROKE} strokeWidth="1.4" opacity="0.8" fill="none">
        <path
          d="M68 170L170 140L272 200"
          className="motif-trace"
          style={{ ["--trace-len" as string]: "230" }}
        />
      </g>

      {/* Column guides */}
      <g stroke={STROKE} strokeWidth="1" opacity="0.14" strokeDasharray="3 6">
        {cols.map((c) => (
          <line key={c.x} x1={c.x} y1="52" x2={c.x} y2="288" />
        ))}
      </g>

      {/* Nodes */}
      {cols.map((c, ci) =>
        c.ys.map((y, ni) => (
          <g key={`${c.x}-${y}`}>
            <circle cx={c.x} cy={y} r="6" fill="var(--tone-bg)" />
            <circle cx={c.x} cy={y} r="6" stroke={STROKE} strokeWidth="1" opacity="0.45" />
            <circle
              cx={c.x}
              cy={y}
              r="2.6"
              fill={STROKE}
              className="motif-blip"
              style={{ animationDelay: `${(ci * 4 + ni) * 0.28}s` }}
            />
          </g>
        )),
      )}

      {/* Output readout */}
      <g opacity="0.3">
        <rect x="252" y="290" width="46" height="14" stroke={STROKE} strokeWidth="1" rx="2" />
        <path d="M258 297h34" stroke={STROKE} strokeWidth="1" />
      </g>
    </Frame>
  );
}

/** 03 — Applications: a device wireframe assembling itself. */
export function MotifApps() {
  const blocks: Array<{ y: number; w: number; h: number; x?: number }> = [
    { y: 122, w: 96, h: 10 },
    { y: 142, w: 62, h: 10 },
    { y: 172, w: 116, h: 34 },
    { y: 216, w: 54, h: 34 },
    { y: 216, w: 54, h: 34, x: 172 },
  ];

  return (
    <Frame>
      {/* Dimension guides */}
      <g stroke={STROKE} strokeWidth="1" opacity="0.18">
        <path d="M78 34v14M262 34v14M78 41h184" strokeDasharray="3 5" />
        <path d="M40 62h14M40 278h14M47 62v216" strokeDasharray="3 5" />
      </g>

      {/* Device */}
      <rect x="78" y="62" width="184" height="216" rx="24" stroke={STROKE} strokeWidth="1.2" opacity="0.5" />
      <rect x="86" y="70" width="168" height="200" rx="18" stroke={STROKE} strokeWidth="1" opacity="0.22" />

      {/* Status bar */}
      <g opacity="0.34">
        <rect x="150" y="78" width="40" height="7" rx="3.5" fill={STROKE} />
        <path d="M100 82h18M222 82h18" stroke={STROKE} strokeWidth="1" />
      </g>

      {/* Content blocks */}
      {blocks.map((b, i) => (
        <rect
          key={`${b.y}-${b.w}-${b.x ?? 104}`}
          x={b.x ?? 104}
          y={b.y}
          width={b.w}
          height={b.h}
          rx="4"
          fill={STROKE}
          className="motif-rise"
          style={{ animationDelay: `${i * 0.24}s` }}
        />
      ))}

      {/* Home indicator */}
      <rect x="146" y="258" width="48" height="3" rx="1.5" fill={STROKE} opacity="0.4" />

      {/* Build ticks */}
      <g opacity="0.3">
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={292}
            cy={140 + i * 26}
            r="3"
            fill={STROKE}
            className="motif-blip"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
        <path d="M292 130v-14M292 200v14" stroke={STROKE} strokeWidth="1" strokeDasharray="3 4" />
      </g>
    </Frame>
  );
}
