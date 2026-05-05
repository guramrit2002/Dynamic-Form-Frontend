import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth }   from '../context/AuthContext'
import client        from '../api/client'
import StatCard      from '../components/ui/StatCard'
import Badge         from '../components/ui/Badge'
import Spinner       from '../components/ui/Spinner'
import Button        from '../components/ui/Button'
import NavBar        from '../components/NavBar'
import { timeAgo, formatDate } from '../utils/timeAgo'

// ── Helpers ──────────────────────────────────────────────────────────────────

function submissionMeta(data) {
  if (data._status) return { label: data._status, color: 'indigo' }
  if (data.status)  return { label: data.status,  color: 'green'  }
  if (data._tags?.length) return { label: data._tags[0], color: 'yellow' }
  return null
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FormsTable({ forms, onView }) {
  if (!forms.length) return (
    <p className="py-8 text-center text-sm text-gray-400">No forms yet.</p>
  )
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
            <th className="pb-3 pr-4">Form</th>
            <th className="pb-3 pr-4">Version</th>
            <th className="pb-3 pr-4 text-right">Submissions</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {forms.map((form) => (
            <tr key={form.id} className="group">
              <td className="py-3 pr-4 font-medium text-gray-800">{form.name}</td>
              <td className="py-3 pr-4 text-gray-400">v{form.version}</td>
              <td className="py-3 pr-4 text-right font-semibold text-gray-700">{form.submission_count}</td>
              <td className="py-3 pr-4">
                <Badge color={form.is_published ? 'green' : 'gray'}>
                  {form.is_published ? 'Published' : 'Draft'}
                </Badge>
              </td>
              <td className="py-3 text-right">
                <button
                  onClick={() => onView(form)}
                  className="text-xs font-medium text-indigo-600 transition hover:underline sm:opacity-0 sm:group-hover:opacity-100"
                >
                  View →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DataPreview({ data }) {
  const entries = Object.entries(data)
    .filter(([k]) => !k.startsWith('_') && k !== 'status')
    .slice(0, 3)
  if (!entries.length) return <span className="text-gray-400">—</span>
  return (
    <span className="text-xs text-gray-500">
      {entries.map(([k, v]) => `${k}: ${v}`).join('  ·  ')}
    </span>
  )
}

function downloadFile(filename, type, content) {
  const blob = new Blob([content], { type })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function SubmissionsModal({ form, onClose }) {
  const [submissions,  setSubmissions]  = useState([])
  const [loading,      setLoading]      = useState(true)
  const [dateFrom,     setDateFrom]     = useState('')
  const [dateTo,       setDateTo]       = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    client.get(`/user/submissions/?form_id=${form.id}`)
      .then((r) => setSubmissions(r.data))
      .finally(() => setLoading(false))
  }, [form.id])

  const statuses = useMemo(() => {
    const set = new Set()
    submissions.forEach((sub) => {
      const meta = submissionMeta(sub.data)
      if (meta) set.add(meta.label)
      ;(sub.data._tags ?? []).forEach((t) => set.add(t))
    })
    return [...set]
  }, [submissions])

  const filtered = useMemo(() => submissions.filter((sub) => {
    const date = new Date(sub.created_at)
    if (dateFrom && date < new Date(dateFrom)) return false
    if (dateTo   && date > new Date(dateTo + 'T23:59:59')) return false
    if (statusFilter) {
      const meta   = submissionMeta(sub.data)
      const labels = [meta?.label, ...(sub.data._tags ?? [])].filter(Boolean)
      if (!labels.includes(statusFilter)) return false
    }
    return true
  }), [submissions, dateFrom, dateTo, statusFilter])

  const hasFilters = dateFrom || dateTo || statusFilter

  function clearFilters() { setDateFrom(''); setDateTo(''); setStatusFilter('') }

  function exportCSV() {
    const fieldKeys = [...new Set(filtered.flatMap((s) =>
      Object.keys(s.data).filter((k) => !k.startsWith('_') && k !== 'status')
    ))]
    const headers = ['id', 'version', 'date', 'status', ...fieldKeys]
    const rows = filtered.map((sub) => {
      const meta   = submissionMeta(sub.data)
      const tags   = sub.data._tags ?? []
      const status = [meta?.label, ...tags].filter(Boolean).join(', ') || ''
      return [sub.id, sub.version, formatDate(sub.created_at), status,
        ...fieldKeys.map((k) => sub.data[k] ?? '')]
    })
    const csv = [headers, ...rows]
      .map((row) => row.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')
    downloadFile(`${form.name}-submissions.csv`, 'text/csv', csv)
  }

  function exportJSON() {
    const data = filtered.map((sub) => ({
      id:      sub.id,
      version: sub.version,
      date:    sub.created_at,
      data:    sub.data,
    }))
    downloadFile(`${form.name}-submissions.json`, 'application/json', JSON.stringify(data, null, 2))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="font-semibold text-gray-800">{form.name}</h2>
            <p className="text-xs text-gray-400">Submissions</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Filters + Export toolbar */}
        {!loading && submissions.length > 0 && (
          <div className="shrink-0 border-b border-gray-100 px-6 py-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Date from */}
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                title="From date"
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <span className="text-xs text-gray-400">to</span>
              {/* Date to */}
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                title="To date"
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              {/* Status */}
              {statuses.length > 0 && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  <option value="">All statuses</option>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
              {/* Clear */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                >
                  Clear filters
                </button>
              )}

              <div className="ml-auto flex items-center gap-2">
                {hasFilters && (
                  <span className="text-xs text-gray-400">
                    {filtered.length} of {submissions.length}
                  </span>
                )}
                {/* Export */}
                <button
                  onClick={exportCSV}
                  disabled={filtered.length === 0}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40"
                >
                  ↓ CSV
                </button>
                <button
                  onClick={exportJSON}
                  disabled={filtered.length === 0}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40"
                >
                  ↓ JSON
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-6 w-6 text-indigo-600" />
            </div>
          ) : submissions.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No submissions yet.</p>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-400">No submissions match the current filters.</p>
              <button onClick={clearFilters} className="mt-2 text-xs font-medium text-indigo-600 hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Version</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Data Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filtered.map((sub) => {
                    const meta = submissionMeta(sub.data)
                    const tags = sub.data._tags ?? []
                    return (
                      <tr key={sub.id} className="transition hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-500">#{sub.id}</td>
                        <td className="px-4 py-3 text-gray-400">v{sub.version}</td>
                        <td className="px-4 py-3 text-gray-500">{formatDate(sub.created_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {meta && <Badge color={meta.color}>{meta.label}</Badge>}
                            {tags.map((t) => <Badge key={t} color="yellow">{t}</Badge>)}
                            {!meta && !tags.length && <span className="text-gray-400">—</span>}
                          </div>
                        </td>
                        <td className="max-w-xs truncate px-4 py-3">
                          <DataPreview data={sub.data} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SubmissionFeed({ submissions }) {
  if (!submissions.length) return (
    <p className="py-8 text-center text-sm text-gray-400">No submissions yet.</p>
  )
  return (
    <ul className="divide-y divide-gray-50">
      {submissions.map((sub) => {
        const meta = submissionMeta(sub.data)
        return (
          <li key={sub.id} className="flex items-start gap-3 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
              #{sub.id}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-800">{sub.form_name}</p>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-xs text-gray-400">{timeAgo(sub.created_at)}</span>
                {meta && (
                  <Badge color={meta.color}>{meta.label}</Badge>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { logout }    = useAuth()
  const navigate      = useNavigate()
  const [data,         setData]         = useState(null)
  const [user,         setUser]         = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [selectedForm, setSelectedForm] = useState(null)

  useEffect(() => {
    Promise.all([
      client.get('/user/me/'),
      client.get('/user/dashboard/'),
    ])
      .then(([userRes, dashRes]) => {
        setUser(userRes.data)
        setData(dashRes.data)
      })
      .catch(() => setError('Failed to load dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedForm && (
        <SubmissionsModal form={selectedForm} onClose={() => setSelectedForm(null)} />
      )}

      <NavBar active="dashboard" onLogout={logout} />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">

        {loading && (
          <div className="flex justify-center py-24"><Spinner className="h-8 w-8 text-indigo-600" /></div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {data && user && (
          <>
            {/* Greeting */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                {greeting()}, {user.first_name || user.username}!
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Here's an overview of your forms and submissions.
              </p>
            </div>

            {/* Stat cards */}
            <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              <StatCard label="Total Forms"   value={data.stats.total_forms}       icon="🗂"  accent="indigo" />
              <StatCard label="Published"     value={data.stats.published_forms}   icon="✅"  accent="green"  />
              <StatCard label="Drafts"        value={data.stats.draft_forms}       icon="📝"  accent="yellow" />
              <StatCard label="Submissions"   value={data.stats.total_submissions} icon="📨"  accent="blue"   />
            </div>

            {/* Two-column content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

              {/* Forms overview (wider) */}
              <div className="lg:col-span-2">
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <h2 className="font-semibold text-gray-800">Forms Overview</h2>
                    <Button variant="secondary" onClick={() => navigate('/builder/new')} className="!py-1.5 !px-3 !text-xs">
                      + New Form
                    </Button>
                  </div>
                  <div className="px-5 py-4">
                    <FormsTable forms={data.forms_summary} onView={setSelectedForm} />
                  </div>
                </div>
              </div>

              {/* Recent submissions (narrower) */}
              <div>
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <h2 className="font-semibold text-gray-800">Recent Submissions</h2>
                    <Link to="/profile?tab=submissions" className="text-xs font-medium text-indigo-600 hover:underline">
                      View all →
                    </Link>
                  </div>
                  <div className="px-5 py-2">
                    <SubmissionFeed submissions={data.recent_submissions} />
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  )
}
