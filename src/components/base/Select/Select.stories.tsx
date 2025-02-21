import React, { useState } from 'react'
import { SelectFrames as SF } from '@/components/base/Select/Frames'
import Select from '@/components/base/Select/SelectV3'
import { Sparkle } from '@tamagui/lucide-icons'
import { Stack, YStack } from 'tamagui'

const props = {
  label: 'Select-2',
  onChange: () => {},
  value: '1',
  options: [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Opt 2' },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 3' },
    { value: '5', label: 'Option 5' },
  ],
  placeholder: 'Select an option',
}

export default {
  title: 'Select-2',
  component: Select,
  args: props,
}

export function Default(args: typeof props) {
  const [value, setValue] = useState(args.value)
  return (
    <Stack gap="$medium" flex={1} height={200} width="100%">
      <Select {...args} onChange={setValue} value={value} label={args.label} />
    </Stack>
  )
}

export function Frames() {
  return (
    <YStack width="100%" maxWidth={500}>
      <YStack gap="$medium" width="100%" maxWidth={500} p="$medium">
        <SF.Props>
          <SF>
            <SF.Container>
              <SF.Label>Test</SF.Label>
              <SF.ValueContainer>
                <SF.Text>
                  <SF.Text semibold>Assemblée</SF.Text> <SF.Text>Hauts-de-Seine</SF.Text>
                </SF.Text>
              </SF.ValueContainer>
            </SF.Container>
          </SF>
        </SF.Props>

        <SF.Props>
          <SF theme="blue">
            <SF.Container>
              <SF.Label>Test</SF.Label>
              <SF.ValueContainer>
                <SF.Text>
                  <SF.Text semibold>Assemblée</SF.Text> <SF.Text>Hauts-de-Seine</SF.Text>
                </SF.Text>
              </SF.ValueContainer>
            </SF.Container>
          </SF>
        </SF.Props>

        <SF.Props themedText>
          <SF theme="blue">
            <SF.Container>
              <SF.Label>Test</SF.Label>
              <SF.ValueContainer>
                <SF.Text>
                  <SF.Text semibold>Assemblée</SF.Text> <SF.Text>Hauts-de-Seine</SF.Text>
                </SF.Text>
              </SF.ValueContainer>
            </SF.Container>
          </SF>
        </SF.Props>

        <SF.Props themedText>
          <SF theme="purple">
            <SF.Container>
              <SF.Label>Test</SF.Label>
              <SF.ValueContainer>
                <SF.Icon icon={Sparkle} />
                <SF.Text>
                  <SF.Text semibold>Assemblée</SF.Text> <SF.Text>Hauts-de-Seine</SF.Text>
                </SF.Text>
              </SF.ValueContainer>
            </SF.Container>
          </SF>
        </SF.Props>

        <SF.Props>
          <SF>
            <SF.Container>
              <SF.Label>Test</SF.Label>
              <SF.ValueContainer theme="yellow">
                <SF.Text themedText>
                  <SF.Text semibold>Assemblée</SF.Text> <SF.Text>Hauts-de-Seine</SF.Text>
                </SF.Text>
              </SF.ValueContainer>
            </SF.Container>
          </SF>
        </SF.Props>

        <SF.Props>
          <SF>
            <SF.Container>
              <SF.Label>Test</SF.Label>
              <SF.ValueContainer theme="blue">
                <SF.Text themedText>
                  <SF.Text semibold>Assemblée</SF.Text> <SF.Text>Hauts-de-Seine</SF.Text>
                </SF.Text>
              </SF.ValueContainer>
            </SF.Container>
          </SF>
        </SF.Props>

        <SF.Props>
          <SF>
            <SF.Container>
              <SF.Label>Catégorie</SF.Label>
              <SF.ValueContainer>
                <SF.Text>
                  <SF.Text semibold>Assemblée</SF.Text> <SF.Text>Hauts-de-Seine</SF.Text>
                </SF.Text>
              </SF.ValueContainer>
            </SF.Container>
          </SF>
        </SF.Props>

        <SF.Props>
          <SF disabled>
            <SF.Container>
              <SF.Label>Test</SF.Label>
              <SF.ValueContainer>
                <SF.Text>
                  <SF.Text semibold>Assemblée</SF.Text> <SF.Text>Hauts-de-Seine</SF.Text>
                </SF.Text>
              </SF.ValueContainer>
            </SF.Container>
          </SF>
        </SF.Props>
      </YStack>
      <YStack backgroundColor="$textSurface" gap="$medium" paddingVertical="$large" paddingHorizontal="$medium">
        <SF.Props>
          <SF white>
            <SF.Container>
              <SF.Label>White Select</SF.Label>
              <SF.ValueContainer>
                <SF.Text>
                  <SF.Text semibold>Assemblée</SF.Text> <SF.Text>Hauts-de-Seine</SF.Text>
                </SF.Text>
              </SF.ValueContainer>
            </SF.Container>
          </SF>
        </SF.Props>

        <SF.Props themedText>
          <SF white theme="orange">
            <SF.Container>
              <SF.Label>White Select</SF.Label>
              <SF.ValueContainer>
                <SF.Text>
                  <SF.Text semibold>Assemblée</SF.Text> <SF.Text>Hauts-de-Seine</SF.Text>
                </SF.Text>
              </SF.ValueContainer>
            </SF.Container>
          </SF>
        </SF.Props>
      </YStack>
    </YStack>
  )
}
