import React, { Children, useEffect, useRef, useState } from 'react'
import { Animated, Easing, View } from 'react-native'
import { AnimatePresence, useMedia, XStack, YStack } from 'tamagui'
import { ChevronUp, Eye } from '@tamagui/lucide-icons'

import Text from '@/components/base/Text'
import { VoxButton } from '@/components/Button'

import type { RestAlertsResponse } from '@/services/alerts/schema'
import { HIT_SOURCES, type HitSource } from '@/services/hits/constants'

import AlertCard from '../AlertCard'

const collapseSize = [1, 0.95, 0.9, 0.85]

export function AnimatedStack({ children, isOpen }: { children: React.ReactNode[]; isOpen: boolean }) {
  const media = useMedia()
  const childArray = Children.toArray(children)

  // Initialisation à la valeur finale (0 ou 1)
  const animateds = useRef(childArray.map(() => new Animated.Value(isOpen ? 1 : 0))).current
  const [childHeights, setChildHeights] = useState<number[]>([])

  // Pour retarder le montage des cartes secondaires et soulager le premier rendu
  const [isMounted, setIsMounted] = useState(false)

  // Ref pour bloquer toute animation au chargement de la page
  const isFirstMount = useRef(true)

  useEffect(() => {
    // Indique que le premier rendu critique est passé
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // On bloque l'animation au chargement initial
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    // Animation stricte basée sur le temps (250ms), pas de physique !
    if (isOpen) {
      Animated.stagger(
        60,
        animateds.map((a) =>
          Animated.timing(a, {
            toValue: 1,
            duration: 250,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }),
        ),
      ).start()
    } else {
      Animated.stagger(
        60,
        animateds
          .slice(1)
          .reverse()
          .map((a) =>
            Animated.timing(a, {
              toValue: 0,
              duration: 250,
              easing: Easing.out(Easing.ease),
              useNativeDriver: false,
            }),
          ),
      ).start()
      Animated.timing(animateds[0], { toValue: 1, duration: 250, useNativeDriver: false }).start()
    }
  }, [isOpen, animateds])

  // --- CALCULS DE HAUTEUR SÉCURISÉS POUR UN AFFICHAGE IMMÉDIAT ---
  // On utilise 200px comme estimation initiale (basé sur tes logs) pour ne pas attendre onLayout
  const firstHeight = childHeights[0] || 200
  const peekHeight = Math.min(animateds.length - 1, 2) * (media.sm ? 5 : 10)
  const collapsedHeight = firstHeight + peekHeight
  const expandedHeight = childHeights.length > 0 ? childHeights.reduce((acc, curr) => acc + (curr || 200), 0) : 200 * childArray.length

  return (
    <>
      {/* Vues invisibles pour la mesure */}
      {childArray.map((child, i) => {
        // On ne monte les vues invisibles secondaires qu'APRÈS le chargement initial
        // pour laisser le thread JS respirer au démarrage.
        if (!isMounted && i > 0) return null

        return (
          <View
            key={i}
            style={{ position: 'absolute', left: 0, opacity: 0, zIndex: -1, userSelect: 'none' }}
            pointerEvents="none"
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout
              setChildHeights((prev) => {
                if (prev[i] === height) return prev
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

      <Animated.View
        style={{
          position: 'relative',
          height:
            animateds?.[1]?.interpolate({
              inputRange: [0, 1],
              outputRange: [collapsedHeight, expandedHeight],
            }) || collapsedHeight, // Fallback de sécurité
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
                  { translateY: isFirst ? 0 : a.interpolate({ inputRange: [0, 1], outputRange: [(media.sm ? -68 : -66) * i - 8 * (i - 1), 0] }) },
                ],
                backgroundColor: '#fdfdfd',
                borderRadius: 16,
                borderWidth: isFirst || isOpen ? 0 : 1,
                borderColor: isFirst || isOpen ? 'transparent' : 'hsl(210, 13%, 94%)',
                // Utilisation de 200 comme valeur par défaut immédiate
                height: isFirst ? childHeights[i] || 200 : a.interpolate({ inputRange: [0, 1], outputRange: [64, childHeights[i] || 200] }),
                marginBottom: 16,
                zIndex: 5 - i,
                top: 0,
                overflow: 'hidden',
                shadowColor: 'rgba(220, 224, 228, 0.40)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: a,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Animated.View style={{ opacity: isFirst ? 1 : a }}>{child}</Animated.View>
            </Animated.View>
          )
        })}
      </Animated.View>
    </>
  )
}

interface AlertStackProps {
  alerts: RestAlertsResponse
  initialCollapsed?: boolean
  hitSource?: HitSource
}

const AlertStack: React.FC<AlertStackProps> = ({ alerts, initialCollapsed, hitSource = HIT_SOURCES.PAGE_TIMELINE }) => {
  const media = useMedia()
  const hasMultiple = alerts.length > 1
  const [collapsed, setCollapsed] = useState(initialCollapsed ?? (hasMultiple ? true : false))

  return (
    <YStack gap={8} marginBottom={media.sm ? '$medium' : undefined}>
      <XStack justifyContent="space-between" alignItems="center" flexShrink={1} height={32} px={media.gtSm ? 0 : '$medium'}>
        <Text.MD color="$gray4" semibold>
          {alerts.length > 1 ? `Infos à la une` : 'Info à la une'}
        </Text.MD>
        <AnimatePresence>
          {hasMultiple && !collapsed ? (
            <VoxButton
              size="sm"
              variant="soft"
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
      <YStack mx="$medium" margin={media.gtSm ? 0 : undefined}>
        {alerts.length === 1 ? (
          alerts.map((alert, i) => <AlertCard key={i} payload={alert} hitSource={hitSource} />)
        ) : (
          <AnimatedStack isOpen={!collapsed}>
            {alerts.map((alert, i) => (
              <AlertCard key={i} payload={alert} hitSource={hitSource} />
            ))}
          </AnimatedStack>
        )}
      </YStack>
      {alerts.length > 1 ? (
        <YStack height={36} mt={media.gtSm ? '$small' : '$medium'}>
          <AnimatePresence initial={false}>
            {hasMultiple && collapsed ? (
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
      ) : (
        <YStack />
      )}
    </YStack>
  )
}

export default AlertStack
