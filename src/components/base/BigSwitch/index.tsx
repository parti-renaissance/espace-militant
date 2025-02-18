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

  '$group-hover': { backgroundColor: '$blue1' },
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
  top: 0,
  left: 0,
  right: 0,
  flexDirection: 'row',
  animation: 'medium',
  transform: [{ translateX: 0 }],
})

export const SwitchGroupIndicator = styled(ThemeableStack, {
  context: SwitchContext,
  flex: 1,
  height: 45,
  borderRadius: 999,
  backgroundColor: '$blue1',
})

export type OptionsTuple = [{ label: string; value: string }, { label: string; value: string }]

export default forwardRef<ComponentRef<typeof SwitchGroupZone>, { options: OptionsTuple; onChange: (x: string) => void; value: string }>(function BigSwitch(
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
