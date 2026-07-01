import { lazy, Suspense, useEffect, useState } from 'react'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Sections from './components/Sections'
import WhatsAppButton from './components/WhatsAppButton'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { setTargetShape } from './lib/morphStore'
import { NAV_ITEMS, SECTION_SHAPES } from './data/site'

// The canvas layer is code-split so the animation engine loads lazily behind
// the branded loader; the DOM content is always available immediately.
const ParticleField = lazy(() => import('./components/ParticleField'))

// Rough capability gate for the particle budget passed to the canvas.
function detectQuality() {
  const cores = navigator.hardwareConcurrency || 4
  const mem = navigator.deviceMemory || 4
  if (cores <= 2 || mem <= 2) return 0.55
  if (window.innerWidth < 768) return 0.75
  return 1
}

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const [activeId, setActiveId] = useState('hero')

  // Smooth-scroll navigation (native scroll-behavior handles the easing; GSAP's
  // ScrollToPlugin takes over when the motion layer is active).
  const go = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
    setActiveId(id)
  }

  // ---- Motion layer: shape switching, reveals, nav active state ----------
  useEffect(() => {
    if (reducedMotion) return
    document.documentElement.classList.add('js-motion')

    let ctx
    let cleanup = () => {}
    let cancelled = false

    Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/ScrollToPlugin')]).then(
      ([{ gsap }, { ScrollTrigger }, { ScrollToPlugin }]) => {
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

        ctx = gsap.context(() => {
          // Per-section: drive the canvas target shape + active nav id.
          NAV_ITEMS.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (!el) return
            const shape = SECTION_SHAPES[id] || 'grating'
            ScrollTrigger.create({
              trigger: el,
              start: 'top center',
              end: 'bottom center',
              onToggle: (self) => {
                if (self.isActive) {
                  setTargetShape(shape)
                  setActiveId(id)
                }
              },
            })
          })

          // Cinematic fade + slide-up entrance for every .reveal block.
          gsap.utils.toArray('.reveal').forEach((el) => {
            gsap.fromTo(
              el,
              { opacity: 0, y: 28 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%', once: true },
              },
            )
          })
        })

        ScrollTrigger.refresh()
        cleanup = () => ctx && ctx.revert()
      },
    )

    return () => {
      cancelled = true
      cleanup()
      document.documentElement.classList.remove('js-motion')
    }
  }, [reducedMotion])

  // ---- Reduced-motion / no-canvas static layout -------------------------
  if (reducedMotion) {
    return (
      <div className="min-h-screen">
        {/* Calm static gradient stands in for the particle field */}
        <div
          className="blueprint-grid fixed inset-0 -z-10"
          style={{
            background:
              'radial-gradient(1200px 600px at 50% 15%, rgba(30,58,110,0.55), transparent 60%), radial-gradient(800px 500px at 80% 80%, rgba(232,119,34,0.12), transparent 60%), #081429',
          }}
        />
        <Nav activeId={activeId} onNavigate={go} />
        <Sections go={go} reduced />
        <WhatsAppButton />
      </div>
    )
  }

  // ---- Full cinematic layout --------------------------------------------
  return (
    <div className="min-h-screen">
      <Loader />
      {/* Static base gradient sits under the canvas for depth + graceful load */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1100px 600px at 50% 10%, rgba(30,58,110,0.5), transparent 60%), #081429',
        }}
      />
      <Suspense fallback={null}>
        <ParticleField quality={detectQuality()} />
      </Suspense>
      <Nav activeId={activeId} onNavigate={go} />
      <Sections go={go} reduced={false} />
      <WhatsAppButton />
    </div>
  )
}
