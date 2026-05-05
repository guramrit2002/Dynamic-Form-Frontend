export default function EmailField({ field, value, onChange, error }) {
  return (
    <input
      type="email"
      id={field.id}
      value={value ?? ''}
      placeholder={field.placeholder ?? ''}
      onChange={(e) => onChange(field.id, e.target.value)}
      className={`input-base ${error ? 'input-error' : ''}`}
    />
  )
}
