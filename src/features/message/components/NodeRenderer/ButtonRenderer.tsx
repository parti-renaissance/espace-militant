import { Text, TextStyle } from 'react-native'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { Href, Link } from 'expo-router'
import { View } from 'tamagui'
import { useThemeStyle } from '../../hooks/useThemeStyle'

export const ButtonRenderer = (props: { data: S.ButtonNode }) => {
  const { containerStyle, baseStyle } = useThemeStyle(props.data)
  if (!props.data) return null

  return (
    <Link asChild href={props.data.link as Href} target="_blank">
      <View tag="button" style={containerStyle}>
        <Text style={baseStyle as TextStyle}>{props.data.label}</Text>
      </View>
    </Link>
  )
}
