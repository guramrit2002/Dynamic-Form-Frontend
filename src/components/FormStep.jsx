import FormField from './FormField'
import { getVisibleFieldIds } from '../utils/conditionEngine'

export default function FormStep({ step, formData, onChange, errors }) {
  const visibleIds = getVisibleFieldIds(step, formData)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{step.title}</h2>
        <p className="mt-1 text-sm text-gray-500">Fill in the fields below to continue.</p>
      </div>

      <div className="space-y-5">
        {step.fields
          .filter((f) => visibleIds.has(f.id))
          .map((field) => (
            <FormField
              key={field.id}
              field={field}
              value={formData[field.id]}
              onChange={onChange}
              errors={errors}
            />
          ))}
      </div>
    </div>
  )
}
