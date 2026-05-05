import { useState } from 'react'

export default function StepList({ steps, activeStepId, onSelect, onAdd, onRemove, onRename }) {
  const [editingId, setEditingId]   = useState(null)
  const [editTitle, setEditTitle]   = useState('')

  function startEdit(step, e) {
    e.stopPropagation()
    setEditingId(step.id)
    setEditTitle(step.title)
  }

  function commitEdit(stepId) {
    if (editTitle.trim()) onRename(stepId, editTitle.trim())
    setEditingId(null)
  }

  return (
    <aside className="w-52 shrink-0">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Steps</p>

      <ul className="space-y-1">
        {steps.map((step, i) => (
          <li key={step.id} className="group relative">
            {editingId === step.id ? (
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => commitEdit(step.id)}
                onKeyDown={(e) => e.key === 'Enter' && commitEdit(step.id)}
                className="w-full rounded-lg border border-indigo-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            ) : (
              <button
                onClick={() => onSelect(step.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition
                  ${activeStepId === step.id
                    ? 'bg-indigo-50 font-medium text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold
                  ${activeStepId === step.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {i + 1}
                </span>
                <span className="flex-1 truncate">{step.title}</span>
              </button>
            )}

            {/* Rename + delete buttons on hover */}
            {editingId !== step.id && (
              <div className="absolute right-1 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 group-hover:flex">
                <button
                  onClick={(e) => startEdit(step, e)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                  title="Rename step"
                >
                  ✏
                </button>
                {steps.length > 1 && (
                  <button
                    onClick={() => onRemove(step.id)}
                    className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    title="Delete step"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={onAdd}
        className="mt-3 flex w-full items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 transition hover:border-indigo-300 hover:text-indigo-600"
      >
        + Add Step
      </button>
      <p className="mt-2 text-xs text-gray-400">Hover a step to rename or delete it.</p>
    </aside>
  )
}
