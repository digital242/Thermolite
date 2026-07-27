# Build Prompt — Thermolite Scrollytelling Website

> Paste everything below into Claude Code (or any capable AI/dev) to rebuild
> this site from scratch. It is a complete, self-contained specification of the
> current build.

---

## 1. Goal & brand

Build a **premium, cinematic single-page website** for **Thermolite — GRP/FRP
Gratings by Thermodrain**, a product line of **Thermoset Poly Products (I) Pvt.
Ltd.** (Navi Mumbai, India). The site targets industrial B2B buyers — municipal
engineers, contractors, water-treatment and infrastructure firms — so **fast
load, crawlable text, and credibility** matter more than spectacle.

The aesthetic is dark, glowing, scroll-driven — the visual language of high-end
WebGL product launches — but achieved with a **lightweight 2D canvas**, not
Three.js, so it stays fast and reliable. The mood is "industrial energy," not
"crypto/Web3": keep the glow strictly in the **orange→amber** range.

## 2. Tech stack (hard requirements)

- **React 18 + Vite**
- **HTML5 Canvas 2D** for the particle system (`requestAnimationFrame`) — **no
  Three.js, no WebGL, no GLSL**
- **GSAP + ScrollTrigger + ScrollToPlugin** for scroll choreography, **lazy
  loaded** (dynamic `import()`), code-split into its own chunk
- **Tailwind CSS v4** via `@tailwindcss/vite` (tokens declared in `@theme`)
- **Fonts:** Space Grotesk (display/headings), Inter (body), via Google Fonts
- All content is **real, crawlable DOM text** — the canvas is purely decorative
  and `aria-hidden`

## 3. Brand palette & type (Tailwind `@theme` tokens)

```
--color-navy-950: #081429   /* page background (deep navy/near-black) */
--color-navy-900: #0b1c39
--color-navy-800: #12274d
--color-navy-700: #1e3a6e   /* primary brand navy */
--color-navy-600: #2a4d8f
--color-ember-500: #e87722  /* energy / glow accent (brand orange) */
--color-ember-400: #f28f45
--color-bone-100: #f5f5f0   /* warm off-white text / particle highlights */
--font-display: 'Space Grotesk'
--font-body: 'Inter'
```

## 4. Logo (component, not an image)

Recreate the wordmark as a scalable CSS/HTML component: **`THERM` + an orange
square-in-square "O" + `LITE`**, lettering in warm off-white so it reads on the
dark background (the original navy lettering is for light backgrounds). The "O"
is an ember-orange rounded-square outline with a filled ember square inside.
Optional **"GRP/FRP GRATINGS"** tagline beneath (wide letter-spacing). Use it in
the nav (compact), hero (large, fluid `clamp` size), loading screen, and footer.

## 5. Particle system (the centrepiece)

A **reusable `<ParticleField>` component**: a `position:fixed`, full-viewport,
`pointer-events:none` canvas behind the scrolling content (so it reads as
"pinned"). Behaviour:

- Particles are glowing ember dots (~18% warm-white highlights) that **morph
  between target shapes** as you scroll. Each shape is an array of `{x,y,alpha}`
  points, all resampled to exactly N points so particle *i* has a stable target
  in every state and can be linearly interpolated (morphed) between them.
- A shared **morph store** holds `from`/`to` shape + a blend factor `t` tweened
  ~600ms (dependency-free rAF tween, so GSAP stays out of the eager bundle).
  Each section's ScrollTrigger calls `setTargetShape(name)`.
- Per frame: interpolate `from→to` by `t`, **damp** each particle toward its
  target (frame-rate-independent damping), add **sine-based idle drift** and a
  gentle **mouse-parallax tilt** (skip parallax on touch/coarse pointers).
- **Glow via a pre-rendered radial-gradient sprite drawn with `drawImage`** and
  additive (`'lighter'`) compositing — **never per-particle `shadowBlur`** (too
  expensive on low-end devices).

### Target shapes (one per scroll state)

1. **grating** (hero/about/configure) — a **framed rectangular FRP grating
   panel**: bold perimeter frame + internal square-mesh grid, slight isometric
   tilt. Must clearly read as a grating product even at low particle counts.
2. **rib** (specs/profiles) — exploded rib / cross-section comb.
3. **bars** (load testing) — rising bar-chart of increasing height.
4. **grid** (applications/locations) — a grid of small grating panels.
5. **seal** (certifications) — a converging badge/seal ring with a check mark.
6. **disperse** (contact) — particles spread outward and fade.

