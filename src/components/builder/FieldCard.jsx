import { useState } from 'react'
import OptionsEditor     from './OptionsEditor'
import ValidationsEditor from './ValidationsEditor'
import VisibilityEditor  from './VisibilityEditor'

const FIELD_TYPES = [
  { value: 'text',     label: 'Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'number',   label: 'Number' },
  { value: 'email',    label: 'Email' },
  { value: 'date',     label: 'Date' },
  { value: 'select',   label: 'Dropdown' },
  { value: 'radio',    label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
]

const TYPE_COLORS = {
  text:     'bg-blue-50 text-blue-700',
  textarea: 'bg-purple-50 text-purple-700',
  number:   'bg-orange-50 text-orange-700',
  email:    'bg-green-50 text-green-700',
  date:     'bg-pink-50 text-pink-700',
  select:   'bg-yellow-50 text-yellow-700',
  radio:    'bg-indigo-50 text-indigo-700',
  checkbox: 'bg-teal-50 text-teal-700',
}

const HAS_OPTIONS = new Set(['select', 'radio', 'checkbox'])

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

export default function FieldCard({ field, isFirst, isLast, allFields, onChange, onMove, onRemove }) {
  const [expanded, setExpanded] = useState(false)

  const otherFields = allFields.filter((f) => f.id !== field.id)

  return (
    <div className={`rounded-xl border bg-white shadow-sm transition-all ${expanded ? 'border-indigo-200 shadow-md' : 'border-gray-200'}`}>

      {/* Collapsed header */}
      <div className="flex items-center gap-3 px-4 py-3">

        {/* Order buttons */}
        <div className="flex shrink-0 flex-col gap-0.5">
          <button
            onClick={() => onMove('up')}
            disabled={isFirst}
            className="rounded px-1 py-0.5 text-xs text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-20"
            title="Move up"
          >▲</button>
          <button
            onClick={() => onMove('down')}
            disabled={isLast}
            className="rounded px-1 py-0.5 text-xs text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-20"
            title="Move down"
          >▼</button>
        </div>

        {/* Type badge */}
        <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[field.type] ?? 'bg-gray-100 text-gray-600'}`}>
          {field.type}
        </span>

        {/* Label */}
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700">
          {field.label || <span className="italic text-gray-400">Unlabeled field</span>}
        </span>

        {/* Indicators */}
        {field.required && (
          <span className="shrink-0 text-xs font-semibold text-red-500">required</span>
        )}
        {field.visibility && (
          <span className="shrink-0 text-xs text-gray-400" title="Has visibility condition">👁</span>
        )}
        {(field.validations?.length > 0) && (
          <span className="shrink-0 text-xs text-gray-400" title="Has validations">✓ {field.validations.length}</span>
        )}

        {/* Expand / delete */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50"
        >
          {expanded ? 'Done ▲' : 'Edit ▼'}
        </button>
        <button
          onClick={onRemove}
          className="shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
          title="Delete field"
        >
          🗑
        </button>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div className="space-y-5 border-t border-gray-100 px-5 py-5">

          {/* Type + Label */}
          <div>
            <label className="label-base">
              Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => onChange({ label: e.target.value })}
              placeholder="e.g. Full Name"
              className="input-base"
            />
          </div>

          {/* Placeholder + Required */}
          <div className="grid grid-cols-2 gap-4">
            {!HAS_OPTIONS.has(field.type) && (
              <div>
                <label className="label-base">Placeholder</label>
                <input
                  type="text"
                  value={field.placeholder ?? ''}
                  onChange={(e) => onChange({ placeholder: e.target.value })}
                  placeholder="Hint text shown in the input"
                  className="input-base"
                />
              </div>
            )}
            <div className="flex items-center gap-3 self-end pb-2">
              <span className="text-sm text-gray-700">Required</span>
              <Toggle
                enabled={field.required}
                onToggle={() => onChange({ required: !field.required })}
              />
            </div>
          </div>

          {/* Options */}
          {HAS_OPTIONS.has(field.type) && (
            <OptionsEditor
              options={field.options ?? []}
              onChange={(options) => onChange({ options })}
            />
          )}

          {/* Validations */}
          <ValidationsEditor
            validations={field.validations ?? []}
            onChange={(validations) => onChange({ validations })}
          />

          {/* Visibility */}
          <VisibilityEditor
            visibility={field.visibility ?? null}
            otherFields={otherFields}
            onChange={(visibility) => onChange({ visibility })}
          />
        </div>
      )}
    </div>
  )
}
