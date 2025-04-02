export const model = {
  name: 'Inventory',
  fields: [
    { name: 'name', type: 'String', required: true },
    { name: 'description', type: 'String' },
    { name: 'active', type: 'Boolean', default: true }
  ]
}
