import { createRule } from '../../utils/schemaHelpers'

const OPERATORS = ['==', '!=', '>', '<', '>=', '<=']
const ACTIONS = [
  { value: 'set_value',  label: 'Set Value' },
  { value: 'set_status', label: 'Set Status' },
  { value: 'tag',        label: 'Add Tag' },
]

export default function RulesEditor({ rules, allFields, onChange }) {
  function add() {
    onChange([...rules, createRule()])
  }

  function remove(id) {
    onChange(rules.filter((r) => r._id !== id))
  }

  function updateIf(id, changes) {
    onChange(rules.map((r) => (r._id === id ? { ...r, if: { ...r.if, ...changes } } : r)))
  }

  function updateThen(id, changes) {
    onChange(rules.map((r) => (r._id === id ? { ...r, then: { ...r.then, ...changes } } : r)))
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Post-Submit Rules</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Automatically set values, assign a status, or add tags when conditions are met after submission.
          </p>
        </div>
        <button
          onClick={add}
          className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          + Add Rule
        </button>
      </div>

      {rules.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">
          No rules yet — submissions will be saved as-is.
        </div>
      )}

      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule._id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-4">

                {/* IF */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">If</p>
                  <div className="flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 px-4 py-3">
                    <select
                      value={rule.if.field}
                      onChange={(e) => updateIf(rule._id, { field: e.target.value })}
                      className="input-base min-w-0 flex-1 bg-white"
                    >
                      <option value="">Select field</option>
                      {allFields.map((f) => <option key={f.id} value={f.id}>{f.label || f.id}</option>)}
                    </select>
                    <select
                      value={rule.if.operator}
                      onChange={(e) => updateIf(rule._id, { operator: e.target.value })}
                      className="input-base w-20 shrink-0 bg-white"
                    >
                      {OPERATORS.map((op) => <option key={op} value={op}>{op}</option>)}
                    </select>
                    <input
                      value={rule.if.value}
                      onChange={(e) => updateIf(rule._id, { value: e.target.value })}
                      placeholder="value"
                      className="input-base w-28 shrink-0"
                    />
                  </div>
                </div>

                {/* THEN */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Then</p>
                  <div className="flex flex-wrap items-center gap-2 rounded-lg bg-indigo-50 px-4 py-3">
                    <select
                      value={rule.then.action}
                      onChange={(e) => updateThen(rule._id, { action: e.target.value, field: '', value: '' })}
                      className="input-base w-36 shrink-0 bg-white"
                    >
                      {ACTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                    </select>

                    {rule.then.action === 'set_value' && (
                      <select
                        value={rule.then.field ?? ''}
                        onChange={(e) => updateThen(rule._id, { field: e.target.value })}
                        className="input-base min-w-0 flex-1 bg-white"
                      >
                        <option value="">Select field</option>
                        {allFields.map((f) => <option key={f.id} value={f.id}>{f.label || f.id}</option>)}
                      </select>
                    )}

                    <input
                      value={rule.then.value ?? ''}
                      onChange={(e) => updateThen(rule._id, { value: e.target.value })}
                      placeholder={rule.then.action === 'tag' ? 'tag name' : 'value'}
                      className="input-base w-32 shrink-0"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => remove(rule._id)}
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
