import { Text, TextStyle } from 'react-native'
import { useThemeStyle } from '@/features_next/publications/components/Editor/hooks/useThemeStyle'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'
import { View, YStack } from 'tamagui'
import { useHits } from '@/services/hits/hook'
import { handleLinkPress } from '@/utils/linkHandler'

export const ButtonRenderer = ({
  data,
  edgePosition,
  displayToolbar = true,
  allowHits = false,
  publicationUuid,
}: { 
  data: S.ButtonNode; 
  edgePosition?: 'leading' | 'trailing' | 'alone'; 
  displayToolbar?: boolean;
  allowHits?: boolean;
  publicationUuid?: string;
}) => {
  const { containerStyle, baseStyle, wrapperStyle: { paddingTop, paddingBottom, paddingLeft, paddingRight, ...wrapperStyle } } = useThemeStyle(data, edgePosition)
  const { trackClick } = useHits()
  
  if (!data.content) return null

  const handlePress = async () => {
    if (data.content?.link) {
      if (allowHits) {
        try {
          trackClick({
            object_type: 'publication',
            object_id: publicationUuid,
            target_url: data.content.link,
            button_name: data.content.text,
          })
        } catch (error) {
          // Silently ignore tracking errors - they should not impact user experience
          if (__DEV__) {
            console.warn('[ButtonRenderer] trackClick error:', error)
          }
        }
      }
      
      await handleLinkPress(data.content.link, undefined, data.content.text)
    }
  }

  return (
    <YStack
      style={wrapperStyle}
      paddingTop={displayToolbar ? (Number(paddingTop) || 8) + 8 : paddingTop}
      paddingBottom={displayToolbar ? (Number(paddingBottom) || 8) + 8 : paddingBottom}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
    >
      <View tag="button" style={containerStyle} onPress={handlePress}>
        <Text style={baseStyle as TextStyle}>{data.content.text}</Text>
      </View>
    </YStack>
  )
}
