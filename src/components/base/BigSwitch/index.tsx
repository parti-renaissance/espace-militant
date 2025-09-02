import { ComponentRef, forwardRef, useState } from 'react'
import { createStyledContext, styled } from '@tamagui/core'
import { ThemeableStack } from '@tamagui/stacks'
import { XStack } from 'tamagui'
import Text from '../Text'

export const SwitchContext = createStyledContext({
  checked: false,
  disabled: false,
})

export const SwitchGroupZone = styled(ThemeableStack, {
  tag: 'button',
  context: SwitchContext,
  focusable: true,
  height: 44,
  flexDirection: 'row',
  borderWidth: 1,
  flex: 1,
  borderColor: '$textOutline',
  borderRadius: 999,
  group: true,

  cursor: 'pointer',

  // '$group-hover': { backgroundColor: '$blue1' }, // Disabled for Expo 53 compatibility
  backgroundColor: '$white1',

  disabledStyle: {
    cursor: 'not-allowed',
    opacity: 0.4,
    backgroundColor: 'transparent',
  },
  variants: {
    checked: {
      true: {},
    },
  } as const,
})

export const SwitchGroupItemFrame = styled(ThemeableStack, {
  context: SwitchContext,
  height: 44,
  flex: 1,
  flexBasis: 0,
  alignItems: 'center',
  justifyContent: 'center',
})

export const SwitchGroupItemFrameText = styled(Text.MD, {
  context: SwitchContext,
  textAlign: 'center',
  color: '$textDisabled',

  semibold: true,
  variants: {
    checked: {
      true: {
        color: '$blue5',
      },
    },
  } as const,
})

export const SwitchGroupIndicatorFrame = styled(ThemeableStack, {
  context: SwitchContext,
  height: 45,
  position: 'absolute',
  top: -1,
  left: -1,
  right: -1,
  flexDirection: 'row',
  animation: 'medium',
  transform: [{ translateX: 0 }],
})

export const SwitchGroupIndicator = styled(ThemeableStack, {
  context: SwitchContext,
  flex: 1,
  height: 45,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: '$blue1',
  backgroundColor: '$blue1',
})

export type OptionsTuple = [{ label: string; value: string }, { label: string; value: string }]

const BigSwitchOld = forwardRef<ComponentRef<typeof SwitchGroupZone>, { options: OptionsTuple; onChange: (x: string) => void; value: string }>(function BigSwitch(
  { options, onChange, value },
  ref,
) {
  const checked = value === options[1].value
  const [width, setWidth] = useState<`${number}%` | number>('100%')

  return (
    <SwitchGroupZone checked={checked} ref={ref} onPress={() => onChange(checked ? options[0].value : options[1].value)}>
      <SwitchGroupIndicatorFrame
        transform={[{ translateX: !checked ? 0 : width }]}
        onLayout={(x) => {
          setWidth(x.nativeEvent.layout.width / 2)
        }}
      >
        <SwitchGroupIndicator />
        <XStack flex={1} />
      </SwitchGroupIndicatorFrame>
      <SwitchGroupItemFrame flex={1} width="100%">
        <SwitchGroupItemFrameText checked={!checked}>{options[0].label}</SwitchGroupItemFrameText>
      </SwitchGroupItemFrame>
      <SwitchGroupItemFrame flex={1} width="100%">
        <SwitchGroupItemFrameText checked={checked}>{options[1].label}</SwitchGroupItemFrameText>
      </SwitchGroupItemFrame>
    </SwitchGroupZone>
  )
})


const BigSwitch = ({ options, value, onChange }: { options: OptionsTuple; value: string; onChange: (x: string) => void }) => {
  return (
    <XStack
      flex={1}
      height={44}
      borderRadius={999}
      borderWidth={1}
      borderColor="$textOutline"
      backgroundColor="$white1"
      onPress={() => onChange(value === options[0].value ? options[1].value : options[0].value)}
    >
      <XStack flex={1} alignItems="center" justifyContent="center">
        <Text color={value === options[0].value ? '$blue5' : '$textDisabled'} fontWeight="600">
          {options[0].label}
        </Text>
      </XStack>
      <XStack flex={1} alignItems="center" justifyContent="center">
        <Text color={value === options[1].value ? '$blue5' : '$textDisabled'} fontWeight="600">
          {options[1].label}
        </Text>
      </XStack>
    </XStack>
  )
}

export default BigSwitch