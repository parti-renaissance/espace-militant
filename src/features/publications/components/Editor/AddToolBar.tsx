import { forwardRef, RefObject, useCallback, useEffect } from 'react'
import { Control } from 'react-hook-form'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withDelay, Easing } from 'react-native-reanimated'
import { styled, ThemeableStack, XStack, YStack } from 'tamagui'
import { Image, Text as TextIcon, MousePointerSquare, X, Plus } from '@tamagui/lucide-icons'
import Text from '@/components/base/Text'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { EditorMethods } from './types'

export const TOOLBAR_ITEM_HEIGHT = 56

const ANIMATION_CONFIG = {
  wrapper: { duration: 300, easing: Easing.inOut(Easing.ease) },
  container: { duration: 400, easing: Easing.inOut(Easing.quad) },
  frame: { duration: 400, easing: Easing.inOut(Easing.quad) },
  plus: { duration: 200, easing: Easing.inOut(Easing.quad) },
  item: { duration: 300, easing: Easing.inOut(Easing.quad) },
  delays: { frame: 200, plus: 400, container: 160, wrapper: 400 }
}

type UseAnimatedStateOptions = {
  openValue: number
  closedValue: number
  isOpen: boolean
  openDelay?: number
  closedDelay?: number
  config?: any
}

const useAnimatedState = ({
  openValue,
  closedValue,
  isOpen,
  openDelay = 0,
  closedDelay = 0,
  config = ANIMATION_CONFIG.container,
}: UseAnimatedStateOptions) => {
  const animatedValue = useSharedValue(isOpen ? openValue : closedValue)

  useEffect(() => {
    const targetValue = isOpen ? openValue : closedValue
    const delay = isOpen ? openDelay : closedDelay
    animatedValue.value = withDelay(delay, withTiming(targetValue, config))
  }, [isOpen, openValue, closedValue, openDelay, closedDelay, config])

  return animatedValue
}

const ToolBarWrapper = styled(ThemeableStack, {
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
})

const AnimatedToolBarWrapper = Animated.createAnimatedComponent(ToolBarWrapper)

const ToolBarContainer = styled(ThemeableStack, {
  justifyContent: 'center',
  alignItems: 'stretch',
  alignContent: 'stretch',
  backgroundColor: 'rgba(145,158,171,0.3)',
  padding: 10,
  // borderRadius: '$large',
  minHeight: 56,
  minWidth: 56,
})

const AnimatedToolBarContainer = Animated.createAnimatedComponent(ToolBarContainer)

const ToolBarFrame = styled(ThemeableStack, {
  borderRadius: '$medium',
  overflow: 'hidden',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  flexDirection: 'column',
  backgroundColor: '$white0',
  minWidth: 120,
})

const AnimatedToolBarFrame = Animated.createAnimatedComponent(ToolBarFrame)

const ToolBarItemFrame = styled(ThemeableStack, {
  padding: '$medium',
  gap: '$medium',
  backgroundColor: 'white',
  flexDirection: 'row',
  alignItems: 'center',
  alignContent: 'center',
  justifyContent: 'space-between',
  borderTopWidth: 1,
  borderTopColor: '$textOutline',
  focusable: true,
  cursor: 'pointer',
  hoverStyle: {
    backgroundColor: '$textSurface',
  },
  pressStyle: {
    backgroundColor: '$gray1',
  },
  variants: {
    last: {
      true: {
        borderTopWidth: 0,
      },
    },
  } as const,
})

const AnimatedToolBarItemFrame = Animated.createAnimatedComponent(ToolBarItemFrame)

type ToolBarItemProps = {
  title: string
  icon: React.ComponentType<any>
  onPress: () => void
  visible?: boolean
  delay?: number
}

const ToolBarItem = ({ title, icon: Icon, onPress, visible = true }: ToolBarItemProps) => {
  const animatedHeight = useAnimatedState({
    openValue: TOOLBAR_ITEM_HEIGHT,
    closedValue: 0,
    isOpen: visible,
    config: ANIMATION_CONFIG.item
  })
  const animatedOpacity = useAnimatedState({
    openValue: 1,
    closedValue: 0,
    isOpen: visible,
    config: ANIMATION_CONFIG.item
  })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
      opacity: animatedOpacity.value,
    }
  })

  return (
    <AnimatedToolBarItemFrame style={animatedStyle} onPress={onPress}>
      <YStack flex={1} gap="$small">
        <XStack gap="$medium" justifyContent="space-between" alignItems="center">
          <XStack alignSelf="flex-start" gap="$small">
            <XStack width={16}>
              <Icon color="$textPrimary" size={16} />
            </XStack>
            <Text.MD textAlign="left" color="$textPrimary">
              {title}
            </Text.MD>
          </XStack>
          <Plus color="$textPrimary" size={16} />
        </XStack>
      </YStack>
    </AnimatedToolBarItemFrame>
  )
}

type MessageEditorToolBarProps = {
  control: Control<S.GlobalForm>
  editorMethods: RefObject<EditorMethods>
  field?: S.FieldsArray[number]
  onClose?: () => void
  asLast?: boolean
  onShowAddBar?: () => void
  showAddBar?: boolean
}

export type MessageEditorToolBarRef = {
  toggleAddBar: (show: boolean) => void
}

