import { useState } from 'react'
import { YStack, Text } from 'tamagui'
import BigSwitch from './index'
import type { OptionsArray } from './index'

export default {
  title: 'BigSwitch',
  component: BigSwitch,
}

const options2: OptionsArray = [
  {
    value: 'event',
    label: 'Tous',
  },
  {
    value: 'myevents',
    label: "J'y participe",
  },
]

const options3: OptionsArray = [
  {
    value: 'all',
    label: 'Tous',
  },
  {
    value: 'participating',
    label: "J'y participe",
  },
  {
    value: 'created',
    label: 'Créés',
  },
]

const options4: OptionsArray = [
  {
    value: 'all',
    label: 'Tous',
  },
  {
    value: 'participating',
    label: "J'y participe",
  },
  {
    value: 'created',
    label: 'Créés',
  },
  {
    value: 'past',
    label: 'Passés',
  },
]

const options5: OptionsArray = [
  {
    value: 'all',
    label: 'Tous',
  },
  {
    value: 'participating',
    label: "J'y participe",
  },
  {
    value: 'created',
    label: 'Créés',
  },
  {
    value: 'past',
    label: 'Passés',
  },
  {
    value: 'favorites',
    label: 'Favoris',
  },
]

export const Default = () => {
  const [value2, setValue2] = useState(options2[0].value)
  const [value3, setValue3] = useState(options3[0].value)
  const [value4, setValue4] = useState(options4[0].value)
  const [value5, setValue5] = useState(options5[0].value)

  return (
    <YStack width={600} gap="$large" padding="$medium">
      <YStack gap="$medium">
        <Text fontSize={16} fontWeight="600">
          2 options
        </Text>
        <BigSwitch value={value2} onChange={setValue2} options={options2} />
      </YStack>

      <YStack gap="$medium">
        <Text fontSize={16} fontWeight="600">
          3 options
        </Text>
        <BigSwitch value={value3} onChange={setValue3} options={options3} />
      </YStack>

      <YStack gap="$medium">
        <Text fontSize={16} fontWeight="600">
          4 options
        </Text>
        <BigSwitch value={value4} onChange={setValue4} options={options4} />
      </YStack>

      <YStack gap="$medium">
        <Text fontSize={16} fontWeight="600">
          5 options
        </Text>
        <BigSwitch value={value5} onChange={setValue5} options={options5} />
      </YStack>
    </YStack>
  )
}
