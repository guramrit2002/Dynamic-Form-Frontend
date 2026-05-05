export function evaluateCondition(condition, data) {
  if (!condition) return true
  const { field, operator, value } = condition
  const actual = data[field]
  if (actual === undefined || actual === null || actual === '') return false
  try {
    switch (operator) {
      case '==':  return String(actual) === String(value)
      case '!=':  return String(actual) !== String(value)
      case '>':   return Number(actual) > Number(value)
      case '<':   return Number(actual) < Number(value)
      case '>=':  return Number(actual) >= Number(value)
      case '<=':  return Number(actual) <= Number(value)
      default:    return false
    }
  } catch {
    return false
  }
}

export function getVisibleFieldIds(step, data) {
  return new Set(
    step.fields
      .filter((f) => {
        if (!f.visibility) return true
        return evaluateCondition(f.visibility.condition, data)
      })
      .map((f) => f.id)
  )
}
