// Small line-art / isometric icons drawn as inline SVG so they stay crisp,
// themeable and add no bundle weight. Stroke uses the ember accent.

const stroke = { fill: 'none', stroke: '#e87722', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }

// Isometric grating profile — mesh depth varies with `depth` (visual only).
export function ProfileIcon({ depth = 20 }) {
  const d = Math.max(8, Math.min(28, depth))
  return (
    <svg viewBox="0 0 80 64" className="h-16 w-20" aria-hidden="true">
      <g {...stroke}>
        {/* top face */}
        <path d="M14 20 L40 8 L66 20 L40 32 Z" />
        {/* front-left face */}
        <path d={`M14 20 L14 ${20 + d} L40 ${32 + d} L40 32 Z`} />
        {/* front-right face */}
        <path d={`M66 20 L66 ${20 + d} L40 ${32 + d} L40 32 Z`} />
        {/* mesh lines on top */}
        <path d="M27 14 L53 26 M40 8 L40 32 M20 23 L46 11 M34 29 L60 17" opacity="0.7" />
      </g>
    </svg>
  )
}

export function AppIcon({ type }) {
  const paths = {
    walkway: (
      <g {...stroke}>
        <path d="M6 40 H58" />
        <path d="M10 40 V22 M22 40 V22 M34 40 V22 M46 40 V22 M54 40 V22" />
        <path d="M10 22 H54" />
        <path d="M6 46 H58" opacity="0.5" />
      </g>
    ),
    drain: (
      <g {...stroke}>
        <path d="M8 18 H56 L50 46 H14 Z" />
        <path d="M14 26 H50 M16 34 H48 M18 42 H46" opacity="0.8" />
      </g>
    ),
    water: (
      <g {...stroke}>
        <circle cx="32" cy="30" r="18" />
        <path d="M14 30 c6 -6 12 6 18 0 s12 -6 18 0" />
        <path d="M14 36 c6 -6 12 6 18 0 s12 -6 18 0" opacity="0.7" />
      </g>
    ),
    public: (
      <g {...stroke}>
        <rect x="12" y="14" width="40" height="32" rx="2" />
        <path d="M20 14 V46 M28 14 V46 M36 14 V46 M44 14 V46 M12 22 H52 M12 30 H52 M12 38 H52" opacity="0.7" />
      </g>
    ),
  }
  return (
    <svg viewBox="0 0 64 56" className="h-14 w-16" aria-hidden="true">
      {paths[type] || paths.walkway}
    </svg>
  )
}

export function CertIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden="true">
      <g {...stroke}>
        <circle cx="32" cy="26" r="16" />
        <circle cx="32" cy="26" r="10" opacity="0.6" />
        <path d="M26 26 l4 4 l8 -9" strokeWidth="2" />
        <path d="M24 40 L20 56 L32 50 L44 56 L40 40" />
      </g>
    </svg>
  )
}
