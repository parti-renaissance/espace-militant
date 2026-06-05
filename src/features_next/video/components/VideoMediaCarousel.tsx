import { useCallback, useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from 'react'
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  View,
  ViewToken,
  type ViewabilityConfig,
} from 'react-native'
import { Circle, XStack, YStack } from 'tamagui'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'

import AutoSizeImage from '@/components/AutoSizeImage'
import FeedVideoPlayer from '@/features_next/video/components/FeedVideoPlayer'
import { getVideoAspectRatio } from '@/features_next/video/components/VideoPlayer.types'
import { buildVideoId, useIsContentInFeedView, useVideoFeedStore } from '@/features_next/video/store/videoFeedStore'
import { RestTimelineFeedSocialMediaItem } from '@/services/timeline-feed/schema'

const MIN_MEDIA_HEIGHT = 200

const VIEWABILITY_CONFIG: ViewabilityConfig = {
  viewAreaCoveragePercentThreshold: 50,
}

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

type CarouselSlide = {
  id: string
  index: number
  item: RestTimelineFeedSocialMediaItem
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

type CarouselSlideProps = {
  contentId: string
  slide: CarouselSlide
  carouselHeight: number
  playbackSlideId: string | null
}

const CarouselSlideContent = ({ contentId, slide, carouselHeight, playbackSlideId }: CarouselSlideProps) => {
  const { item } = slide
  const isCarouselSlide = carouselHeight > 0
  const isPostInView = useIsContentInFeedView(contentId)
  const isFocusedPost = useVideoFeedStore((s) => s.focusedContentId === contentId)
  const isMediaVisible = playbackSlideId === slide.id && isPostInView && isFocusedPost

  if (item.type === 'video') {
    return (
      <SocialPostMediaFrame height={isCarouselSlide ? carouselHeight : undefined}>
        <YStack
          width="100%"
          height={isCarouselSlide ? carouselHeight : undefined}
          minHeight={isCarouselSlide ? undefined : MIN_MEDIA_HEIGHT}
          flex={isCarouselSlide ? 1 : undefined}
        >
          <FeedVideoPlayer
            contentId={contentId}
            videoId={slide.id}
            hlsUrl={item.hls_url}
            thumbnailUrl={item.thumbnail_url}
            width={item.width ?? undefined}
            height={item.height ?? undefined}
            isSlideViewable={isMediaVisible}
            fill={isCarouselSlide}
          />
        </YStack>
      </SocialPostMediaFrame>
    )
  }

  return (
    <SocialPostMediaFrame height={isCarouselSlide ? carouselHeight : undefined}>
      <YStack width="100%" height={carouselHeight} overflow="hidden" alignItems="center" justifyContent="center">
        <AutoSizeImage fill source={item.url} width={item.width} height={item.height} />
      </YStack>
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

export type VideoMediaCarouselProps = {
  contentId: string
  items: RestTimelineFeedSocialMediaItem[]
  isWeb: boolean
}

const SCROLL_ANIMATION_MS = 400

/** Pendant le swipe horizontal, on gèle la slide « lecture » pour éviter le clignotement vignette/vidéo. */
const CAROUSEL_VIEWABILITY_SYNC_MS = Platform.OS === 'android' ? 80 : 0

const getPercentVisible = (token: ViewToken<CarouselSlide>) =>
  (token as ViewToken<CarouselSlide> & { percentVisible?: number }).percentVisible ?? 0

const pickViewableVideoSlideId = (viewableItems: ViewToken<CarouselSlide>[]): string | null => {
  const viewableVideos = viewableItems.filter((token) => token.isViewable && token.item?.item.type === 'video')

  if (viewableVideos.length === 0) return null

  const best = viewableVideos.reduce((current, candidate) => {
    const currentPercent = getPercentVisible(current)
    const candidatePercent = getPercentVisible(candidate)
    if (candidatePercent !== currentPercent) {
      return candidatePercent > currentPercent ? candidate : current
    }
    const currentIndex = current.index ?? -1
    const candidateIndex = candidate.index ?? -1
    return candidateIndex >= currentIndex ? candidate : current
  })

  return best.item?.id ?? null
}

export default function VideoMediaCarousel({ contentId, items, isWeb }: VideoMediaCarouselProps) {
  const flatListRef = useRef<FlatList<CarouselSlide>>(null)
  const isProgrammaticScroll = useRef(false)
  const isHorizontalScrolling = useRef(false)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const viewabilitySyncTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initializedPlaybackForContent = useRef<string | null>(null)

  const setViewableVideoForContent = useVideoFeedStore((s) => s.setViewableVideoForContent)
  const recomputeActiveVideoId = useVideoFeedStore((s) => s.recomputeActiveVideoId)
  const clearVideoFeedFocus = useVideoFeedStore((s) => s.clearVideoFeedFocus)
  const activeVideoId = useVideoFeedStore((s) => s.activeVideoId)
  const focusedContentId = useVideoFeedStore((s) => s.focusedContentId)
  const [playbackSlideId, setPlaybackSlideId] = useState<string | null>(null)

  const [containerWidth, setContainerWidth] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [, startTransition] = useTransition()

  const slides = useMemo<CarouselSlide[]>(
    () =>
      items.map((item, index) => ({
        id: buildVideoId(contentId, index),
        index,
        item,
      })),
    [contentId, items],
  )

  const commitPlaybackSlide = useCallback(
    (slideId: string | null) => {
      setPlaybackSlideId((current) => (current === slideId ? current : slideId))

      const slide = slides.find((entry) => entry.id === slideId)
      const nextVideoId = slide?.item.type === 'video' ? slideId : null
      setViewableVideoForContent(contentId, nextVideoId)

      if (useVideoFeedStore.getState().focusedContentId === contentId) {
        recomputeActiveVideoId()
      }
    },
    [contentId, recomputeActiveVideoId, setViewableVideoForContent, slides],
  )

  const commitPlaybackAtIndex = useCallback(
    (index: number) => {
      const slide = slides[index]
      if (!slide) return
      commitPlaybackSlide(slide.id)
    },
    [commitPlaybackSlide, slides],
  )

  useEffect(() => {
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      if (viewabilitySyncTimeout.current) clearTimeout(viewabilitySyncTimeout.current)
      if (useVideoFeedStore.getState().focusedContentId === contentId) {
        clearVideoFeedFocus()
      }
    }
  }, [clearVideoFeedFocus, contentId])

  const syncActiveVideoFromViewability = useCallback(
    (viewableItems: ViewToken<CarouselSlide>[]) => {
      if (isHorizontalScrolling.current) return

      const nextVideoId = pickViewableVideoSlideId(viewableItems)
      const nextSlideId = nextVideoId ?? viewableItems.find((t) => t.isViewable)?.item?.id ?? null
      commitPlaybackSlide(nextSlideId)
    },
    [commitPlaybackSlide],
  )

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<CarouselSlide>[] }) => {
      if (isHorizontalScrolling.current) return

      if (viewabilitySyncTimeout.current) clearTimeout(viewabilitySyncTimeout.current)

      if (CAROUSEL_VIEWABILITY_SYNC_MS > 0) {
        viewabilitySyncTimeout.current = setTimeout(() => {
          syncActiveVideoFromViewability(viewableItems)
        }, CAROUSEL_VIEWABILITY_SYNC_MS)
        return
      }

      syncActiveVideoFromViewability(viewableItems)
    },
    [syncActiveVideoFromViewability],
  )

  const onViewableItemsChangedRef = useRef(onViewableItemsChanged)

  useEffect(() => {
    onViewableItemsChangedRef.current = onViewableItemsChanged
  }, [onViewableItemsChanged])

  const viewabilityConfigCallbackPairs = useMemo(
    () => [
      {
        viewabilityConfig: VIEWABILITY_CONFIG,
        onViewableItemsChanged: ({ viewableItems }: { viewableItems: ViewToken<CarouselSlide>[] }) => {
          onViewableItemsChangedRef.current({ viewableItems })
        },
      },
    ],
    [],
  )

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const width = event.nativeEvent.layout.width
      if (width <= 0) return

      if (width !== containerWidth) {
        setContainerWidth(width)
      }

      if (slides.length > 0 && initializedPlaybackForContent.current !== contentId) {
        initializedPlaybackForContent.current = contentId
        commitPlaybackAtIndex(0)
      }
    },
    [commitPlaybackAtIndex, containerWidth, contentId, slides.length],
  )

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

  const handleScrollBegin = useCallback(() => {
    isHorizontalScrolling.current = true
    if (viewabilitySyncTimeout.current) clearTimeout(viewabilitySyncTimeout.current)
  }, [])

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      isProgrammaticScroll.current = false
      isHorizontalScrolling.current = false

      const index = indexFromOffset(event.nativeEvent.contentOffset.x)
      updateIndexFromScroll(event)
      commitPlaybackAtIndex(index)
    },
    [commitPlaybackAtIndex, indexFromOffset, updateIndexFromScroll],
  )

  const goToIndex = useCallback(
    (index: number) => {
      if (containerWidth <= 0) return
      const nextIndex = Math.max(0, Math.min(index, items.length - 1))

      isProgrammaticScroll.current = true
      isHorizontalScrolling.current = true
      setActiveIndex(nextIndex)
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true })

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      scrollTimeout.current = setTimeout(() => {
        isProgrammaticScroll.current = false
        isHorizontalScrolling.current = false
        commitPlaybackAtIndex(nextIndex)
      }, SCROLL_ANIMATION_MS)
    },
    [commitPlaybackAtIndex, containerWidth, items.length],
  )

  const carouselHeight = useMemo(() => {
    if (containerWidth <= 0) return MIN_MEDIA_HEIGHT
    return getCarouselHeight(items, containerWidth)
  }, [containerWidth, items])

  const showNav = isWeb && items.length > 1 && containerWidth > 0
  const canGoLeft = activeIndex > 0
  const canGoRight = activeIndex < items.length - 1

  const renderItem: ListRenderItem<CarouselSlide> = useCallback(
    ({ item: slide }) => (
      <View style={{ width: containerWidth, height: carouselHeight, ...webNoSelectStyle }}>
        <CarouselSlideContent
          contentId={contentId}
          slide={slide}
          carouselHeight={carouselHeight}
          playbackSlideId={playbackSlideId}
        />
      </View>
    ),
    [carouselHeight, containerWidth, contentId, playbackSlideId],
  )

  const getItemLayout = useCallback(
    (_: ArrayLike<CarouselSlide> | null | undefined, index: number) => ({
      length: containerWidth,
      offset: containerWidth * index,
      index,
    }),
    [containerWidth],
  )

  const keyExtractor = useCallback((slide: CarouselSlide) => slide.id, [])

  const extraData = `${activeVideoId}:${focusedContentId}:${playbackSlideId ?? ''}`

  return (
    <YStack width="100%" onLayout={handleLayout} {...(isWeb ? { userSelect: 'none' } : {})}>
      <YStack width="100%" height={carouselHeight} position="relative" pointerEvents="box-none" {...(isWeb ? { userSelect: 'none' } : {})}>
        {containerWidth > 0 ? (
          <FlatList
            ref={flatListRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={slides}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            onScroll={updateIndexFromScroll}
            onScrollBeginDrag={handleScrollBegin}
            onMomentumScrollBegin={handleScrollBegin}
            onMomentumScrollEnd={handleScrollEnd}
            onScrollEndDrag={handleScrollEnd}
            scrollEventThrottle={16}
            viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
            extraData={extraData}
            style={{ width: '100%', height: carouselHeight, ...webNoSelectStyle }}
            nestedScrollEnabled
            onScrollToIndexFailed={(info) => {
              flatListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true })
            }}
          />
        ) : (
          <YStack width="100%" minHeight={MIN_MEDIA_HEIGHT}>
            <CarouselSlideContent contentId={contentId} slide={slides[0]} carouselHeight={MIN_MEDIA_HEIGHT} playbackSlideId={null} />
          </YStack>
        )}
        {showNav && canGoLeft ? <CarouselNavButton direction="left" onPress={() => goToIndex(activeIndex - 1)} /> : null}
        {showNav && canGoRight ? <CarouselNavButton direction="right" onPress={() => goToIndex(activeIndex + 1)} /> : null}
      </YStack>
      <PaginationDots count={items.length} activeIndex={activeIndex} onPressDot={goToIndex} interactive={isWeb} />
    </YStack>
  )
}
