import React, { useState, useMemo, useRef, Children } from 'react'
import { YStack, XStack, useMedia, AnimatePresence, Button } from 'tamagui'
import { ChevronUp, Eye } from '@tamagui/lucide-icons'
import AlertCard from '../AlertCard'
import type { RestAlertsResponse } from '@/services/alerts/schema'
import { VoxButton } from '@/components/Button'
import Text from '@/components/base/Text'
import { View, Animated } from 'react-native'


const collapseSize = [1, 0.95, 0.9, 0.85]

export function AnimatedStack({ children, isOpen }: { children: React.ReactNode[], isOpen: boolean }) {
  const media = useMedia()
  const childArray = Children.toArray(children)
  const animateds = useRef(childArray.map(() => new Animated.Value(0))).current
  const [childHeights, setChildHeights] = useState<number[]>([])

  React.useEffect(() => {
    if (isOpen) {
      Animated.stagger(60, animateds.map((a, i) =>
        i === 0
          ? Animated.timing(a, { toValue: 1, duration: 0, useNativeDriver: false })
          : Animated.spring(a, { toValue: 1, stiffness: 220, damping: 25, mass: 1, useNativeDriver: false })
      )).start()
    } else {
      Animated.stagger(60, animateds.slice(1).reverse().map(a =>
        Animated.spring(a, { toValue: 0, stiffness: 200, damping: 22, mass: 1, useNativeDriver: false })
      )).start()
      Animated.timing(animateds[0], { toValue: 1, duration: 0, useNativeDriver: false }).start()
    }
  }, [isOpen, animateds])

  return (
    <>
      {childArray.map((child, i) => {
        return (
          <View
            key={i}
            style={{ position: 'absolute', left: 0, opacity: 0, zIndex: -1, userSelect: 'none', pointerEvents: 'none' }}
            onLayout={event => {
              const { height } = event.nativeEvent.layout
              setChildHeights(prev => {
                const next = [...prev]
                next[i] = height
                return next
              })
            }}
          >
            {child}
          </View>
        )
      })}
      {childHeights.length > 0 && (
        <Animated.View
          style={{
            position: 'relative',
            height: animateds?.[1].interpolate({ inputRange: [0, 1], outputRange: [childHeights[0] + (Math.min(animateds.length - 1, 2) * (media.sm ? 5 : 10)), childHeights.reduce((acc, curr) => acc + curr, 0)] }),
          }}
        >
          {childArray.map((child, i) => {
            const a = animateds[i]
            const isFirst = i === 0
            const isHidden = i > 2
           
            return (
              <Animated.View
                key={i}
                style={{
                  opacity: isHidden ? a : 1,
                  position: 'relative',
                  left: 0,
                  transform: [
                    { scale: isFirst ? 1 : a.interpolate({ inputRange: [0, 1], outputRange: [collapseSize[Math.min(i, collapseSize.length - 1)], 1] }) },
                    { translateY: isFirst ? 0 : a.interpolate({ inputRange: [0, 1], outputRange: [(media.sm ? -62 : -60) * i - 8 * (i - 1), 0] }) }
                  ],
                  backgroundColor: '#fcfcfc',
                  borderRadius: 15,
                  borderWidth: isFirst || isOpen ? 0 : 1,
                  borderColor: isFirst || isOpen ? 'transparent' : 'rgba(0,0,0,0.1)',
                  height: isFirst
                    ? (childHeights[i] || 150)
                    : a.interpolate({ inputRange: [0, 1], outputRange: [64, childHeights[i] || 150] }),
                  marginBottom: 10,
                  zIndex: 5 - i,
                  top: 0,
                  overflow: 'hidden',
                  shadowColor: 'rgba(220, 224, 228, 0.40)',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Animated.View style={{ opacity: isFirst ? 1 : a }}>{child}</Animated.View>
              </Animated.View>
            )
          })}
        </Animated.View>
      )}

    </>
  )
}

interface AlertStackProps {
  alerts: RestAlertsResponse
  initialCollapsed?: boolean
}

const AlertStack: React.FC<AlertStackProps> = ({ alerts, initialCollapsed }) => {
  const media = useMedia()
  const hasMultiple = alerts.length > 1
  const [collapsed, setCollapsed] = useState(
    initialCollapsed ?? (hasMultiple ? true : false)
  )

  return (
    <YStack gap={8} $gtSm={{ gap: 16, marginBottom: '$large' }} animation="quick" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }}>
      <XStack justifyContent="space-between" alignItems="flex-end" flexShrink={1} height={32} px={media.gtSm ? 0 : '$medium'}>
        <Text.MD color="$gray4" semibold>
          {alerts.length > 1 ? `Infos à la une` : 'Info à la une'}
        </Text.MD>
        <AnimatePresence>
          {(hasMultiple && !collapsed) ? (
            <VoxButton
              size="sm"
              variant="outlined"
              theme="blue"
              iconLeft={ChevronUp}
              onPress={() => setCollapsed((c) => !c)}
              animation="quick"
              style={{ transform: [{ translateX: 0 }] }}
              enterStyle={{ opacity: 0, transform: [{ translateX: 16 }] }}
              exitStyle={{ opacity: 0, transform: [{ translateX: 16 }] }}
              animateOnly={['opacity', 'transform', 'height']}
            >
              Réduire
            </VoxButton>
          ) : null}
        </AnimatePresence>
      </XStack>
      <YStack margin="$medium" $gtSm={{ margin: 0 }}>
        <AnimatedStack isOpen={!collapsed}>
          {[...alerts].map((alert, i) => (
            <AlertCard key={i} payload={alert} />
          ))}
        </AnimatedStack>
      </YStack>
      <YStack height={36}>
        <AnimatePresence>
          {(hasMultiple && collapsed) ? (
            <XStack justifyContent="center" mt="$2" zIndex={100}>
              <VoxButton
                variant="text"
                theme="blue"
                iconLeft={Eye}
                onPress={() => setCollapsed((c) => !c)}
                animation="quick"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
                animateOnly={['opacity']}
              >
                {`${alerts.length} infos à la une`}
              </VoxButton>
            </XStack>
          ) : null}
        </AnimatePresence>
      </YStack>
    </YStack>
  )
}

export default AlertStack 