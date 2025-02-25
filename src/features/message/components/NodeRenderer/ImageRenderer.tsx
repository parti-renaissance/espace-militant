import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { Image, ImageStyle } from 'expo-image'
import { useThemeStyle } from '../../hooks/useThemeStyle'

export const ImageRenderer = (props: { data: S.ImageNode }) => {
  const { containerStyle, baseStyle } = useThemeStyle(props.data)
  if (!props.data.image || !props.data.image.url) return null
  const { width, height } = props.data.image
  const dynStyle = useMemo(
    () => ({
      aspectRatio: width / height,
    }),
    [width, height],
  )

  return (
    <View style={[containerStyle]}>
      <Image contentFit={'contain'} source={{ uri: props.data.image.url }} style={[styles.image, dynStyle, baseStyle as ImageStyle]} />
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
  },
})
