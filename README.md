# Thermolite — Scrollytelling Website (v1, 2D Canvas)

A premium, cinematic single-page site for **Thermolite GRP/FRP Gratings by
Thermodrain** (Thermoset Poly Products (I) Pvt. Ltd.). Dark, glowing,
scroll-driven aesthetic — the same visual language as high-end WebGL launches —
built on a **lightweight 2D Canvas + GSAP** stack instead of Three.js/WebGL so
load times stay fast, the DOM stays crawlable, and the build stays reliable.

## Stack

- **React + Vite**
- **HTML5 Canvas 2D** particle system (`requestAnimationFrame`, no WebGL/GLSL)
- **GSAP + ScrollTrigger** for scroll-synced choreography (lazy-loaded)
- **Tailwind CSS v4** for layout/typography
- All content is **real DOM text** — the canvas is purely decorative

## Getting started

```bash
npm install
npm run dev      # dev server
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## How the particle morph works

- `src/lib/shapes.js` — generators that plot each **target layout** (grating
  mesh → exploded rib cross-section → rising load bars → grid of panels →
  certification seal → dispersed) as an array of `{x, y, alpha}` points,
  resampled so particle _i_ has a stable target in every state.
- `src/lib/morphStore.js` — a tiny, dependency-free store holding the current
  `from`/`to` shape and a blend factor `t`. Sections call `setTargetShape()`.
- `src/components/ParticleField.jsx` — the reusable canvas engine. Each frame it
  lerps between the two target shapes by `t`, damps every particle toward its
  target, adds sine-based idle drift and gentle mouse parallax, and draws with
  `shadowBlur` + additive compositing to fake the ember glow. Particle count is
  gated by `hardwareConcurrency` / viewport width.
- `src/App.jsx` — lazy-loads GSAP, wires one `ScrollTrigger` per section to
  drive the target shape + active nav tab, and runs the fade/slide-up reveals.

## Brand palette

| Token | Hex | Use |
| --- | --- | --- |
| `navy-950` | `#081429` | Page background |
| `navy-700` | `#1e3a6e` | Primary brand navy |
| `ember-500` | `#e87722` | Energy / glow accent |
| `bone-100` | `#f5f5f0` | Text / particle highlights |

## Performance & accessibility

- **Lazy-loaded** GSAP + canvas chunks behind a branded loader; DOM content
  paints immediately.
- **Device-gated** particle budget (fewer on mobile / low-core devices).
- **Visibility-paused** rAF loop when the tab is hidden.
- **`prefers-reduced-motion`**: no canvas at all — a calm static gradient plus
  fully-visible content, with load figures rendered at their final values.
- Every spec, table, certification and contact detail exists as crawlable text.
