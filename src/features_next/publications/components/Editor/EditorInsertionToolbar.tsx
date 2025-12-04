import React, { useEffect } from 'react'
import { styled, ThemeableStack, YStack } from "tamagui"
import { EditorMethods } from "./types"
import { memo, RefObject } from "react"
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { Control } from "react-hook-form"
import MessageEditorAddToolbar from "./AddToolBar"
import { Platform } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming, Easing } from 'react-native-reanimated'

const EditorInsertionToolbarContainer = styled(ThemeableStack, {
  position: 'relative',
  zIndex: 1000,
})

const AnimatedEditorInsertionToolbarContainer = Animated.createAnimatedComponent(EditorInsertionToolbarContainer)

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

  const wrapperHeight = useSharedValue(28)
  const wrapperIsAuto = useSharedValue(0)
  const wrapperOpacity = useSharedValue(0)

  useEffect(() => {
    if (props.display) {
      wrapperHeight.value = withTiming(28, { duration: 300, easing: Easing.inOut(Easing.ease) })
      wrapperIsAuto.value = withDelay(300, withTiming(1, { duration: 0 }))
      wrapperOpacity.value = withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
    } else {
      props.onCloseAddBar?.()
      wrapperIsAuto.value = withDelay(0, withTiming(0, { duration: 0 }))
      wrapperHeight.value = withDelay(0, withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) }))
      wrapperOpacity.value = withDelay(0, withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) }))
    }
  }, [props.display, props.onCloseAddBar])

  const wrapperAnimatedStyle = useAnimatedStyle(() => {
    const pointerEvents = wrapperOpacity.value === 0 ? 'none' : 'auto'

    if (wrapperIsAuto.value > 0) {
      return {
        height: 'auto',
        opacity: wrapperOpacity.value,
        pointerEvents,
      }
    }
    return {
      height: wrapperHeight.value,
      opacity: wrapperOpacity.value,
      pointerEvents,
    }
  })

  return (
    <AnimatedEditorInsertionToolbarContainer style={wrapperAnimatedStyle}>
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
    </AnimatedEditorInsertionToolbarContainer>
  )
})

EditorInsertionToolbar.displayName = 'EditorInsertionToolbar' 