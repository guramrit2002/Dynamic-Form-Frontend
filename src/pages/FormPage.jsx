import { useEffect, useState } from 'react'
import { useParams, Link }     from 'react-router-dom'
import client        from '../api/client'
import { getDesign } from '../utils/themes'
import FormRenderer  from '../components/FormRenderer'
import Spinner       from '../components/ui/Spinner'

function pageStyle(design) {
  if (!design) return {}
  if (design.style === 'glass') {
    return {
      background: `linear-gradient(135deg, ${design.theme.color}22 0%, ${design.theme.colorDark}44 50%, ${design.theme.colorLight} 100%)`,
      minHeight: '100vh',
    }
  }
  if (design.style === 'dark') return { backgroundColor: '#0f172a', minHeight: '100vh' }
  return { backgroundColor: design.theme.colorLight }
}

export default function FormPage() {
  const { id }  = useParams()
  const [form,    setForm]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    client.get(`/builder/forms/${id}/`)
      .then((r) => setForm(r.data))
      .catch((err) => {
        if (err.response?.status === 404) setError('Form not found.')
        else setError('Failed to load form.')
      })
      .finally(() => setLoading(false))
  }, [id])

  const design = form ? getDesign(form.schema?.settings ?? {}) : null

  return (
    <div className="min-h-screen px-4 py-10 transition-colors duration-300" style={pageStyle(design)}>
      <div className="mx-auto max-w-2xl">

        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="transition hover:text-indigo-600">Forms</Link>
          <span>/</span>
          <span className={`font-medium ${design?.style === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
            {form?.name ?? '...'}
          </span>
        </nav>

        {loading && (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8 text-indigo-600" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <p className="font-medium text-red-700">{error}</p>
            <Link to="/" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">← Back to Forms</Link>
          </div>
        )}

        {form && <FormRenderer form={form} pageWrapper={false} />}
      </div>
    </div>
  )
}
