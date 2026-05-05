import { useState } from 'react'

const VALIDATION_TYPES = [
  { value: 'min',   label: 'Min' },
  { value: 'max',   label: 'Max' },
  { value: 'regex', label: 'Regex' },
]

export default function ValidationsEditor({ validations, onChange }) {
  const [type, setType]   = useState('min')
  const [value, setValue] = useState('')

  function add() {
    if (!value.trim()) return
    const parsed = type === 'regex' ? value : Number(value)
    onChange([...validations, { type, value: parsed }])
    setValue('')
  }

  function remove(idx) {
    onChange(validations.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <label className="label-base">Validations</label>

      {validations.length > 0 && (
        <ul className="mb-3 space-y-1.5">
          {validations.map((v, i) => (
            <li key={i} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">
              <span className="font-medium text-gray-700 w-10">{v.type}</span>
              <span className="text-gray-400">=</span>
              <span className="flex-1 text-gray-700">{String(v.value)}</span>
              <button
                onClick={() => remove(i)}
                className="text-gray-400 transition hover:text-red-500"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input-base w-24 bg-white"
        >
          {VALIDATION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={type === 'regex' ? 'e.g. ^[A-Z]' : 'value'}
          className="input-base"
        />
        <button
          onClick={add}
          className="shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
        >
          + Add
        </button>
      </div>
    </div>
  )
}
