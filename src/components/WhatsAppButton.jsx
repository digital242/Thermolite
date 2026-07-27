import { BRAND } from '../data/site'

// Floating WhatsApp CTA, fixed bottom-right on every screen.
export default function WhatsAppButton() {
  const href = `https://wa.me/${BRAND.phoneHref.replace('+', '')}?text=${encodeURIComponent(
    'Hi Thermolite, I would like a quote for FRP/GRP gratings.',
  )}`
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Thermolite on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_6px_24px_rgba(37,211,102,0.5)] transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" aria-hidden="true">
        <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
        <path d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.77.46 3.5 1.35 5.03L2 22l5.1-1.33A9.94 9.94 0 0 0 12.02 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.2c-1.58 0-3.13-.42-4.48-1.23l-.32-.19-2.98.78.8-2.9-.21-.33A8.16 8.16 0 0 1 3.82 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2z" />
      </svg>
    </a>
  )
}
