import { ScrollView, XStack, YStack } from 'tamagui'

import Text from '@/components/base/Text'

import { black, blue, gray, green, orange, pink, purple, red, teal, white, yellow } from '../../../theme/colors.hex'
import { COLOR_SCALE_NAMES, COLOR_SCALE_STEPS, type ColorScaleName } from '../../../theme/colorTokens'

type Palette = { title: string; tokens: { token: string; hex: string }[] }

const scales: Record<ColorScaleName, Record<string, string>> = {
  gray,
  purple,
  blue,
  teal,
  green,
  yellow,
  orange,
  red,
  pink,
}

function scalePalette(name: ColorScaleName): Palette {
  return {
    title: name.charAt(0).toUpperCase() + name.slice(1),
    tokens: COLOR_SCALE_STEPS.map((step) => {
      const token = `${name}${step}`
      return { token, hex: scales[name][token] }
    }),
  }
}

function neutralPalette(name: 'white' | 'black', record: Record<string, string>): Palette {
  return {
    title: name.charAt(0).toUpperCase() + name.slice(1),
    tokens: Object.entries(record).map(([token, hex]) => ({ token, hex })),
  }
}

const PALETTES: Palette[] = [...COLOR_SCALE_NAMES.map(scalePalette), neutralPalette('white', white), neutralPalette('black', black)]

function Swatch({ token, hex }: { token: string; hex: string }) {
  return (
    <YStack flex={1} minWidth={56} borderRadius="$small" overflow="hidden" borderWidth={1} borderColor="$textOutline32">
      <YStack minHeight={48} backgroundColor={hex} />
      <YStack padding="$xsmall" gap={2} backgroundColor="$white1" alignItems="center">
        <Text.XSM semibold color="$textPrimary">
          {token.replace(/^[a-z]+/, '') || token}
        </Text.XSM>
        <Text.XSM color="$textSecondary" numberOfLines={1}>{`$${token}`}</Text.XSM>
      </YStack>
    </YStack>
  )
}

export default {
  title: 'Design System/Colors',
  parameters: { layout: 'fullscreen' },
}

export function Colors() {
  return (
    <ScrollView flex={1} width="100%" minHeight="100vh" padding="$medium" paddingBottom={120} paddingTop={32}>
      <YStack gap="$large" width="100%">
        {PALETTES.map((palette) => (
          <YStack key={palette.title} gap="$small">
            <Text.MD semibold color="$textPrimary">
              {palette.title}
            </Text.MD>
            <XStack gap="$xsmall" width="100%">
              {palette.tokens.map((entry) => (
                <Swatch key={entry.token} token={entry.token} hex={entry.hex} />
              ))}
            </XStack>
          </YStack>
        ))}
      </YStack>
    </ScrollView>
  )
}
