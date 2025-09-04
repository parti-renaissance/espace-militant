import { Text, TextStyle, Linking } from 'react-native'
import { useThemeStyle } from '@/features/publications/components/Editor/hooks/useThemeStyle'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { View, YStack } from 'tamagui'
import { useHits } from '@/services/hits/hook'

export const ButtonRenderer = ({
  data,
  edgePosition,
  displayToolbar,
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

  const handlePress = () => {
    if (data.content?.link) {
      if (allowHits) {
        trackClick({
          object_type: 'publication',
          object_id: publicationUuid,
          target_url: data.content.link,
          button_name: data.content.text,
        })
      }
      
      Linking.openURL(data.content.link)
    }
  }

  return (
    <YStack
      style={wrapperStyle}
      paddingTop={displayToolbar ? (Number(paddingTop) || 0) + 8 : paddingTop}
      paddingBottom={displayToolbar ? (Number(paddingBottom) || 0) + 8 : paddingBottom}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
    >
      <View tag="button" style={containerStyle} onPress={handlePress}>
        <Text style={baseStyle as TextStyle}>{data.content.text}</Text>
      </View>
    </YStack>
  )
}
