import React from 'react'
import { styled, ThemeableStack, View, YStack } from "tamagui"
import { EditorMethods } from "./types"
import { memo, RefObject } from "react"
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { Control } from "react-hook-form"
import MessageEditorAddToolbar from "./AddToolBar"
import { Platform } from "react-native"

const EditorInsertionToolbarContainer = styled(ThemeableStack, {
  position: 'relative',
  zIndex: 1000,
})

const EditorInsertionToolbarSeparator = ({ bottom }: { bottom?: boolean }) => {
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

type EditorInsertionToolbarProps = {
  display: boolean
  control: Control<S.GlobalForm>
  editorMethods: RefObject<EditorMethods>
  field?: S.FieldsArray[number]
  asLast?: boolean
  showAddBar: boolean
  onShowAddBar: () => void
  onCloseAddBar?: () => void
}

export const EditorInsertionToolbar = memo((props: EditorInsertionToolbarProps) => {

  if (!props.display) {
    return null
  }

  return (
    <EditorInsertionToolbarContainer>
      <EditorInsertionToolbarSeparator />
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
      <EditorInsertionToolbarSeparator bottom={true} />
    </EditorInsertionToolbarContainer>
  )
})

EditorInsertionToolbar.displayName = 'EditorInsertionToolbar' 