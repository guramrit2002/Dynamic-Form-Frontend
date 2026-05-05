import { useState } from 'react'

export default function OptionsEditor({ options, onChange }) {
  const [newOpt, setNewOpt] = useState('')

  function add() {
    const trimmed = newOpt.trim()
    if (!trimmed || options.includes(trimmed)) return
    onChange([...options, trimmed])
    setNewOpt('')
  }

  function remove(opt) {
    onChange(options.filter((o) => o !== opt))
  }

  return (
    <div>
      <label className="label-base">Options</label>

      <div className="mb-2 flex min-h-8 flex-wrap gap-1.5">
        {options.length === 0 && (
          <p className="text-xs text-gray-400">No options added yet.</p>
        )}
        {options.map((opt) => (
          <span
            key={opt}
            className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-0.5 text-sm text-indigo-700"
          >
            {opt}
            <button
              onClick={() => remove(opt)}
              className="font-bold text-indigo-400 hover:text-indigo-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newOpt}
          onChange={(e) => setNewOpt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Type an option and press Enter"
          className="input-base"
        />
        <button
          onClick={add}
          className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Add
        </button>
      </div>
    </div>
  )
}
