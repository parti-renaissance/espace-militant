import { useCallback, useEffect, useRef, useState } from 'react'

const FRAME_DELAY_MS = 8
const MIN_CHUNK_SIZE = 4
const MAX_CHUNK_SIZE = 48
const BACKLOG_FRAMES = 8

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function getNextChunkEnd(text: string, start: number): number {
  const remaining = text.length - start
  const chunkSize = clamp(Math.ceil(remaining / BACKLOG_FRAMES), MIN_CHUNK_SIZE, MAX_CHUNK_SIZE)
  let end = Math.min(text.length, start + chunkSize)

  if (end < text.length) {
    const charCode = text.charCodeAt(end - 1)
    if (charCode >= 0xd800 && charCode <= 0xdbff) end += 1
  }

  return end
}

export type Typewriter = {
  display: string
  busy: boolean
  push: (text: string) => void
  finish: (onDone: (text: string) => void) => void
  stop: () => string
  reset: () => void
}

export function useTypewriter(): Typewriter {
  const [display, setDisplay] = useState('')
  const [busy, setBusy] = useState(false)
  const bufferRef = useRef('')
  const indexRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const clearInternals = useCallback(() => {
    bufferRef.current = ''
    indexRef.current = 0
    setDisplay('')
  }, [])

  const tick = useCallback(
    function tick() {
      timerRef.current = null
      const full = bufferRef.current
      if (indexRef.current < full.length) {
        indexRef.current = getNextChunkEnd(full, indexRef.current)
        setDisplay(full.slice(0, indexRef.current))
      }
      if (indexRef.current < full.length) {
        timerRef.current = setTimeout(tick, FRAME_DELAY_MS)
      }
    },
    [],
  )

  const push = useCallback(
    (text: string) => {
      bufferRef.current += text
      setBusy(true)
      if (timerRef.current === null) timerRef.current = setTimeout(tick, 0)
    },
    [tick],
  )

  const finish = useCallback(
    (onDone: (text: string) => void) => {
      const content = bufferRef.current
      cancel()
      clearInternals()
      setBusy(false)
      onDone(content)
    },
    [cancel, clearInternals],
  )

  const stop = useCallback(() => {
    cancel()
    const content = bufferRef.current
    clearInternals()
    setBusy(false)
    return content
  }, [cancel, clearInternals])

  const reset = useCallback(() => {
    cancel()
    clearInternals()
    setBusy(false)
  }, [cancel, clearInternals])

  useEffect(() => cancel, [cancel])

  return { display, busy, push, finish, stop, reset }
}
