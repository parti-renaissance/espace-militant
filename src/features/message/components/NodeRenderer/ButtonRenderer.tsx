import { Text, TextStyle } from 'react-native'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { Href, Link } from 'expo-router'
import { View, YStack } from 'tamagui'
import { useThemeStyle } from '../../hooks/useThemeStyle'

export const ButtonRenderer = (props: { data: S.ButtonNode; edgePosition?: 'leading' | 'trailing' | 'alone' }) => {
  const { containerStyle, baseStyle, wrapperStyle } = useThemeStyle(props.data, props.edgePosition)
  if (!props.data.content) return null

  return (
    <YStack style={wrapperStyle}>
      <Link asChild href={props.data.content.link as Href} target="_blank">
        <View tag="button" style={containerStyle}>
          <Text style={baseStyle as TextStyle}>{props.data.content.text}</Text>
        </View>
      </Link>
    </YStack>
  )
}
