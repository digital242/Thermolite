import { useMemo, useState } from 'react'
import { CONFIG, BRAND } from '../data/site'

// Interactive "build your own grating" configurator with a live rendered panel.
// Visitors set length / width (mm), mesh and bar height; the panel drawing,
// weight, UDL, area and aspect ratio update instantly, and a CTA prefills a
// WhatsApp / email enquiry with the exact specification.

const LENGTH = { min: 500, max: 6000, step: 25 }
const WIDTH = { min: 300, max: 1500, step: 25 }

// Visual cell pitch (mm) per mesh — controls how many cells the preview draws.
const PITCH = {
  '38x38': { x: 70, y: 70 },
  '38x75': { x: 112, y: 70 },
  '19x19': { x: 42, y: 42 },
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v))
}

function Stepper({ label, value, set, cfg, unit = 'mm' }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-bone-100/50">{label}</p>
      <div className="flex items-stretch overflow-hidden rounded-xl border border-navy-700/60 bg-navy-900/40">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => set(clamp(value - cfg.step, cfg.min, cfg.max))}
          className="px-4 text-xl font-semibold text-bone-100/70 transition-colors hover:bg-navy-800 hover:text-ember-400"
        >
          −
        </button>
        <div className="flex flex-1 items-center justify-center gap-1 border-x border-navy-800">
          <input
            type="number"
            value={value}
            aria-label={label}
            onChange={(e) => set(Math.min(cfg.max, parseInt(e.target.value || '0', 10) || 0))}
            onBlur={(e) => set(clamp(parseInt(e.target.value || '0', 10) || cfg.min, cfg.min, cfg.max))}
            className="w-20 bg-transparent py-3 text-center font-display text-xl font-semibold text-bone-100 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-xs text-bone-100/50">{unit}</span>
        </div>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => set(clamp(value + cfg.step, cfg.min, cfg.max))}
          className="px-4 text-xl font-semibold text-bone-100/70 transition-colors hover:bg-navy-800 hover:text-ember-400"
        >
          +
        </button>
      </div>
    </div>
  )
}

