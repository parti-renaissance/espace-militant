import { useState } from 'react'
import { YStack } from 'tamagui'
import BigSwitch from './index'

export default {
  title: 'BigSwitch',
  component: BigSwitch,
}

const options = [
  {
    value: 'event',
    label: 'Tous',
  },

  {
    value: 'myevents',
    label: "J'y participe",
  },
] as [{ value: string; label: string }, { value: string; label: string }]

export const Default = () => {
  const [value, setValue] = useState(options[0].value)
  return (
    <YStack width={300} gap="$medium">
      <BigSwitch value={value} onChange={setValue} options={options} />
    </YStack>
  )
}
