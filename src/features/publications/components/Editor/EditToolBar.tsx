import { forwardRef, RefObject, useCallback } from 'react'
import { VoxButton } from '@/components/Button'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { ArrowDownToLine, ArrowUpToLine, Pencil, Trash2, X } from '@tamagui/lucide-icons'
import { Control, Controller } from 'react-hook-form'
import { styled, ThemeableStack, XStack } from 'tamagui'
import { EditorMethods } from './types'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withDelay, Easing } from 'react-native-reanimated'
import React from 'react'

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

const AnimatedToolBarPositioner = Animated.createAnimatedComponent(ToolBarPositioner)

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

const AnimatedToolBarFrame = Animated.createAnimatedComponent(ToolBarFrame)

type MessageEditorToolBarProps = {
  control: Control<S.GlobalForm>
  editorMethods: RefObject<EditorMethods>
  selected: boolean
}

export type MessageEditorToolBarRef = {
  toggleAddBar: (show: boolean) => void
}

const MessageEditorEditToolbar = forwardRef<MessageEditorToolBarRef, MessageEditorToolBarProps>((props, ref) => {
  const animatedOpacity = useSharedValue(0)
  const animatedToolBarOpacity = useSharedValue(0)
  const animatedToolBarWidth = useSharedValue(TOOLBAR_WIDTH_COLLAPSED)

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(33, 43, 54, ${animatedOpacity.value})`,
  }))

  const animatedToolBarStyle = useAnimatedStyle(() => ({
    opacity: withDelay(ANIMATION_DELAY, withTiming(animatedToolBarOpacity.value, {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.quad),
    })),
    width: withDelay(ANIMATION_DELAY, withTiming(animatedToolBarWidth.value, {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.quad),
    })),
  }))

  const animatedButtonStyle = useAnimatedStyle(() => {
    const isCollapsed = animatedToolBarWidth.value < 100
    return {
      marginLeft: withTiming(isCollapsed ? BUTTON_MARGIN_COLLAPSED : BUTTON_MARGIN_EXPANDED, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.quad),
      }),
      marginRight: 4,
      transform: [{
        translateX: withTiming(isCollapsed ? 24 : 0, {
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.quad),
        }),
      }],
    }
  })

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
        React.useEffect(() => {
          if (field.value && props.selected) {
            animatedToolBarOpacity.value = 1
            animatedToolBarWidth.value = TOOLBAR_WIDTH_EXPANDED
            animatedOpacity.value = withTiming(0.8, {
              duration: ANIMATION_DURATION + ANIMATION_DELAY,
              easing: Easing.out(Easing.quad),
            })
          } else if (!props.selected) {
            animatedToolBarOpacity.value = 0
            animatedToolBarWidth.value = TOOLBAR_WIDTH_COLLAPSED
            animatedOpacity.value = withTiming(0, {
              duration: ANIMATION_DURATION + ANIMATION_DELAY,
              easing: Easing.out(Easing.quad),
            })
          }
        }, [field.value, props.selected])

        return (
          <AnimatedToolBarPositioner
            onPress={(e) => e.stopPropagation()}
            style={[animatedStyle, { pointerEvents: props.selected ? 'auto' : 'none' }]}
          >
            <AnimatedToolBarFrame style={animatedToolBarStyle}>
              <Animated.View style={animatedButtonStyle}>
                <VoxButton size="lg" variant="soft" backgroundColor="$white0" shrink iconLeft={Pencil} onPress={handleEditField(field.value?.field!)} />
              </Animated.View>
              <Animated.View style={animatedButtonStyle}>
                <VoxButton size="lg" variant="soft" backgroundColor="$white0" shrink iconLeft={Trash2} onPress={handleDeleteField(field.value?.field!)} />
              </Animated.View>
              <Animated.View style={animatedButtonStyle}>
                <VoxButton size="lg" variant="soft" backgroundColor="$white0" shrink iconLeft={ArrowUpToLine} onPress={handleMoveUp(field.value?.field!)} />
              </Animated.View>
              <Animated.View style={animatedButtonStyle}>
                <VoxButton size="lg" variant="soft" backgroundColor="$white0" shrink iconLeft={ArrowDownToLine} onPress={handleMoveDown(field.value?.field!)} />
              </Animated.View>
              <Animated.View style={animatedButtonStyle}>
                <VoxButton size="lg" variant="soft" backgroundColor="$white4" shrink iconLeft={X} onPress={handleUnSelect} />
              </Animated.View>
            </AnimatedToolBarFrame>
          </AnimatedToolBarPositioner >
        )
      }}
    />
  )
})

export default MessageEditorEditToolbar
