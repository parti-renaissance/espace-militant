import { Text, TextStyle } from 'react-native'
import { useThemeStyle } from '@/features/publications/components/Editor/hooks/useThemeStyle'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { Href, Link } from 'expo-router'
import { View, YStack } from 'tamagui'

export const ButtonRenderer = (props: { data: S.ButtonNode; edgePosition?: 'leading' | 'trailing' | 'alone'; displayToolbar?: boolean }) => {
  const { containerStyle, baseStyle, wrapperStyle: { paddingTop, paddingBottom, paddingLeft, paddingRight, ...wrapperStyle } } = useThemeStyle(props.data, props.edgePosition)
  if (!props.data.content) return null

  return (
    <YStack
      style={wrapperStyle}
      paddingTop={props.displayToolbar ? (Number(paddingTop) || 0) + 8 : paddingTop}
      paddingBottom={props.displayToolbar ? (Number(paddingBottom) || 0) + 8 : paddingBottom}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
    >
      <Link asChild href={props.data.content.link as Href} target="_blank">
        <View tag="button" style={containerStyle}>
          <Text style={baseStyle as TextStyle}>{props.data.content.text}</Text>
        </View>
      </Link>
    </YStack>
  )
}
