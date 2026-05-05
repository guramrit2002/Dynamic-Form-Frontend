export function genId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 4)}`
}

export function createStep(index = 0) {
  return { id: genId('step'), title: `Step ${index + 1}`, fields: [] }
}

export function createField() {
  return {
    id: genId('field'),
    type: 'text',
    label: '',
    required: false,
    placeholder: '',
    options: [],
    validations: [],
  }
}

export function createNavRule() {
  return { _id: genId('nav'), from_step: '', to_step: '', condition: null }
}

export function createRule() {
  return {
    _id: genId('rule'),
    if: { field: '', operator: '==', value: '' },
    then: { action: 'set_value', field: '', value: '' },
  }
}

// Strip internal _id fields before sending to the API
export function cleanSchema(schema) {
  return {
    steps: schema.steps,
    navigation: schema.navigation.map(({ _id, ...rest }) => rest),
    rules: schema.rules.map(({ _id, ...rest }) => rest),
    settings: schema.settings ?? {},
  }
}
