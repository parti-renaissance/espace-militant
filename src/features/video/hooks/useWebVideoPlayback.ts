import { useCallback, useEffect, useRef, useState } from 'react'

import { isAutoplayPolicyError, shouldShowVideoPlayIcon } from '@/features/video/helpers/videoPlaybackUi'

import { useHlsVideoSource } from './useHlsVideoSource'

type UseWebVideoPlaybackParams = {
  hlsUrl: string
  shouldPlay: boolean
  muted: boolean
  expectsAutoPlay: boolean
  isControlled: boolean
  onUserPlay?: () => void
  onUserPause?: () => void
}

export function useWebVideoPlayback({
  hlsUrl,
  shouldPlay,
  muted,
  expectsAutoPlay,
  isControlled,
  onUserPlay,
  onUserPause,
}: UseWebVideoPlaybackParams) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const ready = useHlsVideoSource(videoRef, hlsUrl)
  const [isUserPaused, setIsUserPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoplayFailed, setAutoplayFailed] = useState(false)
  const [autoplayFallbackMuted, setAutoplayFallbackMuted] = useState(false)
  const [prevHlsUrl, setPrevHlsUrl] = useState(hlsUrl)

  if (hlsUrl !== prevHlsUrl) {
    setPrevHlsUrl(hlsUrl)
    setAutoplayFallbackMuted(false)
  }

  const effectiveMuted = muted || autoplayFallbackMuted
  const effectiveShouldPlay = isControlled ? shouldPlay : shouldPlay && !isUserPaused

  const setVideoNode = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node
    if (!node) return

    const onPlay = () => {
      setIsPlaying(true)
      setAutoplayFailed(false)
    }
    const onPause = () => setIsPlaying(false)

    node.addEventListener('play', onPlay)
    node.addEventListener('pause', onPause)
    setIsPlaying(!node.paused)

    return () => {
      node.removeEventListener('play', onPlay)
      node.removeEventListener('pause', onPause)
      videoRef.current = null
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = effectiveMuted
  }, [effectiveMuted])

  const attemptPlay = useCallback(
    (video: HTMLVideoElement) => {
      void video.play().catch((error) => {
        if (isAutoplayPolicyError(error) && !video.muted && expectsAutoPlay) {
          setAutoplayFallbackMuted(true)
          video.muted = true
          void video.play().catch((retryError) => {
            if (isAutoplayPolicyError(retryError)) setAutoplayFailed(true)
          })
          return
        }
        if (isAutoplayPolicyError(error)) setAutoplayFailed(true)
      })
    },
    [expectsAutoPlay],
  )

  useEffect(() => {
    if (!ready) return
    const video = videoRef.current
    if (!video) return

    if (effectiveShouldPlay) {
      attemptPlay(video)
    } else {
      video.pause()
    }
  }, [attemptPlay, effectiveShouldPlay, ready])

  const showPlayIcon = shouldShowVideoPlayIcon(
    isPlaying,
    isControlled ? !shouldPlay : isUserPaused,
    autoplayFailed && expectsAutoPlay && effectiveShouldPlay,
    isControlled ? shouldPlay : expectsAutoPlay,
  )

  const handleTogglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      if (!isControlled) setIsUserPaused(false)
      setAutoplayFailed(false)
      onUserPlay?.()
      void video.play().catch((error) => {
        if (isAutoplayPolicyError(error)) setAutoplayFailed(true)
      })
    } else {
      if (!isControlled) setIsUserPaused(true)
      onUserPause?.()
      video.pause()
    }
  }, [isControlled, onUserPause, onUserPlay])

  const handleAutoplayUnmute = useCallback(() => {
    setAutoplayFallbackMuted(false)
    const video = videoRef.current
    if (video) video.muted = muted
  }, [muted])

  const showAutoplayUnmuteButton = autoplayFallbackMuted && effectiveMuted && isPlaying

  return {
    setVideoNode,
    effectiveMuted,
    isPlaying,
    showPlayIcon,
    showAutoplayUnmuteButton,
    handleTogglePlay,
    handleAutoplayUnmute,
  }
}
