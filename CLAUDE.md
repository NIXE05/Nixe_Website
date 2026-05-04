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
- **Framer Motion v11** — all animations
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

## Architecture

`app/page.tsx` composes everything in order: `GrainOverlay → Cursor → Loader → Nav → [7 sections] → Footer`.

**Global overlays** (`components/`):
- `Cursor` — custom cursor with RAF loop; uses `transform: translate()` for GPU acceleration; `data-cursor-hover` attribute on any element triggers the expand state
- `Loader` — first-visit only (checked via `sessionStorage['nixe:visited']`); uses Framer Motion `AnimatePresence`
- `GrainOverlay` — fixed SVG noise texture at 4% opacity, `mix-blend-mode: multiply`
- `Nav` — backdrop blur triggers at `scrollY > 80`

**Sections** (`components/sections/`):
- All sections are `"use client"` and use Framer Motion `whileInView` with `viewport={{ once: true }}` for scroll reveals
- `Hero` — full-viewport-width headline using `.hero-headline` class; cascade ghost text is `position: absolute right-0 w-1/2 overflow-hidden` with CSS `cascadeFloat` keyframe animation
- `Shipped` — Courtly app showcase; screenshots are at `public/apps/courtly/screen-{1-5}.png`; app icon at `public/apps/courtly/icon.png`; lightbox uses `AnimatePresence`
- `Contact` — dark section (`bg-nixe-ink`); form submission logs to console and shows a success state; no email service wired yet

## Pending work

- Wire contact form to an email service (Resend recommended for Next.js)
- Add real App Store URL for Courtly (currently shows "Coming Soon")
- Configure deployment target (Vercel recommended)
- Domain: `nixe.in`
