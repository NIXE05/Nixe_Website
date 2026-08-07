# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server with Turbopack at http://localhost:3000
pnpm build      # Type-check + production build (run this to verify changes)
```

Always run `pnpm build` after making changes to confirm zero TypeScript errors before reporting done.

`pnpm lint` is currently **broken** — the script still calls `next lint`, which Next 16 removed. Run ESLint directly if you need it.

**Turbopack dev caches CSS aggressively.** If a change to `app/globals.css` appears not to apply, the served stylesheet is probably stale — `rm -rf .next` and restart the dev server before debugging the CSS itself.

## Stack

- **Next.js 16** — App Router, no `src/` directory, static output
- **Tailwind CSS v4** — configured via `app/globals.css` `@theme` block (no `tailwind.config.ts`)
- **Framer Motion v11** — DOM animations; **lenis** — inertial smooth scrolling. No Three.js, no WebGL.
- **Plus Jakarta Sans** (800/700/500/400) + **JetBrains Mono** — loaded via `next/font/google` in `app/layout.tsx`; CSS variables `--font-jakarta` and `--font-jetbrains`

## Critical: Typography classes

Typography classes (`hero-headline`, `display-xl`, `display-l`, etc.) are defined as **plain CSS classes** in `app/globals.css` — NOT as Tailwind `@utility` directives. This is intentional: Tailwind v4's `@utility` content-scanning was unreliable and caused classes to silently not apply. Do not convert them back to `@utility`.

## Design tokens

Colors are defined in `@theme` inside `app/globals.css` and used as `text-nixe-ink`, `bg-nixe-paper`, etc.:

| Token | Hex | Role |
|---|---|---|
| `nixe-paper` | `#FAFAF7` | Light plate |
| `nixe-bone` | `#F1F0EA` | Alternate light plate |
| `nixe-stone` | `#E5E4DF` | Borders |
| `nixe-ash` | `#C9C8C2` | Muted/decorative |
| `nixe-ink` | `#0A0A0A` | Dark plate, primary text on light |
| `nixe-graphite` | `#2A2A2A` | Secondary text |
| `nixe-smoke` | `#6B6B6B` | Labels, captions |
| `nixe-pearl` | `#F5F4EF` | Text/elements on dark |

## Architecture — plates

`app/page.tsx` composes: `SmoothScroll → ScrollHUD → Nav → <main> [6 sections] → Footer`.

The homepage is a stack of **plates**: opaque slabs of colour with hard edges between them. Each plate paints its own background and owns its layout; nothing bleeds across a boundary.

| Plate | id | Tone | Shape |
|---|---|---|---|
| Hero | `hero` | paper | 2D line field + headline |
| 01 Work | `work` | bone | two full-width project cards |
| 02 Services | `services` | **ink** | scroll-pinned panels (300vh track) |
| 03 Shipped | `shipped` | paper | Courtsy split + spec datasheet |
| 04 About | `about` | bone | statement + capability index |
| 05 Contact | `contact` | **ink** | form + direct lines |
| Footer | — | **ink** | continues the Contact plate |

### The tone system (`components/Plate.tsx` + `globals.css`)

`<Plate tone="paper" | "bone" | "ink">` applies `.plate .plate-{tone}`, which publishes CSS variables that everything inside reads instead of hard-coding ink colours:

`--tone-bg`, `--tone-fg`, `--tone-fg-2/3/4` (descending emphasis), `--tone-line`, `--tone-line-soft`, `--tone-fill`, `--tone-raise` (card surface), `--dot` (blueprint grid).

**Write section markup against these variables, never `rgba(10,10,10,…)` literals** — that is what lets the same component read correctly on paper and on near-black. `Button.tsx` is the reference case: `solid` is `background: var(--tone-fg); color: var(--tone-bg)`, so it inverts per plate with no overrides. `.plate-ink` also sets `color-scheme: dark` so native form controls and the autofill rule follow the plate.

Companion components: `PlateInner` (standard `max-w-[1440px]` + gutters) and `SectionHead` (the index-rail + headline chrome every plate opens with).

### The pinned Services plate

`components/sections/Services.tsx` is the one section with scroll choreography. The track is `COUNT * 100vh` tall with a `sticky top-0 h-dvh` child; `useScroll({ offset: ["start start", "end end"] })` drives a panel coordinate, and each `Panel` derives its own opacity/offset from it.

- `HOLD`/`FADE_END` are **complementary, not overlapping** (0.4 / 0.5). All panels share the same left column, so any simultaneous visibility renders two headlines on top of each other — this was tried and looks broken. The short ramp (~90px of scroll each way) makes the handover read as a cut.
- Below `md` the pinning is dropped entirely and the panels simply stack.
- **`position: sticky` here is why `<body>` uses `overflow-x: clip` rather than `hidden`** — `hidden` makes body a scroll container and breaks it. Don't change that back, and don't wrap a plate in a transformed ancestor.

Per-panel line-art diagrams live in `components/ServiceMotif.tsx`, animated entirely by the `motif-*` CSS keyframes in `globals.css` (no JS cost while pinned).

### Scroll depth: parallax layers

`components/ParallaxLayer.tsx` is the decorative depth primitive. `Plate` uses it automatically when given an `index` prop, rendering a soft wash plus an oversized watermark numeral that drift ~54px against the page as the section scrolls. It sits at `zIndex: -1` — above the plate's background but beneath in-flow content — so children need no wrapper or stacking fixes.

