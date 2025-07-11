import { forwardRef, RefObject, useCallback } from 'react'
import { VoxButton } from '@/components/Button'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { ArrowDownToLine, ArrowUpToLine, Pencil, Trash2, X } from '@tamagui/lucide-icons'
import { Control, Controller } from 'react-hook-form'
import { styled, ThemeableStack, XStack } from 'tamagui'
import { EditorMethods } from './types'

const ToolBarPositioner = styled(ThemeableStack, {
  position: 'absolute',
  zIndex: 10,
  inset: 0,
  paddingBottom: 16,
  paddingTop: 16,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(33,43,54,0.8)',
})

const ToolBarFrame = styled(ThemeableStack, {
  padding: 12,
  borderRadius: 68 / 2,
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
}

export type MessageEditorToolBarRef = {
  toggleAddBar: (show: boolean) => void
}

const MessageEditorEditToolbar = forwardRef<MessageEditorToolBarRef, MessageEditorToolBarProps>((props, ref) => {
  const handleUnSelect = useCallback(() => props.editorMethods.current?.unSelect(), [])
  const handleEditField = useCallback(
    (x: S.FieldsArray[number]) => () => {
      props.editorMethods.current?.editField(x)
    },
    [],
  )
  const handleMoveUp = useCallback(
    (x: S.FieldsArray[number]) => () => {
      props.editorMethods.current?.moveField(x, -1)
      setTimeout(() => props.editorMethods.current?.scrollToField(x))
    },
    [],
  )
  const handleMoveDown = useCallback(
    (x: S.FieldsArray[number]) => () => {
      props.editorMethods.current?.moveField(x, +1)
      setTimeout(() => props.editorMethods.current?.scrollToField(x))
    },
    [],
  )
  const handleDeleteField = useCallback((x: S.FieldsArray[number]) => () => props.editorMethods.current?.removeField(x), [])

  return (
    <Controller
      control={props.control}
      name="selectedField"
      render={({ field }) => {
        return (
          <ToolBarPositioner onPress={(e) => e.stopPropagation()}>
            {
              field.value ? (
                <ToolBarFrame>
                  <XStack>
                    <VoxButton size="lg" variant="soft" backgroundColor="$white0" shrink iconLeft={Pencil} onPress={handleEditField(field.value.field)} />
                  </XStack>
                  <XStack>
                    <VoxButton size="lg" variant="soft" backgroundColor="$white0" shrink iconLeft={Trash2} onPress={handleDeleteField(field.value.field)} />
                  </XStack>
                  <XStack>
                    <VoxButton size="lg" variant="soft" backgroundColor="$white0" shrink iconLeft={ArrowUpToLine} onPress={handleMoveUp(field.value.field)} />
                  </XStack>
                  <XStack>
                    <VoxButton size="lg" variant="soft" backgroundColor="$white0" shrink iconLeft={ArrowDownToLine} onPress={handleMoveDown(field.value.field)} />
                  </XStack>
                  <XStack>
                    <VoxButton size="lg" variant="soft" backgroundColor="$white4" shrink iconLeft={X} onPress={handleUnSelect} />
                  </XStack>
                </ToolBarFrame>
              ) : (
                null
              )
            }
          </ToolBarPositioner >
        )
      }}
    />
  )
})

export default MessageEditorEditToolbar
