import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import { Platform } from 'react-native'

import { buildVideoId, useVideoFeedStore } from '@/features_next/video/store/videoFeedStore'
import { RestTimelineFeedSocialMedia } from '@/services/timeline-feed/schema'

type VideoFeedPostVisibilityProps = {
  contentId: string
  media?: RestTimelineFeedSocialMedia | null
  children: ReactNode
}

const getFirstVideoSlideIndex = (media?: RestTimelineFeedSocialMedia | null) =>
  media?.items?.findIndex((item) => item.type === 'video') ?? -1

/**
 * Sur le web, le feed vertical n'utilise pas FlatList : on détecte la visibilité (≥50%)
 * via IntersectionObserver et ne garde qu'un seul post focalisé (celui le plus visible).
 */
export default function VideoFeedPostVisibility({ contentId, media, children }: VideoFeedPostVisibilityProps) {
  const slideIndex = getFirstVideoSlideIndex(media)
  const hasVideo = slideIndex >= 0
  const elementRef = useRef<HTMLDivElement>(null)
  const visibilityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const setContentViewable = useVideoFeedStore((s) => s.setContentViewable)
  const setContentVisibilityRatio = useVideoFeedStore((s) => s.setContentVisibilityRatio)
  const setViewableVideoForContent = useVideoFeedStore((s) => s.setViewableVideoForContent)
  const syncFocusedContentFromViewable = useVideoFeedStore((s) => s.syncFocusedContentFromViewable)

  const applyVisibility = useCallback(
    (isViewable: boolean, ratio: number) => {
      setContentViewable(contentId, isViewable)
      setContentVisibilityRatio(contentId, isViewable ? ratio : 0)

      if (hasVideo && isViewable) {
        setViewableVideoForContent(contentId, buildVideoId(contentId, slideIndex))
      }

      syncFocusedContentFromViewable()
    },
    [contentId, hasVideo, setContentViewable, setContentVisibilityRatio, setViewableVideoForContent, slideIndex, syncFocusedContentFromViewable],
  )

  useEffect(() => {
    if (Platform.OS !== 'web' || !hasVideo) return

    if (!elementRef.current) return

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0]

      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        if (visibilityTimeoutRef.current) clearTimeout(visibilityTimeoutRef.current)
        visibilityTimeoutRef.current = setTimeout(() => applyVisibility(true, entry.intersectionRatio), 400)
        return
      }

      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current)
        visibilityTimeoutRef.current = null
      }
      applyVisibility(false, 0)
    }

    observerRef.current = new IntersectionObserver(handleIntersection, { threshold: [0, 0.5, 1] })
    observerRef.current.observe(elementRef.current)

    return () => {
      if (visibilityTimeoutRef.current) clearTimeout(visibilityTimeoutRef.current)
      observerRef.current?.disconnect()
      applyVisibility(false, 0)
    }
  }, [applyVisibility, hasVideo])

  if (!hasVideo) {
    return <>{children}</>
  }

  if (Platform.OS !== 'web') {
    return <>{children}</>
  }

  return (
    <div ref={elementRef} style={{ width: '100%' }}>
      {children}
    </div>
  )
}
