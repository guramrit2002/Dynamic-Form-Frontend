import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth }   from '../context/AuthContext'
import client        from '../api/client'
import Badge         from '../components/ui/Badge'
import Spinner       from '../components/ui/Spinner'
import Button        from '../components/ui/Button'
import ShareButton   from '../components/ui/ShareButton'
import NavBar        from '../components/NavBar'

function ListIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  )
}
function GridIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  )
}
function SearchIcon() {
  return (
    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function fieldCount(form) { return form.schema?.steps?.reduce((n, s) => n + s.fields.length, 0) ?? 0 }
function stepCount(form)  { return form.schema?.steps?.length ?? 0 }

function Stat({ label, children }) {
  return (
    <div className="flex flex-col">
      <span className="text-lg font-bold leading-none text-gray-800">{children}</span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  )
}

function GridCard({ form }) {
  return (
    <div className="group flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-indigo-300 hover:shadow-md">
      <div className="h-1.5 w-full rounded-t-xl bg-indigo-100 transition group-hover:bg-indigo-400" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-semibold text-gray-800 transition group-hover:text-indigo-600">
            {form.name}
          </h3>
          <Badge color={form.is_published ? 'green' : 'gray'}>{form.is_published ? 'Published' : 'Draft'}</Badge>
        </div>
        <div className="mb-4 flex flex-wrap gap-3">
          <Stat label="Version">{form.version}</Stat>
          <Stat label="Steps">{stepCount(form)}</Stat>
          <Stat label="Fields">{fieldCount(form)}</Stat>
        </div>
        <div className="mt-auto flex items-center gap-2">
          <Link to={`/forms/${form.id}`}
            className="flex-1 rounded-lg bg-indigo-600 py-2 text-center text-sm font-medium text-white transition hover:bg-indigo-700">
            Fill Out
          </Link>
          <ShareButton formId={form.id} className="rounded-lg px-3 py-2" />
          <Link to={`/builder/${form.id}`}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
            title="Edit">✏</Link>
        </div>
      </div>
    </div>
  )
}

function ListRow({ form }) {
  return (
    <li className="flex items-stretch gap-3">
      <Link to={`/forms/${form.id}`}
        className="group flex min-w-0 flex-1 items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md">
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-gray-800 transition group-hover:text-indigo-600">
            {form.name}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
            <span>v{form.version}</span><span>·</span>
            <span>{stepCount(form)} step{stepCount(form) !== 1 ? 's' : ''}</span><span>·</span>
            <span>{fieldCount(form)} fields</span>
          </div>
        </div>
        <div className="ml-4 flex shrink-0 items-center gap-3">
          <Badge color={form.is_published ? 'green' : 'gray'}>{form.is_published ? 'Published' : 'Draft'}</Badge>
          <span className="text-gray-400 transition group-hover:text-indigo-500">→</span>
        </div>
      </Link>
      <ShareButton formId={form.id} className="rounded-xl shadow-sm" />
      <Link to={`/builder/${form.id}`}
        className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-500 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600">
        ✏ Edit
      </Link>
    </li>
  )
}

const STATUS_FILTERS = [
  { key: 'all',       label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft',     label: 'Draft' },
]

const PAGE_SIZE = 10

export default function FormsListPage() {
  const { logout } = useAuth()
  const navigate   = useNavigate()

  const [forms,           setForms]           = useState([])
  const [totalCount,      setTotalCount]      = useState(0)
  const [page,            setPage]            = useState(1)
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState('')
  const [search,          setSearch]          = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status,          setStatus]          = useState('all')
  const [view,            setView]            = useState(() => localStorage.getItem('forms_view') ?? 'list')

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams({ page })
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (status !== 'all') params.set('status', status)
    client.get(`/builder/forms/?${params}`)
      .then((r) => {
        const data = r.data
        if (Array.isArray(data)) {
          setForms(data)
          setTotalCount(data.length)
        } else {
          setForms(data.results ?? [])
          setTotalCount(data.count ?? 0)
        }
      })
      .catch(() => setError('Failed to load forms.'))
      .finally(() => setLoading(false))
  }, [page, debouncedSearch, status])

  function toggleView(v) { setView(v); localStorage.setItem('forms_view', v) }

  function handleStatusChange(key) {
    setStatus(key)
    setPage(1)
  }

  function clearFilters() {
    setSearch('')
    setDebouncedSearch('')
    setStatus('all')
    setPage(1)
  }

  const totalPages  = Math.ceil(totalCount / PAGE_SIZE)
  const isFiltering = !!(debouncedSearch || status !== 'all')

  return (
    <div className="min-h-screen bg-gray-50">

      <NavBar
        active="forms"
        onLogout={logout}
        onCreateForm={() => navigate('/builder/new')}
        maxWidth="max-w-5xl"
      />

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Forms</h1>
          {!loading && (
            <p className="mt-0.5 text-sm text-gray-500">{totalCount} form{totalCount !== 1 ? 's' : ''} total</p>
          )}
        </div>

        {/* Toolbar */}
        {!loading && !error && (totalCount > 0 || isFiltering) && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="relative w-full min-w-0 sm:flex-1 sm:min-w-48">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center"><SearchIcon /></span>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search forms…"
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
              {search && (
                <button onClick={() => { setSearch(''); setDebouncedSearch(''); setPage(1) }}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600">✕</button>
              )}
            </div>

            <div className="flex overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
              {STATUS_FILTERS.map((f) => (
                <button key={f.key} onClick={() => handleStatusChange(f.key)}
                  className={`px-4 py-2 text-sm font-medium transition
                    ${status === f.key ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {f.label}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
              {[['list', ListIcon], ['grid', GridIcon]].map(([v, Icon]) => (
                <button key={v} onClick={() => toggleView(v)} title={`${v} view`}
                  className={`flex items-center justify-center px-3 py-2 transition
                    ${view === v ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <Icon />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* States */}
        {loading && <div className="flex justify-center py-20"><Spinner className="h-8 w-8 text-indigo-600" /></div>}
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {!loading && !error && totalCount === 0 && !isFiltering && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <p className="text-gray-400">No forms yet.</p>
            <button onClick={() => navigate('/builder/new')} className="mt-3 text-sm font-medium text-indigo-600 hover:underline">
              Create your first form →
            </button>
          </div>
        )}

        {!loading && !error && forms.length === 0 && isFiltering && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white py-16 text-center">
            <p className="text-gray-400">No forms match your search.</p>
            <button onClick={clearFilters} className="mt-2 text-sm font-medium text-indigo-600 hover:underline">
              Clear filters
            </button>
          </div>
        )}

        {!loading && forms.length > 0 && view === 'list' && (
          <ul className="hidden sm:block space-y-4">{forms.map((form) => <ListRow key={form.id} form={form} />)}</ul>
        )}
        {!loading && forms.length > 0 && (
          <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3${view === 'list' ? ' sm:hidden' : ''}`}>
            {forms.map((form) => <GridCard key={form.id} form={form} />)}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-500">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
