export default function RadioField({ field, value, onChange }) {
  return (
    <div className="space-y-2">
      {(field.options ?? []).map((opt) => (
        <label key={opt} className="flex cursor-pointer items-center gap-3">
          <input
            type="radio"
            name={field.id}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(field.id, opt)}
            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">{opt}</span>
        </label>
      ))}
    </div>
  )
}
