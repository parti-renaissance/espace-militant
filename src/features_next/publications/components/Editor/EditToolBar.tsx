import React, { forwardRef, RefObject, useImperativeHandle } from 'react'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'
import { styled, ThemeableStack } from 'tamagui'
import { ArrowDownToLine, ArrowUpToLine, Pencil, Trash2, X } from '@tamagui/lucide-icons'

import { VoxButton } from '@/components/Button'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'
import { withCleanAnimated } from '@/utils/withCleanAnimated'

import { EditorMethods } from './types'

// Animation constants
const ANIMATION_DURATION = 300
const ANIMATION_DELAY = 50
const TOOLBAR_WIDTH_COLLAPSED = 64
const TOOLBAR_WIDTH_EXPANDED = 256
const BUTTON_MARGIN_COLLAPSED = -44
const BUTTON_MARGIN_EXPANDED = 4

const ToolBarPositioner = styled(ThemeableStack, {
  position: 'absolute',
  zIndex: 10,
  inset: 0,
  paddingBottom: 16,
  paddingTop: 16,
  justifyContent: 'center',
  alignItems: 'center',
})

const AnimatedToolBarPositioner = withCleanAnimated(ToolBarPositioner)

const ToolBarFrame = styled(ThemeableStack, {
  padding: 12,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  backgroundColor: 'rgba(145,158,171,0.3)',
  overflow: 'hidden',
  height: 64,
  width: 64,
  borderRadius: 32,
  $gtSm: {
    borderRadius: 32,
  },
})

const AnimatedToolBarFrame = withCleanAnimated(ToolBarFrame)

type MessageEditorToolBarProps = {
  editorMethods: RefObject<EditorMethods>
  selected: boolean
  selectedField: S.GlobalForm['selectedField']
}

export type MessageEditorToolBarRef = {
  toggleAddBar: (show: boolean) => void
}

const MessageEditorEditToolbar = forwardRef<MessageEditorToolBarRef, MessageEditorToolBarProps>((props, ref) => {
  const { editorMethods, selected, selectedField } = props

  useImperativeHandle(ref, () => ({
    toggleAddBar: (_show: boolean) => {
      // EditToolbar ne gère pas l'add bar - délégation au parent si nécessaire
    },
  }), [])

  const animatedOpacity = useSharedValue(0)
  const animatedToolBarOpacity = useSharedValue(0)
  const animatedToolBarWidth = useSharedValue(TOOLBAR_WIDTH_COLLAPSED)

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(33, 43, 54, ${animatedOpacity.value})`,
  }))

  const animatedToolBarStyle = useAnimatedStyle(() => ({
    opacity: withDelay(
      ANIMATION_DELAY,
      withTiming(animatedToolBarOpacity.value, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.quad),
      }),
    ),
    width: withDelay(
      ANIMATION_DELAY,
      withTiming(animatedToolBarWidth.value, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.quad),
      }),
    ),
  }))

  const animatedButtonStyle = useAnimatedStyle(() => {
    const isCollapsed = animatedToolBarWidth.value < 100
    return {
      marginLeft: withTiming(isCollapsed ? BUTTON_MARGIN_COLLAPSED : BUTTON_MARGIN_EXPANDED, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.quad),
      }),
      marginRight: 4,
      transform: [
        {
          translateX: withTiming(isCollapsed ? 24 : 0, {
            duration: ANIMATION_DURATION,
            easing: Easing.out(Easing.quad),
          }),
        },
      ],
    }
  })

  const currentField = selectedField?.field

  const handleUnSelect = () => {
    editorMethods.current?.unSelect()
  }

  const handleEditField = () => {
    if (!currentField) return
    editorMethods.current?.editField(currentField)
  }

  const handleMoveUp = () => {
    if (!currentField) return
    editorMethods.current?.moveField(currentField, -1)
    setTimeout(() => editorMethods.current?.scrollToField(currentField))
  }

  const handleMoveDown = () => {
    if (!currentField) return
    editorMethods.current?.moveField(currentField, +1)
    setTimeout(() => editorMethods.current?.scrollToField(currentField))
  }

  const handleDeleteField = () => {
    if (!currentField) return
    editorMethods.current?.removeField(currentField)
  }

  React.useEffect(() => {
    if (selected && currentField) {
      animatedToolBarOpacity.value = 1
      animatedToolBarWidth.value = TOOLBAR_WIDTH_EXPANDED
      animatedOpacity.value = withTiming(0.8, {
        duration: ANIMATION_DURATION + ANIMATION_DELAY,
        easing: Easing.out(Easing.quad),
      })
    } else if (!selected) {
      animatedToolBarOpacity.value = 0
      animatedToolBarWidth.value = TOOLBAR_WIDTH_COLLAPSED
      animatedOpacity.value = withTiming(0, {
        duration: ANIMATION_DURATION + ANIMATION_DELAY,
        easing: Easing.out(Easing.quad),
      })
    }
  }, [selected, currentField, animatedToolBarOpacity, animatedToolBarWidth, animatedOpacity])

  return (
    <AnimatedToolBarPositioner onPress={(e) => e.stopPropagation()} style={[animatedStyle, { pointerEvents: selected ? 'auto' : 'none' }]}>
      {currentField && (
        <AnimatedToolBarFrame style={animatedToolBarStyle}>
          <Animated.View style={animatedButtonStyle}>
            <VoxButton size="lg" variant="soft" backgroundColor="$white1" shrink iconLeft={Pencil} onPress={handleEditField} />
          </Animated.View>
          <Animated.View style={animatedButtonStyle}>
            <VoxButton size="lg" variant="soft" backgroundColor="$white1" shrink iconLeft={Trash2} onPress={handleDeleteField} />
          </Animated.View>
          <Animated.View style={animatedButtonStyle}>
            <VoxButton size="lg" variant="soft" backgroundColor="$white1" shrink iconLeft={ArrowUpToLine} onPress={handleMoveUp} />
          </Animated.View>
          <Animated.View style={animatedButtonStyle}>
            <VoxButton size="lg" variant="soft" backgroundColor="$white1" shrink iconLeft={ArrowDownToLine} onPress={handleMoveDown} />
          </Animated.View>
          <Animated.View style={animatedButtonStyle}>
            <VoxButton
              size="lg"
              variant="soft"
              backgroundColor="$gray3"
              hoverStyle={{ backgroundColor: '$gray4' }}
              pressStyle={{ backgroundColor: '$gray5' }}
              shrink
              iconLeft={X}
              onPress={handleUnSelect}
            />
          </Animated.View>
        </AnimatedToolBarFrame>
      )}
    </AnimatedToolBarPositioner>
  )
})

export default MessageEditorEditToolbar
