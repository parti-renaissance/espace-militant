import { ReactNode, useCallback, useMemo } from 'react'
import { GestureResponderEvent } from 'react-native'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { Control, Controller } from 'react-hook-form'
import { styled, ThemeableStack, View } from 'tamagui'

const SelectOverlay = styled(ThemeableStack, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  cursor: 'pointer',
  borderRadius: 16,
  variants: {
    selected: {
      true: {
        borderWidth: 5,
        borderStyle: 'solid',
        borderColor: '$blue9',
      },
    },
  } as const,
})

const SelectOverlayLayer2 = styled(ThemeableStack, {
  flex: 1,
  width: '100%',
  borderRadius: 11,
  variants: {
    selected: {
      true: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
      },
    },
  } as const,
})

type NodeSelectorProps = {
  field: S.FieldsArray[number]
  children: ReactNode
  control: Control<S.GlobalForm>
}

export const NodeSelectorWrapper = (props: NodeSelectorProps) => {
  const content = useMemo(() => <View pointerEvents="none">{props.children}</View>, [props.children])
  const handlePress = useCallback(
    (fn: (x: S.FieldsArray[number]) => void) => (e: GestureResponderEvent) => {
      e.stopPropagation()
      fn(props.field)
    },
    [props.field],
  )
  return (
    <View id={`field-${props.field.type}-${props.field.id}`}>
      <Controller
        render={({ field }) => (
          <SelectOverlay onPress={handlePress(field.onChange)} selected={field.value?.id === props.field.id}>
            <SelectOverlayLayer2 selected={field.value?.id === props.field.id} />
          </SelectOverlay>
        )}
        control={props.control}
        name="selectedField"
      />
      {content}
    </View>
  )
}
