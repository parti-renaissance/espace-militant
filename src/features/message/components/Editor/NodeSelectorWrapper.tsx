import { memo, ReactNode, RefObject, useMemo } from 'react'
import { GestureResponderEvent } from 'react-native'
import Text from '@/components/base/Text'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import { Control, Controller } from 'react-hook-form'
import { createStyledContext, styled, ThemeableStack, View, withStaticProperties } from 'tamagui'
import { EditorMethods } from './types'
import MessageEditorEditToolbar from './EditToolBar'
import { AddFieldButton } from './AddFieldButton'

const wrapperContext = createStyledContext<{ selected: boolean; edgePosition?: 'trailing' | 'leading' | 'alone'; error?: boolean }>({
  selected: false,
  edgePosition: undefined,
  error: false,
})

const WrapperFrame = styled(ThemeableStack, {
  context: wrapperContext,
  variants: {
    selected: {
      true: {
        minHeight: 120,
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
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '$blue5',
      },
    },
    error: {
      true: {
        borderColor: '$orange5',
        backgroundColor: '$orange/16',
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
    onWrapperDoublePress: (e: GestureResponderEvent) => void
    children: ReactNode
    edgePosition?: 'trailing' | 'leading' | 'alone'
    error?: string
    editorMethods: RefObject<EditorMethods>
    field: S.FieldsArray[number]
    control: Control<S.GlobalForm>
    addBarOpenForFieldId: string | null
    onChangeAddBarOpenFieldId: (id: string | null) => void
    onCloseAddBar: () => void
    displayToolbar: boolean
  }) => {
    const topKey = props.field.id + ':top'
    const bottomKey = props.field.id + ':bottom'
    const displayBottomAddBar = props.edgePosition === 'alone' || props.edgePosition === 'trailing'
    const showAddBarTop = props.addBarOpenForFieldId === topKey
    const showAddBarBottom = props.addBarOpenForFieldId === bottomKey
    return (
      <Wrapper.Props selected={props.selected} edgePosition={props.edgePosition} error={Boolean(props.error)}>
        {props.displayToolbar && (
          <AddFieldButton
            control={props.control}
            editorMethods={props.editorMethods}
            field={props.field}
            display={true}
            showAddBar={showAddBarTop}
            onShowAddBar={() => props.onChangeAddBarOpenFieldId(topKey)}
            onCloseAddBar={props.onCloseAddBar}
          />
        )}
        <Wrapper id={props.htmlId} onPress={props.selected ? props.onWrapperDoublePress : props.onWrapperPress}>
          {props.selected && props.displayToolbar ? (
            <MessageEditorEditToolbar control={props.control} editorMethods={props.editorMethods}/>
          ) : null}

          <Wrapper.Overlay>
            <Wrapper.ErrorBanner>
              <Text.MD color="white">{props.error}</Text.MD>
            </Wrapper.ErrorBanner>
          </Wrapper.Overlay>
          {props.children}
        </Wrapper>
        {displayBottomAddBar && props.displayToolbar && (
          <AddFieldButton
            control={props.control}
            editorMethods={props.editorMethods}
            field={props.field}
            asLast={true}
            display={true}
            showAddBar={showAddBarBottom}
            onShowAddBar={() => props.onChangeAddBarOpenFieldId(bottomKey)}
            onCloseAddBar={props.onCloseAddBar}
          />
        )}
      </Wrapper.Props>
    )
  },
)

MemoWrapper.displayName = 'MemoWrapper'

export const NodeSelectorWrapper = memo((props: NodeSelectorProps & { displayToolbar?: boolean }) => {
  const content = useMemo(() => props.children, [props.children])

  return (
    <Controller
      render={({ field }) => (
        <Controller
          name="addBarOpenForFieldId"
          control={props.control}
          render={({ field: addBarField }) => {
            const handleDoublePress = (e: GestureResponderEvent) => {
              e.stopPropagation()
              field.onChange({ edit: true, field: props.field })
              addBarField.onChange(null)
            }
            const handlePress = (e: GestureResponderEvent) => {
              e.stopPropagation()
              field.onChange({ edit: false, field: props.field })
              addBarField.onChange(null)
            }
            const handleShowAddBar = (key: string) => {
              addBarField.onChange(key)
              field.onChange(null)
            }
            const handleCloseAddBar = () => {
              addBarField.onChange(null)
            }
            return (
              <MemoWrapper
                selected={field.value?.field.id === props.field.id}
                onWrapperPress={handlePress}
                onWrapperDoublePress={handleDoublePress}
                htmlId={`field-${props.field.type}-${props.field.id}`}
                children={content}
                error={props.error}
                edgePosition={props.edgePosition}
                editorMethods={props.editorMethods}
                field={props.field}
                control={props.control}
                addBarOpenForFieldId={typeof addBarField.value === 'string' || addBarField.value === null ? addBarField.value : null}
                onChangeAddBarOpenFieldId={handleShowAddBar}
                onCloseAddBar={handleCloseAddBar}
                displayToolbar={props.displayToolbar ?? true}
              />
            )
          }}
        />
      )}
      control={props.control}
      name="selectedField"
    />
  )
})

NodeSelectorWrapper.displayName = 'NodeSelectorWrapper'
