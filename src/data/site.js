// Single source of truth for every content block. Everything here is rendered
// as real, crawlable DOM text — the canvas is purely decorative.

export const BRAND = {
  name: 'Thermolite',
  range: 'GRP/FRP Gratings by Thermodrain',
  tagline: 'GRP/FRP Gratings. Engineered for Every Load.',
  company: 'Thermoset Poly Products (I) Pvt. Ltd.',
  phone: '+91 70216 50820',
  phoneHref: '+917021650820',
  email: 'thermodrain@frpmanholecover.com',
  location: 'CBD Belapur, Navi Mumbai, Maharashtra, India',
}

export const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'variants', label: 'Profiles' },
  { id: 'load', label: 'Load Testing' },
  { id: 'applications', label: 'Applications' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
]

// Maps each section to the particle target-shape it drives. Consumed by
// ParticleField via the section ScrollTriggers.
export const SECTION_SHAPES = {
  hero: 'grating',
  about: 'grating',
  specifications: 'rib',
  variants: 'rib',
  load: 'bars',
  applications: 'grid',
  certifications: 'seal',
  contact: 'disperse',
}

export const ABOUT = {
  eyebrow: 'Material Science',
  heading: 'Fiberglass that outlasts steel.',
  body: [
    'Thermolite gratings are manufactured from glass-reinforced polymer (GRP/FRP) using a molded, cross-hatched matrix of continuous glass rovings encapsulated in a corrosion-resistant resin. The result is a walkway and drainage surface that will not rust, rot, or fatigue the way galvanised steel does.',
    'Every panel is engineered for a defined uniformly distributed load (UDL) and concentrated wheel load, giving specifying engineers a predictable safety factor for pedestrian, trolley and vehicular traffic — from a maintenance catwalk to an AASHTO H-25 rated access cover.',
  ],
  highlights: [
    { k: 'Non-corrosive', v: 'Immune to salt, chlorine & most industrial chemicals' },
    { k: 'Anti-slip', v: 'Integral gritted top surface, wet or dry' },
    { k: 'Lightweight', v: 'Up to 70% lighter than steel — faster, safer install' },
    { k: 'Non-conductive', v: 'Electrically & thermally insulating; EMI transparent' },
  ],
}

// Full specification table — real values in the DOM for SEO & due diligence.
export const SPEC_TABLE = {
  columns: ['Product', 'Mesh / Pitch', 'Depth', 'Weight (Kg/sqm)', 'UDL (Kg/sqm)'],
  rows: [
    { product: 'FRP Walkways Grating', mesh: '38 × 38 mm', depth: '25 mm', weight: '18.5', udl: '500' },
    { product: 'FRP Grating 25 mm', mesh: '38 × 38 mm', depth: '25 mm', weight: '18.5', udl: '500' },
    { product: 'FRP Grating 30 mm', mesh: '38 × 38 mm', depth: '30 mm', weight: '22.0', udl: '750' },
    { product: 'FRP Grating 38 mm', mesh: '38 × 38 mm', depth: '38 mm', weight: '27.5', udl: '1200' },
    { product: 'FRP Heavy Grating', mesh: '38 × 75 mm', depth: '25 mm', weight: '15.0', udl: '900' },
    { product: 'Mini Mesh Grating', mesh: '19 × 19 mm', depth: '25 mm', weight: '24.0', udl: '400' },
  ],
  note: 'Values are nominal for standard isophthalic resin panels (1220 × 3660 mm / 1220 × 4000 mm). Vinyl-ester, phenolic (fire-retardant) and food-grade resins available to order. UDL figures quoted at a working span of 1.0 m with a safety factor of 3:1.',
}

export const VARIANTS = [
  {
    code: '38×75×25',
    name: 'Heavy-Traffic Mesh',
    focus: 'Wide 38 × 75 mm rectangular mesh, 25 mm deep — maximum open area for drainage while carrying trolley and light-vehicle loads.',
    spec: '38 mm pitch · 75 mm cross-pitch · 25 mm depth',
  },
  {
    code: '38×38×25',
    name: 'Standard Walkway',
    focus: 'The workhorse square mesh. Balanced strength-to-weight for platforms, stair treads and general access walkways.',
    spec: '38 mm pitch · 38 mm cross-pitch · 25 mm depth',
  },
  {
    code: '38×38×30',
    name: 'Reinforced Walkway',
    focus: 'Deeper 30 mm bar for longer unsupported spans without added mesh weight underfoot.',
    spec: '38 mm pitch · 38 mm cross-pitch · 30 mm depth',
  },
  {
    code: '38×38×38',
    name: 'Structural Deck',
    focus: 'Full 38 mm depth for the heaviest UDL and concentrated wheel loads — vehicular decks and trench covers.',
    spec: '38 mm pitch · 38 mm cross-pitch · 38 mm depth',
  },
  {
    code: 'Mini Mesh',
    name: 'Fine Mini Mesh',
    focus: '19 × 19 mm mesh for heel-safe, small-object-retentive surfaces — public realm, food & pharma floors.',
    spec: '19 mm pitch · 19 mm cross-pitch · 25 mm depth',
  },
]

// Load-testing story — the counting numbers rise as the user scrolls.
export const LOAD_STEPS = [
  { value: 90, unit: 'kg', label: 'Single pedestrian point load', tons: false },
  { value: 100, unit: 'kg', label: 'Loaded maintenance trolley', tons: false },
  { value: 500, unit: 'kg', label: 'Walkway UDL — 25 mm panel', tons: false },
  { value: 1.5, unit: 'ton', label: 'Forklift wheel — structural deck', tons: true },
  { value: 5, unit: 'ton', label: 'AASHTO H-25 vehicular UDL', tons: true },
]

export const APPLICATIONS = [
  {
    title: 'Industrial Walkways & Platforms',
    body: 'Elevated catwalks, stair treads and mezzanine flooring in plants, refineries and jetties where corrosion would cripple steel.',
    icon: 'walkway',
  },
  {
    title: 'Drainage & Trench Covers',
    body: 'Channel gratings and trench covers that shrug off effluent, seawater and de-icing salt — the core Thermodrain application.',
    icon: 'drain',
  },
  {
    title: 'Water & Effluent Treatment',
    body: 'Aeration-tank decking, clarifier walkways and pump-house floors in constant chemical and moisture exposure.',
    icon: 'water',
  },
  {
    title: 'Public & Commercial Realm',
    body: 'Tree grates, façade screens and heel-safe mini-mesh flooring for stations, malls and pedestrian zones.',
    icon: 'public',
  },
]

export const CERTIFICATIONS = [
  { code: 'BS EN 124', label: 'Gully tops & manhole tops load classes A15–F900' },
  { code: 'ISO 9001:2015', label: 'Certified quality management system' },
  { code: 'AASHTO H-20 / H-25', label: 'Highway bridge vehicular load rating' },
]

export const MAP_EMBED =
  'https://www.google.com/maps?q=CBD+Belapur+Navi+Mumbai&output=embed'

export const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', short: 'in' },
  { label: 'Facebook', href: 'https://www.facebook.com/', short: 'f' },
  { label: 'Instagram', href: 'https://www.instagram.com/', short: 'ig' },
  { label: 'YouTube', href: 'https://www.youtube.com/', short: 'yt' },
]
