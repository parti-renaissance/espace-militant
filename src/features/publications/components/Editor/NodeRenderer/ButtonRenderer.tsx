import { Text, TextStyle, Linking } from 'react-native'
import { useThemeStyle } from '@/features/publications/components/Editor/hooks/useThemeStyle'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { View, YStack } from 'tamagui'

export const ButtonRenderer = (props: { data: S.ButtonNode; edgePosition?: 'leading' | 'trailing' | 'alone'; displayToolbar?: boolean }) => {
  const { containerStyle, baseStyle, wrapperStyle: { paddingTop, paddingBottom, paddingLeft, paddingRight, ...wrapperStyle } } = useThemeStyle(props.data, props.edgePosition)
  if (!props.data.content) return null

  const handlePress = () => {
    if (props.data.content?.link) {
      Linking.openURL(props.data.content.link)
    }
  }

  return (
    <YStack
      style={wrapperStyle}
      paddingTop={props.displayToolbar ? (Number(paddingTop) || 0) + 8 : paddingTop}
      paddingBottom={props.displayToolbar ? (Number(paddingBottom) || 0) + 8 : paddingBottom}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
    >
      <View tag="button" style={containerStyle} onPress={handlePress}>
        <Text style={baseStyle as TextStyle}>{props.data.content.text}</Text>
      </View>
    </YStack>
  )
}
