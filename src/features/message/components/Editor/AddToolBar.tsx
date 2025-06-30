import { forwardRef, RefObject, useCallback } from 'react'
import { VoxButton } from '@/components/Button'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import { ImagePlus, PlusSquare, TextSelect, X } from '@tamagui/lucide-icons'
import { Control } from 'react-hook-form'
import { ScrollView, styled, ThemeableStack } from 'tamagui'
import { EditorMethods } from './types'

const ToolBarPositioner = styled(ThemeableStack, {
  position: 'absolute',
  zIndex: 10,
  inset: 0,
  justifyContent: 'center',
  alignItems: 'center',
})

const ToolBarFrame = styled(ThemeableStack, {
  padding: 8,
  borderRadius: 100,
  justifyContent: 'space-between',
  alignItems: 'center',
  alignContent: 'center',
  flexDirection: 'row',
  backgroundColor: 'rgba(145,158,171,0.3)',
  gap: '$small',
  $gtSm: {
    borderRadius: 68 / 2,
  },
})

type MessageEditorToolBarProps = {
  control: Control<S.GlobalForm>
  editorMethods: RefObject<EditorMethods>
  field?: S.FieldsArray[number]
  onClose?: () => void
  asLast?: boolean
}

export type MessageEditorToolBarRef = {
  toggleAddBar: (show: boolean) => void
}

const MessageEditorAddToolbar = forwardRef<MessageEditorToolBarRef, MessageEditorToolBarProps>((props, ref) => {
  const handleAddField = useCallback(
    (node: S.NodeType) => {
      if (props.editorMethods.current) {
        if (props.asLast || !props.field) {
          props.editorMethods.current.addField(node, undefined)
        } else {
          const fields = props.editorMethods.current.getFields()
          const currentIndex = fields.findIndex(f => f.id === props.field?.id)
          const previousField = currentIndex > 0 ? fields[currentIndex - 1] : undefined
          props.editorMethods.current.addField(node, previousField, currentIndex === 0)
        }
      }
    },
    [props.editorMethods, props.field],
  )

  return (
    <ToolBarPositioner onPress={(e) => e.stopPropagation()}>
      <ToolBarFrame>
            <ScrollView horizontal contentContainerStyle={{ gap: '$small', justifyContent: 'space-between', flexGrow: 1 }} flex={1}>
              <VoxButton size="sm" variant="soft" iconLeft={TextSelect} onPress={() => handleAddField('richtext')}>
                Text
              </VoxButton>
              <VoxButton size="sm" variant="soft" iconLeft={PlusSquare} onPress={() => handleAddField('button')}>
                Bouton
              </VoxButton>
              <VoxButton size="sm" variant="soft" iconLeft={ImagePlus} onPress={() => handleAddField('image')}>
                Image
              </VoxButton>
              { props.onClose ? (
                <VoxButton size="sm" variant="soft" shrink iconLeft={X} onPress={props.onClose}></VoxButton>
              ) : null }
            </ScrollView>
          </ToolBarFrame>
    </ToolBarPositioner >
  )
})

export default MessageEditorAddToolbar
