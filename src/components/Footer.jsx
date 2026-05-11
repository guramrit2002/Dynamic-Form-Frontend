import { useState } from 'react'
import client, { publicClient, hasCredentials } from '../api/client'
import Spinner from './ui/Spinner'

const BUG_FORM_ID = import.meta.env.VITE_BUG_REPORT_FORM_ID

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical']
const CATEGORIES = ['UI / Display', 'Performance', 'Data Loss', 'Security', 'Integration', 'Other']

function BugReportModal({ onClose }) {
  const [fields, setFields] = useState({
    reporter_email: '',
    severity:       'Medium',
    category:       'Other',
    description:    '',
    steps_to_repro: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [apiError,  setApiError]  = useState('')

  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setApiError('')

    try {
      if (hasCredentials()) {
        // Authenticated path: find "Bug Report" form from user's own forms
        const { data: forms } = await client.get('/builder/forms/')
        const bugForm = forms.find((f) => f.name === 'Bug Report')

        if (bugForm) {
          await client.post(`/builder/forms/${bugForm.id}/submit/`, { data: fields })
        } else if (BUG_FORM_ID) {
          // Authenticated but no Bug Report form in their account — use public endpoint
          await publicClient.post(`/builder/forms/${BUG_FORM_ID}/share/submit/`, { data: fields })
        } else {
          throw new Error('Bug Report form not found. Run seed_demo and set VITE_BUG_REPORT_FORM_ID.')
        }
      } else if (BUG_FORM_ID) {
        // Unauthenticated path: public share endpoint — no login required
        await publicClient.post(`/builder/forms/${BUG_FORM_ID}/share/submit/`, { data: fields })
      } else {
        throw new Error('Set VITE_BUG_REPORT_FORM_ID in .env to enable bug reporting.')
      }

      setSubmitted(true)
    } catch (err) {
      setApiError(err?.response?.data?.detail ?? err.message ?? 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="font-semibold text-gray-800">Report a Bug</h2>
            <p className="text-xs text-gray-400">Help us improve by describing the issue</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Success state */}
        {submitted ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
              ✓
            </div>
            <h3 className="font-semibold text-gray-800">Report submitted — thank you!</h3>
            <p className="mt-1 text-sm text-gray-500">We'll look into it as soon as possible.</p>
            <button
              onClick={onClose}
              className="mt-6 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
            <div>
              <label className="label-base">
                Your Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={fields.reporter_email}
                onChange={set('reporter_email')}
                className="input-base"
                placeholder="you@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-base">Severity</label>
                <select value={fields.severity} onChange={set('severity')} className="input-base">
                  {SEVERITIES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label-base">Category</label>
                <select value={fields.category} onChange={set('category')} className="input-base">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="label-base">
                Describe the bug <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={fields.description}
                onChange={set('description')}
                rows={3}
                className="input-base resize-none"
                placeholder="What went wrong?"
              />
            </div>

            <div>
              <label className="label-base">Steps to reproduce</label>
              <textarea
                value={fields.steps_to_repro}
                onChange={set('steps_to_repro')}
                rows={3}
                className="input-base resize-none"
                placeholder={"1. Go to…\n2. Click…\n3. See error"}
              />
            </div>

            {apiError && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {apiError}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading && <Spinner className="h-4 w-4" />}
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function Footer() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
              F
            </div>
            <span className="font-medium text-gray-700">Dynamic Form</span>
            <span className="text-gray-300">·</span>
            <span>© {new Date().getFullYear()}</span>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            🐛 Report a Bug
          </button>
        </div>
      </footer>

      {showModal && <BugReportModal onClose={() => setShowModal(false)} />}
    </>
  )
}
