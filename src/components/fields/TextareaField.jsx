export default function TextareaField({ field, value, onChange, error }) {
  return (
    <textarea
      id={field.id}
      rows={4}
      value={value ?? ''}
      placeholder={field.placeholder ?? ''}
      onChange={(e) => onChange(field.id, e.target.value)}
      className={`input-base resize-none ${error ? 'input-error' : ''}`}
    />
  )
}