**Only ever wrap decoration in it.** Peer content drifting at different rates is exactly what made the two project cards read as misaligned, and the user called that out directly. `Shipped`'s per-phone drift is the one surviving exception, kept because it's an intentionally staggered collage rather than items that should align.

A repeating pattern (like `.blueprint-dot`) is a *useless* parallax layer — shifting a 32px grid by a multiple of its period is invisible. Use structured shapes.

**Rejected:** a continuous "spine" rail drawn down the whole page with a chapter marker per section, blended via `mix-blend-mode: difference` so it inverted over ink plates. It was built and worked, but the user found the hairline at the left edge unwanted and had it removed. Don't re-propose it. Scroll position is already communicated by `ScrollHUD` and the nav's progress hairline.

### Global overlays (`components/`)

- `SmoothScroll` — lenis (`autoRaf`, `anchors: true`); disabled under `prefers-reduced-motion`. `scroll-behavior: smooth` CSS must stay off while lenis is active (handled in globals.css)
- `Nav` — pill condenses past `scrollY > vh/4`, hides on scroll-down, and **probes the `[data-tone]` plate under `y = 42px` on every scroll frame to invert itself over ink plates**
- `ScrollHUD` — fixed bottom-left chapter readout; renders white through `mix-blend-mode: difference` so it inverts against any plate on its own. Hidden over the hero and again past 96% depth (the footer wordmark occupies the same corner)
- `HeroField` — 2D canvas: three families of drifting hairlines plus a sweep. Parks itself when the tab is hidden or the hero scrolls out of view; renders one static frame under reduced motion

### Sections (`components/sections/`)

All `"use client"`, Framer Motion `whileInView` + `viewport={{ once: true }}` reveals. `Shipped` phones and `FeaturedProjects`' second card have scrubbed parallax via `useScroll`/`useTransform`.

- `Shipped` — a **two-slide carousel** (Courtsy, Regia) with tabs, arrows, drag-to-swipe and autoplay. Autoplay is held while hovered or focused, while the lightbox is open, while the section is off-screen, and entirely under `prefers-reduced-motion`. The stage has a `minHeight` because `AnimatePresence mode="wait"` would otherwise collapse it between slides. Courtsy's screenshots live at `public/apps/courtsy/screen-{1-5}.png`; its lightbox is `position: fixed` and escapes via `createPortal(document.body)` — the slide wrapper is a transformed ancestor, so this is load-bearing
- `components/RegiaScreens.tsx` — Regia has no screenshots, no deployed URL, and its only live install is a client's production database with real customer names in it. So its UI is **drawn in code**: `BookingLedger`, `RegiaDashboard`, `RegiaCalendar`. Numbers are invented, structure follows the documented feature set, everything is `aria-hidden`. Shared by the Shipped carousel and `/regia`. Keep the "Illustrative interface" caption on `/regia` if you add more of these
- `Contact` — form submission logs to console and shows a success state; no email service wired yet

### CTA intent (`lib/intent.ts`)

A CTA can tell the Contact form why the visitor arrived, so the enquiry lands labelled rather than blank. Two routes in, because there are two kinds of caller:

- **Same page** — the hero's "Request a Consultation" jumps to `#contact` *and* dispatches a `nixe:intent` event. Hero and Contact are siblings under a server component, so a one-line event beats threading a context provider through the page for one string.
- **Another page** — `/regia`'s demo buttons link to `/?intent=regia#contact`. An event cannot survive a navigation, so `readIntentFromUrl()` picks it up on mount. Unknown values are rejected against a whitelist.

Consequences to keep in mind: the Intent `<select>` is **controlled** (unlike the other fields, which are uncontrolled with `onChange`) because it has to reflect a value set from outside. `IntentValue` and its `VALID` list in `lib/intent.ts` must stay in sync with the `<option value>` list. `Button` passes `onClick` through on the `href` branch too — it runs alongside navigation, it does not block it.

### Product pages

`/courtsy` and `/clavis` predate the plate system and still use their own bespoke styling. **`/regia` is built on the plate system** (`Plate`/`PlateInner`/`SectionHead`/`Button` + `--tone-*`), which is the direction for any new product page.

Regia is the venue-management product seeded by the `smb-hall-management` build (in `NIXE/External Projects/SMB`). Two things about its copy are deliberate and must not be "corrected":
- **The client is never named.** It says "a marriage hall in Tamil Nadu", not Sri Murugan Bhavan. The user chose to anonymise them.
- **Regia has no logo asset.** The homepage card and the page both render the name as type (the `browser` icon kind falls back to a typographic wordmark when `iconSrc` is absent). Don't invent a logo file.

## Known leftovers

`data-cursor-hover` attributes remain in `WaitlistButton.tsx`, `ClavisWaitlistButton.tsx` and the `/clavis` + `/courtsy` pages. The custom `Cursor` component that consumed them was removed, so they are inert — harmless, but not worth adding to new markup.

## Pending work

- Wire contact form to an email service (Resend recommended for Next.js)
- Add real App Store URL for Courtsy (currently shows "Coming Soon")
- Configure deployment target (Vercel recommended)
- Domain: `nixe.in`
