import { useState } from 'react'
import { StoryObj } from '@storybook/react'
import { View } from 'tamagui'
import Text from '../base/Text'
import CountrySelect from './CountrySelect'

const Component = () => {
  const [state, setState] = useState('FR')

  return (
    <View width={400}>
      <CountrySelect id="country" value={state} onChange={setState} />

      <Text mt="$medium">Selected country is {state}</Text>
    </View>
  )
}

const meta = {
  title: 'Formulaire/CountrySelect',
  component: Component,
}

type Story = StoryObj<typeof Component>

export const Default: Story = {}

export default meta
