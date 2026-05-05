export default function DateField({ field, value, onChange, error }) {
  return (
    <input
      type="date"
      id={field.id}
      value={value ?? ''}
      onChange={(e) => onChange(field.id, e.target.value)}
      className={`input-base ${error ? 'input-error' : ''}`}
    />
  )
}
