import { useEffect, useState } from 'react'
import Logo from './Logo'

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
      <div className="ember-pulse">
        <Logo className="text-3xl sm:text-4xl" tagline />
      </div>
      <p className="mt-6 text-xs tracking-[0.4em] text-navy-600">INITIALISING</p>
    </div>
  )
}
