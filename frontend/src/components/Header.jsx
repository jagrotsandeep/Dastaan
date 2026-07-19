import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Feather, Search, PenSquare, Moon, Sun, Menu } from 'lucide-react'

function Header({ darkMode, toggleDarkMode, user }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-xl bg-[#fffaf3]/90 dark:bg-[#171313]/90 border-[#4e312a]/13">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center gap-2 sm:gap-4 px-3 sm:px-6">

        <Link to="/" className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-2xl bg-[#c94531] text-white shadow-lg">
            <Feather className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <span className="font-bold text-lg sm:text-xl text-[#211b1a] dark:text-[#f8eee8]" style={{ fontFamily: "'Eczar', serif" }}>
  दास्तान
</span>
        </Link>

        <nav className="ml-5 hidden flex-1 items-center gap-6 lg:flex">
          <Link to="/" className="font-semibold text-[#211b1a] dark:text-[#f8eee8]">Home</Link>
          {user?.isAdmin ? (
            <Link to="/admin" className="font-semibold text-[#c94531]">Admin Panel</Link>
          ) : (
            user && <Link to="/dashboard" className="font-semibold text-[#211b1a] dark:text-[#f8eee8]">Dashboard</Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {!user?.isAdmin && (
            <>
              <Link
                to="/search"
                className="grid h-10 w-10 place-items-center rounded-full border border-[#4e312a]/13"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </Link>

              <Link
                to="/write"
                className="flex h-10 items-center gap-2 rounded-full bg-[#c94531] px-3 sm:px-4 text-white font-bold"
              >
                <PenSquare className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Write Story</span>
              </Link>
            </>
          )}

          <button
            onClick={toggleDarkMode}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#4e312a]/13"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            !user.isAdmin && (
              <Link
                to="/profile"
                className="hidden sm:flex h-10 items-center gap-2 rounded-full bg-[#211b1a] px-4 text-white font-bold"
              >
                {user.username}
              </Link>
            )
          ) : (
            <Link
              to="/login"
              className="hidden sm:flex h-10 items-center gap-2 rounded-full bg-[#211b1a] px-4 text-white font-bold"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid h-10 w-10 place-items-center rounded-xl border lg:hidden border-[#4e312a]/13"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t px-4 py-4 lg:hidden border-[#4e312a]/13 flex flex-col gap-2">
          <Link to="/" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-left font-semibold">Home</Link>
          {user?.isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-left font-semibold text-[#c94531]">Admin Panel</Link>
          )}
          {user && !user.isAdmin && (
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-left font-semibold">Dashboard</Link>
          )}
          {user ? (
            !user.isAdmin && (
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-left font-semibold">Profile</Link>
            )
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-left font-semibold text-[#c94531]">Login</Link>
          )}
        </nav>
      )}
    </header>
  )
}

export default Header