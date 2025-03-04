import { View } from 'react-native'
import { TipTapRenderer } from '@/components/TipTapRenderer'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { YStack } from 'tamagui'
import { useThemeStyle } from '../../hooks/useThemeStyle'

export const RichTextRenderer = (props: { data: S.RichTextNode; id: string; edgePosition?: 'leading' | 'trailing' | 'alone' }) => {
  const { containerStyle, wrapperStyle } = useThemeStyle(props.data, props.edgePosition)
  if (!props.data.content) return null

  return (
    <YStack style={wrapperStyle}>
      <View style={containerStyle}>
        <TipTapRenderer id={props.id} content={props.data.content.json} />
      </View>
    </YStack>
  )
}
