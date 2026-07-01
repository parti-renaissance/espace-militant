import { useEffect, useState, type RefObject } from 'react'

const HLS_JS_URL = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.7/dist/hls.min.js'

type HlsPlayer = {
  loadSource: (url: string) => void
  attachMedia: (video: HTMLVideoElement) => void
  destroy: () => void
}

declare global {
  interface Window {
    Hls?: {
      isSupported: () => boolean
      new (): HlsPlayer
    }
  }
}

const loadHlsScript = (signal: AbortSignal): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    if (window.Hls) {
      resolve()
      return
    }
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${HLS_JS_URL}"]`)
    const script = existing ?? document.createElement('script')
    const isOwner = existing === null

    script.addEventListener('load', () => resolve(), { signal })
    script.addEventListener('error', () => reject(new Error('hls.js load failed')), { signal })

    signal.addEventListener('abort', () => {
      reject(new DOMException('Aborted', 'AbortError'))
      if (isOwner && !window.Hls) script.remove()
    })

    if (isOwner) {
      script.src = HLS_JS_URL
      script.async = true
      document.head.appendChild(script)
    }
  })

export function useHlsVideoSource(videoRef: RefObject<HTMLVideoElement | null>, hlsUrl: string) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const controller = new AbortController()
    let hls: HlsPlayer | null = null

    const setup = async () => {
      let hlsSupported = false
      try {
        await loadHlsScript(controller.signal)
        hlsSupported = !controller.signal.aborted && !!window.Hls?.isSupported()
      } catch {
        // hls.js indisponible : on tentera le fallback natif (Safari / iOS).
      }

      if (controller.signal.aborted) return

      if (hlsSupported && window.Hls) {
        hls = new window.Hls()
        hls.loadSource(hlsUrl)
        hls.attachMedia(video)
        setReady(true)
        return
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl
        setReady(true)
      }
    }

    void setup()

    return () => {
      controller.abort()
      setReady(false)
      hls?.destroy()
      hls = null
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [hlsUrl])

  return ready
}
