import { useEffect, useState } from 'react'
import { useParams }           from 'react-router-dom'
import { publicClient }  from '../api/client'
import { getDesign }     from '../utils/themes'
import FormRenderer      from '../components/FormRenderer'
import Spinner           from '../components/ui/Spinner'

function pageStyle(design) {
  if (!design) return { backgroundColor: '#f9fafb' }
  if (design.style === 'glass') {
    return {
      background: `linear-gradient(135deg, ${design.theme.color}22 0%, ${design.theme.colorDark}44 50%, ${design.theme.colorLight} 100%)`,
    }
  }
  if (design.style === 'dark') return { backgroundColor: '#0f172a' }
  return { backgroundColor: design.theme.colorLight }
}

export default function PublicFormPage() {
  const { id } = useParams()
  const [form,    setForm]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    publicClient.get(`/builder/forms/${id}/share/`)
      .then((r) => setForm(r.data))
      .catch((err) => {
        if (err.response?.status === 404) setError('This form does not exist.')
        else setError('Failed to load the form. Please try again later.')
      })
      .finally(() => setLoading(false))
  }, [id])

  function submitFn(currentStepId, formData) {
    return publicClient.post(`/builder/forms/${id}/share/submit/`, {
      current_step: currentStepId,
      data: formData,
    })
  }

  const design = form ? getDesign(form.schema?.settings ?? {}) : null
  const isDark  = design?.style === 'dark'

  return (
    <div
      className="min-h-screen px-4 py-10 transition-colors duration-300"
      style={pageStyle(design)}
    >
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white text-lg font-bold shadow"
            style={{ backgroundColor: design?.theme.color ?? '#4f46e5' }}
          >
            F
          </div>
          {form && (
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {form.name}
            </h1>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8" style={{ color: design?.theme.color ?? '#4f46e5' }} />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <p className="font-medium text-red-700">{error}</p>
          </div>
        )}

        {form && (
          <FormRenderer
            form={form}
            submitFn={submitFn}
            successPath={`/share/${id}/success`}
            pageWrapper={false}
          />
        )}

        <p className={`mt-8 text-center text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          Powered by{' '}
          <span className="font-medium" style={{ color: design?.theme.color ?? '#6366f1' }}>
            Dynamic Form
          </span>
        </p>
      </div>
    </div>
  )
}
