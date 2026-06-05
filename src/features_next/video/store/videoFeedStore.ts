import { create } from 'zustand'

const areSetsEqual = (a: Set<string>, b: Set<string>) => {
  if (a.size !== b.size) return false
  for (const id of a) {
    if (!b.has(id)) return false
  }
  return true
}

const isVisibilityRatioEqual = (a: number, b: number) => Math.abs(a - b) < 0.001

type VideoFeedState = {
  activeVideoId: string | null
  focusedContentId: string | null
  viewableContentIds: Set<string>
  viewableVideoIdByContentId: Record<string, string>
  contentVisibilityRatio: Record<string, number>
  setContentViewable: (contentId: string, isViewable: boolean) => void
  setContentVisibilityRatio: (contentId: string, ratio: number) => void
  setViewableVideoForContent: (contentId: string, videoId: string | null) => void
  setFocusedContentId: (contentId: string | null) => void
  recomputeActiveVideoId: () => void
  syncFocusedContentFromViewable: () => void
  claimActiveVideo: (contentId: string, videoId: string) => void
  clearVideoFeedFocus: () => void
  isMuted: boolean
  setMuted: (muted: boolean) => void
  toggleMuted: () => void
  isAppActive: boolean
  setAppActive: (active: boolean) => void
  isScreenFocused: boolean
  setScreenFocused: (focused: boolean) => void
}

export const useVideoFeedStore = create<VideoFeedState>((set, get) => ({
  activeVideoId: null,
  focusedContentId: null,
  viewableContentIds: new Set(),
  viewableVideoIdByContentId: {},
  contentVisibilityRatio: {},

  setContentViewable: (contentId, isViewable) =>
    set((state) => {
      const alreadyViewable = state.viewableContentIds.has(contentId)
      if (alreadyViewable === isViewable) return state

      const next = new Set(state.viewableContentIds)
      if (isViewable) {
        next.add(contentId)
      } else {
        next.delete(contentId)
      }
      return { viewableContentIds: next }
    }),

  setContentVisibilityRatio: (contentId, ratio) =>
    set((state) => {
      const current = state.contentVisibilityRatio[contentId] ?? 0
      if (isVisibilityRatioEqual(current, ratio)) return state
      return {
        contentVisibilityRatio: { ...state.contentVisibilityRatio, [contentId]: ratio },
      }
    }),

  setViewableVideoForContent: (contentId, videoId) =>
    set((state) => {
      const current = state.viewableVideoIdByContentId[contentId] ?? null
      if (current === videoId) return state

      const next = { ...state.viewableVideoIdByContentId }
      if (videoId) {
        next[contentId] = videoId
      } else {
        delete next[contentId]
      }
      return { viewableVideoIdByContentId: next }
    }),

  setFocusedContentId: (focusedContentId) => {
    if (get().focusedContentId === focusedContentId) return
    set({ focusedContentId })
  },

  recomputeActiveVideoId: () => {
    const { focusedContentId, viewableContentIds, viewableVideoIdByContentId, activeVideoId } = get()

    const nextActiveVideoId =
      focusedContentId && viewableContentIds.has(focusedContentId)
        ? (viewableVideoIdByContentId[focusedContentId] ?? null)
        : null

    if (activeVideoId === nextActiveVideoId) return
    set({ activeVideoId: nextActiveVideoId })
  },

  syncFocusedContentFromViewable: () => {
    const { viewableContentIds, contentVisibilityRatio, focusedContentId } = get()

    let bestContentId: string | null = null
    let bestRatio = 0

    viewableContentIds.forEach((contentId) => {
      const ratio = contentVisibilityRatio[contentId] ?? 0
      if (ratio >= 0.5 && ratio > bestRatio) {
        bestRatio = ratio
        bestContentId = contentId
      }
    })

    if (focusedContentId === bestContentId) {
      get().recomputeActiveVideoId()
      return
    }

    set({ focusedContentId: bestContentId })
    get().recomputeActiveVideoId()
  },

  claimActiveVideo: (contentId, videoId) => {
    const state = get()
    const nextMap = { ...state.viewableVideoIdByContentId, [contentId]: videoId }

    if (
      state.focusedContentId === contentId &&
      state.activeVideoId === videoId &&
      state.viewableVideoIdByContentId[contentId] === videoId
    ) {
      return
    }

    set({
      focusedContentId: contentId,
      viewableVideoIdByContentId: nextMap,
      activeVideoId: videoId,
    })
  },

  clearVideoFeedFocus: () => {
    const { focusedContentId, activeVideoId } = get()
    if (focusedContentId === null && activeVideoId === null) return
    set({ focusedContentId: null, activeVideoId: null })
  },

  isMuted: true,
  setMuted: (isMuted) => set({ isMuted }),
  toggleMuted: () => set((state) => ({ isMuted: !state.isMuted })),
  isAppActive: true,
  setAppActive: (isAppActive) => set({ isAppActive }),
  isScreenFocused: true,
  setScreenFocused: (isScreenFocused) => set({ isScreenFocused }),
}))

/** Évite les re-renders si la visibilité du post n'a pas changé. */
export const useIsContentInFeedView = (contentId: string) =>
  useVideoFeedStore((state) => state.viewableContentIds.has(contentId))

export const useIsFocusedContent = (contentId: string) =>
  useVideoFeedStore((state) => state.focusedContentId === contentId)

export const buildVideoId = (contentId: string, slideIndex: number) => `${contentId}:${slideIndex}`

export const isVideoIdInScope = (videoId: string | null, contentId: string) =>
  videoId != null && videoId.startsWith(`${contentId}:`)

export const getContentIdFromVideoId = (videoId: string) => {
  const separatorIndex = videoId.lastIndexOf(':')
  return separatorIndex >= 0 ? videoId.slice(0, separatorIndex) : videoId
}

/** Compare deux ensembles de slides (carrousel) avant un setState local. */
export const areSlideIdSetsEqual = areSetsEqual
