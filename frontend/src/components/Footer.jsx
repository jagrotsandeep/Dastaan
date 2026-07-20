import { Link } from 'react-router-dom'
import { Feather } from 'lucide-react'

function Footer() {
  return (
    <footer className="mt-16 border-t border-[#4e312a]/13 bg-[#f3e7dd] dark:bg-[#1f1a19]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 sm:gap-10 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#c94531] text-white">
              <Feather className="h-4 w-4" />
            </span>
            <strong className="text-xl font-bold text-[#211b1a] dark:text-[#f8eee8]" style={{ fontFamily: "'Eczar', serif" }}>
              दास्तान
            </strong>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#706766]">
            दास्तान — हर कहानी की एक अपनी दास्तान होती है। Hindi aur apni matribhasha mein likhi gayi kahaniyon ka ghar.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-[#211b1a] dark:text-[#f8eee8]">Company</h2>
          <div className="mt-4 grid gap-2 text-sm text-[#706766]">
            <Link to="#">About Us</Link>
            <Link to="#">Contact Us</Link>
            <Link to="#">Work With Us</Link>
            <Link to="#">Advertise</Link>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-[#211b1a] dark:text-[#f8eee8]">Legal</h2>
          <div className="mt-4 grid gap-2 text-sm text-[#706766]">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms &amp; Conditions</Link>
            <Link to="#">Community Guidelines</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[#4e312a]/13 py-5 text-center">
        <p className="text-sm text-[#706766]">© 2026 Dastaan. Made for every Indian voice.</p>
        <p className="mt-1 text-xs text-[#706766]">Created by SNDP + Anthropic AI</p>
      </div>
    </footer>
  )
}

export default Footer