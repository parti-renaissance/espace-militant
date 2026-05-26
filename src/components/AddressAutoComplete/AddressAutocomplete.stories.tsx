import AddressAutocomplete from '@/components/AddressAutoComplete/AddressAutocomplete'
import { StoryObj } from '@storybook/react'
import { Card, YStack } from 'tamagui'

const meta = {
  title: 'Formulaire/AddressAutocomplete',
  component: () => (
    <Card width={400} p={'$medium'}>
      <YStack>
        <AddressAutocomplete />
      </YStack>
    </Card>
  ),
}

type Story = StoryObj<typeof AddressAutocomplete>

export const Default: Story = {}

export default meta
