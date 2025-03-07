import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { useThemeStyle } from '@/features/message/components/Editor/hooks/useThemeStyle'
import * as S from '@/features/message/components/Editor/schemas/messageBuilderSchema'
import { Image, ImageStyle } from 'expo-image'
import { YStack } from 'tamagui'

export const ImageRenderer = (props: { data: S.ImageNode; edgePosition?: 'leading' | 'trailing' | 'alone' }) => {
  const { containerStyle, baseStyle, wrapperStyle } = useThemeStyle(props.data, props.edgePosition)
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
      <View style={[containerStyle]}>
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
