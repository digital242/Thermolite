import { NAV_ITEMS } from '../data/site'
import Logo from './Logo'

// Sticky/floating nav above the canvas. Active tab gets the ember highlight;
// clicking scrolls (smoothly, via the handler passed from App) rather than
// jump-cutting.
export default function Nav({ activeId, onNavigate }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full border border-navy-700/50 bg-navy-950/70 px-4 py-2.5 backdrop-blur-md sm:px-6">
        <button onClick={() => onNavigate('hero')} aria-label="Go to top">
          <Logo className="text-base sm:text-xl" />
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeId === item.id
                    ? 'bg-ember-500/15 text-ember-400'
                    : 'text-bone-100/70 hover:text-bone-100'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault()
            onNavigate('contact')
          }}
          className="whitespace-nowrap rounded-full bg-ember-500 px-3 py-1.5 text-xs font-semibold text-navy-950 transition-transform hover:scale-105 sm:px-4 sm:text-sm"
        >
          Get a Quote
        </a>
      </nav>
    </header>
  )
}