### Performance tiers (critical)

Detect a device tier from `hardwareConcurrency`, `deviceMemory`, pointer type
and viewport, and **bias toward the lighter tier**. Each tier sets particle
count, FPS cap, max DPR and glow size:

```
low : count 120, fps 30, dpr 1,    glow 3.2, floor 60
mid : count 260, fps 40, dpr 1.35, glow 3.8, floor 120
high: count 460, fps 60, dpr 1.6,  glow 4.4, floor 180
```

Also: **cap the frame rate** (skip rAF frames past the interval), **clamp DPR**,
**pause the loop when the tab is hidden** (`visibilitychange`), and run an
**adaptive governor** — if measured frames run slow, trim the active particle
count (×0.7) down to the tier floor until it's smooth.

## 6. Sections (each a full-viewport pinned scroll state, all real DOM text)

Sticky/floating pill nav above the canvas with active-tab **ember highlight**;
clicking a nav item smooth-scrolls to that section. Every text block gets a
**cinematic fade + slide-up** entrance via GSAP ScrollTrigger (`.reveal`).

1. **Hero** — logo wordmark (fluid), subheading "GRP/FRP Gratings. Engineered
   for Every Load.", CTAs "Explore Products" + "Talk to Engineering".
2. **About / Material Science** — heading "Fiberglass that outlasts steel.",
   two paragraphs on the molded GRP/FRP matrix (NON-corrosive, will not
   rust/rot), and 4 highlight cards: Non-corrosive, Anti-slip, Lightweight,
   Non-conductive. **Do not mention resin.**
3. **Specifications** — full crawlable table with columns
   `Product | Mesh/Pitch | Depth | Weight (Kg/sqm) | UDL (Kg/sqm)`:
   - FRP Walkways Grating — 38×38 — 25mm — 18.5 — 500
   - FRP Grating 25mm — 38×38 — 25mm — 18.5 — 500
   - FRP Grating 30mm — 38×38 — 30mm — 22.0 — 750
   - FRP Grating 38mm — 38×38 — 38mm — 27.5 — 1200
   - FRP Heavy Grating — 38×75 — 25mm — 15.0 — 900
   - Mini Mesh Grating — 19×19 — 25mm — 24.0 — 400
   - Note: "Values are nominal for standard panels (1220×3660 mm and
     1220×4000 mm). Custom panel sizes are cut to order. UDL figures quoted at a
     working span of 1.0 m with a 3:1 safety factor."
4. **Profiles** — 5 variant cards with isometric SVG profile icons:
   38×75×25, 38×38×25, 38×38×30, 38×38×38, Mini Mesh — each with a short
   use-case description and spec line.
5. **Configure** — interactive grating configurator (see §7).
6. **Load Testing** — heading "From a footstep to five tons.", 5 cards of
   increasing height whose numbers **count up on scroll** (IntersectionObserver
   + rAF, easeOutCubic, anchor t0 to the first frame to avoid negative values):
   90 kg → 100 kg → 500 kg → 1.5 ton → 5 ton.
7. **Applications** — 4 cards with line-art SVG icons: Industrial Walkways &
   Platforms, Drainage & Trench Covers, Water & Effluent Treatment, Public &
   Commercial Realm.
8. **Locations We Serve** — grouped city lists (see §8).
9. **Certifications** — 3 badge cards with seal icons: BS EN 124, ISO 9001:2015,
   AASHTO H-20/H-25.
10. **Contact** — company card: **Thermoset Poly Products (I) Pvt. Ltd.**,
    phone **+91 70216 50820**, email **thermodrain@frpmanholecover.com**,
    location **CBD Belapur, Navi Mumbai**. Call / Email / WhatsApp CTAs.
11. **Footer** — logo + tagline, social links, head-office block, and a
    **Google Maps embed** of CBD Belapur. Plus a **floating WhatsApp button**
    fixed bottom-right on every screen.

## 7. Grating configurator (interactive)

A two-column card: controls left, **live rendered panel** right.

- **Controls:** Length (mm) and Width (mm) as −/+ **steppers** with a typeable
  numeric field (Length 500–6000, Width 300–1500, step 25); **Mesh/pitch**
  toggle (38×38 / 38×75 / 19×19); **Bar height** toggle (auto-limited to valid
  depths for the chosen mesh); **Colour** toggle (Safety Orange / Yellow / Dark
  Grey / Green).
