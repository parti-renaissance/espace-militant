import { useCallback, useLayoutEffect, useRef, useState } from 'react'

import { useIsContentInFeedView, useVideoFeedStore } from '@/features_next/video/store/videoFeedStore'

type UseFeedVideoOrchestrationParams = {
  contentId: string
  videoId: string
  isSlideViewable: boolean
}

export function useFeedVideoOrchestration({ contentId, videoId, isSlideViewable }: UseFeedVideoOrchestrationParams) {
  const activeVideoId = useVideoFeedStore((s) => s.activeVideoId)
  const claimActiveVideo = useVideoFeedStore((s) => s.claimActiveVideo)
  const isMuted = useVideoFeedStore((s) => s.isMuted)
  const toggleMuted = useVideoFeedStore((s) => s.toggleMuted)
  const isAppActive = useVideoFeedStore((s) => s.isAppActive)
  const isScreenFocused = useVideoFeedStore((s) => s.isScreenFocused)
  const isFocusedPost = useVideoFeedStore((s) => s.focusedContentId === contentId)
  const viewableVideoId = useVideoFeedStore((s) => s.viewableVideoIdByContentId[contentId] ?? null)

  const isPostInView = useIsContentInFeedView(contentId)
  const canPlay = isAppActive && isScreenFocused
  const isActive = activeVideoId === videoId
  const canAutoPlay = isSlideViewable && isPostInView && isFocusedPost
  const shouldAutoPlay = canAutoPlay && isActive && canPlay
  const isAutoPlayTarget = isPostInView && isFocusedPost && viewableVideoId === videoId
  const canInteract = canAutoPlay || (isActive && isPostInView && isFocusedPost)

  const [isUserPaused, setIsUserPaused] = useState(false)
  const shouldPlay = shouldAutoPlay && !isUserPaused
  const playAllowedRef = useRef(shouldPlay)

  useLayoutEffect(() => {
    playAllowedRef.current = shouldPlay
  }, [shouldPlay])

  const shouldMountPlayer = isAutoPlayTarget && canPlay
  const showManualPlayOverlay = isPostInView && !shouldMountPlayer

  const onThumbnailPress = useCallback(() => {
    if (!isPostInView || !canPlay) return
    claimActiveVideo(contentId, videoId)
  }, [canPlay, claimActiveVideo, contentId, isPostInView, videoId])

  const onUserPlay = useCallback(() => {
    if (!canInteract || !canPlay) return
    playAllowedRef.current = shouldAutoPlay
    setIsUserPaused(false)
    claimActiveVideo(contentId, videoId)
  }, [canInteract, canPlay, claimActiveVideo, contentId, shouldAutoPlay, videoId])

  const onUserPause = useCallback(() => {
    playAllowedRef.current = false
    setIsUserPaused(true)
  }, [])

  const onToggleMute = useCallback(() => {
    toggleMuted()
  }, [toggleMuted])

  return {
    shouldMountPlayer,
    shouldPlay,
    showManualPlayOverlay,
    muted: isMuted,
    playAllowedRef,
    onThumbnailPress,
    onUserPlay,
    onUserPause,
    onToggleMute,
  }
}
