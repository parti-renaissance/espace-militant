import { useEffect, useRef, useState } from 'react'
import { LayoutChangeEvent, LayoutRectangle, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import Text from '@/components/base/Text'
import { createStyledContext, styled, TamaguiElement, ThemeableStack, withStaticProperties } from 'tamagui'

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max)
}

type Context = {
  vertical?: boolean
}

const BreadCrumContext = createStyledContext<Context>({
  vertical: false,
})

const BreadCrumbItemFrame = styled(ThemeableStack, {
  context: BreadCrumContext,

  cursor: 'pointer',
  justifyContent: 'center',
  variants: {
    first: {
      true: {
        paddingLeft: 20,
      },
    },
    vertical: {
      true: {
        paddingLeft: 16,
        paddingRight: 14,
        paddingVertical: 8,
        height: 50,
      },
      false: {
        alignItems: 'center',
        paddingHorizontal: 8,
        height: 38,
      },
    },
  } as const,
})

const ActiveIndicator = styled(ThemeableStack, {
  context: BreadCrumContext,
  backgroundColor: '$textPrimary',
  animation: 'bouncy',
  variants: {
    vertical: {
      true: {
        width: 2,
        height: 50,
      },
      false: {
        height: 2,
        width: '100%',
      },
    },
  } as const,
})

const BreadCrumbFrame = styled(ThemeableStack, {
  context: BreadCrumContext,
  justifyContent: 'flex-start',
  gap: 4,
  position: 'relative',
  variants: {
    vertical: {
      true: {
        flexDirection: 'column',
        borderLeftWidth: 2,
        borderLeftColor: '$textOutline32',
        gap: 0,
      },
      false: {
        backgroundColor: '$white1',
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '$textOutline',
        alignItems: 'center',
        height: 48,
      },
    },
  } as const,
})

export const BreadCrumbApi = withStaticProperties(BreadCrumbFrame, {
  Props: BreadCrumContext.Provider,
  Item: BreadCrumbItemFrame,
  ActiveIndicator,
})

export const BreadCrumb = <ID extends string>(
  props: Context & {
    items: Readonly<
      {
        id: ID
        label: string
      }[]
    >
    value: ID
    onChange?: (value: ID) => void
  },
) => {
  const { vertical = false } = props
  const parentCoordNumber = useSharedValue(0)
  const parentLayout = useRef<LayoutRectangle | null>(null)
  const coordNumber = useSharedValue(0)
  const widthNumber = useSharedValue(0)
  const parentRef = useRef<View>(null)
  const lastPosition = useRef([0, 0, 0])
  const refs = useRef(new Map<string, TamaguiElement | null>())
  const [isLayoutReady, setIsLayoutReady] = useState<boolean>(false)
  const setActivePostion = (x: number, y: number, width: number) => {
    const record = [x, y, width]
    if (record.every((x, i) => x === lastPosition.current[i])) return
    const clp = (x: number) =>
      parentLayout.current
        ? clamp(
            x,
            vertical ? parentLayout.current.y : parentLayout.current.x,
            vertical ? parentLayout.current.y + parentLayout.current.height : parentLayout.current.x + parentLayout.current.width,
          )
        : 0
    if (vertical) {
      coordNumber.value = withSpring(y)
    } else {
      coordNumber.value = withSpring(clp(x))
      widthNumber.value = withTiming(width)
    }
    lastPosition.current = record
  }

  const setActivePositionById = (id: ID) => {
    const element = refs.current.get(id) as View
    if (!element || !parentRef.current) return
    element?.measureLayout(parentRef.current, setActivePostion)
  }

  const handlePress = (id: ID) => () => {
    setActivePositionById(id)
    props.onChange?.(id)
  }

  useEffect(() => {
    if (isLayoutReady) {
      setActivePositionById(props.value)
    }
  }, [props.value, isLayoutReady])

  const initParentPosition = (props: LayoutChangeEvent) => {
    const { x, y } = props.nativeEvent.layout
    parentLayout.current = props.nativeEvent.layout
    parentCoordNumber.value = vertical ? y : x
    coordNumber.value = vertical ? y : x
  }
  const setRef = (id: string) => (element: TamaguiElement | null) => {
    refs.current.set(id, element)
  }

  const animation = useAnimatedStyle(() => {
    const value = coordNumber.value
    return {
      transform: vertical ? [{ translateY: value }] : [{ translateX: value }],
      ...(vertical ? { left: -2 } : { width: widthNumber.value, bottom: -2 }),
    }
  }, [vertical])

  const items = props.items.map((item, index) => {
    return (
      <BreadCrumbApi.Item
        onLayout={() => {
          setIsLayoutReady(true)
        }}
        first={!vertical && index === 0}
        key={item.id}
        ref={setRef(item.id)}
        onPress={handlePress(item.id)}
      >
        <Text.MD semibold> {item.label}</Text.MD>
      </BreadCrumbApi.Item>
    )
  })
  return (
    <BreadCrumbApi ref={parentRef} onLayout={initParentPosition} vertical={vertical}>
      <Animated.View style={[animation, { position: 'absolute' }]}>
        <BreadCrumbApi.ActiveIndicator />
      </Animated.View>
      {items}
    </BreadCrumbApi>
  )
}

export default BreadCrumb
