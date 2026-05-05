export default function SelectField({ field, value, onChange, error }) {
  return (
    <select
      id={field.id}
      value={value ?? ''}
      onChange={(e) => onChange(field.id, e.target.value)}
      className={`input-base bg-white ${error ? 'input-error' : ''}`}
    >
      <option value="">Select an option</option>
      {(field.options ?? []).map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  )
}
