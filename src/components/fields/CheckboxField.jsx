export default function CheckboxField({ field, value, onChange }) {
  const selected = Array.isArray(value) ? value : []

  function toggle(opt) {
    const next = selected.includes(opt)
      ? selected.filter((v) => v !== opt)
      : [...selected, opt]
    onChange(field.id, next)
  }

  return (
    <div className="space-y-2">
      {(field.options ?? []).map((opt) => (
        <label key={opt} className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">{opt}</span>
        </label>
      ))}
    </div>
  )
}