function Toggle({ label, options, value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-bone-100/50">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={o.value === value}
            onClick={() => onChange(o.value)}
            className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors ${
              o.value === value
                ? 'border-ember-500 bg-ember-500 text-navy-950'
                : 'border-navy-700/60 bg-navy-900/40 text-bone-100/70 hover:border-navy-600'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Stat({ label, children }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-bone-100/45">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold text-bone-100">{children}</p>
    </div>
  )
}

// Live SVG rendering of the grating panel with dimension annotations.
function GratingPreview({ length, width, meshId }) {
  const pitch = PITCH[meshId]
  const cols = clamp(Math.round(length / pitch.x), 5, 34)
  const rows = clamp(Math.round(width / pitch.y), 4, 26)

  const maxW = 470
  const maxH = 330
  const aspect = length / width
  let drawW = maxW
  let drawH = maxW / aspect
  if (drawH > maxH) {
    drawH = maxH
    drawW = maxH * aspect
  }

  const mL = 54
  const mT = 34
  const svgW = mL + drawW + 18
  const svgH = mT + drawH + 22

  const cellW = drawW / cols
  const cellH = drawH / rows
  const gap = Math.max(1.4, Math.min(cellW, cellH) * 0.2)
  const r = Math.min(cellW, cellH) * 0.22

  const cells = []
  for (let ry = 0; ry < rows; ry++) {
    for (let cx = 0; cx < cols; cx++) {
      cells.push(
        <rect
          key={`${ry}-${cx}`}
          x={mL + cx * cellW + gap / 2}
          y={mT + ry * cellH + gap / 2}
          width={cellW - gap}
          height={cellH - gap}
          rx={r}
          fill="url(#cellGrad)"
        />,
      )
    }
  }

  const dim = 'rgba(245,245,240,0.4)'
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="h-auto w-full" role="img" aria-label={`Grating panel ${length} by ${width} millimetres`}>
      <defs>
        <linearGradient id="cellGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a4d8f" />
          <stop offset="1" stopColor="#1e3a6e" />
        </linearGradient>
      </defs>

      {/* panel base */}
      <rect x={mL - 4} y={mT - 4} width={drawW + 8} height={drawH + 8} rx="10" fill="#0b1c39" stroke="#e87722" strokeWidth="2" />
      {cells}

      {/* top dimension (length) */}
      <line x1={mL} y1={mT - 16} x2={mL + drawW} y2={mT - 16} stroke={dim} strokeWidth="1" />
      <line x1={mL} y1={mT - 20} x2={mL} y2={mT - 12} stroke={dim} strokeWidth="1" />
      <line x1={mL + drawW} y1={mT - 20} x2={mL + drawW} y2={mT - 12} stroke={dim} strokeWidth="1" />
      <text x={mL + drawW / 2} y={mT - 22} textAnchor="middle" fontSize="12" fill="#f5f5f0">
        {length} mm
      </text>

      {/* left dimension (width) */}
      <line x1={mL - 18} y1={mT} x2={mL - 18} y2={mT + drawH} stroke={dim} strokeWidth="1" />
      <line x1={mL - 22} y1={mT} x2={mL - 14} y2={mT} stroke={dim} strokeWidth="1" />
      <line x1={mL - 22} y1={mT + drawH} x2={mL - 14} y2={mT + drawH} stroke={dim} strokeWidth="1" />
      <text
        x={mL - 26}
        y={mT + drawH / 2}
        textAnchor="middle"
        fontSize="12"
        fill="#f5f5f0"
        transform={`rotate(-90 ${mL - 26} ${mT + drawH / 2})`}
      >
        {width} mm
      </text>
    </svg>
  )
}

export default function GratingConfigurator() {
  const [length, setLength] = useState(2440)
  const [width, setWidth] = useState(1220)
  const [meshId, setMeshId] = useState('38x38')
  const [depth, setDepth] = useState('38')
  const [color, setColor] = useState(CONFIG.colors[0])

  const mesh = CONFIG.meshes.find((m) => m.id === meshId)
  const activeDepth = mesh.depths.includes(depth) ? depth : mesh.depths[0]

  const derived = useMemo(() => {
    const area = (length / 1000) * (width / 1000)
    const spec = CONFIG.specs[`${meshId}|${activeDepth}`]
    const panelWeight = spec ? +(spec.weight * area).toFixed(1) : null
    const aspect = +(length / width).toFixed(2)
    return { area: +area.toFixed(2), spec, panelWeight, aspect }
  }, [length, width, meshId, activeDepth])

  const summary =
    `Thermolite grating — ${length} × ${width} mm, Mesh ${mesh.label}, ` +
    `Bar height ${activeDepth} mm, Colour ${color}` +
    (derived.spec ? ` (~${derived.spec.weight} Kg/sqm, UDL ${derived.spec.udl} Kg/sqm, ≈${derived.panelWeight} kg/panel).` : '.')

  const waHref = `https://wa.me/${BRAND.phoneHref.replace('+', '')}?text=${encodeURIComponent(
    'Hi Thermolite, I would like a quote for this configuration: ' + summary,
  )}`
  const mailHref = `mailto:${BRAND.email}?subject=${encodeURIComponent('Grating configuration enquiry')}&body=${encodeURIComponent(summary)}`

  return (
    <div className="reveal grid gap-8 rounded-3xl border border-navy-700/50 bg-navy-950/60 p-6 backdrop-blur-md sm:p-8 lg:grid-cols-2">
      {/* ---- Controls ---- */}
      <div>
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-700 font-display text-sm font-bold text-bone-100">
            01
          </span>
          <h3 className="font-display text-xl font-semibold text-bone-100">Configure your grating</h3>
        </div>

        <div className="space-y-5">
          <Stepper label="Length" value={length} set={setLength} cfg={LENGTH} />
          <Stepper label="Width" value={width} set={setWidth} cfg={WIDTH} />
          <Toggle
            label="Mesh / pitch"
            value={meshId}
            onChange={setMeshId}
            options={CONFIG.meshes.map((m) => ({ value: m.id, label: m.label }))}
          />
          <Toggle
            label="Bar height"
            value={activeDepth}
            onChange={setDepth}
            options={mesh.depths.map((d) => ({ value: d, label: `${d} mm` }))}
          />
          <Toggle
            label="Colour"
            value={color}
            onChange={setColor}
            options={CONFIG.colors.map((c) => ({ value: c, label: c }))}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-5 border-t border-dashed border-navy-700/60 pt-6">
          <Stat label="Overall size">
            {length} × {width} <span className="text-sm text-bone-100/50">mm</span>
          </Stat>
          <Stat label="Panel area">
            {derived.area} <span className="text-sm text-bone-100/50">m²</span>
          </Stat>
          <Stat label="Weight / sqm">
            {derived.spec ? derived.spec.weight : '—'} <span className="text-sm text-bone-100/50">Kg</span>
          </Stat>
          <Stat label="UDL capacity">
            {derived.spec ? derived.spec.udl : '—'} <span className="text-sm text-bone-100/50">Kg/sqm</span>
          </Stat>
          <Stat label="Weight / panel">
            {derived.panelWeight != null ? `≈ ${derived.panelWeight}` : '—'}{' '}
            <span className="text-sm text-bone-100/50">kg</span>
          </Stat>
          <Stat label="Aspect ratio">
            {derived.aspect} <span className="text-sm text-bone-100/50">: 1</span>
          </Stat>
        </div>
      </div>

      {/* ---- Live preview + CTA ---- */}
      <div className="flex flex-col">
        <div className="rounded-2xl border border-navy-700/40 bg-gradient-to-br from-navy-900/50 to-navy-950/70 p-5">
          <GratingPreview length={length} width={width} meshId={meshId} />
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl bg-ember-500 px-5 py-3.5 text-center font-semibold text-navy-950 transition-transform hover:scale-[1.02]"
          >
            Request this spec
          </a>
          <a
            href={mailHref}
            className="flex-1 rounded-xl border border-navy-600 px-5 py-3.5 text-center text-sm font-semibold text-bone-100 transition-colors hover:border-ember-500 hover:text-ember-400"
          >
            Email these details
          </a>
        </div>
      </div>
    </div>
  )
}
