import React from 'react'
import SwitchGroup from './SwitchGroup'

export default {
  title: 'Formulaire/SwitchGroup',
  component: SwitchGroup,
}

const list = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
]

export const Default = () => {
  const [value, setValue] = React.useState(['option1'])
  return <SwitchGroup options={list} value={value} onChange={setValue} />
}
