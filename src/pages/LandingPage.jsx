import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  {
    icon: '🧩',
    title: 'Drag & Drop Builder',
    description: 'Build forms visually with text, email, number, select, radio, checkbox, date, and textarea fields — no code required.',
  },
  {
    icon: '🔀',
    title: 'Multi-Step with Logic',
    description: 'Split long forms into steps and define conditional navigation rules so respondents only see what is relevant to them.',
  },
  {
    icon: '👁',
    title: 'Field Visibility Rules',
    description: 'Show or hide individual fields based on previous answers — keep forms clean and context-aware.',
  },
  {
    icon: '⚡',
    title: 'Rules Engine',
    description: 'Automatically tag submissions, set statuses, or update values based on responses — no manual triage needed.',
  },
  {
    icon: '🔗',
    title: 'Public Share Links',
    description: 'Publish any form to a unique shareable URL. Anyone can fill it out without needing an account.',
  },
  {
    icon: '📊',
    title: 'Submissions Dashboard',
    description: 'Filter by date and status, then export all submissions as CSV or JSON from a single dashboard view.',
  },
]

export default function LandingPage() {
  const { authenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (authenticated) navigate('/forms', { replace: true })
  }, [authenticated, navigate])

  return (
    <div className="bg-gray-50">

      {/* ── Sticky nav ── */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              F
            </div>
            <span className="font-semibold text-gray-800">Dynamic Form</span>
          </div>
          <div className="ml-auto">
            <Link
              to="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero — full screen ── */}
      <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center sm:px-6">
        <span className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Form Builder Platform
        </span>
        <h1 className="mt-2 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl">
          Build smart forms.<br />Collect better data.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-500">
          Create multi-step forms with conditional logic, visibility rules, and an
          automated rules engine — then share them publicly or manage submissions
          from your dashboard.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/login"
            className="w-full rounded-xl bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:w-auto"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="w-full rounded-xl border border-gray-300 bg-white px-8 py-3 text-base font-semibold text-gray-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 sm:w-auto"
          >
            Sign In
          </Link>
        </div>
        {/* Scroll hint */}
        <div className="mt-16 flex flex-col items-center gap-1 text-gray-400">
          <span className="text-xs">Scroll to explore</span>
          <svg className="h-4 w-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Features — full screen ── */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-20 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Everything you need</h2>
            <p className="mt-3 text-gray-500">Powerful features without the complexity.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition hover:border-indigo-200 hover:shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                  {f.icon}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — full screen ── */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-indigo-600 px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-white sm:text-5xl">
          Ready to get started?
        </h2>
        <p className="mt-4 max-w-md text-lg text-indigo-200">
          Sign in and build your first form in minutes. No setup required.
        </p>
        <Link
          to="/login"
          className="mt-10 inline-block rounded-xl bg-white px-10 py-3.5 text-base font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50"
        >
          Go to Dashboard →
        </Link>
      </section>

    </div>
  )
}
