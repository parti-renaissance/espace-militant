import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Platform, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { VoxButton } from '@/components/Button'
import ModalOrPageBase from '@/components/ModalOrPageBase/ModalOrPageBase'
import VoxCard from '@/components/VoxCard/VoxCard'
import { useMutation } from '@tanstack/react-query'
import { ImageResult, manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import { isWeb, styled, ThemeableStack, useMedia, XStack, YStack } from 'tamagui'
import { gray } from './../../../theme/colors.hsl'

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  flex: {
    flex: 1,
  },
})

const ImgCroperOverlayFrame = styled(ThemeableStack, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 100,
})

const IngCropperDarkFrame = styled(ThemeableStack, {
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
})

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max)
}
const CROP_SIZE = 300

type Size = {
  width: number
  height: number
}

const getMaxImgWidth = (img: Size) => {
  const smallerSideLabel = img.width > img.height ? 'height' : 'width'
  const smallerSide = img[smallerSideLabel]
  const result = CROP_SIZE / smallerSide
  return result
}

function ImageCroper(props: { windowSize: { width: number; height: number }; image: ImageResult; onChange: (image?: string) => void }) {
  const scale = useSharedValue(1)
  const startScale = useSharedValue(0)
  const translationX = useSharedValue(0)
  const translationY = useSharedValue(0)
  const prevTranslationX = useSharedValue(0)
  const prevTranslationY = useSharedValue(0)
  const [ready, setReady] = useState(false)
  const originalImage = useRef<ImageResult | null>(null)
  const [originalSizes, setOriginalSizes] = useState({ width: 0, height: 0 })
  const defaultImagePosition = {
    x: (props.windowSize.width - originalSizes.width) / 2,
    y: (props.windowSize.height - originalSizes.height) / 2,
  }

  const frameRef = useRef<View>(null)
  const media = useMedia()

  useEffect(() => {
    if (frameRef.current && isWeb && ready) {
      const el = frameRef.current as unknown as HTMLElement
      el.onwheel = (e) => {
        e.preventDefault()
        const w = originalSizes.width
        const h = originalSizes.height
        const maxScale = Math.min(w / 100, h / 100)
        scale.value = clamp(scale.value - e.deltaY / props.windowSize.height, Math.max(CROP_SIZE / w, CROP_SIZE / h), maxScale)
        const maxTranslateX = (w - CROP_SIZE / scale.value) / 2
        const maxTranslateY = (h - CROP_SIZE / scale.value) / 2
        translationX.value = clamp(translationX.value, -maxTranslateX, maxTranslateX)
        translationY.value = clamp(translationY.value, -maxTranslateY, maxTranslateY)
      }
    }
  }, [ready])

  useEffect(() => {
    ;(async () => {
      const image = props.image
      originalImage.current = image as ImageResult
      const orignalSize = { width: originalImage.current.width, height: originalImage.current.height }
      setOriginalSizes(orignalSize)
      const displaySizeRatio = getMaxImgWidth(orignalSize)
      scale.value = displaySizeRatio
      setReady(true)
    })()
  }, [props.image])

  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value
    })
    .onUpdate((event) => {
      const w = originalSizes.width
      const h = originalSizes.height
      scale.value = clamp(startScale.value * event.scale, Math.max(CROP_SIZE / w, CROP_SIZE / h), Math.min(w / 100, h / 100))
    })
    .runOnJS(true)

  const boxAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translationX.value }, { translateY: translationY.value }],
  }))

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value
      prevTranslationY.value = translationY.value
    })
    .onUpdate((event) => {
      const w = originalSizes.width
      const h = originalSizes.height
      const maxTranslateX = (w - CROP_SIZE / scale.value) / 2
      const maxTranslateY = (h - CROP_SIZE / scale.value) / 2
      translationX.value = clamp(prevTranslationX.value + event.translationX / scale.value, -maxTranslateX, maxTranslateX)
      translationY.value = clamp(prevTranslationY.value + event.translationY / scale.value, -maxTranslateY, maxTranslateY)
    })
    .runOnJS(true)

  const composed = Gesture.Simultaneous(pan, pinch)

  const calcCropSize = () => {
    const w = originalSizes.width
    const h = originalSizes.height
    const xOriginCropFrame = (w - CROP_SIZE / scale.value) / 2
    const yOriginCropFrame = (h - CROP_SIZE / scale.value) / 2
    const x = xOriginCropFrame - translationX.value
    const y = yOriginCropFrame - translationY.value

    return { x: x > 0 ? x : 0, y: y > 0 ? y : 0, width: CROP_SIZE / scale.value, height: CROP_SIZE / scale.value }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (cropSize: { x: number; y: number; width: number; height: number }) => {
      const crop = {
        originX: cropSize.x,
        originY: cropSize.y,
        width: cropSize.width,
        height: cropSize.height,
      }
      return manipulateAsync(
        originalImage.current?.uri || '',
        [
          { crop },
          {
            resize: {
              width: 360,
              height: 360,
            },
          },
        ],
        { compress: 0.75, format: SaveFormat.WEBP, base64: true },
      )
    },
    onSuccess: (result) => {
      props.onChange('data:image/webp;base64,' + result.base64!)
    },
  })

  const cropImg = () => {
    mutate(calcCropSize())
  }

  const dimentionStyle = media.gtMd || Platform.OS === 'android' ? props.windowSize : {}

  return ready && originalSizes.width > 0 ? (
    <GestureDetector gesture={composed}>
      <View ref={frameRef} style={[dimentionStyle, media.gtMd ? {} : styles.flex]}>
        <View style={[media.gtMd ? {} : styles.flex, { backgroundColor: gray.gray6 }]}>
          <Animated.Image
            style={[
              boxAnimatedStyles,
              { position: 'absolute', top: defaultImagePosition.y, right: defaultImagePosition.x, width: originalSizes.width, height: originalSizes.height },
            ]}
            source={{ uri: props.image.uri }}
          />

          <ImgCroperOverlayFrame style={[dimentionStyle]}>
            <YStack flex={1}>
              <IngCropperDarkFrame flex={1} />
              <XStack>
                <IngCropperDarkFrame flex={1} />
                <YStack width={CROP_SIZE + 4} height={CROP_SIZE + 4} borderWidth={2} borderColor={'white'} />
                <IngCropperDarkFrame flex={1} />
              </XStack>
              <IngCropperDarkFrame flex={1}></IngCropperDarkFrame>
            </YStack>
          </ImgCroperOverlayFrame>
        </View>
        <SafeAreaView
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 200,
          }}
        >
          <XStack gap="$medium" p={16} justifyContent="center" alignItems="center">
            <VoxButton size="lg" onPress={() => props.onChange()} disabled={isPending}>
              Annuler
            </VoxButton>
            <VoxButton theme="gray" inverse={true} size="lg" onPress={cropImg} loading={isPending}>
              Enregistrer
            </VoxButton>
          </XStack>
        </SafeAreaView>
      </View>
    </GestureDetector>
  ) : null
}
const windowSize = Dimensions.get(isWeb || Platform.OS === 'android' ? 'window' : 'screen')

export default function ModalImageCroper(props: { image: ImageResult | null; onClose: (img?: string) => void; open: boolean }) {
  const media = useMedia()
  return (
    <ModalOrPageBase header={<View />} scrollable={false} open={props.open} onClose={props.onClose}>
      {props.image ? (
        media.md ? (
          <ImageCroper image={props.image} onChange={props.onClose} windowSize={windowSize} />
        ) : (
          <GestureHandlerRootView style={{ width: 600, height: 600 }}>
            <VoxCard width={600} height={600} overflow="hidden" backgroundColor="$gray6">
              <ImageCroper
                image={props.image}
                onChange={props.onClose}
                windowSize={{
                  width: 600,
                  height: 600,
                }}
              />
            </VoxCard>
          </GestureHandlerRootView>
        )
      ) : null}
    </ModalOrPageBase>
  )
}
