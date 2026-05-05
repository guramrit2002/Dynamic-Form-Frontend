import { useState, useEffect, useRef } from 'react'
import FormField from './FormField'
import { getVisibleFieldIds } from '../utils/conditionEngine'
import Spinner from './ui/Spinner'

export default function CardStep({ step, formData, onChange, errors, onComplete, submitting }) {
  const visibleIds = getVisibleFieldIds(step, formData)
  const fields     = step.fields.filter((f) => visibleIds.has(f.id))

  const [idx,       setIdx]       = useState(0)
  const [direction, setDirection] = useState('right') // for animation
  const fieldRef = useRef(null)

  const field    = fields[idx]
  const isLast   = idx === fields.length - 1
  const isFirst  = idx === 0

  // Re-focus input when field changes
  useEffect(() => {
    const el = fieldRef.current?.querySelector('input, textarea, select')
    if (el) setTimeout(() => el.focus(), 50)
  }, [idx])

  // Enter key advances to next
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function goNext() {
    if (isLast) { onComplete(); return }
    setDirection('right')
    setIdx((i) => i + 1)
  }

  function goPrev() {
    if (isFirst) return
    setDirection('left')
    setIdx((i) => i - 1)
  }

  if (!field) return null

  const fieldErrors = errors?.[field.id] ?? []
  const animClass   = direction === 'right' ? 'card-enter-right' : 'card-enter-left'

  return (
    <div className="flex flex-col">
      {/* Field counter */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex gap-1.5">
          {fields.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === idx ? '1.5rem' : '0.5rem',
                backgroundColor: i <= idx ? 'var(--theme-color)' : '#e2e8f0',
              }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400">{idx + 1} / {fields.length}</span>
      </div>

      {/* Animated field */}
      <div key={field.id} className={`mb-8 space-y-1 ${animClass}`} ref={fieldRef}>
        <label htmlFor={field.id} className="text-xl font-semibold text-gray-800 leading-snug">
          {field.label}
          {field.required && <span className="ml-1 t-text text-lg">*</span>}
        </label>

        {field.placeholder && (
          <p className="mb-3 text-sm text-gray-400">{field.placeholder}</p>
        )}

        <div className="mt-4">
          <FormField
            field={field}
            value={formData[field.id]}
            onChange={onChange}
            errors={errors}
          />
        </div>

        {fieldErrors.map((err, i) => (
          <p key={i} className="text-xs text-red-500">{err}</p>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={goNext}
          disabled={submitting}
          className="t-btn inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium shadow-sm focus:outline-none disabled:opacity-50"
        >
          {submitting && isLast && <Spinner className="h-4 w-4" />}
          {isLast ? 'Submit' : 'OK →'}
        </button>

        {!isFirst && (
          <button
            onClick={goPrev}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            ↑ Back
          </button>
        )}

        {!isLast && (
          <span className="text-xs text-gray-400">or press <kbd className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-xs">Enter ↵</kbd></span>
        )}
      </div>
    </div>
  )
}
