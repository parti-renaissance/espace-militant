import { useMemo } from 'react'
import { Platform } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Image, ImageStyle } from 'expo-image'
import { View, YStack } from 'tamagui'

import { useThemeStyle } from '@/features_next/publications/components/Editor/hooks/useThemeStyle'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'

import { useHits } from '@/services/hits/hook'
import { handleLinkPress } from '@/utils/linkHandler'

const OVERLAY_ANIMATION = { duration: 300, easing: Easing.out(Easing.ease) } as const

export const ImageRenderer = ({
  data,
  edgePosition,
  displayToolbar = true,
  allowHits = false,
  publicationUuid,
}: {
  data: S.ImageNode
  edgePosition?: 'leading' | 'trailing' | 'alone'
  displayToolbar?: boolean
  allowHits?: boolean
  publicationUuid?: string
}) => {
  const {
    containerStyle: { paddingBottom, ...containerStyle },
    baseStyle,
    wrapperStyle,
  } = useThemeStyle(data, edgePosition)
  const { trackClick } = useHits()
  const isWeb = Platform.OS === 'web'
  const overlayOpacity = useSharedValue(0)
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }))

  if (!data.content) return null
  const { width, height, url, link_url } = data.content
  const dynStyle = useMemo(
    () => ({
      aspectRatio: width / height,
    }),
    [width, height],
  )

  const handlePress = async () => {
    if (link_url) {
      if (allowHits) {
        try {
          trackClick({
            object_type: 'publication',
            object_id: publicationUuid,
            target_url: link_url,
            button_name: 'Image',
          })
        } catch (error) {
          // Silently ignore tracking errors - they should not impact user experience
          if (__DEV__) {
            console.warn('[ImageRenderer] trackClick error:', error)
          }
        }
      }

      await handleLinkPress(link_url, undefined, 'Image')
    }
  }

  return (
    <YStack style={wrapperStyle}>
      <View
        style={[containerStyle, link_url && { cursor: 'pointer' }]}
        paddingBottom={displayToolbar && edgePosition === 'leading' ? 0 : paddingBottom}
        onPress={link_url ? handlePress : undefined}
        tag={link_url ? 'button' : undefined}
      >
        <View
          position="relative"
          onMouseEnter={
            isWeb && link_url
              ? () => { overlayOpacity.value = withTiming(1, OVERLAY_ANIMATION) }
              : undefined
          }
          onMouseLeave={
            isWeb && link_url
              ? () => { overlayOpacity.value = withTiming(0, OVERLAY_ANIMATION) }
              : undefined
          }
        >
          <Image contentFit={'cover'} source={url} style={[dynStyle, baseStyle as ImageStyle]} />

          {isWeb && link_url && (
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(33, 43, 54, 0.16)',
                },

                overlayAnimatedStyle,
              ]}
            />
          )}
        </View>
      </View>
    </YStack>
  )
}
