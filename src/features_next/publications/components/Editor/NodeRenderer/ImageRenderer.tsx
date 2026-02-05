import { useMemo } from 'react'
import { Image, ImageStyle } from 'expo-image'
import { View, YStack } from 'tamagui'

import { useThemeStyle } from '@/features_next/publications/components/Editor/hooks/useThemeStyle'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'

import { useHits } from '@/services/hits/hook'
import { handleLinkPress } from '@/utils/linkHandler'

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
        <Image contentFit={'cover'} source={url} style={[dynStyle, baseStyle as ImageStyle]} />
      </View>
    </YStack>
  )
}
