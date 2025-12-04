import { TipTapRenderer } from '@/components/TipTapRenderer'
import { useThemeStyle } from '@/features/publications/components/Editor/hooks/useThemeStyle'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { YStack, View } from 'tamagui'

export const RichTextRenderer = (props: { 
  data: S.RichTextNode
  id: string
  edgePosition?: 'leading' | 'trailing' | 'alone'
  displayToolbar?: boolean
  numberOfLines?: number
  object_id?: string
}) => {
  const { containerStyle, wrapperStyle } = useThemeStyle(props.data, props.edgePosition)
  if (!props.data.content) return null

  return (
    <YStack style={wrapperStyle} paddingTop={props.displayToolbar ? 8 : 0} paddingBottom={props.displayToolbar ? 8 : 0}>
      <View style={containerStyle}>
        <TipTapRenderer 
          id={props.id} 
          content={props.data.content.json} 
          numberOfLines={props.numberOfLines}
          object_id={props.object_id}
          object_type="publication"
        />
      </View>
    </YStack>
  )
}