- **Derived stats** (update live): Overall size, Panel area (m²), Weight/sqm,
  UDL capacity, Weight/panel (weight × area), Aspect ratio.
- **Live SVG drawing** of the grating panel: a grid of square mesh cells (cell
  count derived from dimensions ÷ mesh pitch), ember frame, and **dimension
  lines** annotating length (top) and width (left) in mm — redraws on every
  change.
- **CTA:** "Request this spec" / "Email these details" that **prefill a
  WhatsApp/email message with the full chosen specification.**

Weight/UDL lookup keyed by `mesh|depth`:
`38x38|25→18.5/500, 38x38|30→22/750, 38x38|38→27.5/1200,
38x75|25→15/900, 38x75|38→21/1500, 19x19|25→24/400`.

## 8. Locations

Section listing cities grouped by region — Maharashtra & West India, North
India, South India, East & Central India, and Export Markets — with a closing
"Don't see your city? …call +91 70216 50820" line. (Populate from the client's
own popular-locations list.)

## 9. Performance, accessibility & fallbacks

- **Lazy-load** the canvas + GSAP behind a **branded loading screen** (navy
  field, pulsing orange logo).
- **`prefers-reduced-motion`**: render **no canvas** — a calm static gradient
  background — with all content fully visible and count-up numbers shown at
  their final values immediately.
- Mobile-responsive: fluid hero wordmark, stacked configurator, no horizontal
  overflow; nav pill collapses to logo + "Get a Quote" on small screens.
- Semantic, crawlable HTML with real headings, a real `<table>`, and meta/OG
  tags for SEO.

## 10. Deployment & security (Netlify)

- `netlify.toml`: build `npm run build`, publish `dist`, Node 22, SPA redirect
  `/* → /index.html 200`.
- **Security headers** (also mirrored in `public/_headers` + `public/_redirects`
  so they apply on both connected-repo and manual dist-folder deploys):
  - **Content-Security-Policy**: `default-src 'self'`; `script-src 'self'`
    (no inline/eval); `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`;
    `font-src 'self' https://fonts.gstatic.com data:`; `img-src 'self' data: https:`;
    `frame-src https://www.google.com https://maps.google.com`;
    `object-src 'none'`; `base-uri 'self'`; `frame-ancestors 'self'`;
    `upgrade-insecure-requests`.
  - `Strict-Transport-Security`, `X-Frame-Options: SAMEORIGIN`,
    `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`
    (deny camera/mic/geolocation/payment), `Cross-Origin-Opener-Policy: same-origin`,
    `X-XSS-Protection: 0`.
  - Immutable long-cache for fingerprinted `/assets/*`.

## 11. Suggested file structure

```
index.html
netlify.toml
public/_headers, public/_redirects
src/
  main.jsx, App.jsx, index.css
  data/site.js                     # all content: BRAND, NAV_ITEMS,
                                    # SECTION_SHAPES, SPEC_TABLE, VARIANTS,
                                    # LOAD_STEPS, APPLICATIONS, CERTIFICATIONS,
                                    # CONFIG, LOCATIONS, MAP_EMBED, SOCIALS
  lib/shapes.js                    # target-shape generators + buildShapes(N,w,h)
  lib/morphStore.js                # from/to/t blend store + setTargetShape
  hooks/usePrefersReducedMotion.js
  components/
    ParticleField.jsx  Loader.jsx  Nav.jsx  Logo.jsx  WhatsAppButton.jsx
    Sections.jsx  CountUp.jsx  Icons.jsx  GratingConfigurator.jsx
```

## 12. Build order

1. Scaffold Vite + React + Tailwind v4; set up brand tokens and the Logo.
2. Build `<ParticleField>` as a reusable component that accepts a target-shape
   (start with the grating shape) — get glow, idle drift, parallax and the
   performance tiers right first.
3. Add the shape generators and wire the morph store.
4. Lay out all sections with real content data; wire one ScrollTrigger per
   section to drive its target shape + active nav tab + `.reveal` entrances.
5. Build the configurator with its live SVG panel.
6. Add loader, reduced-motion fallback, mobile polish.
7. Add `netlify.toml` + `_headers`/`_redirects` and deploy.
