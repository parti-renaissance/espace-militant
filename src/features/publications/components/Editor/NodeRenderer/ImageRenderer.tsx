import { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { useThemeStyle } from '@/features/publications/components/Editor/hooks/useThemeStyle'
import * as S from '@/features/publications/components/Editor/schemas/messageBuilderSchema'
import { Image, ImageStyle } from 'expo-image'
import { YStack, View } from 'tamagui'

export const ImageRenderer = (props: { data: S.ImageNode; edgePosition?: 'leading' | 'trailing' | 'alone'; displayToolbar?: boolean }) => {
  const { containerStyle: {paddingBottom, ...containerStyle}, baseStyle, wrapperStyle } = useThemeStyle(props.data, props.edgePosition)
  if (!props.data.content) return null
  const { width, height, url } = props.data.content
  const dynStyle = useMemo(
    () => ({
      aspectRatio: width / height,
    }),
    [width, height],
  )

  return (
    <YStack style={wrapperStyle}>
      <View style={containerStyle} paddingBottom={props.displayToolbar && props.edgePosition === 'leading' ? 0 : paddingBottom}>
        <Image contentFit={'cover'} source={url} style={[styles.image, dynStyle, baseStyle as ImageStyle]} />
      </View>
    </YStack>
  )
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
})
