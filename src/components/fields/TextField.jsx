export default function TextField({ field, value, onChange, error }) {
  return (
    <input
      type="text"
      id={field.id}
      value={value ?? ''}
      placeholder={field.placeholder ?? ''}
      onChange={(e) => onChange(field.id, e.target.value)}
      className={`input-base ${error ? 'input-error' : ''}`}
    />
  )
}
