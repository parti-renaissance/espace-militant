import { memo, ReactNode, useMemo, useRef } from 'react'
import { GestureResponderEvent } from 'react-native'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { useLazyRef } from '@/hooks/useLazyRef'
import { Control, Controller } from 'react-hook-form'
import { createStyledContext, styled, ThemeableStack, withStaticProperties } from 'tamagui'

const wrapperContext = createStyledContext<{ selected: boolean; edgePosition?: 'trailing' | 'leading' | 'alone' }>({
  selected: false,
  edgePosition: undefined,
})

const WrapperFrame = styled(ThemeableStack, {
  context: wrapperContext,
  variants: {
    selected: {},
    edgePosition: {
      trailing: {
        overflow: 'hidden',
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
      },

      leading: {
        overflow: 'hidden',
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
      },

      alone: {
        overflow: 'hidden',
        borderRadius: 16,
      },
    },
  } as const,
})

const SelectOverlay = styled(ThemeableStack, {
  context: wrapperContext,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  cursor: 'pointer',
  hoverStyle: {
    backgroundColor: '$gray/24',
  },
  variants: {
    selected: {
      true: {
        borderWidth: 5,
        borderStyle: 'solid',
        borderColor: 'black',
      },
    },
    editMode: {
      true: {
        borderWidth: 1,
      },
    },
    edgePosition: {
      trailing: {
        overflow: 'hidden',
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
      },

      leading: {
        overflow: 'hidden',
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
      },

      alone: {
        overflow: 'hidden',
        borderRadius: 16,
      },
    },
  } as const,
})

const SelectOverlayLayer2 = styled(ThemeableStack, {
  context: wrapperContext,
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

const Wrapper = withStaticProperties(WrapperFrame, {
  Props: wrapperContext.Provider,
  Overlay: SelectOverlay,
  OverlayContainer: SelectOverlayLayer2,
})

type NodeSelectorProps = {
  field: S.FieldsArray[number]
  children: ReactNode
  control: Control<S.GlobalForm>
  edgePosition?: 'trailing' | 'leading' | 'alone'
}

const MemoWrapper = memo(
  (props: {
    selected: boolean
    htmlId: string
    onWrapperPress: (e: GestureResponderEvent) => void
    onWrapperDoublePress: (e: GestureResponderEvent) => void
    children: ReactNode
    edgePosition?: 'trailing' | 'leading' | 'alone'
  }) => {
    return (
      <Wrapper.Props selected={props.selected} edgePosition={props.edgePosition}>
        <Wrapper id={props.htmlId} onPress={props.selected ? props.onWrapperDoublePress : props.onWrapperPress}>
          <Wrapper.Overlay />
          {props.children}
        </Wrapper>
      </Wrapper.Props>
    )
  },
)

MemoWrapper.displayName = 'MemoWrapper'

export const NodeSelectorWrapper = memo((props: NodeSelectorProps) => {
  const content = useMemo(() => props.children, [props.children])
  //trick to avoid rerenders, avoid to create a new function each time, props.field can't change and field.onChange is a setter, and can't change
  const handlePress = useRef<{ fn: ((e: GestureResponderEvent) => void) | null }>({ fn: null })
  const handleDoublePress = useRef<{ fn: ((e: GestureResponderEvent) => void) | null }>({ fn: null })

  const handleDoublePressSetter = useLazyRef(() => (fn: (x: S.GlobalForm['selectedField']) => void) => {
    if (handleDoublePress.current.fn === null) {
      handleDoublePress.current.fn = (e) => {
        e.stopPropagation()
        fn({ edit: true, field: props.field })
      }
    }
    return handleDoublePress.current.fn
  })

  const handlePressSetter = useLazyRef(() => (fn: (x: S.GlobalForm['selectedField']) => void) => {
    if (handlePress.current.fn === null) {
      handlePress.current.fn = (e: GestureResponderEvent) => {
        e.stopPropagation()
        fn({ edit: false, field: props.field })
      }
    }
    return handlePress.current.fn
  })

  return (
    <Controller
      render={({ field }) => (
        <MemoWrapper
          selected={field.value?.field.id === props.field.id}
          onWrapperPress={handlePressSetter.current(field.onChange)}
          onWrapperDoublePress={handleDoublePressSetter.current(field.onChange)}
          htmlId={`field-${props.field.type}-${props.field.id}`}
          children={content}
          edgePosition={props.edgePosition}
        />
      )}
      control={props.control}
      name="selectedField"
    />
  )
})

NodeSelectorWrapper.displayName = 'NodeSelectorWrapper'
