// Thermolite brand wordmark, rebuilt as a scalable component so it stays crisp
// at every size and themes to the dark background. The distinctive brand
// element — the "O" rendered as an orange square-in-square — is reproduced
// faithfully; the lettering is warm off-white so it reads on the deep navy
// (the original navy lettering is for light backgrounds).
//
// Scale it by setting a font-size class (e.g. text-xl) on the component.
export default function Logo({ className = '', tagline = false }) {
  return (
    <span
      role="img"
      aria-label="Thermolite — GRP/FRP Gratings"
      className={`logo ${className}`}
    >
      <span className="logo-wordmark">
        <span>THERM</span>
        <span className="logo-o" aria-hidden="true" />
        <span>LITE</span>
      </span>
      {tagline && <span className="logo-tagline">GRP/FRP GRATINGS</span>}
    </span>
  )
}
