import { Text, TextStyle } from 'react-native'
import { useThemeStyle } from '@/features/message/components/Editor/hooks/useThemeStyle'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import { Href, Link } from 'expo-router'
import { View, YStack } from 'tamagui'

export const ButtonRenderer = (props: { data: S.ButtonNode; edgePosition?: 'leading' | 'trailing' | 'alone' }) => {
  const { containerStyle, baseStyle, wrapperStyle } = useThemeStyle(props.data, props.edgePosition)
  if (!props.data.content) return null

  return (
    <YStack style={wrapperStyle} paddingTop={8} paddingBottom={8} paddingLeft={16} paddingRight={16}>
      <Link asChild href={props.data.content.link as Href} target="_blank">
        <View tag="button" style={containerStyle}>
          <Text style={baseStyle as TextStyle}>{props.data.content.text}</Text>
        </View>
      </Link>
    </YStack>
  )
}
