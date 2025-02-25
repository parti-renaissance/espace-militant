import { View } from 'react-native'
import { RenderContent } from '@/components/TipTapRenderer'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { useThemeStyle } from '../../hooks/useThemeStyle'

export const RichTextRenderer = (props: { data: S.RichTextNode }) => {
  const { containerStyle } = useThemeStyle(props.data)
  if (!props.data.content) return null

  return (
    <View style={containerStyle}>
      <RenderContent data={props.data.content} />
    </View>
  )
}
