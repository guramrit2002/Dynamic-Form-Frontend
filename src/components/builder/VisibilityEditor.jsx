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

export default function VisibilityEditor({ visibility, otherFields, onChange }) {
  const enabled   = !!visibility
  const condition = visibility?.condition ?? { field: '', operator: '==', value: '' }

  function toggle() {
    if (enabled) {
      onChange(null)
    } else {
      onChange({ condition: { field: otherFields[0]?.id ?? '', operator: '==', value: '' } })
    }
  }

  function updateCondition(changes) {
    onChange({ condition: { ...condition, ...changes } })
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="label-base mb-0 text-sm font-medium text-gray-700">Visibility Condition</span>
        <Toggle enabled={enabled} onToggle={toggle} />
        <span className="text-xs text-gray-400">{enabled ? 'Show when condition is met' : 'Always visible'}</span>
      </div>

      {enabled && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-gray-50 px-4 py-3">
          <span className="text-sm text-gray-500 shrink-0">Show when</span>
          <select
            value={condition.field}
            onChange={(e) => updateCondition({ field: e.target.value })}
            className="input-base min-w-0 flex-1 bg-white"
          >
            <option value="">Select a field</option>
            {otherFields.map((f) => (
              <option key={f.id} value={f.id}>{f.label || f.id}</option>
            ))}
          </select>
          <select
            value={condition.operator}
            onChange={(e) => updateCondition({ operator: e.target.value })}
            className="input-base w-20 shrink-0 bg-white"
          >
            {OPERATORS.map((op) => <option key={op} value={op}>{op}</option>)}
          </select>
          <input
            value={condition.value}
            onChange={(e) => updateCondition({ value: e.target.value })}
            placeholder="value"
            className="input-base w-28 shrink-0"
          />
        </div>
      )}
    </div>
  )
}
