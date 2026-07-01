import { useEffect, useState } from 'react'

// Lightweight branded loading screen shown while the animation layer boots.
// Navy field with a pulsing orange Thermolite mark; fades itself out.
export default function Loader() {
  const [gone, setGone] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!gone) return
    const t = setTimeout(() => setHidden(true), 650)
    return () => clearTimeout(t)
  }, [gone])

  if (hidden) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy-950 transition-opacity duration-[600ms] ${
        gone ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="ember-pulse mb-6 h-16 w-16 rounded-md bg-gradient-to-br from-ember-400 to-ember-500 shadow-[0_0_40px_rgba(232,119,34,0.7)]" />
      <p className="font-display text-lg font-semibold tracking-[0.35em] text-bone-100">
        THERMO<span className="text-ember-500">LITE</span>
      </p>
      <p className="mt-2 text-xs tracking-widest text-navy-600">INITIALISING</p>
    </div>
  )
}
