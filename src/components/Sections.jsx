import {
  BRAND,
  ABOUT,
  SPEC_TABLE,
  VARIANTS,
  LOAD_STEPS,
  APPLICATIONS,
  CERTIFICATIONS,
  LOCATIONS,
  MAP_EMBED,
  SOCIALS,
} from '../data/site'
import CountUp from './CountUp'
import Logo from './Logo'
import GratingConfigurator from './GratingConfigurator'
import { ProfileIcon, AppIcon, CertIcon } from './Icons'

// A section shell: full-viewport so the fixed canvas reads as "pinned" behind
// the scrolling content, with a subtle bottom scrim for text legibility.
function Section({ id, children, className = '' }) {
  return (
    <section
      id={id}
      data-section={id}
      className={`relative z-10 flex min-h-screen w-full flex-col justify-center px-5 py-24 sm:px-8 ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  )
}

function Eyebrow({ children }) {
  return (
    <p className="reveal mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-ember-500">
      {children}
    </p>
  )
}

export default function Sections({ go, reduced }) {
  return (
    <main>
      {/* ---- 1. HERO ---------------------------------------------------- */}
      <Section id="hero" className="items-center text-center">
        <div className="mx-auto max-w-3xl">
          <p className="reveal mb-4 text-sm font-medium uppercase tracking-[0.4em] text-bone-100/60">
            {BRAND.range}
          </p>
          <h1 className="reveal flex justify-center">
            <Logo className="text-[clamp(2.5rem,11vw,7.5rem)]" />
          </h1>
          <p className="reveal mx-auto mt-6 max-w-xl text-lg text-bone-100/80 sm:text-2xl">
            {BRAND.tagline}
          </p>
          <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => go('specifications')}
              className="rounded-full bg-ember-500 px-8 py-3.5 font-semibold text-navy-950 shadow-[0_8px_30px_rgba(232,119,34,0.4)] transition-transform hover:scale-105"
            >
              Explore Products
            </button>
            <button
              onClick={() => go('contact')}
              className="rounded-full border border-navy-600 px-8 py-3.5 font-semibold text-bone-100 transition-colors hover:border-ember-500 hover:text-ember-400"
            >
              Talk to Engineering
            </button>
          </div>
        </div>
        <div className="reveal absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-bone-100/40">
          Scroll to explore ↓
        </div>
      </Section>

      {/* ---- 2. ABOUT --------------------------------------------------- */}
      <Section id="about">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>{ABOUT.eyebrow}</Eyebrow>
            <h2 className="reveal text-4xl font-bold sm:text-5xl">{ABOUT.heading}</h2>
            {ABOUT.body.map((p, i) => (
              <p key={i} className="reveal mt-5 text-base leading-relaxed text-bone-100/75 sm:text-lg">
                {p}
              </p>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {ABOUT.highlights.map((h) => (
              <div
                key={h.k}
                className="reveal rounded-xl border border-navy-700/50 bg-navy-900/40 p-5 backdrop-blur-sm"
              >
                <p className="font-display text-lg font-semibold text-ember-400">{h.k}</p>
                <p className="mt-2 text-sm text-bone-100/70">{h.v}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---- 3. SPECIFICATIONS ----------------------------------------- */}
      <Section id="specifications">
        <Eyebrow>Product Specifications</Eyebrow>
        <h2 className="reveal text-4xl font-bold sm:text-5xl">The full spec sheet.</h2>
        <p className="reveal mt-4 max-w-2xl text-bone-100/70">
          Real, crawlable data for specifying engineers — weight and uniformly distributed load
          for every Thermolite molded grating profile.
        </p>
        <div className="reveal mt-8 overflow-x-auto rounded-xl border border-navy-700/50 bg-navy-950/70 backdrop-blur-sm">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">
              Thermolite FRP/GRP grating specifications: mesh, depth, weight and UDL
            </caption>
            <thead>
              <tr className="border-b border-navy-700 text-ember-400">
                {SPEC_TABLE.columns.map((c) => (
                  <th key={c} scope="col" className="px-5 py-4 font-display font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPEC_TABLE.rows.map((r) => (
                <tr key={r.product} className="border-b border-navy-800/60 transition-colors hover:bg-navy-800/40">
                  <th scope="row" className="px-5 py-4 font-medium text-bone-100">
                    {r.product}
                  </th>
                  <td className="px-5 py-4 text-bone-100/70">{r.mesh}</td>
                  <td className="px-5 py-4 text-bone-100/70">{r.depth}</td>
                  <td className="px-5 py-4 text-bone-100/70">{r.weight}</td>
                  <td className="px-5 py-4 font-semibold text-ember-400">{r.udl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="reveal mt-4 max-w-3xl text-xs leading-relaxed text-bone-100/50">{SPEC_TABLE.note}</p>
      </Section>

      {/* ---- 4. PROFILE VARIANTS --------------------------------------- */}
      <Section id="variants">
        <Eyebrow>Profile Variants</Eyebrow>
        <h2 className="reveal text-4xl font-bold sm:text-5xl">Five meshes. Every load case.</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VARIANTS.map((v, i) => (
            <div
              key={v.code}
              className="reveal group rounded-2xl border border-navy-700/50 bg-navy-900/40 p-6 backdrop-blur-sm transition-colors hover:border-ember-500/60"
            >
              <div className="flex items-start justify-between">
                <ProfileIcon depth={[24, 20, 24, 28, 14][i]} />
                <span className="rounded-full bg-navy-800 px-3 py-1 font-mono text-xs text-ember-400">
                  {v.code}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-bone-100">{v.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bone-100/70">{v.focus}</p>
              <p className="mt-4 border-t border-navy-800 pt-3 font-mono text-xs text-bone-100/50">
                {v.spec}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- 4b. CONFIGURE / CUSTOMIZE --------------------------------- */}
      <Section id="customize">
        <Eyebrow>Configure Your Grating</Eyebrow>
        <h2 className="reveal text-4xl font-bold sm:text-5xl">Build it to your spec.</h2>
        <p className="reveal mb-8 mt-4 max-w-2xl text-bone-100/70">
          Set your exact panel dimensions, mesh, bar height and colour — the panel drawing, weight
          and load capacity update instantly, then send the spec straight to our team for a quote.
        </p>
        <GratingConfigurator />
      </Section>

      {/* ---- 5. LOAD TESTING ------------------------------------------- */}
      <Section id="load">
        <Eyebrow>Load Testing / UDL Capacity</Eyebrow>
        <h2 className="reveal text-4xl font-bold sm:text-5xl">From a footstep to five tons.</h2>
        <p className="reveal mt-4 max-w-2xl text-bone-100/70">
          Every Thermolite profile is proof-tested against a defined uniformly distributed load.
          The capacity ladder climbs from pedestrian to full vehicular rating.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {LOAD_STEPS.map((s, i) => (
            <div
              key={s.label}
              className="reveal flex flex-col rounded-xl border border-navy-700/50 bg-navy-900/40 p-5 backdrop-blur-sm"
              style={{ minHeight: `${120 + i * 26}px` }}
            >
              <div className="mt-auto">
                <p className="font-display text-3xl font-bold text-ember-400 sm:text-4xl">
                  <CountUp value={s.value} decimals={s.tons ? 1 : 0} reduced={reduced} />
                  <span className="ml-1 text-lg text-bone-100/80">{s.unit}</span>
                </p>
                <p className="mt-2 text-xs leading-snug text-bone-100/60">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- 6. APPLICATIONS ------------------------------------------- */}
      <Section id="applications">
        <Eyebrow>Applications</Eyebrow>
        <h2 className="reveal text-4xl font-bold sm:text-5xl">Where Thermolite goes to work.</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {APPLICATIONS.map((a) => (
            <div
              key={a.title}
              className="reveal flex gap-5 rounded-2xl border border-navy-700/50 bg-navy-900/40 p-6 backdrop-blur-sm transition-colors hover:border-ember-500/60"
            >
              <div className="shrink-0 rounded-xl bg-navy-800/60 p-3">
                <AppIcon type={a.icon} />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-bone-100">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone-100/70">{a.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- 6b. LOCATIONS WE SERVE ------------------------------------ */}
      <Section id="locations">
        <Eyebrow>Locations We Serve</Eyebrow>
        <h2 className="reveal text-4xl font-bold sm:text-5xl">Delivered across India &amp; beyond.</h2>
        <p className="reveal mt-4 max-w-3xl text-bone-100/70">{LOCATIONS.intro}</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LOCATIONS.groups.map((g) => (
            <div
              key={g.region}
              className="reveal rounded-2xl border border-navy-700/50 bg-navy-900/40 p-6 backdrop-blur-sm"
            >
              <h3 className="font-display text-lg font-semibold text-ember-400">{g.region}</h3>
              <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-sm text-bone-100/70">
                {g.cities.map((c) => (
                  <li key={c} className="after:ml-3 after:text-navy-600 after:content-['·'] last:after:hidden">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="reveal mt-6 text-sm text-bone-100/50">
          Don’t see your city? We ship nationwide and export worldwide —{' '}
          <a href={`tel:${BRAND.phoneHref}`} className="text-ember-400 hover:underline">
            call {BRAND.phone}
          </a>{' '}
          to confirm delivery to your site.
        </p>
      </Section>

      {/* ---- 7. CERTIFICATIONS ----------------------------------------- */}
      <Section id="certifications" className="items-center text-center">
        <Eyebrow>Certifications</Eyebrow>
        <h2 className="reveal text-4xl font-bold sm:text-5xl">Rated, tested, certified.</h2>
        <div className="mt-12 flex flex-wrap items-stretch justify-center gap-6">
          {CERTIFICATIONS.map((c) => (
            <div
              key={c.code}
              className="reveal flex w-64 flex-col items-center rounded-2xl border border-navy-700/50 bg-navy-900/40 p-8 backdrop-blur-sm"
            >
              <CertIcon />
              <p className="mt-4 font-display text-xl font-bold text-ember-400">{c.code}</p>
              <p className="mt-2 text-sm text-bone-100/70">{c.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- 8. CONTACT ------------------------------------------------- */}
      <Section id="contact">
        <div className="reveal rounded-3xl border border-navy-700/50 bg-gradient-to-br from-navy-900/70 to-navy-950/70 p-8 backdrop-blur-md sm:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>Contact</Eyebrow>
              <h2 className="text-4xl font-bold sm:text-5xl">Let’s spec your project.</h2>
              <p className="mt-4 max-w-md text-bone-100/70">
                Talk to our engineering team for panel sizing, profile selection and load
                certification tailored to your site.
              </p>
              <div className="mt-8 space-y-4 text-lg">
                <p className="font-display font-semibold text-bone-100">{BRAND.company}</p>
                <p>
                  <a href={`tel:${BRAND.phoneHref}`} className="text-bone-100/80 hover:text-ember-400">
                    {BRAND.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${BRAND.email}`} className="text-bone-100/80 hover:text-ember-400">
                    {BRAND.email}
                  </a>
                </p>
                <p className="text-bone-100/60">{BRAND.location}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <a
                href={`tel:${BRAND.phoneHref}`}
                className="rounded-xl bg-ember-500 px-6 py-4 text-center font-semibold text-navy-950 transition-transform hover:scale-[1.02]"
              >
                Call {BRAND.phone}
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                className="rounded-xl border border-navy-600 px-6 py-4 text-center font-semibold text-bone-100 transition-colors hover:border-ember-500 hover:text-ember-400"
              >
                Email the Engineering Desk
              </a>
              <a
                href={`https://wa.me/${BRAND.phoneHref.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[#25D366]/50 px-6 py-4 text-center font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/10"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- 9. FOOTER -------------------------------------------------- */}
      <footer className="relative z-10 border-t border-navy-800 bg-navy-950/90 px-5 py-14 backdrop-blur-sm sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-3">
          <div>
            <Logo className="text-2xl" tagline />
            <p className="mt-4 max-w-xs text-sm text-bone-100/60">
              GRP/FRP molded gratings by Thermodrain — corrosion-proof surfaces engineered for
              every load, from catwalk to carriageway.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-navy-700 text-xs font-semibold text-bone-100/70 transition-colors hover:border-ember-500 hover:text-ember-400"
                >
                  {s.short}
                </a>
              ))}
            </div>
          </div>

          <div className="text-sm">
            <p className="font-display font-semibold text-ember-400">Head Office</p>
            <p className="mt-3 text-bone-100/70">{BRAND.company}</p>
            <p className="mt-1 text-bone-100/70">{BRAND.location}</p>
            <p className="mt-3">
              <a href={`tel:${BRAND.phoneHref}`} className="text-bone-100/70 hover:text-ember-400">
                {BRAND.phone}
              </a>
            </p>
            <p className="mt-1">
              <a href={`mailto:${BRAND.email}`} className="text-bone-100/70 hover:text-ember-400">
                {BRAND.email}
              </a>
            </p>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-ember-400">Find us — CBD Belapur</p>
            <div className="mt-3 overflow-hidden rounded-xl border border-navy-700">
              <iframe
                title="Thermolite location — CBD Belapur, Navi Mumbai"
                src={MAP_EMBED}
                width="100%"
                height="180"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-navy-800 pt-6 text-xs text-bone-100/40">
          © {new Date().getFullYear()} {BRAND.company}. Thermolite &amp; Thermodrain are product
          brands. All specifications nominal and subject to revision.
        </div>
      </footer>
    </main>
  )
}
