import React from 'react'
import CheckboxGroup from './CheckboxGroup'

export default {
  title: 'Formulaire/CheckboxGroup',
  component: CheckboxGroup,
}

const list = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
]

export const Default = () => {
  const [value, setValue] = React.useState(['option1'])
  return <CheckboxGroup options={list} value={value} onChange={setValue} />
}
