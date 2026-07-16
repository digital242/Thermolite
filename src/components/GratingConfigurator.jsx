import { useMemo, useState } from 'react'
import { CONFIG, BRAND } from '../data/site'
import { ProfileIcon } from './Icons'

// Interactive "build your own grating" configurator. Visitors pick mesh, depth,
// panel size and colour; weight / UDL update live and a CTA prefills a WhatsApp
// or email enquiry with the exact chosen specification.
function Choice({ label, selected, onClick, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-xl border px-4 py-3 text-left transition-colors ${
        selected
          ? 'border-ember-500 bg-ember-500/15 text-bone-100'
          : 'border-navy-700/60 bg-navy-900/40 text-bone-100/70 hover:border-navy-600'
      }`}
    >
      <span className="block font-display text-sm font-semibold">{label}</span>
      {sub && <span className="mt-0.5 block text-xs text-bone-100/50">{sub}</span>}
    </button>
  )
}

export default function GratingConfigurator() {
  const [meshId, setMeshId] = useState('38x38')
  const [depth, setDepth] = useState('25')
  const [panelId, setPanelId] = useState('1220x3660')
  const [color, setColor] = useState(CONFIG.colors[0])

  const mesh = CONFIG.meshes.find((m) => m.id === meshId)
  const panel = CONFIG.panels.find((p) => p.id === panelId)

  // Keep depth valid when the mesh changes (some meshes have fewer depths).
  const activeDepth = mesh.depths.includes(depth) ? depth : mesh.depths[0]

  const result = useMemo(() => {
    const spec = CONFIG.specs[`${meshId}|${activeDepth}`]
    if (!spec) return null
    const panelWeight = panel.area ? +(spec.weight * panel.area).toFixed(1) : null
    return { ...spec, panelWeight }
  }, [meshId, activeDepth, panel])

  const summary =
    `Thermolite grating enquiry — Mesh ${mesh.label}, Depth ${activeDepth} mm, ` +
    `Panel ${panel.label}, Colour ${color}` +
    (result ? ` (~${result.weight} Kg/sqm, UDL ${result.udl} Kg/sqm).` : '.')

  const waHref = `https://wa.me/${BRAND.phoneHref.replace('+', '')}?text=${encodeURIComponent(
    'Hi Thermolite, I would like a quote for this configuration: ' + summary,
  )}`
  const mailHref = `mailto:${BRAND.email}?subject=${encodeURIComponent(
    'Grating configuration enquiry',
  )}&body=${encodeURIComponent(summary)}`

  return (
    <div className="reveal grid gap-6 rounded-3xl border border-navy-700/50 bg-navy-950/60 p-6 backdrop-blur-md sm:p-8 lg:grid-cols-[1.4fr_1fr]">
      {/* ---- Controls ---- */}
      <div className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bone-100/50">
            1 · Mesh / pitch
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {CONFIG.meshes.map((m) => (
              <Choice
                key={m.id}
                label={m.label}
                sub={m.note}
                selected={m.id === meshId}
                onClick={() => setMeshId(m.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bone-100/50">
            2 · Bar depth
          </p>
          <div className="flex flex-wrap gap-3">
            {mesh.depths.map((d) => (
              <Choice
                key={d}
                label={`${d} mm`}
                selected={d === activeDepth}
                onClick={() => setDepth(d)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bone-100/50">
            3 · Panel size
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {CONFIG.panels.map((p) => (
              <Choice
                key={p.id}
                label={p.label}
                selected={p.id === panelId}
                onClick={() => setPanelId(p.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-bone-100/50">
            4 · Colour
          </p>
          <div className="flex flex-wrap gap-3">
            {CONFIG.colors.map((c) => (
              <Choice key={c} label={c} selected={c === color} onClick={() => setColor(c)} />
            ))}
          </div>
        </div>
      </div>

      {/* ---- Live result ---- */}
      <div className="flex flex-col rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/70 to-navy-950/80 p-6">
        <div className="flex items-center justify-between">
          <p className="font-display text-sm font-semibold text-ember-400">Your configuration</p>
          <ProfileIcon depth={+activeDepth} />
        </div>

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between border-b border-navy-800 pb-2">
            <dt className="text-bone-100/60">Mesh</dt>
            <dd className="font-medium text-bone-100">{mesh.label}</dd>
          </div>
          <div className="flex justify-between border-b border-navy-800 pb-2">
            <dt className="text-bone-100/60">Depth</dt>
            <dd className="font-medium text-bone-100">{activeDepth} mm</dd>
          </div>
          <div className="flex justify-between border-b border-navy-800 pb-2">
            <dt className="text-bone-100/60">Panel</dt>
            <dd className="font-medium text-bone-100">{panel.label}</dd>
          </div>
          <div className="flex justify-between border-b border-navy-800 pb-2">
            <dt className="text-bone-100/60">Weight</dt>
            <dd className="font-semibold text-ember-400">{result ? `${result.weight} Kg/sqm` : '—'}</dd>
          </div>
          <div className="flex justify-between border-b border-navy-800 pb-2">
            <dt className="text-bone-100/60">UDL capacity</dt>
            <dd className="font-semibold text-ember-400">{result ? `${result.udl} Kg/sqm` : '—'}</dd>
          </div>
          {result?.panelWeight != null && (
            <div className="flex justify-between">
              <dt className="text-bone-100/60">Weight / panel</dt>
              <dd className="font-medium text-bone-100">≈ {result.panelWeight} kg</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-ember-500 px-5 py-3 text-center font-semibold text-navy-950 transition-transform hover:scale-[1.02]"
          >
            Request this spec
          </a>
          <a
            href={mailHref}
            className="rounded-xl border border-navy-600 px-5 py-3 text-center text-sm font-semibold text-bone-100 transition-colors hover:border-ember-500 hover:text-ember-400"
          >
            Email these details
          </a>
        </div>
      </div>
    </div>
  )
}
