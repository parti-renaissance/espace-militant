import { useState } from 'react'
import { StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import { Image } from 'expo-image'

interface AutoSizeImageProps {
  source: string | number
  onPress?: () => void
  onLoad?: () => void
  hasMore?: boolean
  isLast?: boolean
  token?: string
  ratio?: number
  width?: number
  height?: number
  /** Remplit le conteneur parent et recadre en cover (ex. carousel). */
  fill?: boolean
}

function AutoSizeImage({ width, height, fill = false, ...props }: AutoSizeImageProps) {
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(width && height ? { width, height } : null)

  return (
    <Animated.View style={[styles.imageContainer, fill && styles.imageContainerFill]}>
      <Image
        style={[
          styles.image,
          fill
            ? styles.imageFill
            : {
                aspectRatio: imageSize ? imageSize.width / imageSize.height : (props.ratio ?? 16 / 9),
              },
        ]}
        source={typeof props.source === 'string' ? { uri: props.source } : props.source}
        contentFit={fill ? 'cover' : 'contain'}
        onLoad={(evt) => {
          if (evt.source && !imageSize) {
            setImageSize({
              width: evt.source.width,
              height: evt.source.height,
            })
            props.onLoad?.()
          }
        }}
      />
    </Animated.View>
  )
}

export default AutoSizeImage

const styles = StyleSheet.create({
  image: {
    height: '100%',
    flex: 1,
    zIndex: 1,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexBasis: 2,
    justifyContent: 'space-between',
    gap: 4,
  },
  imageContainerFill: {
    flexDirection: 'column',
    flexWrap: 'nowrap',
    flexBasis: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    gap: 0,
  },
  imageFill: {
    width: '100%',
    height: '100%',
    flex: undefined,
  },
  overlay: {
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    zIndex: 20,
  },
})
