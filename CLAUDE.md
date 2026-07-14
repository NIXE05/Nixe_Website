# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server with Turbopack at http://localhost:3000
pnpm build      # Type-check + production build (run this to verify changes)
pnpm lint       # ESLint
```

Always run `pnpm build` after making changes to confirm zero TypeScript errors before reporting done.

## Stack

- **Next.js 16** — App Router, no `src/` directory, static output
- **Tailwind CSS v4** — configured via `app/globals.css` `@theme` block (no `tailwind.config.ts`)
- **Framer Motion v11** — DOM animations; **Three.js** — the WorldCanvas particle scene; **lenis** — inertial smooth scrolling
- **Plus Jakarta Sans** (800/700/500/400) + **JetBrains Mono** — loaded via `next/font/google` in `app/layout.tsx`; CSS variables `--font-jakarta` and `--font-jetbrains`

## Critical: Typography classes

Typography classes (`hero-headline`, `display-xl`, `display-l`, etc.) are defined as **plain CSS classes** in `app/globals.css` — NOT as Tailwind `@utility` directives. This is intentional: Tailwind v4's `@utility` content-scanning was unreliable and caused classes to silently not apply. Do not convert them back to `@utility`.

## Design tokens

Colors are defined in `@theme` inside `app/globals.css` and used as `text-nixe-ink`, `bg-nixe-paper`, etc.:

| Token | Hex | Role |
|---|---|---|
| `nixe-paper` | `#FAFAF7` | Page background |
| `nixe-bone` | `#F4F3EE` | Alternate section bg (Manifesto, Ethos) |
| `nixe-stone` | `#E5E4DF` | Borders |
| `nixe-ash` | `#C9C8C2` | Muted/decorative |
| `nixe-ink` | `#0A0A0A` | Primary text, dark elements |
| `nixe-graphite` | `#2A2A2A` | Secondary text |
| `nixe-smoke` | `#6B6B6B` | Labels, captions |
| `nixe-pearl` | `#F5F4EF` | Text/elements on dark bg |

## Architecture — igloo.inc-inspired scroll experience

`app/page.tsx` composes: `BackgroundMorph → SmoothScroll → WorldCanvas → Loader → ScrollHUD → Nav → <main z-[1]> [6 sections] → Footer`.

The homepage is one continuous "world": a **fixed full-viewport Three.js canvas** (`WorldCanvas`, z-0) sits behind all content (`main` is `relative z-[1]`). Sections do NOT paint their own backgrounds — the page color lives on `<html>` and is **continuously interpolated** with scroll by `BackgroundMorph` (reading each section's `data-bg-color`, anchored to section centers, same hold-30/morph-40/hold-30 curve as the canvas). Don't re-add opaque section backgrounds; they would hide the canvas.

**Blending conventions:**
- `SectionMorph` scrubs every section's content (opacity ease-in/out + gentle y drift via `useScroll`), so adjacent sections crossfade instead of stacking. Its children sit inside a TRANSFORMED wrapper — any `position: fixed` descendant (modal, lightbox) must escape via `createPortal(document.body)` (see Shipped's lightbox)
- Add `data-world-clear` to content blocks (card grids, form/text columns) and the canvas softly pushes particles out of their projected rects, so the world parts around content and rims its edges. Measured via the offsetParent chain (transform-safe); re-measured by ResizeObserver
- The Loader does NOT curtain-lift: its paper layer fades in place, the progress ring expands into the globe's bloom, and the wordmark flies into the nav's `[data-nav-wordmark]` slot (nav fades in reveal-gated)

**The world** (`components/WorldCanvas.tsx`):
- ~12k instanced tetrahedron particles (5.2k on mobile) morph between 6 formations, one per section id (`hero` globe → `work` shell → `services` disc → `shipped` rings → `about` constellation → `contact` core)
- Scroll drives a chapter coordinate (same 0.55-viewport trigger as BackgroundMorph). Formations HOLD while a section is in view; the morph plays in a window before the next trigger. Camera dolly/offset, line network, grid, opacity, and pulse are per-chapter params in `CHAPTERS`
- Cinematic intro (beam drop → ring bloom → scan ignition) starts on the loader's `nixe:reveal` event, not on mount

**Loader / reveal coordination** (`lib/reveal.ts`):
- `Loader` shows EVERY visit; counter reflects real progress (fonts 30% + canvas first frame 45% + window load 25%), force-completes at 6s, locks scroll while visible, then dispatches `nixe:reveal` and curtain-lifts
- Hero entrance animations gate on `useRevealed()`; `WordReveal` takes an `active` prop for this

**Global overlays** (`components/`):
- `SmoothScroll` — lenis (`autoRaf`, `anchors: true`); disabled under `prefers-reduced-motion`. `scroll-behavior: smooth` CSS must stay off while lenis is active (handled in globals.css)
- `ScrollHUD` — fixed bottom-left chapter readout, `mix-blend-mode: difference`
- `Cursor` — custom cursor with RAF loop; `data-cursor-hover` triggers the expand state
- `GrainOverlay` — fixed SVG noise texture, `mix-blend-mode: screen`
- `Nav` — pill condenses past `scrollY > vh/4`, hides on scroll-down

**Sections** (`components/sections/`):
- All `"use client"`, Framer Motion `whileInView` + `viewport={{ once: true }}` reveals; `Shipped` phones and `FeaturedProjects` second card have scrubbed parallax via `useScroll`/`useTransform`
- `Hero` — reveal-gated entrances + scroll-scrubbed exit (headline rises/fades)
- `Shipped` — Courtsy showcase; screenshots at `public/apps/courtsy/screen-{1-5}.png`; lightbox uses `AnimatePresence`
- `Contact` — form submission logs to console and shows a success state; no email service wired yet

## Pending work

- Wire contact form to an email service (Resend recommended for Next.js)
- Add real App Store URL for Courtsy (currently shows "Coming Soon")
- Configure deployment target (Vercel recommended)
- Domain: `nixe.in`
