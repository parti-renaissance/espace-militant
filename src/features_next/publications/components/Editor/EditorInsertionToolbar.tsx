import React, { memo, RefObject, useEffect } from 'react'
import { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import { Line, Svg } from 'react-native-svg'
import { styled, ThemeableStack, YStack } from 'tamagui'

import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'
import { withCleanAnimated } from '@/utils/withCleanAnimated'

import MessageEditorAddToolbar from './AddToolBar'
import { EditorMethods } from './types'

const EditorInsertionToolbarContainer = styled(ThemeableStack, {
  position: 'relative',
  zIndex: 1000,
})

const AnimatedEditorInsertionToolbarContainer = withCleanAnimated(EditorInsertionToolbarContainer)

const EditorInsertionToolbarSeparator = ({ bottom }: { bottom?: boolean }) => {
  return (
    <ThemeableStack
      position="absolute"
      top={bottom ? undefined : 13}
      bottom={bottom ? 13 : undefined}
      width="100%"
      height={2}
      style={{ pointerEvents: 'none' }}
    >
      <Svg height="2" width="100%">
        <Line x1="0" y1="1" x2="100%" y2="1" stroke="#D2DCE5" strokeWidth="2" strokeDasharray="6, 6" strokeLinecap="round" />
      </Svg>
    </ThemeableStack>
  )
}

type EditorInsertionToolbarProps = {
  display: boolean
  editorMethods: RefObject<EditorMethods>
  field?: S.FieldsArray[number]
  asLast?: boolean
  showAddBar: boolean
  onShowAddBar: () => void
  onCloseAddBar?: () => void
}

export const EditorInsertionToolbar = memo((props: EditorInsertionToolbarProps) => {
  const { display, editorMethods, field, asLast, onCloseAddBar, onShowAddBar, showAddBar } = props
  const wrapperHeight = useSharedValue(28)
  const wrapperIsAuto = useSharedValue(0)
  const wrapperOpacity = useSharedValue(0)

  useEffect(() => {
    if (display) {
      wrapperHeight.value = withTiming(28, { duration: 300, easing: Easing.inOut(Easing.ease) })
      wrapperIsAuto.value = withDelay(300, withTiming(1, { duration: 0 }))
      wrapperOpacity.value = withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) })
    } else {
      onCloseAddBar?.()
      wrapperIsAuto.value = withDelay(0, withTiming(0, { duration: 0 }))
      wrapperHeight.value = withDelay(0, withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) }))
      wrapperOpacity.value = withDelay(0, withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) }))
    }
  }, [display, onCloseAddBar, wrapperHeight, wrapperIsAuto, wrapperOpacity])

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
          editorMethods={editorMethods}
          field={field}
          asLast={asLast}
          onClose={onCloseAddBar}
          onShowAddBar={onShowAddBar}
          showAddBar={showAddBar}
        />
      </YStack>
      <EditorInsertionToolbarSeparator bottom={true} />
    </AnimatedEditorInsertionToolbarContainer>
  )
})

EditorInsertionToolbar.displayName = 'EditorInsertionToolbar'
