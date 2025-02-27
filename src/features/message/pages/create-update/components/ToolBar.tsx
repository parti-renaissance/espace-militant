import { forwardRef, RefObject, useCallback, useImperativeHandle, useState } from 'react'
import { VoxButton } from '@/components/Button'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { BetweenHorizontalEnd, ChevronDown, ChevronUp, Image, Link, Pencil, Text as TextIcon, Trash2, X } from '@tamagui/lucide-icons'
import { Control, Controller } from 'react-hook-form'
import { isWeb, styled, ThemeableStack, XStack } from 'tamagui'
import { EditorMethods } from '../types'

const ToolBarPositioner = styled(ThemeableStack, {
  position: 'fixed',
  '$platform-native': {
    position: 'absolute',
  },
  left: '50%',
})

const ToolBarFrame = styled(ThemeableStack, {
  position: 'absolute',
  bottom: 0,
  left: -(296 / 2),
  width: 296,
  height: 56,
  padding: 12,
  borderRadius: 56 / 2,
  justifyContent: 'space-between',
  alignItems: 'center',
  alignContent: 'center',
  flexDirection: 'row',
  backgroundColor: 'black',
  borderStyle: 'solid',
  borderColor: '$textSecondary',
  gap: '$small',
  $gtSm: {
    width: 368,
    height: 68,
    borderRadius: 68 / 2,
    left: -(368 / 2) - 250,
  },
  variants: {
    addMode: {
      true: {
        left: -(360 / 2),
        width: 360,
        $gtSm: {
          width: 400,
          left: -(400 / 2) - 250,
        },
      },
    },
  } as const,
})

type MessageEditorToolBarProps = {
  control: Control<S.GlobalForm>
  editorMethods: RefObject<EditorMethods>
}

export type MessageEditorToolBarRef = {
  toggleAddBar: (show: boolean) => void
}

const MessageEditorToolbar = forwardRef<MessageEditorToolBarRef, MessageEditorToolBarProps>((props, ref) => {
  const [showAddBar, setShowAddBar] = useState(false)
  const handleUnSelect = useCallback(() => props.editorMethods.current?.unSelect(), [])
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
  const handleAddField = useCallback(
    (node: S.NodeType, after: S.FieldsArray[number] | null) => () => props.editorMethods.current?.addField(node, after ?? undefined),
    [],
  )
  const handleShowAddbar = useCallback(() => {
    setShowAddBar(true)
  }, [])
  const handleCloseAddbar = useCallback(() => {
    setShowAddBar(false)
  }, [])
  useImperativeHandle(
    ref,
    () => ({
      toggleAddBar: (x: boolean) => setShowAddBar(x),
    }),
    [],
  )
  return (
    <Controller
      control={props.control}
      name="selectedField"
      render={({ field }) => {
        return (
          <ToolBarPositioner top={isWeb ? 'calc(100vh - 100px)' : 'unset'} onPress={(e) => e.stopPropagation()}>
            {!showAddBar && field.value ? (
              <ToolBarFrame>
                <XStack>
                  <VoxButton size="md" $gtSm={{ size: 'xl' }} variant="soft" shrink iconLeft={Pencil} />
                </XStack>
                <XStack>
                  <VoxButton size="md" $gtSm={{ size: 'xl' }} variant="soft" shrink iconLeft={ChevronUp} onPress={handleMoveUp(field.value)} />
                </XStack>
                <VoxButton size="md" $gtSm={{ size: 'xl' }} variant="soft" shrink iconLeft={BetweenHorizontalEnd} onPress={handleShowAddbar} />
                <XStack>
                  <VoxButton size="md" $gtSm={{ size: 'xl' }} variant="soft" shrink iconLeft={ChevronDown} onPress={handleMoveDown(field.value)} />
                </XStack>
                <XStack>
                  <VoxButton size="md" $gtSm={{ size: 'xl' }} theme="orange" variant="soft" shrink iconLeft={Trash2} onPress={handleDeleteField(field.value)} />
                </XStack>
                <XStack>
                  <VoxButton size="md" $gtSm={{ size: 'xl' }} variant="text" shrink iconLeft={X} theme="blue" textColor="white" onPress={handleUnSelect} />
                </XStack>
              </ToolBarFrame>
            ) : (
              <ToolBarFrame addMode>
                <XStack>
                  <VoxButton size="sm" $gtSm={{ size: 'xl' }} variant="soft" iconLeft={Image} onPress={handleAddField('image', field.value)}>
                    Image
                  </VoxButton>
                </XStack>
                <XStack>
                  <VoxButton size="sm" $gtSm={{ size: 'xl' }} variant="soft" iconLeft={Link} onPress={handleAddField('button', field.value)}>
                    Bouton
                  </VoxButton>
                </XStack>
                <XStack>
                  <VoxButton size="sm" $gtSm={{ size: 'xl' }} variant="soft" iconLeft={TextIcon} onPress={handleAddField('doc', field.value)}>
                    Text
                  </VoxButton>
                </XStack>
                {field.value ? (
                  <XStack>
                    <VoxButton size="sm" $gtSm={{ size: 'xl' }} variant="text" shrink iconLeft={X} theme="blue" textColor="white" onPress={handleCloseAddbar} />
                  </XStack>
                ) : null}
              </ToolBarFrame>
            )}
          </ToolBarPositioner>
        )
      }}
    />
  )
})

export default MessageEditorToolbar
