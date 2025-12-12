import React, { memo, ReactNode, RefObject, useMemo, useCallback } from 'react'
import { GestureResponderEvent } from 'react-native'
import Text from '@/components/base/Text'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'
import { Control, useFormContext, useWatch } from 'react-hook-form'
import { createStyledContext, styled, ThemeableStack, withStaticProperties } from 'tamagui'
import { EditorMethods } from './types'
import MessageEditorEditToolbar from './EditToolBar'
import { EditorInsertionToolbar } from './EditorInsertionToolbar'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated'

const wrapperContext = createStyledContext<{ selected: boolean; edgePosition?: 'trailing' | 'leading' | 'alone'; error?: boolean; editMode?: boolean }>({
  selected: false,
  edgePosition: undefined,
  error: false,
  editMode: false,
})

const WrapperFrame = styled(ThemeableStack, {
  context: wrapperContext,
  justifyContent: 'center',
  variants: {
    selected: {
      true: {
        minHeight: 120,
      },
      false: {
        minHeight: 'auto',
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
      },

      alone: {
        overflow: 'hidden',
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
      },
    },
  } as const,
})

const AnimatedWrapperFrame = Animated.createAnimatedComponent(WrapperFrame)

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
    backgroundColor: '#2633401a',
  },
  variants: {
    selected: {
      true: {},
    },
    error: {
      true: {
        borderColor: '$orange5',
        backgroundColor: '$orange/16',
      },
    },
    editMode: {
      false: {
        display: 'none',
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
      },

      alone: {
        overflow: 'hidden',
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
      },
    },
  } as const,
})

const SelectErrorBanner = styled(ThemeableStack, {
  context: wrapperContext,
  position: 'absolute',
  padding: '$medium',
  display: 'none',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '$orange5',
  variants: {
    selected: {
      true: {
        bottom: -5,
        left: -5,
        right: -5,
      },
    },
    error: {
      true: {
        display: 'flex',
      },
    },
  },
})

const Wrapper = withStaticProperties(WrapperFrame, {
  Props: wrapperContext.Provider,
  Overlay: SelectOverlay,
  ErrorBanner: SelectErrorBanner,
})

type NodeSelectorProps = {
  field: S.FieldsArray[number]
  children: ReactNode
  control: Control<S.GlobalForm>
  edgePosition?: 'trailing' | 'leading' | 'alone'
  error?: string
  editorMethods: RefObject<EditorMethods>
}

const MemoWrapper = memo(
  (props: {
    selected: boolean
    htmlId: string
    onWrapperPress: (e: GestureResponderEvent) => void
    children: ReactNode
    edgePosition?: 'trailing' | 'leading' | 'alone'
    error?: string
    editorMethods: RefObject<EditorMethods>
    field: S.FieldsArray[number]
    control: Control<S.GlobalForm>
    onShowAddBarTop: () => void
    onShowAddBarBottom: () => void
    onCloseAddBar: () => void
    displayToolbar: boolean
    showAddBarTop: boolean
    showAddBarBottom: boolean
    selectedField: S.GlobalForm['selectedField']
  }) => {
    const displayBottomAddBar = props.edgePosition === 'alone' || props.edgePosition === 'trailing'

    const animatedHeight = useSharedValue(props.selected ? 120 : 0.1)

    const animatedStyle = useAnimatedStyle(() => {
      return {
        minHeight: withTiming(animatedHeight.value, {
          duration: 300,
          easing: Easing.out(Easing.ease),
        }),
      }
    })

    React.useEffect(() => {
      const shouldAnimate = props.selected && props.displayToolbar
      animatedHeight.value = shouldAnimate ? 120 : 0.1
    }, [props.selected, props.displayToolbar, animatedHeight])

    const handlePress = (e: GestureResponderEvent) => {
      if (!props.selected && props.displayToolbar) {
        props.onWrapperPress(e)
      }
    }

    return (
      <Wrapper.Props selected={props.selected} edgePosition={props.edgePosition} error={Boolean(props.error)} editMode={props.displayToolbar}>
        <EditorInsertionToolbar
          control={props.control}
          editorMethods={props.editorMethods}
          field={props.field}
          display={props.displayToolbar}
          showAddBar={props.showAddBarTop}
          onShowAddBar={props.onShowAddBarTop}
          onCloseAddBar={props.onCloseAddBar}
        />
        <AnimatedWrapperFrame
          id={props.htmlId}
          onPress={handlePress}
          style={animatedStyle}
        >
          {props.displayToolbar && (
            <MessageEditorEditToolbar selected={props.selected} selectedField={props.selectedField} editorMethods={props.editorMethods} />
          )}

          <Wrapper.Overlay>
            <Wrapper.ErrorBanner>
              <Text.MD color="white">{props.error}</Text.MD>
            </Wrapper.ErrorBanner>
          </Wrapper.Overlay>
          {props.children}
        </AnimatedWrapperFrame>
        {displayBottomAddBar ? (
          <EditorInsertionToolbar
            control={props.control}
            editorMethods={props.editorMethods}
            field={props.field}
            asLast={true}
            display={props.displayToolbar}
            showAddBar={props.showAddBarBottom}
            onShowAddBar={props.onShowAddBarBottom}
            onCloseAddBar={props.onCloseAddBar}
          />
        ) : null}
      </Wrapper.Props>
    )
  },
)

