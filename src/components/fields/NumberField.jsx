export default function NumberField({ field, value, onChange, error }) {
  return (
    <input
      type="number"
      id={field.id}
      value={value ?? ''}
      placeholder={field.placeholder ?? ''}
      onChange={(e) => onChange(field.id, e.target.value)}
      className={`input-base ${error ? 'input-error' : ''}`}
    />
  )
}
