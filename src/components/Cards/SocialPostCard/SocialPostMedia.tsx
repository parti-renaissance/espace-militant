import { useCallback, useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from 'react'
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, View } from 'react-native'
import { Circle, XStack, YStack } from 'tamagui'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'

import AutoSizeImage from '@/components/AutoSizeImage'
import VideoPlayer from '@/features_next/video/components/VideoPlayer'
import { getVideoAspectRatio } from '@/features_next/video/components/VideoPlayer.types'

import { RestTimelineFeedSocialMedia, RestTimelineFeedSocialMediaItem } from '@/services/timeline-feed/schema'

type FeedImage = {
  url: string | null
  width: number | null
  height: number | null
} | null

const MIN_MEDIA_HEIGHT = 200

const getMediaAspectRatio = (item: RestTimelineFeedSocialMediaItem) => {
  if (item.type === 'video') {
    return getVideoAspectRatio(item.width ?? undefined, item.height ?? undefined)
  }
  return item.height > 0 ? item.width / item.height : 1
}

const getMediaHeightAtWidth = (item: RestTimelineFeedSocialMediaItem, width: number) => width / getMediaAspectRatio(item)

const getCarouselHeight = (items: RestTimelineFeedSocialMediaItem[], containerWidth: number) => {
  const heights = items.map((item) => getMediaHeightAtWidth(item, containerWidth))
  return Math.max(MIN_MEDIA_HEIGHT, Math.min(...heights))
}

const webNoSelectStyle = Platform.OS === 'web' ? ({ userSelect: 'none' } as const) : undefined

const preventWebTextSelection = () => {
  if (Platform.OS === 'web') {
    window.getSelection()?.removeAllRanges()
  }
}

const SocialPostMediaFrame = ({ children, height }: { children: ReactNode; height?: number }) => (
  <YStack
    width="100%"
    height={height}
    minHeight={height == null ? MIN_MEDIA_HEIGHT : undefined}
    backgroundColor="$gray2"
    overflow="hidden"
    justifyContent="center"
    alignItems="center"
    {...webNoSelectStyle}
  >
    {children}
  </YStack>
)

type SocialPostMediaItemProps = {
  item: RestTimelineFeedSocialMediaItem
  carouselHeight?: number
}

const SocialPostMediaItem = ({ item, carouselHeight }: SocialPostMediaItemProps) => {
  const isCarouselSlide = carouselHeight != null && carouselHeight > 0

  if (item.type === 'video') {
    return (
      <SocialPostMediaFrame height={isCarouselSlide ? carouselHeight : undefined}>
        <YStack width="100%" height={isCarouselSlide ? carouselHeight : undefined} minHeight={isCarouselSlide ? undefined : MIN_MEDIA_HEIGHT} flex={isCarouselSlide ? 1 : undefined}>
          <VideoPlayer
            hlsUrl={item.hls_url}
            thumbnailUrl={item.thumbnail_url}
            width={item.width ?? undefined}
            height={item.height ?? undefined}
            autoPlay={false}
            controls={false}
            rounded={false}
            fill={isCarouselSlide}
          />
        </YStack>
      </SocialPostMediaFrame>
    )
  }

  const aspectRatio = getMediaAspectRatio(item)

  return (
    <SocialPostMediaFrame height={isCarouselSlide ? carouselHeight : undefined}>
      {isCarouselSlide ? (
        <YStack width="100%" height={carouselHeight} overflow="hidden" alignItems="center" justifyContent="center">
          <AutoSizeImage fill source={item.url} width={item.width} height={item.height} />
        </YStack>
      ) : (
        <YStack width="100%" minHeight={MIN_MEDIA_HEIGHT} style={{ aspectRatio }}>
          <AutoSizeImage source={item.url} width={item.width} height={item.height} />
        </YStack>
      )}
    </SocialPostMediaFrame>
  )
}

type CarouselNavButtonProps = {
  direction: 'left' | 'right'
  onPress: () => void
}

const CarouselNavButton = ({ direction, onPress }: CarouselNavButtonProps) => {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight

  return (
    <YStack
      position="absolute"
      left={direction === 'left' ? 8 : undefined}
      right={direction === 'right' ? 8 : undefined}
      top="50%"
      marginTop={-16}
      zIndex={10}
      onPress={() => {
        preventWebTextSelection()
        onPress()
      }}
      onMouseDown={Platform.OS === 'web' ? (event) => event.preventDefault() : undefined}
      role="button"
      aria-label={direction === 'left' ? 'Média précédent' : 'Média suivant'}
      pressStyle={{ opacity: 0.85 }}
      cursor="pointer"
      hoverStyle={{ opacity: 0.9 }}
    >
      <Circle size={32} backgroundColor="rgba(255,255,255,0.92)" alignItems="center" justifyContent="center">
        <Icon size={20} color="$textPrimary" />
      </Circle>
    </YStack>
  )
}

type PaginationDotsProps = {
  count: number
  activeIndex: number
  onPressDot: (index: number) => void
  interactive?: boolean
}

