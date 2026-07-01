import { useEffect, useRef } from 'react'
import { buildShapes } from '../lib/shapes'
import { morphState } from '../lib/morphStore'

// Reusable 2D-canvas particle system. Reads the shared morphStore each frame and
// eases every particle toward the currently-targeted shape, so it works as a
// fixed decorative backdrop while DOM content scrolls over it.
//
// Props:
//   accept a `quality` hint (0.5–1) to scale particle count on weaker devices.
export default function ParticleField({ quality = 1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })

    let width = 0
    let height = 0
    let dpr = 1
    let N = 0
    let shapes = null
    let particles = []
    let raf = 0
    let running = true

    // Pointer parallax (eased toward the real cursor for a gentle tilt).
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }

    // Device-capability gate: fewer particles on small screens / low core counts.
    function targetCount() {
      const cores = navigator.hardwareConcurrency || 4
      const mobile = window.innerWidth < 768
      let base
      if (mobile) base = 380
      else if (window.innerWidth < 1280) base = 620
      else base = 820
      if (cores <= 4) base *= 0.7
      return Math.round(base * quality)
    }

    function makeParticles() {
      N = targetCount()
      shapes = buildShapes(N, width, height)
      const start = shapes[morphState.to] || shapes.grating
      particles = new Array(N)
      for (let i = 0; i < N; i++) {
        const s = start[i]
        particles[i] = {
          x: s.x,
          y: s.y,
          phase: Math.random() * Math.PI * 2,
          driftAmp: 3 + Math.random() * 5,
          driftSpeed: 0.4 + Math.random() * 0.7,
          size: Math.random() < 0.16 ? 2.2 : 1.3 + Math.random() * 0.9,
          // ~18% warm-white highlight particles, the rest ember-orange.
          highlight: Math.random() < 0.18,
        }
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      makeParticles()
    }

    function onPointerMove(e) {
      mouse.tx = (e.clientX / width - 0.5) * 2
      mouse.ty = (e.clientY / height - 0.5) * 2
    }

    let t0 = performance.now()
    function frame(now) {
      if (!running) return
      const time = (now - t0) / 1000
      raf = requestAnimationFrame(frame)

      // ease parallax
      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05
      const parX = mouse.x * 22
      const parY = mouse.y * 16

      const from = shapes[morphState.from] || shapes.grating
      const to = shapes[morphState.to] || shapes.grating
      const bt = morphState.t

      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'

      for (let i = 0; i < N; i++) {
        const a = from[i]
        const b = to[i]
        const tx = a.x + (b.x - a.x) * bt
        const ty = a.y + (b.y - a.y) * bt
        const talpha = a.alpha + (b.alpha - a.alpha) * bt

        const p = particles[i]
        // damped move toward morph target
        p.x += (tx - p.x) * 0.09
        p.y += (ty - p.y) * 0.09

        // ambient idle drift (sine-based, no physics)
        const dx = Math.sin(time * p.driftSpeed + p.phase) * p.driftAmp
        const dy = Math.cos(time * p.driftSpeed * 0.8 + p.phase) * p.driftAmp * 0.7

        const px = p.x + dx + parX * (p.highlight ? 1.3 : 1)
        const py = p.y + dy + parY * (p.highlight ? 1.3 : 1)

        const alpha = Math.max(0, Math.min(1, talpha))
        ctx.globalAlpha = alpha
        ctx.shadowBlur = p.highlight ? 10 : 8
        ctx.shadowColor = p.highlight ? '#f7a962' : '#e87722'
        ctx.fillStyle = p.highlight ? '#f5f5f0' : '#e87722'
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      ctx.globalCompositeOperation = 'source-over'
    }

    function start() {
      if (running) return
      running = true
      t0 = performance.now()
      raf = requestAnimationFrame(frame)
    }
    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }

    function onVisibility() {
      if (document.hidden) stop()
      else start()
    }

    resize()
    running = true
    raf = requestAnimationFrame(frame)

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [quality])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  )
}