const MessageEditorAddToolbar = forwardRef<MessageEditorToolBarRef, MessageEditorToolBarProps>((props, ref) => {
  const animatedFrameHeight = useAnimatedState({
    openValue: TOOLBAR_ITEM_HEIGHT * 4,
    closedValue: 36,
    isOpen: props.showAddBar || false,
    openDelay: ANIMATION_CONFIG.delays.frame,
    config: ANIMATION_CONFIG.frame
  })
  const animatedFrameOpacity = useAnimatedState({
    openValue: 1,
    closedValue: 0,
    isOpen: props.showAddBar || false,
    openDelay: ANIMATION_CONFIG.delays.frame + 20,
    config: ANIMATION_CONFIG.frame
  })
  const animatedContainerWidth = useAnimatedState({
    openValue: 1,
    closedValue: 0,
    isOpen: props.showAddBar || false,
    closedDelay: ANIMATION_CONFIG.delays.container,
    config: ANIMATION_CONFIG.container
  })
  const animatedContainerBorderRadius = useAnimatedState({
    openValue: 24,
    closedValue: TOOLBAR_ITEM_HEIGHT,
    isOpen: props.showAddBar || false,
    closedDelay: ANIMATION_CONFIG.delays.container,
    config: ANIMATION_CONFIG.plus
  })
  const animatedPlusOpacity = useAnimatedState({
    openValue: 0,
    closedValue: 1,
    isOpen: props.showAddBar || false,
    closedDelay: ANIMATION_CONFIG.delays.plus,
    config: ANIMATION_CONFIG.plus
  })
  const animatedPlusSize = useAnimatedState({
    openValue: 0,
    closedValue: 36,
    isOpen: props.showAddBar || false,
    closedDelay: ANIMATION_CONFIG.delays.plus,
    config: ANIMATION_CONFIG.plus
  })

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedContainerWidth.value * 100}%`,
      borderRadius: animatedContainerBorderRadius.value,
    }
  })

  const frameAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedFrameHeight.value,
      opacity: animatedFrameOpacity.value,
    }
  })

  const plusAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedPlusOpacity.value,
      height: animatedPlusSize.value,
      width: animatedPlusSize.value,
    }
  })

  const wrapperHeight = useSharedValue(28)
  const wrapperIsAuto = useSharedValue(0)
  const wrapperMargin = useSharedValue(0)
  const wrapperOpacity = useSharedValue(0)

  useEffect(() => {
    if (props.showAddBar) {
      wrapperHeight.value = withTiming(56, ANIMATION_CONFIG.wrapper)
      wrapperIsAuto.value = withDelay(200, withTiming(1, ANIMATION_CONFIG.wrapper))
      wrapperMargin.value = withTiming(28, ANIMATION_CONFIG.wrapper)
      wrapperOpacity.value = withTiming(1, ANIMATION_CONFIG.wrapper)
    } else {
      wrapperIsAuto.value = withDelay(ANIMATION_CONFIG.delays.wrapper, withTiming(0, { duration: 0 }))
      
      wrapperHeight.value = withDelay(ANIMATION_CONFIG.delays.wrapper, withTiming(28, { 
        duration: 200,
        easing: Easing.inOut(Easing.quad)
      }))
      wrapperMargin.value = withDelay(ANIMATION_CONFIG.delays.wrapper, withTiming(0, { 
        duration: 200,
        easing: Easing.inOut(Easing.quad)
      }))
    }
  }, [props.showAddBar])

  const wrapperAnimatedStyle = useAnimatedStyle(() => {
    if (wrapperIsAuto.value > 0) {
      return { 
        height: 'auto',
        marginTop: wrapperMargin.value,
        marginBottom: wrapperMargin.value,
      }
    }
    return {
      height: wrapperHeight.value,
      marginTop: wrapperMargin.value,
      marginBottom: wrapperMargin.value,
    }
  })


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
    <AnimatedToolBarWrapper style={wrapperAnimatedStyle}>
        <AnimatedToolBarContainer style={containerAnimatedStyle} onPress={(e) => e.stopPropagation()}>
        <Animated.View style={[plusAnimatedStyle, { justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position: 'absolute', zIndex: 100 }]}>
          <YStack justifyContent="center" alignItems="center" width="100%" height="100%" borderRadius={36} backgroundColor="white" onPress={props.onShowAddBar}>
            <Plus color="black" size={16} />
          </YStack>
        </Animated.View>
        <AnimatedToolBarFrame style={frameAnimatedStyle}>
          <XStack height={TOOLBAR_ITEM_HEIGHT} justifyContent="space-between" gap="$medium" alignItems="center">
            <Text.LG padding="$medium" numberOfLines={1}>Ajouter un élément</Text.LG>
            <YStack padding="$medium" cursor="pointer">
              <X color="$textPrimary" onPress={props.onClose} size={24} />
            </YStack>
          </XStack>
          <ToolBarItem
            title="Texte"
            icon={TextIcon}
            onPress={() => handleAddField('richtext')}
            visible={props.showAddBar}
          />

          <ToolBarItem
            title="Image"
            icon={Image}
            onPress={() => handleAddField('image')}
            visible={props.showAddBar}
          />

          <ToolBarItem
            title="Bouton"
            icon={MousePointerSquare}
            onPress={() => handleAddField('button')}
            visible={props.showAddBar}
          />
        </AnimatedToolBarFrame>
      </AnimatedToolBarContainer>
    </AnimatedToolBarWrapper>
  )
})

export default MessageEditorAddToolbar
