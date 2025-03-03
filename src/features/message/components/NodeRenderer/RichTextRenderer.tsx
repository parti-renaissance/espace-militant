import { View } from 'react-native'
import { TipTapRenderer } from '@/components/TipTapRenderer'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { useThemeStyle } from '../../hooks/useThemeStyle'

export const RichTextRenderer = (props: { data: S.RichTextNode; id: string }) => {
  const { containerStyle } = useThemeStyle(props.data)
  if (!props.data.content) return null

  return (
    <View style={containerStyle}>
      <TipTapRenderer id={props.id} content={props.data.content.json} />
    </View>
  )
}
