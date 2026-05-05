import { createNavRule } from '../../utils/schemaHelpers'

const OPERATORS = ['==', '!=', '>', '<', '>=', '<=']

function Toggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${enabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function NavigationEditor({ navigation, steps, allFields, onChange }) {
  function add() {
    onChange([...navigation, createNavRule()])
  }

  function remove(id) {
    onChange(navigation.filter((n) => n._id !== id))
  }

  function update(id, changes) {
    onChange(navigation.map((n) => (n._id === id ? { ...n, ...changes } : n)))
  }

  function updateCondition(id, changes) {
    onChange(
      navigation.map((n) => {
        if (n._id !== id) return n
        return { ...n, condition: { ...(n.condition ?? { field: '', operator: '==', value: '' }), ...changes } }
      })
    )
  }

  function toggleCondition(id) {
    const nav = navigation.find((n) => n._id === id)
    update(id, {
      condition: nav.condition
        ? null
        : { field: allFields[0]?.id ?? '', operator: '==', value: '' },
    })
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Navigation Rules</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Control which step the user sees next. Without rules, steps proceed in order.
          </p>
        </div>
        <button
          onClick={add}
          className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          + Add Rule
        </button>
      </div>

      {navigation.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">
          No navigation rules — steps proceed in linear order.
        </div>
      )}

      <div className="space-y-4">
        {navigation.map((nav) => (
          <div key={nav._id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-4">

                {/* From → To */}
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="label-base">From Step</label>
                    <select
                      value={nav.from_step}
                      onChange={(e) => update(nav._id, { from_step: e.target.value })}
                      className="input-base bg-white"
                    >
                      <option value="">Select step</option>
                      {steps.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                  </div>
                  <span className="mb-2.5 shrink-0 text-gray-400">→</span>
                  <div className="flex-1">
                    <label className="label-base">To Step</label>
                    <select
                      value={nav.to_step}
                      onChange={(e) => update(nav._id, { to_step: e.target.value })}
                      className="input-base bg-white"
                    >
                      <option value="">Select step</option>
                      {steps.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                  </div>
                </div>

                {/* Condition toggle */}
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Only when a condition is met</span>
                    <Toggle enabled={!!nav.condition} onToggle={() => toggleCondition(nav._id)} />
                  </div>

                  {nav.condition && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 px-4 py-3">
                      <select
                        value={nav.condition.field}
                        onChange={(e) => updateCondition(nav._id, { field: e.target.value })}
                        className="input-base min-w-0 flex-1 bg-white"
                      >
                        <option value="">Select field</option>
                        {allFields.map((f) => <option key={f.id} value={f.id}>{f.label || f.id}</option>)}
                      </select>
                      <select
                        value={nav.condition.operator}
                        onChange={(e) => updateCondition(nav._id, { operator: e.target.value })}
                        className="input-base w-20 shrink-0 bg-white"
                      >
                        {OPERATORS.map((op) => <option key={op} value={op}>{op}</option>)}
                      </select>
                      <input
                        value={nav.condition.value}
                        onChange={(e) => updateCondition(nav._id, { value: e.target.value })}
                        placeholder="value"
                        className="input-base w-28 shrink-0"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => remove(nav._id)}
                className="mt-1 shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                title="Remove rule"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
