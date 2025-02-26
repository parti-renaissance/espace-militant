import { forwardRef, RefObject, useCallback, useImperativeHandle, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { VoxButton } from '@/components/Button'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { BetweenHorizontalEnd, ChevronDown, ChevronUp, Image, Link, Pencil, Text as TextIcon, Trash2, X } from '@tamagui/lucide-icons'
import { Control, Controller } from 'react-hook-form'
import { isWeb, styled, ThemeableStack, XStack } from 'tamagui'
import { RenderFieldRef } from '../types'

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
    left: -(368 / 2) - 150,
  },
  variants: {
    addMode: {
      true: {
        left: -(360 / 2),
        width: 360,
        $gtSm: {
          width: 400,
          left: -(400 / 2) - 150,
        },
      },
    },
  } as const,
})

type MessageEditorToolBarProps = {
  control: Control<S.GlobalForm>
  renderFieldsRef: RefObject<RenderFieldRef>
}

export type MessageEditorToolBarRef = {
  toggleAddBar: (show: boolean) => void
}

const MessageEditorToolbar = forwardRef<MessageEditorToolBarRef, MessageEditorToolBarProps>((props, ref) => {
  const insets = useSafeAreaInsets()
  const [showAddBar, setShowAddBar] = useState(false)
  const handleUnSelect = useCallback((fn: (x: null) => void) => () => fn(null), [])
  const handleMoveUp = useCallback(
    (x: S.FieldsArray[number]) => () => {
      props.renderFieldsRef.current?.moveField(x, -1)
      setTimeout(() => props.renderFieldsRef.current?.scrollToField(x))
    },
    [],
  )
  const handleMoveDown = useCallback(
    (x: S.FieldsArray[number]) => () => {
      props.renderFieldsRef.current?.moveField(x, +1)
      setTimeout(() => props.renderFieldsRef.current?.scrollToField(x))
    },
    [],
  )
  const handleDeleteField = useCallback((x: S.FieldsArray[number]) => () => props.renderFieldsRef.current?.removeField(x), [])
  const handleAddField = useCallback(
    (...xs: [S.FieldsArray[number] | null, S.NodeType]) =>
      () =>
        props.renderFieldsRef.current?.addField(...xs),
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
          <ToolBarPositioner top={isWeb ? 'calc(100vh - 100px)' : 'unset'}>
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
                  <VoxButton
                    size="md"
                    $gtSm={{ size: 'xl' }}
                    variant="text"
                    shrink
                    iconLeft={X}
                    theme="blue"
                    textColor="white"
                    onPress={handleUnSelect(field.onChange)}
                  />
                </XStack>
              </ToolBarFrame>
            ) : (
              <ToolBarFrame addMode>
                <XStack>
                  <VoxButton size="sm" $gtSm={{ size: 'xl' }} variant="soft" iconLeft={Image} onPress={handleAddField(field.value, 'image')}>
                    Image
                  </VoxButton>
                </XStack>
                <XStack>
                  <VoxButton size="sm" $gtSm={{ size: 'xl' }} variant="soft" iconLeft={Link} onPress={handleAddField(field.value, 'button')}>
                    Bouton
                  </VoxButton>
                </XStack>
                <XStack>
                  <VoxButton size="sm" $gtSm={{ size: 'xl' }} variant="soft" iconLeft={TextIcon} onPress={handleAddField(field.value, 'doc')}>
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

// import { SelectOption } from '@/components/base/Select/SelectV3'
// import { Image, Link, Text } from '@tamagui/lucide-icons'

// const RenderFieldWithUI = memo(
//   (props: {
//     control: Control<S.GlobalForm>
//     handleAddField: (f: string) => (x: S.NodeType) => void
//     handleMove: (id: string, distance: number) => () => void
//     handleDeleteField: (x: S.FieldsArray[number]) => () => void
//     field: S.FieldsArray[number]
//   }) => {
//     return (
//       <YStack gap="$medium">
//         <XStack alignItems="center" gap="$small" flex={1}>
//           <XStack>
//             <YStack gap="$xsmall">
//               <VoxButton theme="purple" variant="soft" size="sm" shrink iconLeft={ChevronUp} onPress={props.handleMove(props.field.id, -1)} />
//               <VoxButton theme="purple" variant="soft" size="sm" shrink iconLeft={ChevronDown} onPress={props.handleMove(props.field.id, +1)} />
//             </YStack>
//           </XStack>
//           <View flex={1}>
//             <RenderField field={props.field} control={props.control} />
//           </View>
//           <XStack>
//             <VoxButton theme="purple" variant="soft" size="xl" shrink iconLeft={Trash} onPress={props.handleDeleteField(props.field)} />
//           </XStack>
//         </XStack>
//         <XStack justifyContent="center">
//           <Select
//             theme="purple"
//             size="xs"
//             icon={Plus}
//             label="Ajouter"
//             noValuePlaceholder="un block"
//             options={fieldOptions}
//             onChange={props.handleAddField(props.field.id)}
//           />
//         </XStack>
//       </YStack>
//     )
//   },
// )

// const fieldOptions: SelectOption<S.NodeType>[] = [
//   {
//     label: 'Un bouton',
//     icon: Link,
//     value: 'button',
//   },
//   {
//     value: 'image',
//     icon: Image,
//     label: 'Une image',
//   },
//   {
//     value: 'doc',
//     icon: Text,
//     label: 'Un block Text',
//   },
// ]
