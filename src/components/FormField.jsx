import TextField     from './fields/TextField'
import TextareaField from './fields/TextareaField'
import NumberField   from './fields/NumberField'
import EmailField    from './fields/EmailField'
import DateField     from './fields/DateField'
import SelectField   from './fields/SelectField'
import RadioField    from './fields/RadioField'
import CheckboxField from './fields/CheckboxField'

const FIELD_MAP = {
  text:     TextField,
  textarea: TextareaField,
  number:   NumberField,
  email:    EmailField,
  date:     DateField,
  select:   SelectField,
  radio:    RadioField,
  checkbox: CheckboxField,
}

export default function FormField({ field, value, onChange, errors }) {
  const Component = FIELD_MAP[field.type]
  const fieldErrors = errors?.[field.id] ?? []

  if (!Component) return (
    <p className="text-sm text-red-500">Unknown field type: {field.type}</p>
  )

  return (
    <div className="space-y-1">
      <label htmlFor={field.id} className="label-base">
        {field.label}
        {field.required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <Component
        field={field}
        value={value}
        onChange={onChange}
        error={fieldErrors.length > 0}
      />

      {fieldErrors.map((err, i) => (
        <p key={i} className="text-xs text-red-500">{err}</p>
      ))}
    </div>
  )
}
