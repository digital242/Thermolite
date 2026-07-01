// Particle target-shape generators.
//
// Each generator returns an array of candidate points {x, y, alpha} in *pixel*
// space for a given canvas width/height. `buildShapes` then resamples every
// shape to exactly N points so particle `i` has a stable target in every state
// and can be linearly interpolated (morphed) between them.

// Tiny deterministic RNG so shapes are identical every rebuild/resize frame.
function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Resample an arbitrary-length candidate list to exactly N points.
function resample(points, n) {
  const out = new Array(n)
  const len = points.length
  for (let i = 0; i < n; i++) {
    out[i] = points[Math.floor((i * len) / n) % len]
  }
  return out
}

function frame(w, h) {
  // Shapes are composed in an upper-middle band so DOM content sits below.
  const cx = w / 2
  const cy = h * (w < 720 ? 0.4 : 0.44)
  const s = Math.min(w * 0.34, h * 0.42, 380)
  return { cx, cy, s }
}

// ---- State 1 & idle: single FRP grating panel (crosshatch mesh) ------------
function grating(w, h) {
  const { cx, cy, s } = frame(w, h)
  const pts = []
  const hw = s
  const hh = s * 0.66
  const lines = 8
  const density = 26
  // slight isometric skew so the flat panel reads with depth
  const skew = 0.26
  for (let c = 0; c <= lines; c++) {
    const gx = -hw + (2 * hw * c) / lines
    for (let d = 0; d <= density; d++) {
      const gy = -hh + (2 * hh * d) / density
      pts.push({ x: cx + gx + gy * skew, y: cy + gy * 0.62, alpha: 1 })
    }
  }
  for (let r = 0; r <= lines; r++) {
    const gy = -hh + (2 * hh * r) / lines
    for (let d = 0; d <= density; d++) {
      const gx = -hw + (2 * hw * d) / density
      pts.push({ x: cx + gx + gy * skew, y: cy + gy * 0.62, alpha: 1 })
    }
  }
  return pts
}

// ---- State 2: exploded rib / cross-section comb ----------------------------
function rib(w, h) {
  const { cx, cy, s } = frame(w, h)
  const pts = []
  const hw = s * 1.05
  const ribCount = 9
  const depth = s * 0.5
  const skew = 0.4
  // top & bottom chords
  for (let d = 0; d <= 60; d++) {
    const gx = -hw + (2 * hw * d) / 60
    pts.push({ x: cx + gx, y: cy - depth * 0.5 + gx * 0.04, alpha: 1 })
    pts.push({ x: cx + gx + depth * skew, y: cy + depth * 0.5 + gx * 0.04, alpha: 0.85 })
  }
  // vertical ribs, slightly separated to read as an "exploded" section
  for (let rIdx = 0; rIdx <= ribCount; rIdx++) {
    const gx = -hw + (2 * hw * rIdx) / ribCount
    for (let d = 0; d <= 22; d++) {
      const t = d / 22
      const yy = cy - depth * 0.5 + depth * t + gx * 0.04
      pts.push({ x: cx + gx + depth * skew * t, y: yy, alpha: 1 })
    }
  }
  return pts
}

// ---- State 3: rising bar / stress visualisation ----------------------------
function bars(w, h) {
  const { cx, cy, s } = frame(w, h)
  const pts = []
  const count = 5
  const gap = (s * 2) / count
  const barW = gap * 0.44
  const baseY = cy + s * 0.62
  const maxH = s * 1.15
  for (let b = 0; b < count; b++) {
    const bx = cx - s + gap * b + gap * 0.5
    const bh = maxH * (0.22 + 0.78 * (b / (count - 1)))
    const cols = 4
    const rows = Math.max(6, Math.round(bh / 12))
    for (let ci = 0; ci < cols; ci++) {
      const px = bx - barW / 2 + (barW * ci) / (cols - 1)
      for (let ri = 0; ri < rows; ri++) {
        const py = baseY - (bh * ri) / (rows - 1)
        pts.push({ x: px, y: py, alpha: 0.6 + 0.4 * (ri / (rows - 1)) })
      }
    }
  }
  return pts
}

// ---- State 4: grid of small grating panels (applications) ------------------
function grid(w, h) {
  const { cx, cy, s } = frame(w, h)
  const pts = []
  const cols = w < 720 ? 2 : 3
  const rows = 2
  const cellW = (s * 2.1) / cols
  const cellH = (s * 1.35) / rows
  const startX = cx - (cellW * cols) / 2 + cellW / 2
  const startY = cy - (cellH * rows) / 2 + cellH / 2
  const pw = cellW * 0.68
  const ph = cellH * 0.62
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const px = startX + gx * cellW
      const py = startY + gy * cellH
      const n = 5
      for (let a = 0; a <= n; a++) {
        for (let b = 0; b <= 8; b++) {
          pts.push({ x: px - pw / 2 + (pw * a) / n, y: py - ph / 2 + (ph * b) / 8, alpha: 0.95 })
          pts.push({ x: px - pw / 2 + (pw * b) / 8, y: py - ph / 2 + (ph * a) / n, alpha: 0.95 })
        }
      }
    }
  }
  return pts
}

// ---- State 5: certification badge / seal -----------------------------------
function seal(w, h) {
  const { cx, cy, s } = frame(w, h)
  const pts = []
  const R = s * 0.92
  // outer ring
  for (let i = 0; i < 220; i++) {
    const a = (i / 220) * Math.PI * 2
    pts.push({ x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, alpha: 1 })
  }
  // inner ring
  for (let i = 0; i < 160; i++) {
    const a = (i / 160) * Math.PI * 2
    pts.push({ x: cx + Math.cos(a) * R * 0.74, y: cy + Math.sin(a) * R * 0.74, alpha: 0.85 })
  }
  // radial ticks (gear-like seal edge)
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2
    for (let t = 0; t < 5; t++) {
      const rr = R + t * (s * 0.03)
      pts.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr, alpha: 0.7 })
    }
  }
  // central check-mark
  const check = [
    [-0.3, 0.02],
    [-0.12, 0.24],
    [0.34, -0.26],
  ]
  for (let seg = 0; seg < 2; seg++) {
    const p0 = check[seg]
    const p1 = check[seg + 1]
    for (let t = 0; t <= 30; t++) {
      const k = t / 30
      pts.push({
        x: cx + (p0[0] + (p1[0] - p0[0]) * k) * R,
        y: cy + (p0[1] + (p1[1] - p0[1]) * k) * R,
        alpha: 1,
      })
    }
  }
  return pts
}

// ---- State 6: disperse outward & fade --------------------------------------
function disperse(w, h) {
  const rnd = mulberry32(9187)
  const pts = []
  for (let i = 0; i < 1400; i++) {
    const ang = rnd() * Math.PI * 2
    const rad = 0.2 + rnd() * 0.9
    pts.push({
      x: w / 2 + Math.cos(ang) * rad * w * 0.6,
      y: h * 0.44 + Math.sin(ang) * rad * h * 0.6,
      alpha: 0.12 + rnd() * 0.18,
    })
  }
  return pts
}

const GENERATORS = { grating, rib, bars, grid, seal, disperse }
export const SHAPE_ORDER = ['grating', 'rib', 'bars', 'grid', 'seal', 'disperse']

// Build every shape resampled to exactly N points for width/height w/h.
export function buildShapes(n, w, h) {
  const shapes = {}
  for (const key of SHAPE_ORDER) {
    shapes[key] = resample(GENERATORS[key](w, h), n)
  }
  return shapes
}
