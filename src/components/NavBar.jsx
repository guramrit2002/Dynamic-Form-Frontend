import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './ui/Button'

const NAV_LINKS = [
  { to: '/forms',     label: 'Forms',     key: 'forms'     },
  { to: '/dashboard', label: 'Dashboard', key: 'dashboard' },
  { to: '/profile',   label: 'Profile',   key: 'profile'   },
]

export default function NavBar({ active, onLogout, onCreateForm, maxWidth = 'max-w-6xl' }) {
  const [open, setOpen] = useState(false)

  function close() { setOpen(false) }

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
      <div className={`mx-auto flex items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6 ${maxWidth}`}>

        {/* Logo */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">F</div>
          <span className="hidden font-semibold text-gray-800 sm:inline">Dynamic Form</span>
        </div>

        {/* Desktop nav */}
        <nav className="ml-1 hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.key}
              to={l.to}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                active === l.key
                  ? 'bg-indigo-50 font-medium text-indigo-600'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right actions */}
        <div className="ml-auto hidden items-center gap-3 sm:flex">
          {onCreateForm && (
            <Button onClick={onCreateForm}>+ Create Form</Button>
          )}
          <Button variant="secondary" onClick={onLogout}>Sign Out</Button>
        </div>

        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="ml-auto rounded-lg p-2 text-gray-500 hover:bg-gray-100 sm:hidden"
        >
          {open ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 sm:hidden">
          <nav className="flex flex-col gap-0.5">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.key}
                to={l.to}
                onClick={close}
                className={`rounded-lg px-3 py-2.5 text-sm transition ${
                  active === l.key
                    ? 'bg-indigo-50 font-medium text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
            {onCreateForm && (
              <Button onClick={() => { onCreateForm(); close() }} className="w-full">
                + Create Form
              </Button>
            )}
            <Button variant="secondary" onClick={onLogout} className="w-full">
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
