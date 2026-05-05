export default function ProgressBar({ steps, currentStepId }) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId)
  const pct = Math.round(((currentIndex + 1) / steps.length) * 100)

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
        <span>Step {currentIndex + 1} of {steps.length}</span>
        <span>{pct}%</span>
      </div>

      {/* Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="t-progress-fill h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Step dots */}
      {steps.length > 1 && (
        <ol className="mt-4 flex gap-2">
          {steps.map((step, i) => {
            const done    = i < currentIndex
            const current = i === currentIndex
            return (
              <li key={step.id} className="flex flex-1 flex-col items-center gap-1">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition
                  ${done    ? 't-step-active'
                  : current ? 't-step-border border-2 bg-white'
                             : 'bg-gray-200 text-gray-500'}`}>
                  {done ? '✓' : i + 1}
                </div>
                <span className={`text-center text-xs leading-tight ${current ? 't-text font-medium' : 'text-gray-500'}`}>
                  {step.title}
                </span>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