MemoWrapper.displayName = 'MemoWrapper'

export const NodeSelectorWrapper = memo((props: NodeSelectorProps & { displayToolbar?: boolean }) => {
  const content = useMemo(() => props.children, [props.children])
  const displayToolbar = props.displayToolbar ?? true

  const { setValue } = useFormContext<S.GlobalForm>()
  const selectedField = useWatch({ control: props.control, name: 'selectedField' })
  const addBarOpenForFieldId = useWatch({ control: props.control, name: 'addBarOpenForFieldId' })

  const topKey = useMemo(() => `${props.field.id}:top`, [props.field.id])
  const bottomKey = useMemo(() => `${props.field.id}:bottom`, [props.field.id])

  const isSelected = selectedField?.field?.id === props.field.id
  const selectedFieldForWrapper = isSelected ? selectedField : null

  const showAddBarTop = addBarOpenForFieldId === topKey
  const showAddBarBottom = addBarOpenForFieldId === bottomKey

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      e.stopPropagation()
      setValue('selectedField', { edit: false, field: props.field }, { shouldDirty: false, shouldTouch: false, shouldValidate: false })
      setValue('addBarOpenForFieldId', null, { shouldDirty: false, shouldTouch: false, shouldValidate: false })
      if (!displayToolbar) {
        props.editorMethods.current?.setEditorMode('edit')
      }
    },
    [displayToolbar, props.editorMethods, props.field, setValue],
  )

  const handleShowAddBarTop = useCallback(() => {
    setValue('addBarOpenForFieldId', topKey, { shouldDirty: false, shouldTouch: false, shouldValidate: false })
    setValue('selectedField', null, { shouldDirty: false, shouldTouch: false, shouldValidate: false })
  }, [setValue, topKey])

  const handleShowAddBarBottom = useCallback(() => {
    setValue('addBarOpenForFieldId', bottomKey, { shouldDirty: false, shouldTouch: false, shouldValidate: false })
    setValue('selectedField', null, { shouldDirty: false, shouldTouch: false, shouldValidate: false })
  }, [setValue, bottomKey])

  const handleCloseAddBar = useCallback(() => {
    setValue('addBarOpenForFieldId', null, { shouldDirty: false, shouldTouch: false, shouldValidate: false })
  }, [setValue])

  return (
    <MemoWrapper
      selected={isSelected}
      onWrapperPress={handlePress}
      htmlId={`field-${props.field.type}-${props.field.id}`}
      children={content}
      error={props.error}
      edgePosition={props.edgePosition}
      editorMethods={props.editorMethods}
      field={props.field}
      control={props.control}
      onShowAddBarTop={handleShowAddBarTop}
      onShowAddBarBottom={handleShowAddBarBottom}
      onCloseAddBar={handleCloseAddBar}
      displayToolbar={displayToolbar}
      showAddBarTop={showAddBarTop}
      showAddBarBottom={showAddBarBottom}
      selectedField={selectedFieldForWrapper}
    />
  )
})

NodeSelectorWrapper.displayName = 'NodeSelectorWrapper'
