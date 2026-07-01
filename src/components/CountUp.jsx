import { useEffect, useRef, useState } from 'react'

// Counts a number up from 0 to `value` the first time it scrolls into view.
// Uses IntersectionObserver + rAF (no GSAP dependency here). When `reduced` is
// true it renders the final value immediately with no animation.
export default function CountUp({ value, decimals = 0, duration = 1400, reduced = false }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(reduced ? value : 0)

  useEffect(() => {
    if (reduced) {
      setDisplay(value)
      return
    }
    const el = ref.current
    let raf = 0
    let started = false

    const run = () => {
      // Anchor t0 to the first rAF frame so we compare timestamps from the same
      // clock — mixing performance.now() with the rAF timestamp can yield a
      // negative delta on the first frame and briefly show negative numbers.
      let t0 = null
      const tick = (now) => {
        if (t0 === null) t0 = now
        const p = Math.min(1, Math.max(0, (now - t0) / duration))
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3)
        setDisplay(value * eased)
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true
          run()
          io.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    if (el) io.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [value, duration, reduced])

  return <span ref={ref}>{display.toFixed(decimals)}</span>
}
