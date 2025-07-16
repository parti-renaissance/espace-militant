import React from 'react'
import { styled, ThemeableStack, View, YStack } from "tamagui"
import { EditorMethods } from "./types"
import { memo, RefObject } from "react"
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { Control } from "react-hook-form"
import MessageEditorAddToolbar from "./AddToolBar"
import { Platform } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated'

const AddFieldButtonContainer = styled(ThemeableStack, {
  position: 'relative',
  zIndex: 1000,
})

const AddFieldButtonSeparator = ({ bottom }: { bottom?: boolean }) => {
  return (
    <ThemeableStack
      position="absolute"
      top={bottom ? undefined : 13}
      bottom={bottom ? 13 : undefined}
      left={0}
      right={0}
      height={2}
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      style={{ pointerEvents: 'none' }}
    >
      {Array.from({ length: Platform.OS === 'web' ? 90 : 60 }).map((_, i) => (
        <ThemeableStack
          key={i}
          width={6}
          height={2}
          backgroundColor={i % 2 === 0 ? '$gray3' : 'transparent'}
          borderRadius={1}
        />
      ))}
    </ThemeableStack>
  )
}

type AddFieldButtonProps = {
  display: boolean
  control: Control<S.GlobalForm>
  editorMethods: RefObject<EditorMethods>
  field?: S.FieldsArray[number]
  asLast?: boolean
  showAddBar: boolean
  onShowAddBar: () => void
  onCloseAddBar?: () => void
}

export const AddFieldButton = memo((props: AddFieldButtonProps) => {

  if (!props.display) {
    return null
  }

  return (
    <AddFieldButtonContainer>
      <AddFieldButtonSeparator />
      <YStack paddingHorizontal="$medium" width="100%" justifyContent="center" alignItems="center" zIndex={10}>
        <MessageEditorAddToolbar
          control={props.control}
          editorMethods={props.editorMethods}
          field={props.field}
          asLast={props.asLast}
          onClose={props.onCloseAddBar}
          onShowAddBar={props.onShowAddBar}
          showAddBar={props.showAddBar}
        />
      </YStack>
      <AddFieldButtonSeparator bottom={true} />
    </AddFieldButtonContainer>
  )
})

AddFieldButton.displayName = 'AddFieldButton'