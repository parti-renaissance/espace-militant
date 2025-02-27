import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import * as S from '@/features/message/schemas/messageBuilderSchema'
import { Image, ImageStyle } from 'expo-image'
import { useThemeStyle } from '../../hooks/useThemeStyle'

export const ImageRenderer = (props: { data: S.ImageNode }) => {
  const { containerStyle, baseStyle } = useThemeStyle(props.data)
  if (!props.data.content) return null
  const { width, height, url } = props.data.content
  const dynStyle = useMemo(
    () => ({
      aspectRatio: width / height,
    }),
    [width, height],
  )

  return (
    <View style={[containerStyle]}>
      <Image contentFit={'cover'} source={{ uri: url }} style={[styles.image, dynStyle, baseStyle as ImageStyle]} />
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
})
