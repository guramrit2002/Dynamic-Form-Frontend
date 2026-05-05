import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import client from '../api/client'
import {
  createStep, createField,
  createNavRule, createRule,
  cleanSchema, genId,
} from '../utils/schemaHelpers'
import StepList         from '../components/builder/StepList'
import FieldCard        from '../components/builder/FieldCard'
import NavigationEditor from '../components/builder/NavigationEditor'
import RulesEditor      from '../components/builder/RulesEditor'
import ThemePicker    from '../components/builder/ThemePicker'
import DesignPreview  from '../components/builder/DesignPreview'
import Button      from '../components/ui/Button'
import Spinner     from '../components/ui/Spinner'
import ShareButton from '../components/ui/ShareButton'

const TABS = ['steps', 'navigation', 'rules', 'design']

export default function FormBuilderPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isEdit   = !!id

  const [formName,    setFormName]    = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [schema,      setSchema]      = useState({
    steps: [createStep(0)],
    navigation: [],
    rules: [],
    settings: {},
  })
  const [activeStepId, setActiveStepId] = useState(null)
  const [activeTab,    setActiveTab]    = useState('steps')
  const [saving,       setSaving]       = useState(false)
  const [loading,      setLoading]      = useState(isEdit)
  const [loadError,    setLoadError]    = useState('')
  const [saveError,    setSaveError]    = useState('')
  const [saved,        setSaved]        = useState(false)

  // Set initial active step once schema is ready
  useEffect(() => {
    if (!activeStepId && schema.steps.length > 0) {
      setActiveStepId(schema.steps[0].id)
    }
  }, [schema.steps, activeStepId])

  // Load form in edit mode
  useEffect(() => {
    if (!isEdit) return
    client.get(`/builder/forms/${id}/`)
      .then((r) => {
        const f = r.data
        setFormName(f.name)
        setIsPublished(f.is_published)
        const nav   = (f.schema.navigation ?? []).map((n) => ({ _id: genId('nav'),  ...n }))
        const rules = (f.schema.rules      ?? []).map((r) => ({ _id: genId('rule'), ...r }))
        setSchema({ ...f.schema, navigation: nav, rules })
        setActiveStepId(f.schema.steps?.[0]?.id ?? null)
      })
      .catch(() => setLoadError('Failed to load form.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  // ── Step operations ──────────────────────────────────────────────────
  function addStep() {
    const step = createStep(schema.steps.length)
    setSchema((s) => ({ ...s, steps: [...s.steps, step] }))
    setActiveStepId(step.id)
  }

  function removeStep(stepId) {
    const remaining = schema.steps.filter((s) => s.id !== stepId)
    setSchema((s) => ({ ...s, steps: remaining }))
    if (activeStepId === stepId) {
      setActiveStepId(remaining[0]?.id ?? null)
    }
  }

  function renameStep(stepId, title) {
    setSchema((s) => ({
      ...s,
      steps: s.steps.map((st) => (st.id === stepId ? { ...st, title } : st)),
    }))
  }

  // ── Field operations ─────────────────────────────────────────────────
  function addField(stepId) {
    const field = createField()
    setSchema((s) => ({
      ...s,
      steps: s.steps.map((st) =>
        st.id === stepId ? { ...st, fields: [...st.fields, field] } : st
      ),
    }))
  }

  function removeField(stepId, fieldId) {
    setSchema((s) => ({
      ...s,
      steps: s.steps.map((st) =>
        st.id === stepId
          ? { ...st, fields: st.fields.filter((f) => f.id !== fieldId) }
          : st
      ),
    }))
  }

  function updateField(stepId, fieldId, changes) {
    setSchema((s) => ({
      ...s,
      steps: s.steps.map((st) =>
        st.id === stepId
          ? { ...st, fields: st.fields.map((f) => (f.id === fieldId ? { ...f, ...changes } : f)) }
          : st
      ),
    }))
  }

  function moveField(stepId, fieldId, direction) {
    setSchema((s) => ({
      ...s,
      steps: s.steps.map((st) => {
        if (st.id !== stepId) return st
        const fields  = [...st.fields]
        const idx     = fields.findIndex((f) => f.id === fieldId)
        const newIdx  = direction === 'up' ? idx - 1 : idx + 1
        if (newIdx < 0 || newIdx >= fields.length) return st
        ;[fields[idx], fields[newIdx]] = [fields[newIdx], fields[idx]]
        return { ...st, fields }
      }),
    }))
  }

  // ── Save ─────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!formName.trim()) { setSaveError('Form name is required.'); return }
    setSaveError('')
    setSaving(true)
    setSaved(false)
    try {
      const payload = {
        name: formName,
        is_published: isPublished,
        schema: cleanSchema(schema),
      }
      const res = isEdit
        ? await client.patch(`/builder/forms/${id}/`, payload)
        : await client.post('/builder/forms/', payload)

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      if (!isEdit) navigate(`/builder/${res.data.id}`, { replace: true })
    } catch (err) {
      const data = err.response?.data ?? {}
      setSaveError(
        data?.schema?.[0]     ??
        data?.schema?.steps?.[0] ??
        data?.name?.[0]       ??
        JSON.stringify(data).slice(0, 120)
      )
    } finally {
      setSaving(false)
    }
  }

  // ── Derived ──────────────────────────────────────────────────────────
  const activeStep = schema.steps.find((s) => s.id === activeStepId)

  const allFields = schema.steps.flatMap((st) =>
    st.fields.map((f) => ({ id: f.id, label: f.label || f.id, stepTitle: st.title }))
  )

  // ── Render ───────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="h-8 w-8 text-indigo-600" />
    </div>
  )

  if (loadError) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-red-600">
      <p>{loadError}</p>
      <Link to="/" className="text-sm text-indigo-600 hover:underline">← Back to Forms</Link>
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <Link to="/" className="shrink-0 text-sm text-gray-500 transition hover:text-indigo-600">
            ← Forms
          </Link>

          <input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Untitled Form"
            className="min-w-0 flex-1 rounded-lg border border-transparent px-3 py-1.5 text-lg font-semibold text-gray-800 transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          {/* Published toggle */}
          <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm text-gray-600">
            <span>Published</span>
            <button
              onClick={() => setIsPublished((p) => !p)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${isPublished ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${isPublished ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </label>

          {isEdit && <ShareButton formId={id} className="shrink-0" />}

          <Button onClick={handleSave} disabled={saving} className="shrink-0">
            {saving && <Spinner className="h-4 w-4" />}
            {saved ? '✓ Saved' : isEdit ? 'Save Changes' : 'Create Form'}
          </Button>
        </div>

        {saveError && (
          <p className="mx-auto max-w-6xl px-6 pb-2 text-sm text-red-600">{saveError}</p>
        )}
      </header>

      {/* ── Tabs ── */}
      <div className="border-b border-gray-200 bg-white px-6">
        <div className="mx-auto flex max-w-6xl gap-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-1 py-3 text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {tab === 'steps'      && <span className="ml-1.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">{schema.steps.length}</span>}
              {tab === 'navigation' && schema.navigation.length > 0 && <span className="ml-1.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">{schema.navigation.length}</span>}
              {tab === 'rules'      && schema.rules.length > 0      && <span className="ml-1.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">{schema.rules.length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">

        {/* Steps tab */}
        {activeTab === 'steps' && (
          <div className="flex gap-6">
            <StepList
              steps={schema.steps}
              activeStepId={activeStepId}
              onSelect={setActiveStepId}
              onAdd={addStep}
              onRemove={removeStep}
              onRename={renameStep}
            />

            <div className="min-w-0 flex-1">
              {activeStep ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{activeStep.title}</h2>
                      <p className="text-sm text-gray-400">
                        {activeStep.fields.length} field{activeStep.fields.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Button variant="secondary" onClick={() => addField(activeStep.id)}>
                      + Add Field
                    </Button>
                  </div>

                  {activeStep.fields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
                      <p className="text-gray-400">No fields in this step yet.</p>
                      <button
                        onClick={() => addField(activeStep.id)}
                        className="mt-3 text-sm font-medium text-indigo-600 hover:underline"
                      >
                        Add your first field →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeStep.fields.map((field, idx) => (
                        <FieldCard
                          key={field.id}
                          field={field}
                          isFirst={idx === 0}
                          isLast={idx === activeStep.fields.length - 1}
                          allFields={allFields}
                          onChange={(changes) => updateField(activeStep.id, field.id, changes)}
                          onMove={(dir) => moveField(activeStep.id, field.id, dir)}
                          onRemove={() => removeField(activeStep.id, field.id)}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center py-20 text-gray-400">
                  Select a step on the left to edit its fields.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation tab */}
        {activeTab === 'navigation' && (
          <NavigationEditor
            navigation={schema.navigation}
            steps={schema.steps}
            allFields={allFields}
            onChange={(nav) => setSchema((s) => ({ ...s, navigation: nav }))}
          />
        )}

        {/* Rules tab */}
        {activeTab === 'rules' && (
          <RulesEditor
            rules={schema.rules}
            allFields={allFields}
            onChange={(rules) => setSchema((s) => ({ ...s, rules }))}
          />
        )}

        {/* Design tab */}
        {activeTab === 'design' && (
          <div className="flex items-start gap-8">
            {/* Options panel */}
            <div className="min-w-0 flex-1">
              <ThemePicker
                current={schema.settings ?? {}}
                onChange={(settings) =>
                  setSchema((s) => ({ ...s, settings }))
                }
              />
            </div>

            {/* Live preview */}
            <DesignPreview
              settings={schema.settings ?? {}}
              formName={formName}
            />
          </div>
        )}
      </main>
    </div>
  )
}