const PaginationDots = ({ count, activeIndex, onPressDot, interactive = false }: PaginationDotsProps) => (
  <XStack gap="$xsmall" justifyContent="center" paddingVertical="$small">
    {Array.from({ length: count }, (_, index) => (
      <Circle
        key={index}
        size={6}
        backgroundColor={index === activeIndex ? '$blue6' : '$gray3'}
        onPress={() => {
          preventWebTextSelection()
          onPressDot(index)
        }}
        onMouseDown={interactive ? (event) => event.preventDefault() : undefined}
        cursor={interactive ? 'pointer' : undefined}
        hoverStyle={interactive ? { opacity: 0.8, scale: 1.2 } : undefined}
        pressStyle={interactive ? { opacity: 0.5, scale: 0.9 } : undefined}
        role="button"
        aria-label={`Aller au média ${index + 1}`}
        aria-current={index === activeIndex ? 'true' : undefined}
      />
    ))}
  </XStack>
)

type SocialPostMediaCarouselProps = {
  items: RestTimelineFeedSocialMediaItem[]
  isWeb: boolean
}

const SCROLL_ANIMATION_MS = 400

const SocialPostMediaCarousel = ({ items, isWeb }: SocialPostMediaCarouselProps) => {
  const scrollRef = useRef<ScrollView>(null)
  const isProgrammaticScroll = useRef(false)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [containerWidth, setContainerWidth] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [, startTransition] = useTransition()

  useEffect(() => {
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
    }
  }, [])

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width
    if (width > 0 && width !== containerWidth) setContainerWidth(width)
  }

  const indexFromOffset = useCallback(
    (offsetX: number) => {
      if (containerWidth <= 0) return 0
      return Math.max(0, Math.min(Math.round(offsetX / containerWidth), items.length - 1))
    },
    [containerWidth, items.length],
  )

  const updateIndexFromScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isProgrammaticScroll.current) return

      const index = indexFromOffset(event.nativeEvent.contentOffset.x)

      startTransition(() => {
        setActiveIndex((current) => (current === index ? current : index))
      })
    },
    [indexFromOffset],
  )

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      isProgrammaticScroll.current = false
      updateIndexFromScroll(event)
    },
    [updateIndexFromScroll],
  )

  const goToIndex = useCallback(
    (index: number) => {
      if (containerWidth <= 0) return
      const nextIndex = Math.max(0, Math.min(index, items.length - 1))

      isProgrammaticScroll.current = true

      setActiveIndex(nextIndex)
      scrollRef.current?.scrollTo({ x: nextIndex * containerWidth, animated: true })

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      scrollTimeout.current = setTimeout(() => {
        isProgrammaticScroll.current = false
      }, SCROLL_ANIMATION_MS)
    },
    [containerWidth, items.length],
  )

  const carouselHeight = useMemo(() => {
    if (containerWidth <= 0) return MIN_MEDIA_HEIGHT
    return getCarouselHeight(items, containerWidth)
  }, [containerWidth, items])

  const showNav = isWeb && items.length > 1 && containerWidth > 0
  const canGoLeft = activeIndex > 0
  const canGoRight = activeIndex < items.length - 1

  const scrollStyle = useMemo(
    () => ({
      width: '100%' as const,
      height: carouselHeight,
      ...webNoSelectStyle,
    }),
    [carouselHeight],
  )

  return (
    <YStack width="100%" onLayout={handleLayout} {...(isWeb ? { userSelect: 'none' } : {})}>
      <YStack width="100%" height={carouselHeight} position="relative" pointerEvents="box-none" {...(isWeb ? { userSelect: 'none' } : {})}>
        {containerWidth > 0 ? (
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={updateIndexFromScroll}
            onMomentumScrollEnd={handleScrollEnd}
            onScrollEndDrag={handleScrollEnd}
            scrollEventThrottle={16}
            style={scrollStyle}
            contentContainerStyle={{ height: carouselHeight, ...webNoSelectStyle }}
          >
            {items.map((item, index) => (
              <View key={index} style={{ width: containerWidth, height: carouselHeight, ...webNoSelectStyle }}>
                <SocialPostMediaItem item={item} carouselHeight={carouselHeight} />
              </View>
            ))}
          </ScrollView>
        ) : (
          <YStack width="100%" minHeight={MIN_MEDIA_HEIGHT}>
            <SocialPostMediaItem item={items[0]} />
          </YStack>
        )}
        {showNav && canGoLeft ? <CarouselNavButton direction="left" onPress={() => goToIndex(activeIndex - 1)} /> : null}
        {showNav && canGoRight ? <CarouselNavButton direction="right" onPress={() => goToIndex(activeIndex + 1)} /> : null}
      </YStack>
      <PaginationDots count={items.length} activeIndex={activeIndex} onPressDot={goToIndex} interactive={isWeb} />
    </YStack>
  )
}

type SocialPostMediaProps = {
  media?: RestTimelineFeedSocialMedia | null
  image?: FeedImage
}

const SocialPostMedia = ({ media, image }: SocialPostMediaProps) => {
  const isWeb = Platform.OS === 'web'

  const items = useMemo(() => {
    if (media?.items?.length) return media.items
    if (image?.url) {
      return [
        {
          type: 'photo' as const,
          url: image.url,
          width: image.width ?? 1,
          height: image.height ?? 1,
        },
      ]
    }
    return []
  }, [media, image])

  if (items.length === 0) return null

  if (items.length === 1) {
    return <SocialPostMediaItem item={items[0]} />
  }

  return <SocialPostMediaCarousel items={items} isWeb={isWeb} />
}

export default SocialPostMedia
