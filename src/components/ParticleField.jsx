import { useEffect, useRef } from 'react'
import { buildShapes } from '../lib/shapes'
import { morphState } from '../lib/morphStore'

// Reusable 2D-canvas particle system. Reads the shared morphStore each frame and
// eases every particle toward the currently-targeted shape, so it works as a
// fixed decorative backdrop while DOM content scrolls over it.
//
// Performance-first design for low-end devices:
//   • glow is a PRE-RENDERED sprite drawn via drawImage — no per-particle
//     shadowBlur (the single most expensive Canvas 2D op) each frame.
//   • particle count, FPS cap and device-pixel-ratio all scale by device tier.
//   • morph damping is frame-rate independent, so 30fps looks like 60fps.
//   • an adaptive governor trims particles if real frames come in slow.

// Device tiers: [particles, fps cap, max DPR, glow footprint ×, particle floor]
const TIERS = {
  low: { count: 240, fps: 30, dpr: 1, glow: 4.4, floor: 110 },
  mid: { count: 520, fps: 45, dpr: 1.5, glow: 5.2, floor: 200 },
  high: { count: 820, fps: 60, dpr: 2, glow: 6, floor: 320 },
}

function detectTier() {
  const cores = navigator.hardwareConcurrency || 4
  const mem = navigator.deviceMemory || 4
  const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches
  if (cores <= 4 || mem <= 4) return 'low'
  if (coarse || cores <= 8 || window.innerWidth < 1024) return 'mid'
  return 'high'
}

// Soft radial-gradient dot baked once into an offscreen canvas. Drawn additively
// ('lighter') this reproduces the ember glow far cheaper than shadowBlur.
function makeGlowSprite(r, g, b) {
  const D = 48
  const c = document.createElement('canvas')
  c.width = c.height = D
  const gx = c.getContext('2d')
  const grad = gx.createRadialGradient(D / 2, D / 2, 0, D / 2, D / 2, D / 2)
  grad.addColorStop(0, `rgba(${r},${g},${b},1)`)
  grad.addColorStop(0.22, `rgba(${r},${g},${b},0.72)`)
  grad.addColorStop(0.5, `rgba(${r},${g},${b},0.2)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  gx.fillStyle = grad
  gx.fillRect(0, 0, D, D)
  return c
}

export default function ParticleField({ quality = 1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })

    const tier = TIERS[detectTier()]
    const frameInterval = 1000 / tier.fps
    const emberSprite = makeGlowSprite(232, 119, 34)
    const boneSprite = makeGlowSprite(247, 200, 150)

    let width = 0
    let height = 0
    let dpr = 1
    let N = 0
    let activeCount = 0 // adaptive: how many particles we actually draw
    let shapes = null
    let particles = []
    let raf = 0
    let running = true

    // Pointer parallax (skipped on touch — coarse pointers don't hover).
    const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }

    function makeParticles() {
      N = Math.max(tier.floor, Math.round(tier.count * quality))
      activeCount = N
      shapes = buildShapes(N, width, height)
      const start = shapes[morphState.to] || shapes.grating
      particles = new Array(N)
      for (let i = 0; i < N; i++) {
        const s = start[i]
        const size = Math.random() < 0.16 ? 2.2 : 1.3 + Math.random() * 0.9
        particles[i] = {
          x: s.x,
          y: s.y,
          phase: Math.random() * Math.PI * 2,
          driftAmp: 3 + Math.random() * 5,
          driftSpeed: 0.4 + Math.random() * 0.7,
          size,
          glow: size * tier.glow, // pre-computed sprite footprint (CSS px)
          highlight: Math.random() < 0.18,
        }
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, tier.dpr)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
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
    let lastDraw = 0
    // adaptive governor accumulators
    let accum = 0
    let frames = 0
    let sampleAt = 0

    function frame(now) {
      if (!running) return
      raf = requestAnimationFrame(frame)

      // FPS cap: skip this frame if the cap interval hasn't elapsed.
      const sinceDraw = now - lastDraw
      if (sinceDraw < frameInterval - 1) return
      const dt = Math.min(sinceDraw, 50) // clamp so tab-return doesn't jump
      lastDraw = now
      const time = (now - t0) / 1000

      // ---- adaptive downscale: if frames run slow, quietly trim particles ---
      accum += dt
      frames++
      if (now - sampleAt > 1000) {
        const avg = accum / frames
        if (avg > frameInterval * 1.5 && activeCount > tier.floor) {
          activeCount = Math.max(tier.floor, Math.floor(activeCount * 0.85))
        }
        accum = 0
        frames = 0
        sampleAt = now
      }

      // Frame-rate-independent damping factor (0.09 tuned at 60fps).
      const k = 1 - Math.pow(1 - 0.09, dt / 16.667)

      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05
      const parX = mouse.x * 22
      const parY = mouse.y * 16

      const from = shapes[morphState.from] || shapes.grating
      const to = shapes[morphState.to] || shapes.grating
      const bt = morphState.t

      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'

      for (let i = 0; i < activeCount; i++) {
        const a = from[i]
        const b = to[i]
        const tx = a.x + (b.x - a.x) * bt
        const ty = a.y + (b.y - a.y) * bt
        const talpha = a.alpha + (b.alpha - a.alpha) * bt

        const p = particles[i]
        p.x += (tx - p.x) * k
        p.y += (ty - p.y) * k

        const dx = Math.sin(time * p.driftSpeed + p.phase) * p.driftAmp
        const dy = Math.cos(time * p.driftSpeed * 0.8 + p.phase) * p.driftAmp * 0.7

        const g = p.glow
        const px = p.x + dx + parX * (p.highlight ? 1.3 : 1) - g / 2
        const py = p.y + dy + parY * (p.highlight ? 1.3 : 1) - g / 2

        ctx.globalAlpha = talpha < 0 ? 0 : talpha > 1 ? 1 : talpha
        ctx.drawImage(p.highlight ? boneSprite : emberSprite, px, py, g, g)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    function start() {
      if (running) return
      running = true
      t0 = performance.now()
      lastDraw = 0
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
    if (!coarse) window.addEventListener('pointermove', onPointerMove)
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
