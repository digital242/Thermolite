// Shared morph state read every frame by <ParticleField>. Sections push a new
// target shape through setTargetShape(); we tween the blend factor `t` from the
// previous shape to the new one so the canvas cross-fades (~600ms) rather than
// hard-cutting between states.
//
// Deliberately dependency-free (its own rAF tween) so importing it does NOT
// pull GSAP into the eager bundle — GSAP is lazy-loaded by App for scroll only.
export const morphState = {
  from: 'grating',
  to: 'grating',
  t: 1,
}

const DURATION = 600 // ms
let rafId = 0
let startTime = 0

function easeInOut(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
}

function step(now) {
  const p = Math.min(1, (now - startTime) / DURATION)
  morphState.t = easeInOut(p)
  if (p < 1) {
    rafId = requestAnimationFrame(step)
  }
}

export function setTargetShape(name) {
  if (name === morphState.to) return
  morphState.from = morphState.to
  morphState.to = name
  morphState.t = 0
  cancelAnimationFrame(rafId)
  startTime = performance.now()
  rafId = requestAnimationFrame(step)
}
