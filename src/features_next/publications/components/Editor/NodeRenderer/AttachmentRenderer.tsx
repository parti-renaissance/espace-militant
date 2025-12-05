import { Linking } from 'react-native'
import Text from '@/components/base/Text'
import { useThemeStyle } from '@/features_next/publications/components/Editor/hooks/useThemeStyle'
import * as S from '@/features_next/publications/components/Editor/schemas/messageBuilderSchema'
import { Paperclip } from '@tamagui/lucide-icons'
import { XStack, YStack } from 'tamagui'

export const AttachmentRenderer = ({
  data,
  edgePosition,
  displayToolbar = true,
  senderThemeColor,
}: { 
  data: S.AttachmentNode
  edgePosition?: 'leading' | 'trailing' | 'alone'
  displayToolbar?: boolean
  senderThemeColor?: string
}) => {
  const { containerStyle, wrapperStyle: { paddingTop, paddingBottom, ...wrapperStyle } } = useThemeStyle(data, edgePosition)
  
  if (!data.content) return null

  const handlePress = () => {
    if (data.content?.url) {
      Linking.openURL(data.content.url)
    }
  }

  const iconColor = senderThemeColor || '#4291E1'

  return (
    <YStack
      style={wrapperStyle}
      paddingTop={displayToolbar ? (Number(paddingTop) || 8) + 8 : paddingTop}
      paddingBottom={displayToolbar ? (Number(paddingBottom) || 8) + 8 : paddingBottom}
    >
      <XStack 
        style={containerStyle}
        gap={10}
        alignItems="center"
        justifyContent="center"
        onPress={handlePress}
        cursor="pointer"
      >
        <Paperclip size={16} color={iconColor} />
        <YStack>
          <Text.MD semibold numberOfLines={1}>
            {data.content.title}
          </Text.MD>
        </YStack>
      </XStack>
    </YStack>
  )
}
