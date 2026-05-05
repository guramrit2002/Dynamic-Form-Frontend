import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client          from '../api/client'
import { getDesign }   from '../utils/themes'
import { ThemeProvider } from '../context/ThemeContext'
import FormStep    from './FormStep'
import CardStep    from './CardStep'
import ProgressBar from './ProgressBar'
import Button      from './ui/Button'
import Spinner     from './ui/Spinner'

// ── Style-specific card wrapper ───────────────────────────────────────────────

function FormCard({ style, theme, stepTitle, children, footer }) {
  if (style === 'bold') {
    return (
      <div className="form-card overflow-hidden shadow-lg">
        <div className="px-8 py-6" style={{ backgroundColor: theme.color }}>
          <h2 className="text-lg font-semibold text-white">{stepTitle}</h2>
        </div>
        <div className="bg-white px-8 py-6">
          {children}
          <div className="mt-8">{footer}</div>
        </div>
      </div>
    )
  }

  if (style === 'minimal') {
    return (
      <div className="form-card py-2">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">{stepTitle}</h2>
        {children}
        <div className="mt-8">{footer}</div>
      </div>
    )
  }

  // modern | glass | dark
  return (
    <div className="form-card border border-gray-200 bg-white p-8 shadow-sm">
      {children}
      <div className="mt-8">{footer}</div>
    </div>
  )
}

// ── Page background for glass/dark ────────────────────────────────────────────

function pageStyle(style, theme) {
  if (style === 'glass') {
    return {
      background: `linear-gradient(135deg, ${theme.color}22 0%, ${theme.colorDark}44 50%, ${theme.colorLight} 100%)`,
    }
  }
  if (style === 'dark') return { backgroundColor: '#0f172a' }
  return {}
}

// ── Main renderer ─────────────────────────────────────────────────────────────

export default function FormRenderer({ form, submitFn, successPath, pageWrapper = true }) {
  const navigate = useNavigate()
  const design   = getDesign(form.schema?.settings ?? {})
  const steps    = form.schema.steps ?? []

  const [currentStepId, setCurrentStepId] = useState(steps[0]?.id)
  const [formData,      setFormData]      = useState({})
  const [errors,        setErrors]        = useState({})
  const [apiError,      setApiError]      = useState('')
  const [submitting,    setSubmitting]    = useState(false)

  const currentStep  = steps.find((s) => s.id === currentStepId)
  const currentIndex = steps.findIndex((s) => s.id === currentStepId)
  const isFirstStep  = currentIndex === 0
  const isLastStep   = currentIndex === steps.length - 1

  function handleChange(fieldId, value) {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
    setErrors((prev) => { const n = { ...prev }; delete n[fieldId]; return n })
  }

  async function submit() {
    setApiError('')
    setSubmitting(true)
    try {
      const defaultSubmit = () =>
        client.post(`/builder/forms/${form.id}/submit/`, {
          current_step: currentStepId,
          data: formData,
        })

      const res = await (submitFn ? submitFn(currentStepId, formData) : defaultSubmit())

      if (res.data.next_step) {
        setCurrentStepId(res.data.next_step)
        setErrors({})
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        navigate(successPath ?? `/forms/${form.id}/success`, { state: { submission: res.data } })
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setErrors(err.response.data.errors ?? {})
      } else {
        setApiError(err.response?.data?.detail ?? 'Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleBack() {
    if (!isFirstStep) {
      setCurrentStepId(steps[currentIndex - 1].id)
      setErrors({})
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (!currentStep) return <p className="text-sm text-gray-500">This form has no steps.</p>

  const isCard = design.layout === 'card'

  // Buttons shown in classic layout
  const classicFooter = (
    <div className="flex items-center justify-between">
      <Button variant="secondary" onClick={handleBack} disabled={isFirstStep || submitting}>
        ← Back
      </Button>
      <button
        onClick={submit}
        disabled={submitting}
        className="t-btn inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm focus:outline-none disabled:opacity-50"
      >
        {submitting && <Spinner className="h-4 w-4" />}
        {isLastStep ? 'Submit' : 'Next →'}
      </button>
    </div>
  )

  const inner = (
    <ThemeProvider design={design}>
      <ProgressBar steps={steps} currentStepId={currentStepId} />

      <FormCard
        style={design.style}
        theme={design.theme}
        stepTitle={currentStep.title}
        footer={!isCard ? classicFooter : null}
      >
        {isCard ? (
          <CardStep
            step={currentStep}
            formData={formData}
            onChange={handleChange}
            errors={errors}
            submitting={submitting}
            onComplete={submit}
          />
        ) : (
          <FormStep
            step={currentStep}
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        )}

        {apiError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        )}
      </FormCard>
    </ThemeProvider>
  )

  if (!pageWrapper) return inner

  return (
    <div
      className="transition-colors duration-300"
      style={pageStyle(design.style, design.theme)}
    >
      {inner}
    </div>
  )
}
